// ============================================
// REGRA 4: DANGEROUSLYSETINNERHTML / INNERHTML
// ============================================
// Nível: CRÍTICO | Tipo: BLOCK
// Padrão: OWASP XSS Prevention

/**
 * OBJETIVO: Bloquear inserção de HTML não sanitizado.
 *
 * POR QUE É PERIGOSO:
 * - Permite injeção de scripts maliciosos (XSS)
 * - Atacante pode roubar tokens, sessões, dados
 * - Pode redirecionar usuários para phishing
 * - Pode executar keyloggers no navegador
 *
 * O QUE VERIFICA:
 * 1. dangerouslySetInnerHTML em React
 * 2. innerHTML em DOM manipulation
 * 3. outerHTML
 * 4. insertAdjacentHTML
 * 5. document.write
 * 6. eval com HTML
 * 7. new Function com HTML
 * 8. Template literals com HTML dinâmico
 * 9. React.createElement com HTML string
 */

module.exports = {
  name: 'XSS Prevention',
  version: '1.0.0',
  severity: 'BLOCK',
  description: 'Bloqueia inserção de HTML não sanitizado',

  rules: [
    {
      id: 'R04_XSS',
      name: 'XSS Injection Detection',
      severity: 'BLOCK',

      check: (filePath, content) => {
        const violations = [];

        // ============================================
        // PADRÕES PERIGOSOS DE INSERÇÃO DE HTML
        // ============================================
        const patterns = [
          // React
          { pattern: /dangerouslySetInnerHTML/g, name: 'dangerouslySetInnerHTML' },

          // DOM Manipulation
          { pattern: /\.innerHTML\s*=/g, name: 'innerHTML assignment' },
          { pattern: /\.outerHTML\s*=/g, name: 'outerHTML assignment' },
          { pattern: /\.insertAdjacentHTML\s*\(/g, name: 'insertAdjacentHTML' },

          // Document
          { pattern: /document\.write\s*\(/g, name: 'document.write()' },
          { pattern: /document\.writeln\s*\(/g, name: 'document.writeln()' },

          // Eval/Function com HTML
          { pattern: /eval\s*\(\s*['"`]<[^>]+>/g, name: 'eval com HTML' },
          { pattern: /new\s+Function\s*\(\s*['"`]<[^>]+>/g, name: 'new Function com HTML' },

          // DOMParser perigoso
          { pattern: /DOMParser.*\.parseFromString.*text\/html/g, name: 'DOMParser com text/html' },

          // React.createElement com dangerouslySetInnerHTML
          { pattern: /createElement\s*\([^)]*dangerouslySetInnerHTML/g, name: 'createElement com dangerouslySetInnerHTML' },
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

            // Verificar se há sanitização
            const hasSanitization = content.includes('sanitize') ||
              content.includes('DOMPurify') ||
              content.includes('xss') ||
              content.includes('escape');

            if (!hasSanitization) {
              violations.push({
                file: filePath,
                line: lineNumber,
                rule: 'R04_XSS',
                message: `${name} detectado SEM sanitização. Risco de XSS`,
                severity: 'BLOCK',
                code: match[0].substring(0, 60),
                remediation: 'Use textContent, React components, ou DOMPurify para sanitizar',
              });
            }
          }
        }

        // ============================================
        // VERIFICAR TEMPLATE LITERALS COM HTML
        // ============================================
        const templateHtmlPattern = /`[^`]*<[^`]+>`/g;
        let templateMatch;
        while ((templateMatch = templateHtmlPattern.exec(content)) !== null) {
          const lineNumber = content.substring(0, templateMatch.index).split('\n').length;
          const line = content.split('\n')[lineNumber - 1];
          if (line && !line.trim().startsWith('//') && !line.trim().startsWith('*')) {
            const contextBefore = content.substring(Math.max(0, templateMatch.index - 100), templateMatch.index);
            if (contextBefore.includes('dangerouslySetInnerHTML')) {
              violations.push({
                file: filePath,
                line: lineNumber,
                rule: 'R04_XSS',
                message: 'dangerouslySetInnerHTML com template literal HTML',
                severity: 'BLOCK',
                code: templateMatch[0].substring(0, 60),
              });
            }
          }
        }

        return violations;
      },
    },
  ],
};
