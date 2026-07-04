#!/usr/bin/env node
// scripts/security-gate.js
// Security gate - bloqueia commit se houver violações

const { SecurityChecker } = require('./security-check');
const { execSync } = require('child_process');

console.log('🛡️  SECURITY GATE - Verificando segurança antes do commit...\n');

// ============================================
// 1. VERIFICAR SEGURANÇA DO CÓDIGO
// ============================================

const checker = new SecurityChecker();
checker.checkDirectory('src');
checker.checkDirectory('app');

const report = checker.getReport();

if (report.errors.length > 0) {
  console.log('❌ BLOCKED: Violações de segurança encontradas!\n');
  checker.printReport();
  console.log('\n🔧 Corrija os erros antes de commitar.\n');
  process.exit(1);
}

// ============================================
// 2. VERIFICAR SECRETS NO GIT
// ============================================

try {
  const gitDiff = execSync('git diff --cached --name-only', { encoding: 'utf8' });
  const files = gitDiff.split('\n').filter(Boolean);

  for (const file of files) {
    if (file.endsWith('.env') || file.endsWith('.env.local') || file.endsWith('.env.production')) {
      console.log(`❌ BLOCKED: Arquivo ${file} não pode ser commitado!`);
      console.log('   Adicione ao .gitignore.\n');
      process.exit(1);
    }
  }
} catch (err) {
  // git diff pode falhar se não estiver em um repo git
}

// ============================================
// 3. VERIFICAR .gitignore
// ============================================

const fs = require('fs');
const path = require('path');

const gitignorePath = path.join(process.cwd(), '.gitignore');
if (fs.existsSync(gitignorePath)) {
  const gitignore = fs.readFileSync(gitignorePath, 'utf8');
  const requiredPatterns = ['.env', 'node_modules', '*.log'];

  for (const pattern of requiredPatterns) {
    if (!gitignore.includes(pattern)) {
      console.log(`⚠️  AVISO: ${pattern} não está no .gitignore`);
    }
  }
}

// ============================================
// 4. VERIFICAR DEPENDÊNCIAS VULNERÁVEIS
// ============================================

try {
  execSync('npm audit --audit-level=high 2>/dev/null', { stdio: 'pipe' });
} catch (err) {
  if (err.status !== 0) {
    console.log('⚠️  AVISO: Dependências com vulnerabilidades altas encontradas.');
    console.log('   Execute: npm audit fix\n');
  }
}

// ============================================
// 5. VERIFICAR SE HÁ MUDANÇAS NOS ARQUIVOS DE SEGURANÇA
// ============================================

try {
  const gitDiff = execSync('git diff --cached --name-only', { encoding: 'utf8' });
  const securityFiles = [
    'src/security/',
    'src/middleware/auth.js',
    'src/middleware/rateLimit.js',
    'src/services/security.js',
    'src/services/contentModeration.js',
  ];

  const changedSecurityFiles = gitDiff.split('\n').filter(f =>
    securityFiles.some(sf => f.includes(sf))
  );

  if (changedSecurityFiles.length > 0) {
    console.log('🔒 AVISO: Arquivos de segurança foram modificados:');
    changedSecurityFiles.forEach(f => console.log(`   - ${f}`));
    console.log('\n   Certifique-se de que as mudanças são seguras.\n');
  }
} catch (err) {
  // Pode falhar se não estiver em repo git
}

// ============================================
// RESULTADO
// ============================================

if (report.warnings.length > 0) {
  console.log(`\n⚠️  ${report.warnings.length} avisos encontrados.`);
  console.log('   Recomendado corrigir antes de commitar.\n');
}

console.log('✅ Security gate passou! Commit permitido.\n');
process.exit(0);
