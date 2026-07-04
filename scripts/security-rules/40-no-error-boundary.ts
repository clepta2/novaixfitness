// ============================================
// REGRA 40: ERROR BOUNDARY
// ============================================
// Nível: MÉDIO | Tipo: WARNING

/**
 * OBJETIVO: Verificar se telas têm ErrorBoundary.
 */

module.exports = {
  name: 'ErrorBoundary Check',
  version: '1.0.0',
  severity: 'WARNING',
  description: 'Verifica ErrorBoundary em telas',

  rules: [
    {
      id: 'R40_ERROR_BOUNDARY',
      name: 'ErrorBoundary Check',
      severity: 'WARNING',

      check: (filePath, content) => {
        if (!filePath.includes('app/') || filePath.includes('_layout') || filePath.includes('index.js')) return [];

        const violations = [];
        const hasErrorBoundary = content.includes('ErrorBoundary');
        const hasExportDefault = content.includes('export default');

        if (hasExportDefault && !hasErrorBoundary) {
          violations.push({
            file: filePath, line: 0, rule: 'R40_ERROR_BOUNDARY',
            message: 'Tela sem ErrorBoundary. Adicione ErrorBoundary para tratamento de erros',
            severity: 'WARNING', code: 'Sem ErrorBoundary',
          });
        }
        return violations;
      },
    },
  ],
};
