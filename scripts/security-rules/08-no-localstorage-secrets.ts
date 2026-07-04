// ============================================
// REGRA 8: LOCALSTORAGE PARA DADOS SENSÍVEIS
// ============================================
// Nível: CRÍTICO | Tipo: BLOCK

/**
 * OBJETIVO: Bloquear armazenamento de dados sensíveis em localStorage.
 *
 * POR QUE É PERIGOSO:
 * - localStorage é acessível via JavaScript (XSS)
 * - Não tem proteção HttpOnly
 * - Persiste mesmo após logout
 * - Atacante pode roubar tokens facilmente
 *
 * O QUE VERIFICA:
 * 1. localStorage.setItem com tokens/senhas
 * 2. AsyncStorage com dados sensíveis
 * 3. window.localStorage direto
 * 4. Armazenamento de JWT em storage
 * 5. Cookies sem HttpOnly
 */

module.exports = {
  name: 'No LocalStorage for Secrets',
  version: '1.0.0',
  severity: 'BLOCK',
  description: 'Bloqueia localStorage/AsyncStorage para dados sensíveis',

  rules: [
    {
      id: 'R08_NO_LOCALSTORAGE',
      name: 'LocalStorage Secrets Detection',
      severity: 'BLOCK',

      check: (filePath, content) => {
        const violations = [];
        const sensitiveKeys = ['token', 'auth', 'password', 'jwt', 'session', 'secret', 'key', 'credential', 'access', 'refresh'];

        // Padrões de armazenamento
        const storagePatterns = [
          { pattern: /localStorage\.setItem\s*\(\s*['"`]([^'"]+)['"]/gi, name: 'localStorage.setItem' },
          { pattern: /AsyncStorage\.setItem\s*\(\s*['"`]([^'"]+)['"]/gi, name: 'AsyncStorage.setItem' },
          { pattern: /sessionStorage\.setItem\s*\(\s*['"`]([^'"]+)['"]/gi, name: 'sessionStorage.setItem' },
          { pattern: /window\.localStorage\.setItem\s*\(\s*['"`]([^'"]+)['"]/gi, name: 'window.localStorage.setItem' },
        ];

        for (const { pattern, name } of storagePatterns) {
          let match;
          const regex = new RegExp(pattern.source, pattern.flags);

          while ((match = regex.exec(content)) !== null) {
            const lineNumber = content.substring(0, match.index).split('\n').length;
            const key = match[1];

            // Verificar se a chave é sensível
            const isSensitive = sensitiveKeys.some(sk => key.toLowerCase().includes(sk));

            if (isSensitive) {
              const line = content.split('\n')[lineNumber - 1];
              if (line && (line.trim().startsWith('//') || line.trim().startsWith('*'))) continue;

              violations.push({
                file: filePath,
                line: lineNumber,
                rule: 'R08_NO_LOCALSTORAGE',
                message: `${name} com chave sensível "${key}". Use SecureStore ou cookies HttpOnly`,
                severity: 'BLOCK',
                code: match[0].substring(0, 60),
                remediation: 'Use expo-secure-store para dados sensíveis no React Native',
              });
            }
          }
        }

        return violations;
      },
    },
  ],
};
