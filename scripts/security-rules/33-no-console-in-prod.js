// ============================================
// REGRA 33: CONSOLE EM PRODUÇÃO
// ============================================
// Nível: ALTO | Tipo: WARNING

/**
 * OBJETIVO: Bloquear console.warn e console.error sem contexto.
 */

module.exports = {
  name: 'Console Production Check',
  version: '1.0.0',
  severity: 'WARNING',
  description: 'Verifica uso adequado de console em produção',

  rules: [
    {
      id: 'R33_CONSOLE_PROD',
      name: 'Console Production Check',
      severity: 'WARNING',

      check: (filePath, content) => {
        const violations = [];
        const pattern = /console\.(?:warn|error)\s*\(\s*['"][^'"]+['"]\s*\)/g;
        let match;

        while ((match = pattern.exec(content)) !== null) {
          const lineNumber = content.substring(0, match.index).split('\n').length;
          const line = content.split('\n')[lineNumber - 1];
          if (line && (line.trim().startsWith('//') || line.trim().startsWith('*'))) continue;

          // Verificar se é em bloco __DEV__
          const context = content.substring(Math.max(0, match.index - 200), match.index);
          const isInDev = /if\s*\(\s*__DEV__\s*\)/.test(context);
          const isSafe = /logger\.(warn|error)/.test(match[0]);

          if (!isInDev && !isSafe) {
            violations.push({
              file: filePath, line: lineNumber, rule: 'R33_CONSOLE_PROD',
              message: 'console.warn/error sem contexto. Use logger.warn/logger.error',
              severity: 'WARNING', code: match[0].substring(0, 40),
            });
          }
        }
        return violations;
      },
    },
  ],
};
