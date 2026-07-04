// ============================================
// REGRA 3: IMPORTAR .ENV DIRETAMENTE
// ============================================
// Nível: CRÍTICO | Tipo: BLOCK

/**
 * OBJETIVO: Bloquear importação direta de arquivos .env.
 *
 * POR QUE É PERIGOSO:
 * - Arquivo .env pode ser commitado acidentalmente
 * - Expõe todas as variáveis de ambiente de uma vez
 * - Ferramentas de scan detectam e exploram
 * - Bundle do app pode conter o arquivo completo
 *
 * O QUE VERIFICA:
 * 1. require('.env') ou require(".env")
 * 2. import '.env' ou import ".env"
 * 3. require('dotenv').config()
 * 4. dotenv.config({ path: ... })
 * 5. Qualquer referência a arquivos .env em imports
 * 6. require com path que termina em .env
 * 7. process.env com valores hardcoded (não de variável)
 */

module.exports = {
  name: 'No Direct .env Import',
  version: '1.0.0',
  severity: 'BLOCK',
  description: 'Bloqueia importação direta de arquivos .env',

  rules: [
    {
      id: 'R03_NO_ENV_IMPORT',
      name: 'Direct .env Import',
      severity: 'BLOCK',

      check: (filePath, content) => {
        const violations = [];

        // ============================================
        // PADRÕES DE IMPORTAÇÃO DE .ENV
        // ============================================
        const patterns = [
          // require direto
          { pattern: /require\s*\(\s*['"]\.env['"]\s*\)/g, name: 'require(".env")' },
          { pattern: /require\s*\(\s*['"]\.\/\.env['"]\s*\)/g, name: 'require("./.env")' },
          { pattern: /require\s*\(\s*['"]\.\.\/\.env['"]\s*\)/g, name: 'require("../.env")' },
          { pattern: /require\s*\(\s*['"]\.\.\/\.\.\/\.env['"]\s*\)/g, name: 'require("../../.env")' },

          // import direto
          { pattern: /import\s+['"]\.env['"]/g, name: 'import ".env"' },
          { pattern: /import\s+['"]\.\/\.env['"]/g, name: 'import "./.env"' },
          { pattern: /import\s+['"]\.\.\/\.env['"]/g, name: 'import "../.env"' },

          // dotenv
          { pattern: /require\s*\(\s*['"]dotenv['"]\s*\)\.config/g, name: 'dotenv.config()' },
          { pattern: /import\s+dotenv.*\.config/g, name: 'dotenv import + config' },
          { pattern: /dotenv\.config\s*\(/g, name: 'dotenv.config() call' },

          // Qualquer path que termina em .env
          { pattern: /require\s*\(\s*['"][^'"]*\.env['"]\s*\)/g, name: 'require com path .env' },

          // process.env com valores hardcoded (perigoso)
          { pattern: /process\.env\s*=\s*\{/g, name: 'process.env override' },
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

            violations.push({
              file: filePath,
              line: lineNumber,
              rule: 'R03_NO_ENV_IMPORT',
              message: `${name} detectado. Use process.env.EXPO_PUBLIC_* diretamente`,
              severity: 'BLOCK',
              code: match[0].substring(0, 60),
              remediation: 'No Expo/React Native, use process.env.EXPO_PUBLIC_* (expõe no build automaticamente)',
            });
          }
        }

        // ============================================
        // VERIFICAR SE .ENV ESTÁ NO .gitignore
        // ============================================
        // (Isto seria verificado em outro lugar, mas podemos sinalizar)

        return violations;
      },
    },
  ],
};
