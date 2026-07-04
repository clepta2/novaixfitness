#!/usr/bin/env node
// scripts/fix-usecolors.js
// Script para corrigir const colors = useColors() inserido no lugar errado

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
  
  // Corrigir const colors = useColors() inserido em locais errados
  // Padrão: função com parâmetros quebrados
  const lines = content.split('\n');
  const fixedLines = [];
  let skipNext = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Verificar se a linha anterior termina com '{' e a linha atual é 'const colors = useColors();'
    if (i > 0 && lines[i-1].trim().endsWith('{') && line.trim() === 'const colors = useColors();') {
      // Pular esta linha e adicionar depois do '{'
      fixedLines[fixedLines.length - 1] = lines[i-1] + '\n  const colors = useColors();';
      fixed = true;
      continue;
    }
    
    fixedLines.push(line);
  }
  
  if (fixed) {
    fs.writeFileSync(filePath, fixedLines.join('\n'));
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
