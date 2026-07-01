// backend/scripts/retention-notifications.js
// Script para envio de notificações automáticas de retenção, cobrança e streaks
// Agendar via cron para rodar diariamente: 0 10 * * * node scripts/retention-notifications.js

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { runRetentionChecks } = require('../src/services/retentionService');

console.info(`[${new Date().toISOString()}] Iniciando verificação de notificações automáticas...`);

runRetentionChecks()
  .then((stats) => {
    console.info(`[${new Date().toISOString()}] Cron finalizado com sucesso.`);
    console.info(`Resumo: Inatividade: ${stats.inactiveSent} | Cobrança: ${stats.overdueSent} | Streaks: ${stats.streakSent}`);
    process.exit(0);
  })
  .catch((err) => {
    console.error('Erro ao executar Cron de Retenção:', err);
    process.exit(1);
  });
