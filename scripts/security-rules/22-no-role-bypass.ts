// ============================================
// REGRA 22: BYPASS DE ROLE VIA PAYLOAD
// ============================================
// Nível: CRÍTICO | Tipo: BLOCK

/**
 * OBJETIVO: Bloquear spread de body completo em updates.
 */

module.exports = {
  name: 'Role Bypass Prevention',
  version: '1.0.0',
  severity: 'BLOCK',
  description: 'Bloqueia spread de body em updates',

  rules: [
    {
      id: 'R22_ROLE_BYPASS',
      name: 'Role Bypass Detection',
      severity: 'BLOCK',

      check: (filePath, content) => {
        const violations = [];
        const patterns = [
          /\.\.\.(?:req\.body|body|data)\s*\)/g,
          /Object\.assign\s*\(\s*\{\s*\},\s*(?:req\.body|body|data)/g,
        ];

        for (const pattern of patterns) {
          let match;
          while ((match = pattern.exec(content)) !== null) {
            const lineNumber = content.substring(0, match.index).split('\n').length;
            const line = content.split('\n')[lineNumber - 1];
            if (line && (line.trim().startsWith('//') || line.trim().startsWith('*'))) continue;

            const context = content.substring(Math.max(0, match.index - 200), match.index + match[0].length + 200);
            const isUpdate = /update|edit|patch|modify/i.test(context);

            if (isUpdate) {
              violations.push({
                file: filePath, line: lineNumber, rule: 'R22_ROLE_BYPASS',
                message: 'Spread de body em update permite bypass de role. Use whitelist',
                severity: 'BLOCK', code: match[0].substring(0, 60),
              });
            }
          }
        }
        return violations;
      },
    },
  ],
};
