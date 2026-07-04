// ============================================
// REGRA 25: PAYLOAD SEM LIMITE
// ============================================
// Nível: MÉDIO | Tipo: WARNING

/**
 * OBJETIVO: Bloquear express.json() sem limite de tamanho.
 */

module.exports = {
  name: 'Payload Limit Required',
  version: '1.0.0',
  severity: 'WARNING',
  description: 'Exige limite de tamanho em express.json()',

  rules: [
    {
      id: 'R25_PAYLOAD_LIMIT',
      name: 'Payload Limit Detection',
      severity: 'WARNING',

      check: (filePath, content) => {
        const violations = [];
        const pattern = /express\.json\s*\(\s*\)(?:(?!limit))/g;
        let match;

        while ((match = pattern.exec(content)) !== null) {
          const lineNumber = content.substring(0, match.index).split('\n').length;
          const line = content.split('\n')[lineNumber - 1];
          if (line && (line.trim().startsWith('//') || line.trim().startsWith('*'))) continue;

          violations.push({
            file: filePath, line: lineNumber, rule: 'R25_PAYLOAD_LIMIT',
            message: 'express.json() sem limite. Use { limit: "2mb" }',
            severity: 'WARNING', code: match[0],
          });
        }
        return violations;
      },
    },
  ],
};
