#!/usr/bin/env node
// scripts/fix-theme-migration.js
// Script para corrigir migração de tema incompleta

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
  
  // Verificar se usa 'colors' mas não tem 'useColors'
  if (content.includes('colors.') && !content.includes('useColors')) {
    // Adicionar import de useColors
    const importPath = filePath.includes('/ui/') ? '../../context/ThemeContext' : '../context/ThemeContext';
    
    // Encontrar a posição para inserir o import
    const lastImportIndex = content.lastIndexOf("from '");
    if (lastImportIndex !== -1) {
      const lineEnd = content.indexOf('\n', lastImportIndex);
      content = content.slice(0, lineEnd + 1) + `import { useColors } from '${importPath}';\n` + content.slice(lineEnd + 1);
      fixed = true;
    }
  }
  
  // Verificar se usa 'colors' mas não tem 'const colors = useColors()'
  if (content.includes('colors.') && !content.includes('const colors = useColors()')) {
    // Encontrar a primeira função de componente
    const functionMatch = content.match(/(export\s+(default\s+)?function\s+\w+|const\s+\w+\s*=\s*(?:memo\s*\()?\s*\()/);
    if (functionMatch) {
      const functionIndex = content.indexOf(functionMatch[0]);
      const afterFunction = content.indexOf('{', functionIndex);
      
      if (afterFunction !== -1) {
        // Verificar se já tem useColors
        if (!content.includes('const colors = useColors()')) {
          content = content.slice(0, afterFunction + 1) + '\n  const colors = useColors();\n' + content.slice(afterFunction + 1);
          fixed = true;
        }
      }
    }
  }
  
  // Corrigir formatação quebrada (arquivo em uma linha)
  if (content.includes('//') && content.split('\n').length < 10) {
    // Arquivo pode estar em uma linha - não fazer nada
    return false;
  }
  
  if (fixed) {
    fs.writeFileSync(filePath, content);
    return true;
  }
  return false;
}

const files = findTsxFiles(COMPONENTS_DIR);
let fixed = 0;
let skipped = 0;

console.log(`Verificando ${files.length} arquivos...`);

for (const file of files) {
  try {
    if (fixFile(file)) {
      fixed++;
      console.log(`Corrigido: ${path.relative(COMPONENTS_DIR, file)}`);
    } else {
      skipped++;
    }
  } catch (err) {
    console.error(`Erro em ${path.relative(COMPONENTS_DIR, file)}: ${err.message}`);
  }
}

console.log(`\nResultado:`);
console.log(`  Corrigidos: ${fixed}`);
console.log(`  Pulados: ${skipped}`);
