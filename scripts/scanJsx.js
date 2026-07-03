const fs = require('fs');
const p = require('path');

function checkFile(file) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  const results = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Look for literal period text nodes in JSX
    // Pattern: > . < or similar
    if (line.match(/>[ \t]*\.[ \t]*</)) {
      results.push(`${file}:${i+1}: ${line.trim()}`);
    }
  }
  return results;
}

function scanDir(dir) {
  const results = [];
  try {
    const entries = fs.readdirSync(dir, {withFileTypes: true});
    for (const entry of entries) {
      const fullPath = p.join(dir, entry.name);
      if (entry.isDirectory() && !entry.name.includes('node_modules') && !entry.name.includes('.expo') && !entry.name.includes('dist')) {
        results.push(...scanDir(fullPath));
      } else if (entry.name.endsWith('.tsx')) {
        results.push(...checkFile(fullPath));
      }
    }
  } catch(e) {}
  return results;
}

console.log('Scanning for stray period text nodes...');
const results = scanDir('app');
results.push(...scanDir('src/components'));
results.push(...scanDir('src/hooks'));

if (results.length === 0) {
  console.log('No stray period text nodes found in source files.');
  console.log('The error might be coming from a runtime value or translation.');
} else {
  results.forEach(r => console.log(r));
}
