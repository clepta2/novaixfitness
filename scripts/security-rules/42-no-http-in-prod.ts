// ============================================
// REGRA 42: HTTP EM PRODUÇÃO
// ============================================
// Nível: ALTO | Tipo: BLOCK

/**
 * OBJETIVO: Bloquear HTTP não-criptografado em produção.
 */

module.exports = {
  name: 'No HTTP in Production',
  version: '1.0.0',
  severity: 'BLOCK',
  description: 'Bloqueia HTTP em produção',

  rules: [
    {
      id: 'R42_NO_HTTP_PROD',
      name: 'HTTP Production Check',
      severity: 'BLOCK',

      check: (filePath, content) => {
        const violations = [];
        const pattern = /['"]http:\/\/(?!localhost|127\.0\.0\.1)/gi;
        let match;

        while ((match = pattern.exec(content)) !== null) {
          const lineNumber = content.substring(0, match.index).split('\n').length;
          const line = content.split('\n')[lineNumber - 1];
          if (line && (line.trim().startsWith('//') || line.trim().startsWith('*'))) continue;

          violations.push({
            file: filePath, line: lineNumber, rule: 'R42_NO_HTTP_PROD',
            message: 'HTTP não-criptografado. Use HTTPS',
            severity: 'BLOCK', code: match[0].substring(0, 60),
          });
        }
        return violations;
      },
    },
  ],
};
