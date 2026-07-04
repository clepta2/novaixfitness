#!/usr/bin/env node
// scripts/fix-imports.js
// Script para corrigir imports quebrados

const fs = require('fs');
const path = require('path');

const COMPONENTS_DIR = path.join(__dirname, '../src/components');

function findTsxFiles(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findTsxFiles(fullPath));
    } else if (entry.name.endsWith('.tsx') && !entry.name.includes('.test.')) {
      results.push(fullPath);
    }
  }
  return results;
}

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let fixed = false;
  
  // Corrigir imports quebrados (string literal unterminated)
  const brokenImport = content.match(/import\s*\{\s*COLORS\s*\}\s*from\s*['"]([^'"]+?)['"]\s*\n\s*import\s*\{\s*COLORS\s*\}\s*from\s*['"]([^'"]+?)['"]/);
  if (brokenImport) {
    content = content.replace(
      /import\s*\{\s*COLORS\s*\}\s*from\s*['"]([^'"]+?)['"]\s*\n\s*import\s*\{\s*COLORS\s*\}\s*from\s*['"]([^'"]+?)['"]/,
      `import { COLORS } from '$2'`
    );
    fixed = true;
  }
  
  // Corrigir import incompleto
  const incompleteImport = content.match(/import\s*\{\s*COLORS\s*\}\s*from\s*['"]([^'"]+?)['"]\s*$/m);
  if (incompleteImport && !content.includes(`import { COLORS } from '${incompleteImport[1]}';`)) {
    content = content.replace(
      incompleteImport[0],
      `import { COLORS } from '${incompleteImport[1]}';`
    );
    fixed = true;
  }
  
  // Corrigir const colors = useColors() inserido no lugar errado
  const badUseColors = content.match(/export\s+default\s+function\s+\w+\([^)]*\)\s*\{\s*\n\s*const\s+colors\s*=\s*useColors\(\);/);
  if (badUseColors) {
    content = content.replace(
      /export\s+default\s+function\s+(\w+)\(([^)]*)\)\s*\{\s*\n\s*const\s+colors\s*=\s*useColors\(\);/,
      'export default function $1($2) {\n  const colors = useColors();'
    );
    fixed = true;
  }
  
  if (fixed) {
    fs.writeFileSync(filePath, content);
    return true;
  }
  return false;
}

const files = findTsxFiles(COMPONENTS_DIR);
let fixed = 0;

console.log(`Verificando ${files.length} arquivos...`);

for (const file of files) {
  try {
    if (fixFile(file)) {
      fixed++;
      console.log(`Corrigido: ${path.relative(COMPONENTS_DIR, file)}`);
    }
  } catch (err) {
    console.error(`Erro em ${path.relative(COMPONENTS_DIR, file)}: ${err.message}`);
  }
}

console.log(`\nCorrigidos: ${fixed} arquivos`);
