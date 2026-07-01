// ============================================
// REGRA 17: IDOR (IDs SEQUENCIAIS)
// ============================================
// Nível: ALTO | Tipo: WARNING

/**
 * OBJETIVO: Detectar IDs sequenciais expostos em rotas públicas.
 */

module.exports = {
  name: 'IDOR Prevention',
  version: '1.0.0',
  severity: 'WARNING',
  description: 'Detecta IDs sequenciais em rotas públicas',

  rules: [
    {
      id: 'R17_IDOR',
      name: 'IDOR Detection',
      severity: 'WARNING',

      check: (filePath, content) => {
        const violations = [];
        const pattern = /\/api\/[^'"]*\/\d{4,}/g;
        let match;

        while ((match = pattern.exec(content)) !== null) {
          const lineNumber = content.substring(0, match.index).split('\n').length;
          const line = content.split('\n')[lineNumber - 1];
          if (line && (line.trim().startsWith('//') || line.trim().startsWith('*'))) continue;

          violations.push({
            file: filePath, line: lineNumber, rule: 'R17_IDOR',
            message: 'IDs sequenciais expostos em rota pública (IDOR). Use UUIDs',
            severity: 'WARNING', code: match[0].substring(0, 60),
          });
        }
        return violations;
      },
    },
  ],
};
