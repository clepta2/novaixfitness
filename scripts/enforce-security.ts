#!/usr/bin/env node
// scripts/enforce-security.js
// MAESTRO MODULAR - 180 Regras Enterprise
// 30 Camadas: Escrita | Lógica | Operação | Nuvem | Humana | Sobrevivência | Asaas | Bug Bounty | Comportamental | Servidor | Chat | Email | Growth | Checkout | Contingência | Defesa | Performance | Infrastructure | Storage | Crypto | Resiliência | Chaos | API Hardening | API Transport | API Lifecycle | Client/Backend | Advanced Defense | AI Security | AI Output | AI Governance

const fs = require('fs');
const path = require('path');

const WHITELIST = [/node_modules\//, /dist\//, /\.expo\//, /coverage\//, /package-lock\.json$/, /yarn\.lock$/, /\.git\//, /android\//, /ios\//, /__mocks__\//, /\.json$/];
function isWhitelisted(f) { return WHITELIST.some(p => p.test(f)); }

function loadRules() {
  const dir = path.join(__dirname, 'security-rules');
  const all = [];
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.js'))) {
    const mod = require(path.join(dir, f));
    all.push(...mod.rules.map(r => ({ ...r, category: mod.name })));
  }
  return all;
}

function checkConsole(content, fp) {
  const v = [], lines = content.split('\n');
  let inDev = false, d = 0;
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (l.includes('if (__DEV__)')) { inDev = true; d = 0; }
    if (inDev) { d += (l.match(/{/g)||[]).length - (l.match(/}/g)||[]).length; if (d <= 0) inDev = false; }
    if (l.includes('console.log(') && !inDev && !l.includes('logger.dev('))
      v.push({ file: fp, line: i+1, rule: 'CONSOLE', msg: 'console.log() fora de __DEV__', severity: 'BLOCK' });
  }
  return v;
}

function checkFile(fp, rules) {
  if (isWhitelisted(fp)) return [];
  const content = fs.readFileSync(fp, 'utf8');
  const lines = content.split('\n');
  const v = [...checkConsole(content, fp)];

  for (const r of rules) {
    if (r.check) {
      const result = r.check(fp, content);
      if (result) v.push({ file: fp, line: 0, rule: r.id, msg: result.msg, severity: result.severity });
    } else if (r.pattern) {
      let m;
      const re = new RegExp(r.pattern.source, r.pattern.flags);
      while ((m = re.exec(content)) !== null)
        v.push({ file: fp, line: content.substring(0, m.index).split('\n').length, rule: r.id, msg: r.msg, severity: r.severity, code: m[0].substring(0,50) });
    }
  }

  const isDataOrConstant = fp.includes('data\\') || fp.includes('constants\\') || fp.includes('data/') || fp.includes('constants/');
  if (lines.length > 200 && !isDataOrConstant) v.push({ file: fp, line: 0, rule: 'MAX_LEN', msg: `${lines.length} linhas (máx: 200)`, severity: 'BLOCK' });
  return v;
}

function checkDir(dir, rules) {
  let v = [], c = 0, s = 0;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory() && !e.name.startsWith('.') && e.name !== 'node_modules') {
      const r = checkDir(full, rules); v.push(...r.violations); c += r.checked; s += r.skipped;
    } else if (e.isFile() && ['.js','.ts','.tsx'].some(ext => e.name.endsWith(ext))) {
      if (isWhitelisted(full)) s++; else { v.push(...checkFile(full, rules)); c++; }
    }
  }
  return { violations: v, checked: c, skipped: s };
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const target = args.find(a => !a.startsWith('--')) || 'src';
  const rules = loadRules();
  const blocks = rules.filter(r => r.severity === 'BLOCK');
  console.log(`\n🔒 SECURITY GATE - ${rules.length} regras (${blocks.length} BLOCK, ${rules.length - blocks.length} WARNING)\n`);

  const result = checkDir(target, rules);
  const b = result.violations.filter(v => v.severity === 'BLOCK');
  const w = result.violations.filter(v => v.severity === 'WARNING');

  console.log(`📁 ${result.checked} verificados | ${result.skipped} ignorados`);
  console.log(`🚫 ${b.length} BLOCKS | ⚠️ ${w.length} WARNINGS\n`);

  if (b.length > 0) { console.log('🚫 BLOQUEADOS:\n'); b.forEach(x => console.log(`  ${x.file}:${x.line} [${x.rule}] ${x.msg}\n`)); }
  if (w.length > 0) { console.log('⚠️  AVISOS:\n'); w.forEach(x => console.log(`  ${x.file}:${x.line} [${x.rule}] ${x.msg}\n`)); }

  console.log(b.length === 0 ? '✅ APROVADO\n' : '❌ BLOQUEADO\n');
  process.exit(b.length === 0 ? 0 : 1);
}

module.exports = { loadRules, checkFile, checkDir };
