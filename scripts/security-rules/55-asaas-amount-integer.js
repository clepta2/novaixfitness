// ============================================
// REGRA 55: VALORES EM CENTAVOS
// ============================================
// Nível: MÉDIO | Tipo: WARNING

/**
 * OBJETIVO: Verificar se valores financeiros usam centavos.
 */

module.exports = {
  name: 'Amount Integer Check',
  version: '1.0.0',
  severity: 'WARNING',
  description: 'Exige valores financeiros em centavos',

  rules: [
    {
      id: 'R55_AMOUNT_INTEGER',
      name: 'Amount Integer Check',
      severity: 'WARNING',

      check: (filePath, content) => {
        const violations = [];

        if (content.includes('asaas') || content.includes('payment')) {
          const hasIntegerCheck = content.includes('centavos') ||
            content.includes('Math.round') ||
            content.includes('parseInt') ||
            content.includes('* 100');

          if (!hasIntegerCheck && content.includes('value')) {
            violations.push({
              file: filePath, line: 0, rule: 'R55_AMOUNT_INTEGER',
              message: 'Valores financeiros devem ser inteiros (centavos)',
              severity: 'WARNING', code: 'Sem conversão para centavos',
            });
          }
        }

        return violations;
      },
    },
  ],
};
