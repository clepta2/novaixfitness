// eslint-security-rules.js
// Regras de segurança customizadas para ESLint
declare var module: any;

module.exports = {
  rules: {
    // ============================================
    // BLOQUEAR CÓDIGO INSEGURO
    // ============================================

    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-script-url': 'error',

    // ============================================
    // BLOQUEAR console.log EM PRODUÇÃO
    // ============================================

    'no-console': ['warn', {
      allow: ['warn', 'error'],
    }],

    // ============================================
    // BLOQUEAR VAR (usar let/const)
    // ============================================

    'no-var': 'error',
    'prefer-const': 'error',

    // ============================================
    // BLOQUEAR IMPORTS INSEGUROS
    // ============================================

    'no-restricted-imports': ['error', {
      patterns: [{
        group: ['*.env', '*.env.*'],
        message: 'Nunca importe arquivos .env diretamente. Use variáveis de ambiente.',
      }],
    }],

    // ============================================
    // BLOQUEAR CÓDIGO MORTO PERIGOSO
    // ============================================

    'no-unused-vars': ['error', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    }],
  },
};
