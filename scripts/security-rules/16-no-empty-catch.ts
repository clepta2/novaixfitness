// ============================================
// REGRA 16: TRY/CATCH VAZIO
// ============================================
// Nível: ALTO | Tipo: WARNING

/**
 * OBJETIVO: Bloquear blocos catch vazios.
 */

module.exports = {
  name: 'No Empty Catch',
  version: '1.0.0',
  severity: 'WARNING',
  description: 'Bloqueia try/catch vazios',

  rules: [
    {
      id: 'R16_EMPTY_CATCH',
      name: 'Empty Catch Detection',
      severity: 'WARNING',

      check: (filePath, content) => {
        const violations = [];
        const pattern = /catch\s*\([^)]*\)\s*\{\s*\}/g;
        let match;

        while ((match = pattern.exec(content)) !== null) {
          const lineNumber = content.substring(0, match.index).split('\n').length;
          const line = content.split('\n')[lineNumber - 1];
          if (line && (line.trim().startsWith('//') || line.trim().startsWith('*'))) continue;

          violations.push({
            file: filePath, line: lineNumber, rule: 'R16_EMPTY_CATCH',
            message: 'Try/catch vazio engole erros silenciosamente. Log o erro',
            severity: 'WARNING', code: match[0].substring(0, 40),
          });
        }
        return violations;
      },
    },
  ],
};
