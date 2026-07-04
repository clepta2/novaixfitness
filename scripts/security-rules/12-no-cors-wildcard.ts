// ============================================
// REGRA 12: CORS WILDCARD
// ============================================
// Nível: ALTO | Tipo: BLOCK

/**
 * OBJETIVO: Bloquear CORS com asterisco em produção.
 */

module.exports = {
  name: 'No CORS Wildcard',
  version: '1.0.0',
  severity: 'BLOCK',
  description: 'Bloqueia Access-Control-Allow-Origin: *',

  rules: [
    {
      id: 'R12_CORS_WILDCARD',
      name: 'CORS Wildcard Detection',
      severity: 'BLOCK',

      check: (filePath, content) => {
        const violations = [];
        const pattern = /(?:Access-Control-Allow-Origin|origin)\s*[:=]\s*['"]?\*['"]?/gi;
        let match;

        while ((match = pattern.exec(content)) !== null) {
          const lineNumber = content.substring(0, match.index).split('\n').length;
          const line = content.split('\n')[lineNumber - 1];
          if (line && (line.trim().startsWith('//') || line.trim().startsWith('*'))) continue;

          violations.push({
            file: filePath, line: lineNumber, rule: 'R12_CORS_WILDCARD',
            message: 'CORS wildcard (*) detectado. Use lista explícita de domínios',
            severity: 'BLOCK', code: match[0],
          });
        }
        return violations;
      },
    },
  ],
};
