// ============================================
// REGRA 31: MASS ASSIGNMENT
// ============================================
// Nível: ALTO | Tipo: WARNING

/**
 * OBJETIVO: Bloquear criação direta com body completo.
 */

module.exports = {
  name: 'Mass Assignment Prevention',
  version: '1.0.0',
  severity: 'WARNING',
  description: 'Bloqueia create com body completo',

  rules: [
    {
      id: 'R31_MASS_ASSIGNMENT',
      name: 'Mass Assignment Detection',
      severity: 'WARNING',

      check: (filePath, content) => {
        const violations = [];
        const patterns = [
          /\.create\s*\(\s*(?:req\.body|body|data)\s*\)/g,
          /\.insert\s*\(\s*(?:req\.body|body|data)\s*\)/g,
          /\.createMany\s*\(\s*(?:req\.body|body|data)\s*\)/g,
        ];

        for (const pattern of patterns) {
          let match;
          while ((match = pattern.exec(content)) !== null) {
            const lineNumber = content.substring(0, match.index).split('\n').length;
            const line = content.split('\n')[lineNumber - 1];
            if (line && (line.trim().startsWith('//') || line.trim().startsWith('*'))) continue;

            violations.push({
              file: filePath, line: lineNumber, rule: 'R31_MASS_ASSIGNMENT',
              message: 'Create com body completo - Mass Assignment vulnerável',
              severity: 'WARNING', code: match[0].substring(0, 60),
            });
          }
        }
        return violations;
      },
    },
  ],
};
