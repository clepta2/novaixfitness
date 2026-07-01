// ============================================
// REGRA 11: TIPO ANY NO TYPESCRIPT
// ============================================
// Nível: MÉDIO | Tipo: WARNING

/**
 * OBJETIVO: Bloquear uso de tipo any no TypeScript.
 *
 * POR QUE É PERIGOSO:
 * - Desliga verificações de tipo
 * - Abre margem para bugs em produção
 * - Impossível rastrear erros de contrato de dados
 */

module.exports = {
  name: 'No TypeScript any',
  version: '1.0.0',
  severity: 'WARNING',
  description: 'Bloqueia tipo any no TypeScript',

  rules: [
    {
      id: 'R11_NO_ANY',
      name: 'TypeScript any Detection',
      severity: 'WARNING',

      check: (filePath, content) => {
        if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) return [];

        const violations = [];
        const patterns = [
          /:\s*any\b/g,
          /:\s*any\[\]/g,
          /as\s+any\b/g,
          /<any>/g,
        ];

        for (const pattern of patterns) {
          let match;
          while ((match = pattern.exec(content)) !== null) {
            const lineNumber = content.substring(0, match.index).split('\n').length;
            const line = content.split('\n')[lineNumber - 1];
            if (line && (line.trim().startsWith('//') || line.trim().startsWith('*'))) continue;

            violations.push({
              file: filePath, line: lineNumber, rule: 'R11_NO_ANY',
              message: 'Tipo "any" usado. Use unknown ou tipos específicos',
              severity: 'WARNING', code: match[0],
            });
          }
        }
        return violations;
      },
    },
  ],
};
