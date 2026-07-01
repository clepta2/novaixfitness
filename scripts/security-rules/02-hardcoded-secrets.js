// ============================================
// REGRA 2: SECRETS HARDCODED
// ============================================
// Nível: CRÍTICO | Tipo: BLOCK
// Padrão: OWASP Top 10 - A07:2021

/**
 * OBJETIVO: Bloquear QUALQUER segredo hardcoded no código.
 *
 * POR QUE É PERIGOSO:
 * - Chaves hardcoded podem ser extraídas do bundle do app
 * - Git history preserva segredos mesmo após delete
 * - Atacantes usam ferramentas como TruffleHog, GitLeaks
 * - Vazamento = acesso total ao sistema
 *
 * O QUE VERIFICA:
 * 1. Chaves de API (AWS, GCP, Azure, Stripe, Twilio, etc.)
 * 2. Senhas de banco de dados
 * 3. Tokens de acesso (JWT, OAuth, session)
 * 4. Chaves de criptografia
 * 5. Credenciais de serviços terceiros
 * 6. Strings que parecem hex/base64 longas (possíveis chaves)
 * 7. Connection strings com senhas
 * 8. Chaves de webhook
 */

module.exports = {
  name: 'Hardcoded Secrets Detection',
  version: '1.0.0',
  severity: 'BLOCK',
  description: 'Bloqueia segredos, chaves e senhas hardcoded',

  rules: [
    {
      id: 'R02_SECRETS',
      name: 'Hardcoded Secrets',
      severity: 'BLOCK',

      check: (filePath, content) => {
        const violations = [];

        // ============================================
        // PADRÕES DE CHAVES DE API
        // ============================================
        const apiKeyPatterns = [
          // AWS
          { pattern: /(?:AKIA|ABIA|ACCA|ASIA)[A-Z0-9]{16}/g, name: 'AWS Access Key' },
          { pattern: /(?:aws_secret_access_key|AWS_SECRET)\s*[:=]\s*['"][^'"]+['"]/gi, name: 'AWS Secret Key' },

          // Google Cloud
          { pattern: /(?:GOOGLE_API_KEY|AIza[A-Za-z0-9_-]{35})/g, name: 'Google API Key' },
          { pattern: /(?:GOOGLE_SECRET|client_secret)\s*[:=]\s*['"][^'"]+['"]/gi, name: 'Google Secret' },

          // Azure
          { pattern: /(?:AZURE_CLIENT_SECRET|AccountKey=)[A-Za-z0-9+/=]{40,}/g, name: 'Azure Secret' },

          // Stripe
          { pattern: /sk_live_[a-zA-Z0-9]{24,}/g, name: 'Stripe Live Key' },
          { pattern: /sk_test_[a-zA-Z0-9]{24,}/g, name: 'Stripe Test Key' },
          { pattern: /pk_live_[a-zA-Z0-9]{24,}/g, name: 'Stripe Publishable Key' },

          // Twilio
          { pattern: /(?:TWILIO_AUTH_TOKEN|twilio_auth_token)\s*[:=]\s*['"][a-f0-9]{32}['"]/gi, name: 'Twilio Auth Token' },

          // SendGrid
          { pattern: /SG\.[a-zA-Z0-9_-]{22}\.[a-zA-Z0-9_-]{43}/g, name: 'SendGrid API Key' },

          // GitHub
          { pattern: /ghp_[a-zA-Z0-9]{36}/g, name: 'GitHub PAT' },
          { pattern: /gho_[a-zA-Z0-9]{36}/g, name: 'GitHub OAuth' },
          { pattern: /github_pat_[a-zA-Z0-9_]{82}/g, name: 'GitHub Fine-grained PAT' },

          // Slack
          { pattern: /xox[baprs]-[a-zA-Z0-9-]+/g, name: 'Slack Token' },

          // Discord
          { pattern: /[MN][a-zA-Z0-9]{23,}\.[a-zA-Z0-9_-]{6}\.[a-zA-Z0-9_-]{27,}/g, name: 'Discord Bot Token' },

          // Heroku
          { pattern: /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/g, name: 'UUID (possível segredo)' },

          // Generic patterns
          { pattern: /(?:api_key|apikey|api_secret|secret_key|access_key|private_key)\s*[:=]\s*['"][a-zA-Z0-9+/=_-]{20,}['"]/gi, name: 'API Key genérica' },
          { pattern: /(?:token|auth_token|access_token|refresh_token)\s*[:=]\s*['"][a-zA-Z0-9+/=_-]{20,}['"]/gi, name: 'Token genérico' },
        ];

        // ============================================
        // PADRÕES DE SENHAS
        // ============================================
        const passwordPatterns = [
          { pattern: /(?:password|passwd|pwd)\s*[:=]\s*['"][^'"]{8,}['"]/gi, name: 'Senha hardcoded' },
          { pattern: /(?:DB_PASSWORD|DATABASE_PASSWORD|MYSQL_PASSWORD|POSTGRES_PASSWORD)\s*[:=]\s*['"][^'"]+['"]/gi, name: 'Senha de banco' },
          { pattern: /(?:REDIS_PASSWORD|MONGO_PASSWORD)\s*[:=]\s*['"][^'"]+['"]/gi, name: 'Senha de cache' },
        ];

        // ============================================
        // PADRÕES DE CREDENCIAIS
        // ============================================
        const credentialPatterns = [
          { pattern: /(?:jwt_secret|JWT_SECRET)\s*[:=]\s*['"][^'"]+['"]/gi, name: 'JWT Secret' },
          { pattern: /(?:encryption_key|ENCRYPTION_KEY)\s*[:=]\s*['"][^'"]+['"]/gi, name: 'Encryption Key' },
          { pattern: /(?:signing_key|SIGNING_KEY)\s*[:=]\s*['"][^'"]+['"]/gi, name: 'Signing Key' },
          { pattern: /(?:private_key|PRIVATE_KEY)\s*[:=]\s*['"][^'"]+['"]/gi, name: 'Private Key' },
        ];

        // ============================================
        // PADRÕES DE CONNECTION STRINGS
        // ============================================
        const connectionStringPatterns = [
          { pattern: /(?:mongodb|mysql|postgres|redis|amqp):\/\/[^:]+:[^@]+@[^'"]+/gi, name: 'Connection string com senha' },
          { pattern: /(?:mysql|postgres):\/\/[^'"]*:[^'"]+@[^'"]+/gi, name: 'Database URL com senha' },
        ];

        // ============================================
        // VERIFICAR TODOS OS PADRÕES
        // ============================================
        const allPatterns = [
          ...apiKeyPatterns,
          ...passwordPatterns,
          ...credentialPatterns,
          ...connectionStringPatterns,
        ];

        for (const { pattern, name } of allPatterns) {
          let match;
          const regex = new RegExp(pattern.source, pattern.flags);

          while ((match = regex.exec(content)) !== null) {
            const lineNumber = content.substring(0, match.index).split('\n').length;
            const matchedValue = match[0];

            // Ignorar se estiver em comentário
            const line = content.split('\n')[lineNumber - 1];
            if (line && (line.trim().startsWith('//') || line.trim().startsWith('*') || line.trim().startsWith('/*'))) {
              continue;
            }

            // Ignorar se for placeholder
            if (matchedValue.includes('YOUR_') || matchedValue.includes('xxx') || matchedValue.includes('placeholder')) {
              continue;
            }

            // Ignorar se for variável de ambiente
            if (matchedValue.includes('process.env') || matchedValue.includes('EXPO_PUBLIC')) {
              continue;
            }

            violations.push({
              file: filePath,
              line: lineNumber,
              rule: 'R02_SECRETS',
              message: `${name} detectado: ${matchedValue.substring(0, 30)}...`,
              severity: 'BLOCK',
              code: matchedValue.substring(0, 60),
              remediation: `Mova para variável de ambiente: process.env.EXPO_PUBLIC_${name.replace(/\s/g, '_').toUpperCase()}`,
            });
          }
        }

        // ============================================
        // VERIFICAR STRINGS HEX/BASE64 LONGAS
        // ============================================
        const hexPattern = /['"][a-f0-9]{64,}['"]/g;
        let hexMatch;
        while ((hexMatch = hexPattern.exec(content)) !== null) {
          const line = content.split('\n')[hexMatch.index.split('\n').length - 1];
          if (line && !line.trim().startsWith('//') && !line.trim().startsWith('*')) {
            violations.push({
              file: filePath,
              line: content.substring(0, hexMatch.index).split('\n').length,
              rule: 'R02_SECRETS',
              message: 'String hex longa detectada (possível chave criptográfica)',
              severity: 'BLOCK',
              code: hexMatch[0].substring(0, 40) + '...',
            });
          }
        }

        const base64Pattern = /['"][A-Za-z0-9+/]{64,}={0,2}['"]/g;
        let b64Match;
        while ((b64Match = base64Pattern.exec(content)) !== null) {
          const line = content.split('\n')[b64Match.index.split('\n').length - 1];
          if (line && !line.trim().startsWith('//') && !line.trim().startsWith('*')) {
            violations.push({
              file: filePath,
              line: content.substring(0, b64Match.index).split('\n').length,
              rule: 'R02_SECRETS',
              message: 'String Base64 longa detectada (possível chave)',
              severity: 'BLOCK',
              code: b64Match[0].substring(0, 40) + '...',
            });
          }
        }

        return violations;
      },
    },
  ],
};
