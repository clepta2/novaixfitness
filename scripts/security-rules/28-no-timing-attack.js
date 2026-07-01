// ============================================
// REGRA 28: TIMING ATTACK
// ============================================
// Nível: ALTO | Tipo: WARNING

/**
 * OBJETIVO: Bloquear comparações diretas de strings secretas.
 */

module.exports = {
  name: 'Timing Attack Prevention',
  version: '1.0.0',
  severity: 'WARNING',
  description: 'Bloqueia comparação direta de secrets',

  rules: [
    {
      id: 'R28_TIMING_ATTACK',
      name: 'Timing Attack Detection',
      severity: 'WARNING',

      check: (filePath, content) => {
        const violations = [];
        const pattern = /(?:token|secret|hash|password|key)\s*===?\s*(?:token|secret|hash|password|key)/gi;
        let match;

        while ((match = pattern.exec(content)) !== null) {
          const lineNumber = content.substring(0, match.index).split('\n').length;
          const line = content.split('\n')[lineNumber - 1];
          if (line && (line.trim().startsWith('//') || line.trim().startsWith('*'))) continue;

          const hasTimingSafe = content.includes('timingSafeEqual') || content.includes('crypto');
          if (!hasTimingSafe) {
            violations.push({
              file: filePath, line: lineNumber, rule: 'R28_TIMING_ATTACK',
              message: 'Comparação direta de secret - Timing Attack vulnerável',
              severity: 'WARNING', code: match[0].substring(0, 60),
            });
          }
        }
        return violations;
      },
    },
  ],
};
