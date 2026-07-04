// ============================================
// REGRA 44: URLS HARDCODED
// ============================================
// Nível: MÉDIO | Tipo: WARNING

/**
 * OBJETIVO: Bloquear URLs hardcoded que deveriam ser variáveis de ambiente.
 */

module.exports = {
  name: 'No Hardcoded URLs',
  version: '1.0.0',
  severity: 'WARNING',
  description: 'Bloqueia URLs hardcoded em produção',

  rules: [
    {
      id: 'R44_NO_HARDcoded_URLS',
      name: 'Hardcoded URL Detection',
      severity: 'WARNING',

      check: (filePath, content) => {
        const violations = [];
        const pattern = /['"]https?:\/\/[^'"]+\.(com|org|net|io|dev|app)['"]/gi;
        let match;

        while ((match = pattern.exec(content)) !== null) {
          const lineNumber = content.substring(0, match.index).split('\n').length;
          const line = content.split('\n')[lineNumber - 1];
          if (line && (line.trim().startsWith('//') || line.trim().startsWith('*'))) continue;

          const url = match[0];
          if (url.includes('localhost') || url.includes('127.0.0.1') || url.includes('process.env')) continue;

          // Verificar se é URL de API
          const isAPI = /api|supabase|backend|server/i.test(url);
          if (isAPI) {
            violations.push({
              file: filePath, line: lineNumber, rule: 'R44_NO_HARDcoded_URLS',
              message: 'URL de API hardcoded. Use variável de ambiente',
              severity: 'WARNING', code: url.substring(0, 60),
            });
          }
        }
        return violations;
      },
    },
  ],
};
