// ============================================
// REGRA 15: MATH.RANDOM() PARA SEGURANÇA
// ============================================
// Nível: ALTO | Tipo: BLOCK

/**
 * OBJETIVO: Bloquear Math.random() para geração de tokens/IDs.
 */

module.exports = {
  name: 'No Math.random for Security',
  version: '1.0.0',
  severity: 'BLOCK',
  description: 'Bloqueia Math.random() para tokens/IDs',

  rules: [
    {
      id: 'R15_NO_MATH_RANDOM',
      name: 'Math.random Security Detection',
      severity: 'BLOCK',

      check: (filePath, content) => {
        const violations = [];
        const pattern = /Math\.random\s*\(\s*\)/g;
        let match;

        while ((match = pattern.exec(content)) !== null) {
          const lineNumber = content.substring(0, match.index).split('\n').length;
          const context = content.substring(Math.max(0, match.index - 100), match.index + match[0].length + 100);

          const isSecurity = /token|id|session|password|hash|key|secret|otp|pin|code/i.test(context);
          const line = content.split('\n')[lineNumber - 1];
          if (line && (line.trim().startsWith('//') || line.trim().startsWith('*'))) continue;

          if (isSecurity) {
            violations.push({
              file: filePath, line: lineNumber, rule: 'R15_NO_MATH_RANDOM',
              message: 'Math.random() para finalidade de segurança. Use crypto.randomBytes()',
              severity: 'BLOCK', code: match[0],
            });
          }
        }
        return violations;
      },
    },
  ],
};
