import { readdirSync, readFileSync, writeFileSync, unlinkSync, statSync } from 'fs';
import { join, basename, dirname, extname } from 'path';

const COMPONENTS_DIR = join(process.cwd(), 'src', 'components');
const SKIP_FILES = ['index.js', 'barrel.ts'];
const SKIP_DIRS = ['exports'];

function findJsFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      if (!SKIP_DIRS.includes(entry)) {
        results.push(...findJsFiles(fullPath));
      }
    } else if (extname(entry) === '.js' && !SKIP_FILES.includes(entry)) {
      results.push(fullPath);
    }
  }
  return results;
}

function extractParamNames(paramStr) {
  // Remove default values and extract just the names
  const cleaned = paramStr.replace(/=\s*[^,}]+/g, '').trim();
  const props = [];
  // Match individual prop names (handles nested destructuring loosely)
  const parts = cleaned.split(',');
  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    // Handle nested destructuring like { a, b: { c, d } }
    // For simplicity, if it contains {, just use "any" for the whole thing
    if (trimmed.includes('{') || trimmed.includes('[')) {
      return null; // Signal to use generic any props
    }
    props.push(trimmed);
  }
  return props;
}

function transformContent(content, filePath) {
  let lines = content.split('\n');
  const fileName = basename(filePath, '.js');

  // Check if React import already exists
  const hasReactDefaultImport = lines.some(l => /import\s+React\s+from\s+['"]react['"]/.test(l));
  const hasReactNamedImport = lines.some(l => /import\s*\{[^}]*\}\s*from\s*['"]react['"]/.test(l));

  // We need React in scope for JSX
  if (!hasReactDefaultImport) {
    if (hasReactNamedImport) {
      // Add React to existing import: import { useState } from 'react' → import React, { useState } from 'react'
      const idx = lines.findIndex(l => /import\s*\{[^}]*\}\s*from\s*['"]react['"]/.test(l));
      lines[idx] = lines[idx].replace(/import\s*\{/, 'import React, {');
    } else {
      // Add new React import at top
      lines.unshift("import React from 'react';");
    }
  }

  let result = lines.join('\n');

  // Pattern 1: export default function X({ ... })
  // Pattern 2: function X({ ... })
  // Pattern 3: export function X({ ... })
  // Pattern 4: export default memo(function X({ ... }))

  // Handle: function FuncName({ prop1, prop2 }) { or function FuncName() {
  // We need to add return type and props type

  // Match function declarations with props destructuring
  const funcDeclRegex = /((?:export\s+)?(?:default\s+)?(?:memo\s*\()?)function\s+(\w+)\s*\((\{[^}]*\})\)/g;
  let match;
  const changes = [];

  // First pass: find all function declarations with destructured props
  while ((match = funcDeclRegex.exec(result)) !== null) {
    const [fullMatch, prefix, funcName, propsStr] = match;
    const paramNames = extractParamNames(propsStr);
    if (paramNames !== null) {
      changes.push({
        fullMatch,
        prefix,
        funcName,
        propsStr,
        paramNames,
        offset: match.index,
      });
    }
  }

  // Apply changes in reverse order to preserve offsets
  for (let i = changes.length - 1; i >= 0; i--) {
    const c = changes[i];
    const propsType = `{ ${c.paramNames.map(p => `${p}: any`).join('; ')} }`;
    const replacement = `${c.prefix}function ${c.funcName}(${c.propsStr} : ${propsType})`;
    result = result.substring(0, c.offset) + replacement + result.substring(c.offset + c.fullMatch.length);
  }

  // Also handle functions with no props: function FuncName() {
  const noPropsFuncRegex = /((?:export\s+)?(?:default\s+)?(?:memo\s*\()?)function\s+(\w+)\s*\(\s*\)/g;
  // Only add return type to these - they don't need props typing
  const noPropsChanges = [];
  while ((match = noPropsFuncRegex.exec(result)) !== null) {
    noPropsChanges.push({
      fullMatch: match[0],
      prefix: match[1],
      funcName: match[2],
      offset: match.index,
    });
  }
  for (let i = noPropsChanges.length - 1; i >= 0; i--) {
    const c = noPropsChanges[i];
    // Don't re-match things we already typed (skip if already has return type)
    if (!result.substring(c.offset).startsWith(c.fullMatch)) continue;
  }

  // Handle functions with non-destructured single param like: function Foo(props)
  const simpleParamRegex = /((?:export\s+)?(?:default\s+)?(?:memo\s*\()?)function\s+(\w+)\s*\(((?!{)[^)]*)\)/g;
  const simpleChanges = [];
  while ((match = simpleParamRegex.exec(result)) !== null) {
    const [fullMatch, prefix, funcName, paramStr] = match;
    if (paramStr.trim() && !paramStr.includes(':')) {
      simpleChanges.push({
        fullMatch,
        prefix,
        funcName,
        paramStr: paramStr.trim(),
        offset: match.index,
      });
    }
  }
  for (let i = simpleChanges.length - 1; i >= 0; i--) {
    const c = simpleChanges[i];
    const replacement = `${c.prefix}function ${c.funcName}(${c.paramStr}: any)`;
    result = result.substring(0, c.offset) + replacement + result.substring(c.offset + c.fullMatch.length);
  }

  return result;
}

// Main
const jsFiles = findJsFiles(COMPONENTS_DIR);
console.log(`Found ${jsFiles.length} .js files to convert.`);

let converted = 0;
let errors = [];

for (const filePath of jsFiles) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const transformed = transformContent(content, filePath);
    const tsxPath = filePath.replace(/\.js$/, '.tsx');
    writeFileSync(tsxPath, transformed, 'utf-8');
    unlinkSync(filePath);
    converted++;
    const rel = filePath.replace(COMPONENTS_DIR, 'src/components');
    console.log(`  [OK] ${rel} → .tsx`);
  } catch (err) {
    errors.push({ file: filePath, error: err.message });
    console.error(`  [ERR] ${filePath}: ${err.message}`);
  }
}

console.log(`\nDone! Converted ${converted} files.`);
if (errors.length > 0) {
  console.log(`Errors: ${errors.length}`);
  errors.forEach(e => console.log(`  ${e.file}: ${e.error}`));
}
