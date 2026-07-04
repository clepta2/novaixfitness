const fs = require('fs');
const path = require('path');

function walk(d) {
  const f = [];
  fs.readdirSync(d, { withFileTypes: true }).forEach(x => {
    const p = path.join(d, x.name);
    if (x.isDirectory()) f.push(...walk(p));
    else if (x.name.endsWith('.js')) f.push(p);
  });
  return f;
}

// Get all existing routes
const appFiles = walk('app');
const routes = new Set();
appFiles.forEach(f => {
  const relativePath = path.relative(path.join(process.cwd(), 'app'), f).split(path.sep).join('/');
  let route = relativePath.replace('.js', '');
  if (route === 'index') route = '/';
  else if (route.endsWith('/index')) route = '/' + route.replace('/index', '');
  else route = '/' + route;
  routes.add(route);
});

// Add tab routes
routes.add('/(tabs)/home');
routes.add('/(tabs)/feed');
routes.add('/(tabs)/library');
routes.add('/(tabs)/perfil');
routes.add('/(tabs)/ajuda');

console.log('Rotas registradas: ' + routes.size);

// Check all route references
const srcFiles = [...walk('app'), ...walk('src')];
const broken = [];
srcFiles.forEach(f => {
  const c = fs.readFileSync(f, 'utf8');
  const pattern = /router\.(push|replace)\(['"`]([^'"`]+)/g;
  let match;
  while ((match = pattern.exec(c)) !== null) {
    const route = match[2];
    if (route.startsWith('http') || route.includes('{') || route.includes('?') || route.includes(':')) continue;
    if (!routes.has(route) && !routes.has(route + '/index')) {
      if (route.startsWith('/')) {
        broken.push({ file: path.relative(process.cwd(), f).split(path.sep).join('/'), route });
      }
    }
  }
});

if (broken.length === 0) {
  console.log('Todos os links estao funcionando!');
} else {
  console.log('Links quebrados encontrados (' + broken.length + '):');
  broken.forEach(b => console.log('  ' + b.file + ' -> ' + b.route));
}
