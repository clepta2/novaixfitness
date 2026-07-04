// ============================================
// REGRA 52: WEBHOOK ASAAS SEM VALIDAÇÃO
// ============================================
// Nível: CRÍTICO | Tipo: BLOCK

/**
 * OBJETIVO: Bloquear webhooks sem validação de token.
 */

module.exports = {
  name: 'Asaas Webhook Validation',
  version: '1.0.0',
  severity: 'BLOCK',
  description: 'Exige validação de token em webhooks',

  rules: [
    {
      id: 'R52_WEBHOOK_VALIDATION',
      name: 'Webhook Token Check',
      severity: 'BLOCK',

      check: (filePath, content) => {
        const violations = [];

        if (content.includes('webhook') || content.includes('asaas')) {
          const hasTokenCheck = content.includes('access-token') ||
            content.includes('token') ||
            content.includes('secret') ||
            content.includes('authorization');

          if (!hasTokenCheck && content.includes('app.post')) {
            violations.push({
              file: filePath, line: 0, rule: 'R52_WEBHOOK_VALIDATION',
              message: 'Webhook sem validação de token. Use asaas-access-token',
              severity: 'BLOCK', code: 'Webhook sem autenticação',
            });
          }
        }

        return violations;
      },
    },
  ],
};
