// ============================================
// REGRA 30: JWT NONE ATTACK
// ============================================
// Nível: CRÍTICO | Tipo: BLOCK

/**
 * OBJETIVO: Bloquear JWT sem algoritmo explícito.
 */

module.exports = {
  name: 'JWT None Attack Prevention',
  version: '1.0.0',
  severity: 'BLOCK',
  description: 'Exige algoritmo explícito em JWT verify',

  rules: [
    {
      id: 'R30_JWT_NONE',
      name: 'JWT None Attack Detection',
      severity: 'BLOCK',

      check: (filePath, content) => {
        const violations = [];
        const patterns = [
          /jwt\.verify\s*\(\s*[^)]*\)(?:(?!algorithms))/g,
          /jwt\.decode\s*\(\s*[^)]*\)(?:(?!complete))/g,
        ];

        for (const pattern of patterns) {
          let match;
          while ((match = pattern.exec(content)) !== null) {
            const lineNumber = content.substring(0, match.index).split('\n').length;
            const line = content.split('\n')[lineNumber - 1];
            if (line && (line.trim().startsWith('//') || line.trim().startsWith('*'))) continue;

            const hasAlgorithms = content.includes('algorithms:') || content.includes('algorithms :');
            if (!hasAlgorithms) {
              violations.push({
                file: filePath, line: lineNumber, rule: 'R30_JWT_NONE',
                message: 'JWT verify sem algoritmo explícito - JWT none attack',
                severity: 'BLOCK', code: match[0].substring(0, 60),
              });
            }
          }
        }
        return violations;
      },
    },
  ],
};
