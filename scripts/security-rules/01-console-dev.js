// ============================================
// REGRA 1: CONSOLE.LOG EM PRODUÇÃO
// ============================================
// Nível: CRÍTICO | Tipo: BLOCK
// Padrão: Netflix, Stripe, Nubank

/**
 * OBJETIVO: Impedir QUALQUER console.log() que não esteja
 * protegido por if (__DEV__) ou use logger.dev().
 *
 * POR QUE É PERIGOSO:
 * - console.log() em produção expõe dados sensíveis no console
 * - Navegadores móveis salvam logs que podem ser acessados
 * - Ferramentas como Sentry capturam logs e enviam para servidores
 * - Atacantes podem usar console.log para mapear estrutura interna
 *
 * O QUE VERIFICA:
 * 1. Procura TODOS os console.log() no arquivo
 * 2. Verifica se cada um está DENTRO de um bloco if (__DEV__)
 * 3. Verifica se usa logger.dev() ou wrapper seguro
 * 4. Detecta console.log em strings templates
 * 5. Detecta console.log em callbacks aninhados
 * 6. Verifica console.log dentro de funções arrow
 * 7. Detecta console.log condicional complexo
 */

module.exports = {
  name: 'Console.log Protection',
  version: '1.0.0',
  severity: 'BLOCK',
  description: 'Bloqueia console.log() fora de blocos __DEV__',

  rules: [
    {
      id: 'R01_CONSOLE_LOG',
      name: 'Console.log Detection',
      severity: 'BLOCK',

      // ============================================
      // MÉTODO 1: Análise linha por linha com rastreamento de escopo
      // ============================================
      check: (filePath, content) => {
        // Excluir arquivos de logger (são o wrapper)
        if (filePath.includes('logger.js') || filePath.includes('logger.ts')) {
          return [];
        }

        const violations = [];
        const lines = content.split('\n');

        // Estado do rastreamento de escopo
        let devBlockDepth = 0;      // Profundidade dentro de if (__DEV__)
        let isInDevBlock = false;    // Estamos dentro de um bloco __DEV__?
        let braceCount = 0;          // Contador de chaves
        let parenCount = 0;          // Contador de parênteses
        let bracketCount = 0;        // Contador de colchetes

        // Padrões que indicam proteção __DEV__
        const devPatterns = [
          /if\s*\(\s*__DEV__\s*\)/,
          /if\s*\(\s*__DEV__\s*&&/,
          /if\s*\(\s*!?\s*__DEV__\s*\)/,
          /if\s*\(\s*process\.env\.NODE_ENV\s*===?\s*['"]development['"]\s*\)/,
          /if\s*\(\s*process\.env\.NODE_ENV\s*!==?\s*['"]production['"]\s*\)/,
        ];

        // Padrões que indicam wrapper seguro
        const safePatterns = [
          /logger\.dev\(/,
          /logger\.info\(/,
          /devLog\(/,
          /debug\(/,
          /logDev\(/,
          /if\s*\(\s*__DEV__\s*\)\s*console\./,
        ];

        // Padrões que indicam retorno antecipado em dev
        const devReturnPatterns = [
          /if\s*\(\s*!?\s*__DEV__\s*\)\s*return/,
          /if\s*\(\s*!?\s*__DEV__\s*\)\s*return\s*;/,
        ];

        // Arquivos que são o próprio logger (excluir)
        if (filePath.includes('logger.js') || filePath.includes('logger.ts')) {
          return [];
        }

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          const trimmed = line.trim();

          // Detectar início de bloco __DEV__
          for (const pattern of devPatterns) {
            if (pattern.test(trimmed)) {
              isInDevBlock = true;
              devBlockDepth = 0;
              braceCount = 0;
            }
          }

          // Rastrear escopo com chaves
          if (isInDevBlock) {
            braceCount += (line.match(/{/g) || []).length;
            braceCount -= (line.match(/}/g) || []).length;

            // Se saiu do bloco
            if (braceCount <= 0 && i > 0) {
              isInDevBlock = false;
              devBlockDepth = 0;
            }
          }

          // Verificar se tem console.log
          if (trimmed.includes('console.log(')) {
            // Verificar se é wrapper seguro
            const isSafe = safePatterns.some(p => p.test(trimmed));

          // Verificar se está dentro de __DEV__
          const isInDev = isInDevBlock || devPatterns.some(p => {
            // Verificar nas 20 linhas anteriores
            const start = Math.max(0, i - 20);
            return lines.slice(start, i + 1).some(l => p.test(l));
          }) || devReturnPatterns.some(p => {
            // Verificar se há retorno antecipado com __DEV__
            const start = Math.max(0, i - 30);
            return lines.slice(start, i + 1).some(l => p.test(l));
          });

            if (!isSafe && !isInDev) {
              violations.push({
                file: filePath,
                line: i + 1,
                rule: 'R01_CONSOLE_LOG',
                message: `console.log() fora de bloco __DEV__. Use logger.dev() ou if (__DEV__) console.log()`,
                severity: 'BLOCK',
                code: trimmed.substring(0, 80),
                context: getContext(lines, i, 3),
              });
            }
          }

          // Detectar console.log em template literals
          if (trimmed.match(/console\.log\s*\(\s*`/)) {
            const isSafe = safePatterns.some(p => p.test(trimmed));
            if (!isSafe) {
              violations.push({
                file: filePath,
                line: i + 1,
                rule: 'R01_CONSOLE_LOG',
                message: `console.log com template literal. Dados podem vazar em produção`,
                severity: 'BLOCK',
                code: trimmed.substring(0, 80),
              });
            }
          }

          // Detectar console.log com spread de objetos
          if (trimmed.match(/console\.log\s*\(\s*\.\.\./)) {
            violations.push({
              file: filePath,
              line: i + 1,
              rule: 'R01_CONSOLE_LOG',
              message: `console.log com spread de objeto expõe todos os dados`,
              severity: 'BLOCK',
              code: trimmed.substring(0, 80),
            });
          }

          // Detectar console.log com JSON.stringify
          if (trimmed.match(/console\.log\s*\(\s*JSON\.stringify/)) {
            violations.push({
              file: filePath,
              line: i + 1,
              rule: 'R01_CONSOLE_LOG',
              message: `console.log com JSON.stringify expõe dados estruturados`,
              severity: 'BLOCK',
              code: trimmed.substring(0, 80),
            });
          }
        }

        return violations;
      },
    },
  ],
};

// Função auxiliar para obter contexto
function getContext(lines, currentIndex, radius) {
  const start = Math.max(0, currentIndex - radius);
  const end = Math.min(lines.length, currentIndex + radius + 1);
  return lines.slice(start, end).join('\n');
}
