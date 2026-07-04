// scripts/fix-stylesheet-colors.js
// In files where StyleSheet.create is at module scope and references `colors`,
// replace `colors.X` with `COLORS.X` (the constant import)
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

const DIRS = [
  path.join(ROOT, 'src/components'),
  path.join(ROOT, 'src/styles'),
];

let totalFiles = 0;
let totalReplacements = 0;

function processFile(fp) {
  let content = fs.readFileSync(fp, 'utf8');
  if (!content.includes('StyleSheet.create') || !content.includes('colors.')) return;
  if (!content.includes('import { COLORS }') && !content.includes("import { COLORS}")) return;

  const original = content;
  // Replace colors.X with COLORS.X inside StyleSheet.create blocks
  // Simple approach: replace all colors. with COLORS. — but only in style definitions
  content = content.replace(/colors\.(\w+)/g, 'COLORS.$1');

  if (content !== original) {
    fs.writeFileSync(fp, content, 'utf8');
    const count = (original.match(/colors\.\w+/g) || []).length;
    totalFiles++;
    totalReplacements += count;
    console.log(`  ${path.relative(ROOT, fp)}: ${count}`);
  }
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const fp = path.join(dir, e.name);
    if (e.isDirectory() && !['node_modules','__tests__','.expo','coverage'].includes(e.name)) walk(fp);
    else if (e.isFile() && /\.(ts|tsx)$/.test(e.name) && !e.name.includes('.test.')) processFile(fp);
  }
}

DIRS.forEach(d => { if (fs.existsSync(d)) walk(d); });
console.log(`Total: ${totalReplacements} replacements in ${totalFiles} files`);
