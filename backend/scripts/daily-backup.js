// backend/scripts/daily-backup.js
// Backup automatico diario - NOVAIX FITNESS
// Agendar via cron: 0 2 * * * node scripts/daily-backup.js

const { execSync } = require('child_process');
const path = require('path');

const script = path.join(__dirname, 'backup.js');

try {
  console.log(`[${new Date().toISOString()}] Iniciando backup diario...`);
  execSync(`node "${script}"`, { stdio: 'inherit', cwd: path.join(__dirname, '..') });
  console.log(`[${new Date().toISOString()}] Backup diario concluido.`);
} catch (err) {
  console.error(`[${new Date().toISOString()}] Erro no backup diario:`, err.message);
  process.exit(1);
}
