// scripts/findStrayPeriod.js
const fs = require('fs');
const path = require('path');

function scan(d) {
  const entries = fs.readdirSync(d, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(d, e.name);
    if (e.isDirectory() && !e.name.includes('node_modules') && !e.name.includes('.expo')) {
      scan(full);
    } else if (e.name.endsWith('.tsx') || e.name.endsWith('.ts')) {
      const content = fs.readFileSync(full, 'utf8');
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        // Procurar por linhas que sao apenas um ponto
        if (line.trim() === '.') {
          console.log(full + ':' + (i+1) + ': "' + line.trim() + '"');
        }
        // Procurar por '> . <'
        if (line.includes('> . <')) {
          console.log(full + ':' + (i+1) + ': "' + line.trim() + '"');
        }
        // Procurar por '>.  <' com espacos
        if (/>\s*\.\s*</.test(line)) {
          console.log(full + ':' + (i+1) + ': "' + line.trim() + '"');
        }
      }
    }
  }
}

console.log('Searching for stray periods...');
scan('app');
scan('src/components');
scan('src/hooks');
console.log('Done.');
