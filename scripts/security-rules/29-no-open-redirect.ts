// ============================================
// REGRA 29: OPEN REDIRECT
// ============================================
// Nível: ALTO | Tipo: BLOCK

/**
 * OBJETIVO: Bloquear redirecionamentos dinâmicos sem validação.
 */

module.exports = {
  name: 'Open Redirect Prevention',
  version: '1.0.0',
  severity: 'BLOCK',
  description: 'Bloqueia redirect sem whitelist',

  rules: [
    {
      id: 'R29_OPEN_REDIRECT',
      name: 'Open Redirect Detection',
      severity: 'BLOCK',

      check: (filePath, content) => {
        const violations = [];
        const patterns = [
          /res\.redirect\s*\(\s*(?:req\.(?:query|params|body)\.)/g,
          /window\.location\s*=\s*(?:req\.|params\.|query\.)/g,
          /window\.location\.href\s*=\s*(?:req\.|params\.|query\.)/g,
        ];

        for (const pattern of patterns) {
          let match;
          while ((match = pattern.exec(content)) !== null) {
            const lineNumber = content.substring(0, match.index).split('\n').length;
            const line = content.split('\n')[lineNumber - 1];
            if (line && (line.trim().startsWith('//') || line.trim().startsWith('*'))) continue;

            violations.push({
              file: filePath, line: lineNumber, rule: 'R29_OPEN_REDIRECT',
              message: 'Redirecionamento dinâmico sem validação - Open Redirect',
              severity: 'BLOCK', code: match[0].substring(0, 60),
            });
          }
        }
        return violations;
      },
    },
  ],
};
