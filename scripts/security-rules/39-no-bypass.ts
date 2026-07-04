// ============================================
// REGRA 39: PRE-COMMIT BYPASS
// ============================================
// Nível: ALTO | Tipo: BLOCK

/**
 * OBJETIVO: Bloquear uso de --no-verify.
 */

module.exports = {
  name: 'No Pre-commit Bypass',
  version: '1.0.0',
  severity: 'BLOCK',
  description: 'Bloqueia --no-verify',

  rules: [
    {
      id: 'R39_NO_BYPASS',
      name: 'No Bypass Detection',
      severity: 'BLOCK',

      check: (filePath, content) => {
        const violations = [];
        const pattern = /--no-verify/g;
        let match;

        while ((match = pattern.exec(content)) !== null) {
          const lineNumber = content.substring(0, match.index).split('\n').length;
          const line = content.split('\n')[lineNumber - 1];
          if (line && (line.trim().startsWith('//') || line.trim().startsWith('*'))) continue;

          violations.push({
            file: filePath, line: lineNumber, rule: 'R39_NO_BYPASS',
            message: 'Flag --no-verify detectada. Bypass de segurança proibido',
            severity: 'BLOCK', code: match[0],
          });
        }
        return violations;
      },
    },
  ],
};
