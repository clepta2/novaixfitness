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
  'user_workouts',
  'favorites',
  'subscriptions',
  'payments',
  'notifications',
  'posts',
  'post_likes',
  'post_comments',
  'admin_2fa',
  'user_achievements',
  'weight_logs',
  'water_logs',
  'body_measurements',
  'progress_photos',
  'coach_chat_messages',
  'login_attempts',
  'blocked_ips',
  'faqs',
  'testimonials',
  'forum_posts',
  'forum_replies',
  'onboarding_v2',
  'injury_details',
  'injury_checkins',
  'injury_photos',
  'movement_tests',
];

const MAX_BACKUPS = 7;

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

  rotateBackups();
}

function rotateBackups() {
  const backupsDir = path.join(__dirname, '../backups');
  if (!fs.existsSync(backupsDir)) return;

  const dirs = fs.readdirSync(backupsDir)
    .filter(d => fs.statSync(path.join(backupsDir, d)).isDirectory())
    .sort()
    .reverse();

  if (dirs.length > MAX_BACKUPS) {
    const toRemove = dirs.slice(MAX_BACKUPS);
    for (const dir of toRemove) {
      const dirPath = path.join(backupsDir, dir);
      fs.rmSync(dirPath, { recursive: true });
      console.log(`Backup antigo removido: ${dir}`);
    }
  }
}

runBackup().catch(console.error);
