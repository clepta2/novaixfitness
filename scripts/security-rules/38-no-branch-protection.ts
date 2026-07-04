// ============================================
// REGRA 38: BRANCH PROTECTION
// ============================================
// Nível: MÉDIO | Tipo: WARNING

/**
 * OBJETIVO: Verificar se há proteção de branch.
 */

module.exports = {
  name: 'Branch Protection Check',
  version: '1.0.0',
  severity: 'WARNING',
  description: 'Verifica proteção de branch principal',

  rules: [
    {
      id: 'R38_BRANCH_PROTECTION',
      name: 'Branch Protection Check',
      severity: 'WARNING',

      check: (filePath, content) => {
        if (!filePath.includes('pre-push') && !filePath.includes('.gitlab-ci') && !filePath.includes('.github')) return [];

        const violations = [];
        if (content.includes('push') && content.includes('main') && !content.includes('feature')) {
          violations.push({
            file: filePath, line: 0, rule: 'R38_BRANCH_PROTECTION',
            message: 'Verifique se há proteção contra push direto na branch main',
            severity: 'WARNING', code: 'Branch protection check needed',
          });
        }
        return violations;
      },
    },
  ],
};
