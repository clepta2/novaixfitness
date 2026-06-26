// backend/scripts/backup.js
// Backup manual do banco Supabase - NOVAIX FITNESS
// Uso: node scripts/backup.js

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
);

const TABLES = [
  'profiles',
  'workouts',
  'exercises',
  'workout_logs',
  'favorites',
  'subscriptions',
  'payments',
  'notifications',
  'posts',
  'comments',
  'admin_2fa',
  'coupons',
  'referrals',
  'achievements',
  'weight_logs',
  'water_logs',
  'body_measurements',
  'progress_photos',
  'challenges',
  'consents',
];

async function backupTable(tableName) {
  const { data, error } = await supabase.from(tableName).select('*');
  if (error) {
    console.error(`  Erro na tabela ${tableName}: ${error.message}`);
    return null;
  }
  console.log(`  ${tableName}: ${data?.length || 0} registros`);
  return data;
}

function toSQL(tableName, rows) {
  if (!rows || rows.length === 0) return `-- ${tableName}: 0 registros\n`;

  let sql = `-- ${tableName}\n`;
  sql += `DELETE FROM ${tableName};\n`;

  for (const row of rows) {
    const values = Object.entries(row)
      .map(([key, val]) => {
        if (val === null) return 'NULL';
        if (typeof val === 'number') return val;
        if (typeof val === 'boolean') return val;
        if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
        return `'${String(val).replace(/'/g, "''")}'`;
      })
      .join(', ');

    sql += `INSERT INTO ${tableName} (${Object.keys(row).join(', ')}) VALUES (${values});\n`;
  }
  return sql;
}

async function runBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const backupDir = path.join(__dirname, '../backups', timestamp);

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  console.log(`Backup iniciado: ${timestamp}`);
  console.log(`Diretório: ${backupDir}\n`);

  let totalRecords = 0;
  let successTables = 0;

  for (const table of TABLES) {
    const rows = await backupTable(table);
    if (rows !== null) {
      const sql = toSQL(table, rows);
      fs.writeFileSync(path.join(backupDir, `${table}.sql`), sql);
      totalRecords += rows.length;
      successTables++;
    }
  }

  const summary = {
    timestamp,
    tables: successTables,
    totalRecords,
    directory: backupDir,
  };

  fs.writeFileSync(
    path.join(backupDir, 'summary.json'),
    JSON.stringify(summary, null, 2)
  );

  console.log(`\nBackup concluído!`);
  console.log(`Tabelas: ${successTables}/${TABLES.length}`);
  console.log(`Total de registros: ${totalRecords}`);
  console.log(`Arquivos em: ${backupDir}`);
}

runBackup().catch(console.error);
