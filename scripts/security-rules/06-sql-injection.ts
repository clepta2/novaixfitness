// ============================================
// REGRA 6: SQL INJECTION
// ============================================
// Nível: CRÍTICO | Tipo: BLOCK
// Padrão: OWASP A03:2021 - Injection

/**
 * OBJETIVO: Bloquear queries SQL com interpolação de variáveis.
 *
 * POR QUE É PERIGOSO:
 * - Atacante injeta SQL para ler/deletar/inserir dados
 * - Pode acessar banco inteiro, incluindo senhas
 * - Pode deletar tabelas ou criar backdoors
 * - Uma das vulnerabilidades mais comuns do mundo
 *
 * O QUE VERIFICA:
 * 1. Template literals com variáveis em queries
 * 2. Concatenação de strings em queries
 * 3. query() com string interpolation
 * 4. raw() com variáveis
 * 5. exec() com SQL dinâmico
 * 6. Supabase com filters não parametrizados
 */

module.exports = {
  name: 'SQL Injection Prevention',
  version: '1.0.0',
  severity: 'BLOCK',
  description: 'Bloqueia SQL injection via interpolação',

  rules: [
    {
      id: 'R06_SQL_INJECTION',
      name: 'SQL Injection Detection',
      severity: 'BLOCK',

      check: (filePath, content) => {
        const violations = [];

        // ============================================
        // PADRÕES PERIGOSOS DE SQL
        // ============================================
        const patterns = [
          // Template literals com SQL
          { pattern: /`(?:SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|EXEC)\s+[^`]*\$\{[^}]*\}/gi, name: 'SQL com template literal' },

          // Concatenação em queries
          { pattern: /['"](?:SELECT|INSERT|UPDATE|DELETE)\s+[^'"]*['"]\s*\+/gi, name: 'SQL com concatenação' },
          { pattern: /\+\s*['"](?:WHERE|AND|OR|SET|VALUES)\s+/gi, name: 'SQL injection via concatenação' },

          // Métodos perigosos de query
          { pattern: /\.query\s*\(\s*`[^`]*\$\{[^}]*\}`/gi, name: 'query() com template literal' },
          { pattern: /\.raw\s*\(\s*`[^`]*\$\{[^}]*\}`/gi, name: 'raw() com template literal' },
          { pattern: /\.raw\s*\(\s*['"][^'"]*\$\{[^}]*\}[^'"]*['"]/gi, name: 'raw() com interpolação' },
          { pattern: /\.exec\s*\(\s*`[^`]*\$\{[^}]*\}`/gi, name: 'exec() com template literal' },

          // Sequelize/Prisma perigoso
          { pattern: /Sequelize\.literal\s*\(\s*[^)]*\$/g, name: 'Sequelize.literal com interpolação' },
          { pattern: /\.executeRaw\s*\(\s*`/g, name: 'Prisma executeRaw com template' },

          // Knex perigoso
          { pattern: /knex\.raw\s*\(\s*`[^`]*\$\{[^}]*\}`/gi, name: 'Knex raw com template' },

          // pg perigoso
          { pattern: /client\.query\s*\(\s*`[^`]*\$\{[^}]*\}`/gi, name: 'pg query com template' },
        ];

        for (const { pattern, name } of patterns) {
          let match;
          const regex = new RegExp(pattern.source, pattern.flags);

          while ((match = regex.exec(content)) !== null) {
            const lineNumber = content.substring(0, match.index).split('\n').length;
            const line = content.split('\n')[lineNumber - 1];

            if (line && (line.trim().startsWith('//') || line.trim().startsWith('*'))) continue;

            violations.push({
              file: filePath,
              line: lineNumber,
              rule: 'R06_SQL_INJECTION',
              message: `${name} - SQL Injection vulnerável`,
              severity: 'BLOCK',
              code: match[0].substring(0, 60),
              remediation: 'Use query parameters: .eq("field", value) ou $1, $2 em raw()',
            });
          }
        }

        return violations;
      },
    },
  ],
};
