// scripts/fix-module-scope-useColors.js
// Moves `const colors = useColors()` from module scope into the component body
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

const DIRS = [
  path.join(ROOT, 'src/components'),
  path.join(ROOT, 'src/hooks'),
  path.join(ROOT, 'app'),
];

let totalFiles = 0;
let totalMoves = 0;

function processFile(fp) {
  let content = fs.readFileSync(fp, 'utf8');
  const lines = content.split('\n');

  // Find module-scope `const colors = useColors();` (not inside a function)
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line !== 'const colors = useColors();') continue;

    // Check if this line is at module scope (indented 0 spaces, or inside a component)
    const indent = lines[i].search(/\S/);
    if (indent > 0) continue; // Already inside a function — skip

    // Find the first function/export default after this line
    let insertLine = -1;
    for (let j = i + 1; j < lines.length; j++) {
      const l = lines[j].trim();
      if (l.match(/^(export\s+(default\s+)?(function|const)\s+\w+|function\s+\w+)/)) {
        insertLine = j + 1;
        break;
      }
    }

    if (insertLine === -1) continue;

    // Find the opening brace of the function
    for (let j = insertLine; j < Math.min(insertLine + 10, lines.length); j++) {
      if (lines[j].includes('{')) {
        insertLine = j + 1;
        break;
      }
    }

    // Remove the module-scope line
    lines.splice(i, 1);

    // Add it right after the opening brace
    lines.splice(insertLine, 0, '  const colors = useColors();');

    totalFiles++;
    totalMoves++;
    break; // One file at a time
  }

  fs.writeFileSync(fp, lines.join('\n'), 'utf8');
}

for (const dir of DIRS) {
  if (!fs.existsSync(dir)) continue;
  walkDir(dir);
}

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fp = path.join(dir, entry.name);
    if (entry.isDirectory() && !['node_modules','__tests__','.expo','coverage'].includes(entry.name)) {
      walkDir(fp);
    } else if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name) && !entry.name.includes('.test.')) {
      processFile(fp);
    }
  }
}

console.log(`Total: ${totalMoves} useColors() calls moved in ${totalFiles} files`);
