// ============================================
// REGRA 23: QUERIES SEM LIMITE
// ============================================
// Nível: ALTO | Tipo: WARNING

/**
 * OBJETIVO: Bloquear queries sem limite de registros.
 */

module.exports = {
  name: 'Query Limit Required',
  version: '1.0.0',
  severity: 'WARNING',
  description: 'Exige .limit() em queries Supabase',

  rules: [
    {
      id: 'R23_NO_LIMIT',
      name: 'Query Limit Detection',
      severity: 'WARNING',

      check: (filePath, content) => {
        const violations = [];
        const pattern = /\.select\s*\([^)]*\)(?:(?!\.limit|\.range|\.single|\.maybeSingle))/g;
        let match;

        while ((match = pattern.exec(content)) !== null) {
          const lineNumber = content.substring(0, match.index).split('\n').length;
          const context = content.substring(match.index, match.index + 200);
          const hasLimit = /\.limit\s*\(/.test(context) || /\.range\s*\(/.test(context) || /\.single\s*\(/.test(context);

          if (!hasLimit && !context.includes('.eq(') && !context.includes('.single()')) {
            const line = content.split('\n')[lineNumber - 1];
            if (line && (line.trim().startsWith('//') || line.trim().startsWith('*'))) continue;

            violations.push({
              file: filePath, line: lineNumber, rule: 'R23_NO_LIMIT',
              message: 'Query sem LIMIT pode retornar todos os registros',
              severity: 'WARNING', code: match[0].substring(0, 60),
            });
          }
        }
        return violations;
      },
    },
  ],
};
