// ============================================
// REGRA 20: FUNÇÕES SÍNCRONAS
// ============================================
// Nível: MÉDIO | Tipo: WARNING

/**
 * OBJETIVO: Bloquear funções síncronas que bloqueiam o servidor.
 */

module.exports = {
  name: 'No Sync Functions',
  version: '1.0.0',
  severity: 'WARNING',
  description: 'Bloqueia funções síncronas no servidor',

  rules: [
    {
      id: 'R20_NO_SYNC',
      name: 'Sync Functions Detection',
      severity: 'WARNING',

      check: (filePath, content) => {
        if (!filePath.includes('backend') && !filePath.includes('server') && !filePath.includes('api')) return [];

        const violations = [];
        const patterns = [
          /fs\.\w+Sync\s*\(/g,
          /crypto\.\w+Sync\s*\(/g,
          /child_process\.execSync\s*\(/g,
          /child_process\.spawnSync\s*\(/g,
        ];

        for (const pattern of patterns) {
          let match;
          while ((match = pattern.exec(content)) !== null) {
            const lineNumber = content.substring(0, match.index).split('\n').length;
            const line = content.split('\n')[lineNumber - 1];
            if (line && (line.trim().startsWith('//') || line.trim().startsWith('*'))) continue;

            violations.push({
              file: filePath, line: lineNumber, rule: 'R20_NO_SYNC',
              message: 'Função síncrona bloqueia o servidor. Use versão async',
              severity: 'WARNING', code: match[0].substring(0, 40),
            });
          }
        }
        return violations;
      },
    },
  ],
};
