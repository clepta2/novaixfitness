// scripts/fix-animated-value.js
// Bulk replace useMemo(() => new Animated.Value(X), []) → useRef(new Animated.Value(X)).current
// Also ensures useRef is imported alongside useMemo

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PATTERN = /useMemo\(\(\) => new (Animated\.Value\([^)]*\)), \[\]\)/g;
const REPLACEMENT = 'useRef($1).current';

let totalFiles = 0;
let totalReplacements = 0;

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const matches = content.match(PATTERN);
  if (!matches) return;

  const count = matches.length;
  content = content.replace(PATTERN, REPLACEMENT);

  // Ensure useRef is imported
  const useMemoMatch = content.match(/import\s*\{([^}]*)\}\s*from\s*['"]react['"]/);
  if (useMemoMatch) {
    const imports = useMemoMatch[1];
    if (imports.includes('useMemo') && !imports.includes('useRef')) {
      content = content.replace(
        /import\s*\{([^}]*)\}\s*from\s*['"]react['"]/,
        (match, importList) => {
          const newImports = importList.includes('useRef') ? importList : importList + ', useRef';
          return `import {${newImports}} from 'react'`;
        }
      );
    }
  }

  // If no React import exists at all (shouldn't happen but safety check)
  if (!content.match(/import.*useRef.*from.*react/)) {
    // Check if it has useMemo import and add useRef there
    content = content.replace(
      /(import\s*\{[^}]*useMemo[^}]*\}\s*from\s*['"]react['"])/,
      (match) => match.replace('useMemo', 'useMemo, useRef')
    );
  }

  fs.writeFileSync(filePath, content, 'utf8');
  totalFiles++;
  totalReplacements += count;
  console.log(`  ${path.relative(ROOT, filePath)}: ${count} replacement(s)`);
}

// Process src/ and app/
const dirs = [
  path.join(ROOT, 'src'),
  path.join(ROOT, 'app'),
];

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '__tests__') {
      walkDir(fullPath);
    } else if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name)) {
      processFile(fullPath);
    }
  }
}

for (const dir of dirs) {
  if (fs.existsSync(dir)) walkDir(dir);
}

console.log(`\nDone: ${totalReplacements} replacements across ${totalFiles} files`);
