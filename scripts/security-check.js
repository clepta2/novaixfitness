#!/usr/bin/env node
// scripts/security-check.js
// Verificação de segurança obrigatória antes de commit

const fs = require('fs');
const path = require('path');

const SECURITY_RULES = {
  // ============================================
  // PADRÕES PROIBIDOS
  // ============================================

  forbidden: [
    {
      pattern: /console\.log\(/g,
      message: 'console.log() não é permitido. Use console.warn() ou console.error()',
      severity: 'error',
    },
    {
      pattern: /API_KEY\s*=\s*['"][^'"]+['"]/g,
      message: 'Chaves de API hardcoded são proibidas. Use variáveis de ambiente.',
      severity: 'error',
    },
    {
      pattern: /SECRET\s*=\s*['"][^'"]+['"]/g,
      message: 'Segredos hardcoded são proibidos. Use variáveis de ambiente.',
      severity: 'error',
    },
    {
      pattern: /PASSWORD\s*=\s*['"][^'"]+['"]/g,
      message: 'Senhas hardcoded são proibidas.',
      severity: 'error',
    },
    {
      pattern: /eval\(/g,
      message: 'eval() é proibido por segurança.',
      severity: 'error',
    },
    {
      pattern: /new\s+Function\(/g,
      message: 'new Function() é proibido por segurança.',
      severity: 'error',
    },
    {
      pattern: /document\.write\(/g,
      message: 'document.write() é proibido.',
      severity: 'error',
    },
    {
      pattern: /innerHTML\s*=/g,
      message: 'innerHTML é proibido. Use textContent ou React.',
      severity: 'error',
    },
  ],

  // ============================================
  // PADRÕES OBRIGATÓRIOS
  // ============================================

  required: [
    {
      // Arquivos de serviço devem usar supabase
      filePattern: /src\/services\/.*\.js$/,
      contentPattern: /from\s+['"].*supabase['"]/,
      message: 'Serviços devem importar supabase para operações de banco.',
      severity: 'warning',
    },
    {
      // Componentes devem usar design system
      filePattern: /src\/components\/.*\.js$/,
      contentPattern: /from\s+['"].*constants\/(colors|spacing)['"]/,
      message: 'Componentes devem usar o design system (COLORS, SPACING).',
      severity: 'warning',
    },
    {
      // Telas devem ter ErrorBoundary
      filePattern: /app\/.*\.js$/,
      contentPattern: /ErrorBoundary/,
      message: 'Telas devem usar ErrorBoundary.',
      severity: 'warning',
    },
  ],

  // ============================================
  // COMPRIMENTO MÁXIMO DE ARQUIVO
  // ============================================

  maxFileLines: 200,

  // ============================================
  // COMPRIMENTO MÁXIMO DE FUNÇÃO
  // ============================================

  maxFunctionLines: 50,
};

// ============================================
// VERIFICADOR
// ============================================

class SecurityChecker {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.filesChecked = 0;
  }

  checkFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    this.filesChecked++;

    // Verificar regras proibidas
    for (const rule of SECURITY_RULES.forbidden) {
      let match;
      while ((match = rule.pattern.exec(content)) !== null) {
        const lineNumber = content.substring(0, match.index).split('\n').length;
        const entry = {
          file: filePath,
          line: lineNumber,
          message: rule.message,
          code: match[0],
        };

        if (rule.severity === 'error') {
          this.errors.push(entry);
        } else {
          this.warnings.push(entry);
        }
      }
    }

    // Verificar regras obrigatórias
    for (const rule of SECURITY_RULES.required) {
      if (rule.filePattern && !rule.filePattern.test(filePath)) continue;
      if (rule.contentPattern && !rule.contentPattern.test(content)) {
        this.warnings.push({
          file: filePath,
          line: 0,
          message: rule.message,
        });
      }
    }

    // Verificar comprimento do arquivo
    if (lines.length > SECURITY_RULES.maxFileLines) {
      this.warnings.push({
        file: filePath,
        line: 0,
        message: `Arquivo tem ${lines.length} linhas (máximo: ${SECURITY_RULES.maxFileLines})`,
      });
    }

    // Verificar imports de .env
    if (content.includes("require('.env") || content.includes('require(".env')) {
      this.errors.push({
        file: filePath,
        line: 0,
        message: 'Nunca importe arquivos .env diretamente.',
      });
    }

    // Verificar credenciais expostas
    if (content.match(/sk-[a-zA-Z0-9]{32,}/)) {
      this.errors.push({
        file: filePath,
        line: 0,
        message: 'Chave de API (sk-...) exposta no código.',
      });
    }

    if (content.match(/ghp_[a-zA-Z0-9]{36}/)) {
      this.errors.push({
        file: filePath,
        line: 0,
        message: 'GitHub token exposto no código.',
      });
    }
  }

  checkDirectory(dirPath, extensions = ['.js', '.ts', '.tsx']) {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        this.checkDirectory(fullPath, extensions);
      } else if (entry.isFile() && extensions.some(ext => entry.name.endsWith(ext))) {
        this.checkFile(fullPath);
      }
    }
  }

  getReport() {
    return {
      filesChecked: this.filesChecked,
      errors: this.errors,
      warnings: this.warnings,
      passed: this.errors.length === 0,
      summary: {
        errors: this.errors.length,
        warnings: this.warnings.length,
      },
    };
  }

  printReport() {
    console.log('\n🔒 RELATÓRIO DE SEGURANÇA\n');
    console.log(`📁 Arquivos verificados: ${this.filesChecked}`);
    console.log(`❌ Erros: ${this.errors.length}`);
    console.log(`⚠️  Avisos: ${this.warnings.length}\n`);

    if (this.errors.length > 0) {
      console.log('❌ ERROS (devem ser corrigidos):\n');
      for (const error of this.errors) {
        console.log(`  ${error.file}:${error.line}`);
        console.log(`    ${error.message}`);
        if (error.code) console.log(`    Código: ${error.code}`);
        console.log('');
      }
    }

    if (this.warnings.length > 0) {
      console.log('⚠️  AVISOS (recomendado corrigir):\n');
      for (const warning of this.warnings) {
        console.log(`  ${warning.file}:${warning.line}`);
        console.log(`    ${warning.message}\n`);
      }
    }

    if (this.errors.length === 0) {
      console.log('✅ Todas as verificações de segurança passaram!\n');
    }

    return this.errors.length === 0;
  }
}

// ============================================
// EXECUÇÃO
// ============================================

if (require.main === module) {
  const checker = new SecurityChecker();
  const targetDir = process.argv[2] || 'src';

  console.log(`🔍 Verificando segurança em: ${targetDir}\n`);

  checker.checkDirectory(targetDir);
  const passed = checker.printReport();

  process.exit(passed ? 0 : 1);
}

module.exports = { SecurityChecker, SECURITY_RULES };
