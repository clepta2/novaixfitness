const fs = require('fs');
const path = require('path');

const servicesDir = path.join(__dirname, 'src', 'services');
const tables = new Set();
const routes = new Set();
const hrefs = new Set();

function scanDir(dir) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDir(fullPath);
    } else if (/\.(ts|tsx|js|jsx)$/.test(entry.name)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // Extract table names
      let match;
      const tableRe = /\.from\(['"]([^'"]+)['"]\)/g;
      while ((match = tableRe.exec(content)) !== null) {
        tables.add(match[1]);
      }
    }
  });
}

function scanAll(srcDir) {
  fs.readdirSync(srcDir, { withFileTypes: true }).forEach(entry => {
    const fullPath = path.join(srcDir, entry.name);
    if (entry.isDirectory()) {
      scanAll(fullPath);
    } else if (/\.(ts|tsx|js|jsx)$/.test(entry.name)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      let match;
      // Extract table names
      const tableRe = /\.from\(['"]([^'"]+)['"]\)/g;
      while ((match = tableRe.exec(content)) !== null) {
        tables.add(match[1]);
      }
      
      // Extract router paths
      const routerRe = /router\.(push|replace)\(['"]([^'"]+)['"]\)/g;
      while ((match = routerRe.exec(content)) !== null) {
        routes.add(match[2]);
      }
      
      // Extract href paths
      const hrefRe = /href=['"]([^'"]+)['"]/g;
      while ((match = hrefRe.exec(content)) !== null) {
        if (match[1].startsWith('/')) {
          hrefs.add(match[1]);
        }
      }
    }
  });
}

const srcDir = path.join(__dirname, 'src');
scanAll(srcDir);

console.log('=== TABLES ===');
[...tables].sort().forEach(t => console.log(t));
console.log('\n=== ROUTES (router) ===');
[...routes].sort().forEach(r => console.log(r));
console.log('\n=== ROUTES (href) ===');
[...hrefs].sort().forEach(h => console.log(h));
