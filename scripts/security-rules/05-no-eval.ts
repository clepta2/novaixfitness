// ============================================
// REGRA 5: EVAL() E NEW FUNCTION()
// ============================================
// Nível: CRÍTICO | Tipo: BLOCK
// Padrão: OWASP A03:2021 - Injection

/**
 * OBJETIVO: Bloquear execução dinâmica de código.
 *
 * POR QUE É PERIGOSO:
 * - Permite injeção arbitrária de código
 * - Atacante pode executar qualquer comando
 * - Bypass total de todas as outras proteções
 * - Pode acessar filesystem, rede, dados sensíveis
 *
 * O QUE VERIFICA:
 * 1. eval()
 * 2. new Function()
 * 3. setTimeout com string
 * 4. setInterval com string
 * 5. Function() constructor
 * 6. import() dinâmico com input do usuário
 * 7. require com path dinâmico
 * 8. Child Process exec/spawn com shell
 */

module.exports = {
  name: 'No Eval / Dynamic Code Execution',
  version: '1.0.0',
  severity: 'BLOCK',
  description: 'Bloqueia execução dinâmica de código',

  rules: [
    {
      id: 'R05_NO_EVAL',
      name: 'Dynamic Code Execution',
      severity: 'BLOCK',

      check: (filePath, content) => {
        const violations = [];

        // ============================================
        // PADRÕES DE EXECUÇÃO DINÂMICA
        // ============================================
        const patterns = [
          // Eval clássico
          { pattern: /\beval\s*\(/g, name: 'eval()' },

          // Function constructor
          { pattern: /new\s+Function\s*\(/g, name: 'new Function()' },
          { pattern: /Function\s*\(\s*['"]/g, name: 'Function() constructor' },

          // setTimeout/setInterval com string
          { pattern: /setTimeout\s*\(\s*['"`]/g, name: 'setTimeout com string' },
          { pattern: /setInterval\s*\(\s*['"`]/g, name: 'setInterval com string' },

          // import() dinâmico
          { pattern: /import\s*\(\s*[^)]*\+/g, name: 'import() dinâmico com concatenação' },

          // require dinâmico
          { pattern: /require\s*\(\s*[^)]*\+/g, name: 'require() dinâmico' },
          { pattern: /require\s*\(\s*[^a-z]/g, name: 'require() com variável' },

          // Child Process (Node.js)
          { pattern: /child_process.*exec\s*\(/g, name: 'child_process.exec()' },
          { pattern: /child_process.*spawn\s*\(/g, name: 'child_process.spawn()' },
          { pattern: /\bexec\s*\(\s*[^)]*\+/g, name: 'exec() com concatenação' },
          { pattern: /\bspawn\s*\(\s*['"]sh/g, name: 'spawn com shell' },
          { pattern: /\bspawn\s*\(\s*['"]cmd/g, name: 'spawn com cmd' },

          // vm module (Node.js)
          { pattern: /vm\.(run|createScript|compileFunction)/g, name: 'vm module execution' },

          // IndexedDB/eval perigoso
          { pattern: /indexedDB.*eval/g, name: 'IndexedDB com eval' },
        ];

        for (const { pattern, name } of patterns) {
          let match;
          const regex = new RegExp(pattern.source, pattern.flags);

          while ((match = regex.exec(content)) !== null) {
            const lineNumber = content.substring(0, match.index).split('\n').length;
            const line = content.split('\n')[lineNumber - 1];

            // Ignorar comentários
            if (line && (line.trim().startsWith('//') || line.trim().startsWith('*'))) {
              continue;
            }

            // Ignorar se for em teste
            if (filePath.includes('.test.') || filePath.includes('.spec.')) {
              continue;
            }

            // Verificar se há input do usuário envolvido
            const context = content.substring(Math.max(0, match.index - 200), match.index + match[0].length + 200);
            const hasUserInput = context.includes('req.') ||
              context.includes('body.') ||
              context.includes('query.') ||
              context.includes('params.') ||
              context.includes('input') ||
              context.includes('userInput');

            violations.push({
              file: filePath,
              line: lineNumber,
              rule: 'R05_NO_EVAL',
              message: hasUserInput
                ? `${name} com input do usuário - VULNERABILIDADE CRÍTICA`
                : `${name} detectado - proibido por segurança`,
              severity: 'BLOCK',
              code: match[0].substring(0, 60),
              remediation: 'Use JSON.parse(), switch/if, ou módulos seguros',
            });
          }
        }

        return violations;
      },
    },
  ],
};
