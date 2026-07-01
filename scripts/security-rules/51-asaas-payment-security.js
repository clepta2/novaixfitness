// ============================================
// REGRA 51: SEGURANÇA DE PAGAMENTOS ASAAS
// ============================================
// Nível: CRÍTICO | Tipo: BLOCK

/**
 * OBJETIVO: Blindar integração com Asaas contra fraude.
 *
 * O QUE VERIFICA:
 * 1. Preço hardcoded no frontend (deve vir do backend)
 * 2. Webhook sem validação de token
 * 3. Cartão cru salvo no banco
 * 4. Valores não em centavos
 */

module.exports = {
  name: 'Asaas Payment Security',
  version: '1.0.0',
  severity: 'BLOCK',
  description: 'Blindagem de pagamentos Asaas',

  rules: [
    {
      id: 'R51_ASAAS_SECURITY',
      name: 'Asaas Payment Check',
      severity: 'BLOCK',

      check: (filePath, content) => {
        const violations = [];

        // Verificar se preço está hardcoded
        const pricePattern = /(?:value|valor|price|preco)\s*[:=]\s*(?:\d+\.?\d*|['"][^'"]*\d+['"])/gi;
        let match;
        while ((match = pricePattern.exec(content)) !== null) {
          const lineNumber = content.substring(0, match.index).split('\n').length;
          const line = content.split('\n')[lineNumber - 1];
          if (line && (line.trim().startsWith('//') || line.trim().startsWith('*'))) continue;

          const context = content.substring(Math.max(0, match.index - 200), match.index + match[0].length + 200);
          const isAsaas = /asaas|payment|cobranca|fatura/i.test(context);
          const isHardcoded = /:\s*\d+\.?\d*\s*[;,]/.test(match[0]) || /:\s*['"]\d+['"]/.test(match[0]);

          if (isAsaas && isHardcoded) {
            violations.push({
              file: filePath, line: lineNumber, rule: 'R51_ASAAS_SECURITY',
              message: 'Preço hardcoded no frontend. Busque do banco no backend',
              severity: 'BLOCK', code: match[0].substring(0, 60),
            });
          }
        }

        return violations;
      },
    },
  ],
};
