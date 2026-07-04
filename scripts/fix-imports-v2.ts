#!/usr/bin/env node
// scripts/fix-imports-v2.js
// Script para corrigir imports de forma mais robusta

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

function fixImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let fixed = false;
  
  // Corrigir imports que estão na mesma linha
  // Padrão: import { A } from 'x';import { B } from 'y';
  const lines = content.split('\n');
  const newLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    // Verificar se a linha contém múltiplos imports
    const importMatches = line.match(/import\s+\{[^}]+\}\s+from\s+'[^']+'/g);
    if (importMatches && importMatches.length > 1) {
      // Separar os imports
      for (const imp of importMatches) {
        newLines.push(imp + ';');
      }
      fixed = true;
      continue;
    }
    
    // Corrigir imports que terminam com ';}' em vez de '};'
    if (line.match(/from\s*'[^']+';\s*\}/)) {
      line = line.replace(/from\s*'([^']+)';\s*\}/, "from '$1';");
      fixed = true;
    }
    
    newLines.push(line);
  }
  
  if (fixed) {
    fs.writeFileSync(filePath, newLines.join('\n'));
    return true;
  }
  return false;
}

const files = findTsxFiles(COMPONENTS_DIR);
let fixed = 0;

console.log(`Verificando ${files.length} arquivos...`);

for (const file of files) {
  try {
    if (fixImports(file)) {
      fixed++;
      console.log(`Corrigido: ${path.relative(COMPONENTS_DIR, file)}`);
    }
  } catch (err) {
    console.error(`Erro em ${path.relative(COMPONENTS_DIR, file)}: ${err.message}`);
  }
}

console.log(`\nCorrigidos: ${fixed} arquivos`);
