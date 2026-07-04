#!/usr/bin/env node
// scripts/fix-formatting.js
// Script para corrigir formatação de imports quebrados

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

function fixFormatting(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let fixed = false;
  
  // Corrigir imports quebrados em múltiplas linhas
  // Padrão: import {\n  ...\n} from '...'
  const brokenImportPattern = /import\s*\{\s*\n/g;
  if (brokenImportPattern.test(content)) {
    // Reunir imports quebrados
    content = content.replace(/import\s*\{\s*\n/g, 'import { ');
    content = content.replace(/\n\s*\}\s*from\s*'/g, " } from '");
    content = content.replace(/\n\s*from\s*'/g, " from '");
    fixed = true;
  }
  
  // Corrigir imports que terminam com ';}' em vez de '};'
  content = content.replace(/from\s*'([^']+)';\s*}/g, "from '$1';");
  
  // Corrigir imports que estão na mesma linha
  // Padrão: import { A } from 'x'; import { B } from 'y';
  const sameLineImports = content.match(/import\s+\{[^}]+\}\s+from\s+'[^']+';\s*import\s+\{[^}]+\}\s+from\s+'[^']+'/g);
  if (sameLineImports) {
    for (const imp of sameLineImports) {
      const parts = imp.split(/;\s*import\s+/);
      content = content.replace(imp, parts.join('\nimport '));
      fixed = true;
    }
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
    if (fixFormatting(file)) {
      fixed++;
      console.log(`Corrigido: ${path.relative(COMPONENTS_DIR, file)}`);
    }
  } catch (err) {
    console.error(`Erro em ${path.relative(COMPONENTS_DIR, file)}: ${err.message}`);
  }
}

console.log(`\nCorrigidos: ${fixed} arquivos`);
