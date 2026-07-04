// ============================================
// REGRA 41: CORS WILDCARD EM PRODUÇÃO
// ============================================
// Nível: CRÍTICO | Tipo: BLOCK

/**
 * OBJETIVO: Bloquear CORS wildcard em produção.
 */

module.exports = {
  name: 'CORS Wildcard Production',
  version: '1.0.0',
  severity: 'BLOCK',
  description: 'Bloqueia CORS * em produção',

  rules: [
    {
      id: 'R41_CORS_PROD',
      name: 'CORS Wildcard Production',
      severity: 'BLOCK',

      check: (filePath, content) => {
        const violations = [];
        const pattern = /(?:origin|Access-Control-Allow-Origin)\s*[:=]\s*['"]?\*['"]?/gi;
        let match;

        while ((match = pattern.exec(content)) !== null) {
          const lineNumber = content.substring(0, match.index).split('\n').length;
          const line = content.split('\n')[lineNumber - 1];
          if (line && (line.trim().startsWith('//') || line.trim().startsWith('*'))) continue;

          violations.push({
            file: filePath, line: lineNumber, rule: 'R41_CORS_PROD',
            message: 'CORS wildcard em produção é proibido',
            severity: 'BLOCK', code: match[0],
          });
        }
        return violations;
      },
    },
  ],
};
