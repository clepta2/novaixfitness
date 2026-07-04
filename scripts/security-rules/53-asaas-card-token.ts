// ============================================
// REGRA 53: CARTÃO CRU NO BANCO
// ============================================
// Nível: CRÍTICO | Tipo: BLOCK

/**
 * OBJETIVO: Bloquear armazenamento de dados de cartão cru.
 */

module.exports = {
  name: 'No Raw Card Data',
  version: '1.0.0',
  severity: 'BLOCK',
  description: 'Bloqueia dados de cartão cru no banco',

  rules: [
    {
      id: 'R53_NO_CARD_DATA',
      name: 'Card Data Detection',
      severity: 'BLOCK',

      check: (filePath, content) => {
        const violations = [];
        const patterns = [
          /(?:card_number|cardNumber|numero_cartao)\s*[:=]/gi,
          /(?:cvv|cvc)\s*[:=]/gi,
          /(?:card_holder|cardHolder|nome_cartao)\s*[:=]/gi,
          /(?:expiry|validade)\s*[:=]\s*['"]\d{2}\/\d{2}['"]/gi,
          /(?:card_token|creditCardToken)\s*[:=]\s*['"]/gi,
        ];

        for (const pattern of patterns) {
          let match;
          while ((match = pattern.exec(content)) !== null) {
            const lineNumber = content.substring(0, match.index).split('\n').length;
            const line = content.split('\n')[lineNumber - 1];
            if (line && (line.trim().startsWith('//') || line.trim().startsWith('*'))) continue;

            violations.push({
              file: filePath, line: lineNumber, rule: 'R53_NO_CARD_DATA',
              message: 'Dados de cartão detectados. Use tokenização do Asaas',
              severity: 'BLOCK', code: match[0].substring(0, 40),
            });
          }
        }

        return violations;
      },
    },
  ],
};
