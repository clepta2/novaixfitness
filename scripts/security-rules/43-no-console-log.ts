// ============================================
// REGRA 43: CONSOLE.LOG EM PRODUÇÃO
// ============================================
// Nível: CRÍTICO | Tipo: BLOCK

/**
 * OBJETIVO: Bloquear console.log fora de __DEV__.
 */

module.exports = {
  name: 'Console.log Production',
  version: '1.0.0',
  severity: 'BLOCK',
  description: 'Bloqueia console.log fora de __DEV__',

  rules: [
    {
      id: 'R43_NO_CONSOLE_LOG',
      name: 'Console.log Detection',
      severity: 'BLOCK',

      check: (filePath, content) => {
        const violations = [];
        const lines = content.split('\n');
        let inDev = false, depth = 0;

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          const trimmed = line.trim();

          if (trimmed.includes('if (__DEV__)')) { inDev = true; depth = 0; }
          if (inDev) {
            depth += (line.match(/{/g) || []).length - (line.match(/}/g) || []).length;
            if (depth <= 0) inDev = false;
          }

          if (trimmed.includes('console.log(') && !inDev && !trimmed.includes('logger.dev(')) {
            violations.push({
              file: filePath, line: i + 1, rule: 'R43_NO_CONSOLE_LOG',
              message: 'console.log() fora de __DEV__. Use logger.dev()',
              severity: 'BLOCK', code: trimmed.substring(0, 60),
            });
          }
        }
        return violations;
      },
    },
  ],
};
