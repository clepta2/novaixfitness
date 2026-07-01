// ============================================
// REGRA 14: PATH TRAVERSAL
// ============================================
// Nível: CRÍTICO | Tipo: BLOCK

/**
 * OBJETIVO: Bloquear concatenação em paths de arquivo.
 *
 * POR QUE É PERIGOSO:
 * - Atacante pode ler ../../etc/passwd
 * - Acessar arquivos confidenciais do servidor
 */

module.exports = {
  name: 'Path Traversal Prevention',
  version: '1.0.0',
  severity: 'BLOCK',
  description: 'Bloqueia concatenação em paths de arquivo',

  rules: [
    {
      id: 'R14_PATH_TRAVERSAL',
      name: 'Path Traversal Detection',
      severity: 'BLOCK',

      check: (filePath, content) => {
        const violations = [];
        const patterns = [
          /fs\.(readFile|writeFile|appendFile|unlink|existsSync|readFileSync)\s*\(\s*[^)]*\+/g,
          /path\.(join|resolve)\s*\(\s*[^)]*\+\s*[^)]*req\./g,
        ];

        for (const pattern of patterns) {
          let match;
          while ((match = pattern.exec(content)) !== null) {
            const lineNumber = content.substring(0, match.index).split('\n').length;
            const line = content.split('\n')[lineNumber - 1];
            if (line && (line.trim().startsWith('//') || line.trim().startsWith('*'))) continue;

            violations.push({
              file: filePath, line: lineNumber, rule: 'R14_PATH_TRAVERSAL',
              message: 'Concatenação em path de arquivo - Path Traversal vulnerável',
              severity: 'BLOCK', code: match[0].substring(0, 60),
            });
          }
        }
        return violations;
      },
    },
  ],
};
