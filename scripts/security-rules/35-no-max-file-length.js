// ============================================
// REGRA 35: ARQUIVO > 200 LINHAS
// ============================================
// Nível: MÉDIO | Tipo: WARNING

/**
 * OBJETIVO: Bloquear arquivos com mais de 200 linhas.
 */

module.exports = {
  name: 'Max File Length',
  version: '1.0.0',
  severity: 'WARNING',
  description: 'Limita arquivos a 200 linhas',

  rules: [
    {
      id: 'R35_MAX_LENGTH',
      name: 'File Length Check',
      severity: 'WARNING',

      check: (filePath, content) => {
        const violations = [];
        const lines = content.split('\n').length;

        if (lines > 200) {
          violations.push({
            file: filePath, line: 0, rule: 'R35_MAX_LENGTH',
            message: `Arquivo tem ${lines} linhas (máximo: 200). Divida em arquivos menores`,
            severity: 'WARNING', code: `${lines} linhas`,
          });
        }
        return violations;
      },
    },
  ],
};
