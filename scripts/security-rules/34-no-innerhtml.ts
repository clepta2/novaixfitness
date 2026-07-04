// ============================================
// REGRA 34: INNERHTML
// ============================================
// Nível: CRÍTICO | Tipo: BLOCK

/**
 * OBJETIVO: Bloquear innerHTML sem sanitização.
 */

module.exports = {
  name: 'No innerHTML',
  version: '1.0.0',
  severity: 'BLOCK',
  description: 'Bloqueia innerHTML sem sanitização',

  rules: [
    {
      id: 'R34_INNERHTML',
      name: 'innerHTML Detection',
      severity: 'BLOCK',

      check: (filePath, content) => {
        const violations = [];
        const pattern = /\.innerHTML\s*=/g;
        let match;

        while ((match = pattern.exec(content)) !== null) {
          const lineNumber = content.substring(0, match.index).split('\n').length;
          const line = content.split('\n')[lineNumber - 1];
          if (line && (line.trim().startsWith('//') || line.trim().startsWith('*'))) continue;

          const hasSanitize = content.includes('sanitize') || content.includes('DOMPurify');
          if (!hasSanitize) {
            violations.push({
              file: filePath, line: lineNumber, rule: 'R34_INNERHTML',
              message: 'innerHTML sem sanitização - XSS vulnerável',
              severity: 'BLOCK', code: line.trim().substring(0, 60),
            });
          }
        }
        return violations;
      },
    },
  ],
};
