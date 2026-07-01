// ============================================
// REGRA 27: REDOS (Regex DoS)
// ============================================
// Nível: ALTO | Tipo: BLOCK

/**
 * OBJETIVO: Bloquear regex com risco de ReDoS.
 */

module.exports = {
  name: 'ReDoS Prevention',
  version: '1.0.0',
  severity: 'BLOCK',
  description: 'Bloqueia regex com risco de ReDoS',

  rules: [
    {
      id: 'R27_REDoS',
      name: 'ReDoS Detection',
      severity: 'BLOCK',

      check: (filePath, content) => {
        const violations = [];
        // Padrões perigosos de repetição aninhada
        const patterns = [
          /\(\?:[^)]*\+\)\+/g,
          /\(\?:[^)]*\*\)\*/g,
          /\(\?:[^)]*\+\)\*/g,
          /\(\?:[^)]*\*\)\+/g,
          /\([^)]*\+\)\+/g,
          /\([^)]*\*\)\*/g,
        ];

        for (const pattern of patterns) {
          let match;
          while ((match = pattern.exec(content)) !== null) {
            const lineNumber = content.substring(0, match.index).split('\n').length;
            const line = content.split('\n')[lineNumber - 1];
            if (line && (line.trim().startsWith('//') || line.trim().startsWith('*'))) continue;

            violations.push({
              file: filePath, line: lineNumber, rule: 'R27_REDoS',
              message: 'Regex com repetição aninhada - risco de ReDoS',
              severity: 'BLOCK', code: match[0].substring(0, 40),
            });
          }
        }
        return violations;
      },
    },
  ],
};
