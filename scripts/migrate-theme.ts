#!/usr/bin/env node
// scripts/migrate-theme.js
// Script para migrar componentes para tema reativo

const fs = require('fs');
const path = require('path');

const COMPONENTS_DIR = path.join(__dirname, '../src/components');
const THEME_IMPORT = "import { useColors } from '../../context/ThemeContext';";

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

function migrateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Verificar se já usa useColors
  if (content.includes('useColors')) {
    return { migrated: false, reason: 'already uses useColors' };
  }
  
  // Verificar se importa COLORS
  if (!content.includes("from '../../constants/colors'") && !content.includes('from "../constants/colors"')) {
    return { migrated: false, reason: 'does not import COLORS' };
  }
  
  // Determinar caminho correto para import
  const isUIComponent = filePath.includes('/ui/');
  const importPath = isUIComponent ? '../../context/ThemeContext' : '../context/ThemeContext';
  
  // Adicionar import de useColors
  const colorImport = content.match(/import.*COLORS.*from.*constants\/colors/);
  if (colorImport) {
    const newImport = colorImport[0].replace(
      /from\s+['"].*constants\/colors['"]/,
      `from '${importPath}'`
    );
    content = content.replace(colorImport[0], newImport + '\n' + colorImport[0]);
  }
  
  // Encontrar a primeira função de componente
  const functionMatch = content.match(/(export\s+(default\s+)?function\s+\w+|const\s+\w+\s*=\s*(?:memo\s*\()?\s*\()/);
  if (!functionMatch) {
    return { migrated: false, reason: 'no component function found' };
  }
  
  // Adicionar const colors = useColors() após a primeira linha da função
  const functionIndex = content.indexOf(functionMatch[0]);
  const afterFunction = content.indexOf('{', functionIndex);
  
  if (afterFunction === -1) {
    return { migrated: false, reason: 'could not find function body' };
  }
  
  // Verificar se já tem useColors
  if (!content.includes('const colors = useColors()')) {
    content = content.slice(0, afterFunction + 1) + '\n  const colors = useColors();\n' + content.slice(afterFunction + 1);
  }
  
  // Substituir COLORS.xxx por colors.xxx nos estilos
  content = content.replace(/COLORS\.(\w+)/g, 'colors.$1');
  
  fs.writeFileSync(filePath, content);
  return { migrated: true };
}

// Main
const files = findTsxFiles(COMPONENTS_DIR);
let migrated = 0;
let skipped = 0;
let errors = 0;

console.log(`Encontrados ${files.length} arquivos .tsx para verificar...\n`);

for (const file of files) {
  try {
    const result = migrateFile(file);
    if (result.migrated) {
      migrated++;
      console.log(`✅ ${path.relative(COMPONENTS_DIR, file)}`);
    } else {
      skipped++;
    }
  } catch (err) {
    errors++;
    console.error(`❌ ${path.relative(COMPONENTS_DIR, file)}: ${err.message}`);
  }
}

console.log(`\nResultado:`);
console.log(`  Migrados: ${migrated}`);
console.log(`  Pulados: ${skipped}`);
console.log(`  Erros: ${errors}`);
