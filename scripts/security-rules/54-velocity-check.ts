// ============================================
// REGRA 54: VELOCITY CHECK (FRAUDE)
// ============================================
// Nível: ALTO | Tipo: WARNING

/**
 * OBJETIVO: Detectar padrões de fraude em pagamentos.
 */

module.exports = {
  name: 'Velocity Check',
  version: '1.0.0',
  severity: 'WARNING',
  description: 'Detecta fraude por inundação de pagamentos',

  rules: [
    {
      id: 'R54_VELOCITY_CHECK',
      name: 'Velocity Check',
      severity: 'WARNING',

      check: (filePath, content) => {
        const violations = [];

        if (content.includes('payment') || content.includes('cobranca') || content.includes('asaas')) {
          const hasRateLimit = content.includes('rate') || content.includes('limit') || content.includes('velocity');
          if (!hasRateLimit) {
            violations.push({
              file: filePath, line: 0, rule: 'R54_VELOCITY_CHECK',
              message: 'Endpoints de pagamento sem rate limiting para detecção de fraude',
              severity: 'WARNING', code: 'Sem velocity check',
            });
          }
        }

        return violations;
      },
    },
  ],
};
