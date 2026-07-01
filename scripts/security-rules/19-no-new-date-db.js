// ============================================
// REGRA 19: NEW DATE() PARA BANCO
// ============================================
// Nível: MÉDIO | Tipo: WARNING

/**
 * OBJETIVO: Bloquear new Date() para salvar no banco.
 */

module.exports = {
  name: 'No new Date for DB',
  version: '1.0.0',
  severity: 'WARNING',
  description: 'Bloqueia new Date() para operações de banco',

  rules: [
    {
      id: 'R19_NO_NEW_DATE',
      name: 'new Date Detection',
      severity: 'WARNING',

      check: (filePath, content) => {
        const violations = [];
        const pattern = /new\s+Date\s*\(\s*\)/g;
        let match;

        while ((match = pattern.exec(content)) !== null) {
          const lineNumber = content.substring(0, match.index).split('\n').length;
          const context = content.substring(Math.max(0, match.index - 200), match.index + match[0].length + 200);
          const isDB = /insert|update|save|create|supabase/i.test(context);
          const line = content.split('\n')[lineNumber - 1];
          if (line && (line.trim().startsWith('//') || line.trim().startsWith('*'))) continue;

          if (isDB) {
            violations.push({
              file: filePath, line: lineNumber, rule: 'R19_NO_NEW_DATE',
              message: 'new Date() para banco gera fuso horário errado. Use .toISOString()',
              severity: 'WARNING', code: match[0],
            });
          }
        }
        return violations;
      },
    },
  ],
};
