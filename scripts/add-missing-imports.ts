#!/usr/bin/env node
// scripts/add-missing-imports.js
// Script para adicionar imports de useColors que estão faltando

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

function addMissingImport(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Verificar se usa 'colors' mas não tem 'useColors' importado
  if (content.includes('colors.') && !content.includes("from '../../context/ThemeContext'") && !content.includes('from "../context/ThemeContext"')) {
    // Determinar caminho correto para import
    const isUIComponent = filePath.includes('/ui/');
    const importPath = isUIComponent ? '../../context/ThemeContext' : '../context/ThemeContext';
    
    // Encontrar a última linha de import
    const lines = content.split('\n');
    let lastImportIndex = -1;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('import ')) {
        lastImportIndex = i;
      }
    }
    
    if (lastImportIndex !== -1) {
      // Adicionar import após o último import
      lines.splice(lastImportIndex + 1, 0, `import { useColors } from '${importPath}';`);
      content = lines.join('\n');
      
      fs.writeFileSync(filePath, content);
      return true;
    }
  }
  return false;
}

const files = findTsxFiles(COMPONENTS_DIR);
let added = 0;

console.log(`Verificando ${files.length} arquivos...`);

for (const file of files) {
  try {
    if (addMissingImport(file)) {
      added++;
      console.log(`Import adicionado: ${path.relative(COMPONENTS_DIR, file)}`);
    }
  } catch (err) {
    console.error(`Erro em ${path.relative(COMPONENTS_DIR, file)}: ${err.message}`);
  }
}

console.log(`\nImports adicionados: ${added}`);
