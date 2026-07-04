#!/usr/bin/env node
// scripts/fix-duplicate-imports.js
// Script para corrigir imports duplicados

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
  
  // Corrigir imports duplicados de COLORS
  const lines = content.split('\n');
  const seenImports = new Set();
  const fixedLines = [];
  
  for (const line of lines) {
    // Verificar se é um import de COLORS
    if (line.match(/import\s*\{[^}]*COLORS[^}]*\}\s*from\s*['"].*constants\/colors/)) {
      if (seenImports.has('COLORS')) {
        // Pular import duplicado
        fixed = true;
        continue;
      }
      seenImports.add('COLORS');
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

console.log(`Verificando ${files.length} arquivos para imports duplicados...`);

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
