// ============================================
// REGRA 26: DOCUMENT.WRITE
// ============================================
// Nível: ALTO | Tipo: BLOCK

/**
 * OBJETIVO: Bloquear document.write() em produção.
 */

module.exports = {
  name: 'No document.write',
  version: '1.0.0',
  severity: 'BLOCK',
  description: 'Bloqueia document.write()',

  rules: [
    {
      id: 'R26_NO_DOC_WRITE',
      name: 'document.write Detection',
      severity: 'BLOCK',

      check: (filePath, content) => {
        const violations = [];
        const pattern = /document\.write\s*\(/g;
        let match;

        while ((match = pattern.exec(content)) !== null) {
          const lineNumber = content.substring(0, match.index).split('\n').length;
          const line = content.split('\n')[lineNumber - 1];
          if (line && (line.trim().startsWith('//') || line.trim().startsWith('*'))) continue;

          violations.push({
            file: filePath, line: lineNumber, rule: 'R26_NO_DOC_WRITE',
            message: 'document.write() é proibido. Use React components',
            severity: 'BLOCK', code: match[0],
          });
        }
        return violations;
      },
    },
  ],
};
