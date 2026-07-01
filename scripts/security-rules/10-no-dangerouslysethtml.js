// ============================================
// REGRA 10: DANGEROUSLYSETINNERHTML
// ============================================
// Nível: CRÍTICO | Tipo: BLOCK

/**
 * OBJETIVO: Bloquear dangerouslySetInnerHTML sem sanitização.
 */

module.exports = {
  name: 'dangerouslySetInnerHTML',
  version: '1.0.0',
  severity: 'BLOCK',
  description: 'Bloqueia dangerouslySetInnerHTML sem sanitização',

  rules: [
    {
      id: 'R10_DANGEROUS_HTML',
      name: 'dangerouslySetInnerHTML Detection',
      severity: 'BLOCK',

      check: (filePath, content) => {
        const violations = [];
        const pattern = /dangerouslySetInnerHTML/g;
        let match;

        while ((match = pattern.exec(content)) !== null) {
          const lineNumber = content.substring(0, match.index).split('\n').length;
          const line = content.split('\n')[lineNumber - 1];
          if (line && (line.trim().startsWith('//') || line.trim().startsWith('*'))) continue;

          const hasSanitize = content.includes('sanitize') || content.includes('DOMPurify');
          if (!hasSanitize) {
            violations.push({
              file: filePath, line: lineNumber, rule: 'R10_DANGEROUS_HTML',
              message: 'dangerouslySetInnerHTML sem sanitização - XSS vulnerável',
              severity: 'BLOCK', code: line.trim().substring(0, 60),
            });
          }
        }
        return violations;
      },
    },
  ],
};
