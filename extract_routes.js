const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const routes = new Set();

function scan(d) {
  fs.readdirSync(d, { withFileTypes: true }).forEach(f => {
    const fp = path.join(d, f.name);
    if (f.isDirectory()) return scan(fp);
    if (!/\.(ts|tsx|js|jsx)$/.test(f.name)) return;
    const c = fs.readFileSync(fp, 'utf8');
    
    // router.push('/path') or router.replace('/path')
    let m;
    const re1 = /router\.(push|replace)\(['"]([^'"]+)['"]\)/g;
    while ((m = re1.exec(c))) routes.add(m[2]);
    
    // to="/path" in Link or similar
    const re2 = /to=['"]([^'"]+)['"]/g;
    while ((m = re2.exec(c))) {
      if (m[1].startsWith('/')) routes.add(m[1]);
    }
    
    // href="/path"
    const re3 = /href=['"]([^'"]+)['"]/g;
    while ((m = re3.exec(c))) {
      if (m[1].startsWith('/')) routes.add(m[1]);
    }
    
    // navigate('/path')
    const re4 = /navigate\(['"]([^'"]+)['"]\)/g;
    while ((m = re4.exec(c))) routes.add(m[1]);
    
    // pathname: '/path'
    const re5 = /pathname:\s*['"]([^'"]+)['"]/g;
    while ((m = re5.exec(c))) routes.add(m[1]);
  });
}

scan(srcDir);
console.log([...routes].sort().join('\n'));
