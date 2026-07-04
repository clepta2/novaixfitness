// scripts/fix-useRef-new.js
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

const PATTERN = /useRef\(Animated\.Value\(([^)]*)\)\)\.current/g;

let totalFiles = 0;
let totalReplacements = 0;

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fp = path.join(dir, entry.name);
    if (entry.isDirectory() && !['node_modules','__tests__','.expo','coverage'].includes(entry.name)) {
      walkDir(fp);
    } else if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name)) {
      let content = fs.readFileSync(fp, 'utf8');
      const matches = content.match(PATTERN);
      if (matches) {
        content = content.replace(PATTERN, (_, args) => `useRef(new Animated.Value(${args})).current`);
        fs.writeFileSync(fp, content, 'utf8');
        totalFiles++;
        totalReplacements += matches.length;
        console.log(`  ${path.relative(ROOT, fp)}: ${matches.length}`);
      }
    }
  }
}

walkDir(path.join(ROOT, 'src'));
walkDir(path.join(ROOT, 'app'));
console.log(`Total: ${totalReplacements} in ${totalFiles} files`);
