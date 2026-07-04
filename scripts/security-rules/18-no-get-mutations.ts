// ============================================
// REGRA 18: GET PARA MUTAÇÕES
// ============================================
// Nível: ALTO | Tipo: WARNING

/**
 * OBJETIVO: Bloquear rotas GET que executam mutações.
 */

module.exports = {
  name: 'No GET Mutations',
  version: '1.0.0',
  severity: 'WARNING',
  description: 'Bloqueia GET para delete/update/create',

  rules: [
    {
      id: 'R18_NO_GET_MUTATIONS',
      name: 'GET Mutation Detection',
      severity: 'WARNING',

      check: (filePath, content) => {
        const violations = [];
        const pattern = /(?:app|router)\.get\s*\(\s*['"][^'"]*(?:delete|remove|update|create|destroy)/gi;
        let match;

        while ((match = pattern.exec(content)) !== null) {
          const lineNumber = content.substring(0, match.index).split('\n').length;
          violations.push({
            file: filePath, line: lineNumber, rule: 'R18_NO_GET_MUTATIONS',
            message: 'Rota GET para mutação detectada. Use POST/PUT/DELETE',
            severity: 'WARNING', code: match[0].substring(0, 60),
          });
        }
        return violations;
      },
    },
  ],
};
