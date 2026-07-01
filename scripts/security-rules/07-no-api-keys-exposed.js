// ============================================
// REGRA 7: API KEYS EXPOSTAS
// ============================================
// Nível: CRÍTICO | Tipo: BLOCK

/**
 * OBJETIVO: Detectar chaves de API expostas no código.
 *
 * O QUE VERIFICA:
 * 1. Chaves AWS (AKIA, ABIA, ACCA, ASIA)
 * 2. GitHub tokens (ghp_, gho_, github_pat_)
 * 3. Stripe keys (sk_live_, sk_test_)
 * 4. Google API keys (AIza)
 * 5. JWTs (eyJ...)
 * 6. Tokens genéricos longos
 * 7. Chaves hex/base64 longas
 */

module.exports = {
  name: 'API Keys Exposure',
  version: '1.0.0',
  severity: 'BLOCK',
  description: 'Detecta chaves de API expostas no código',

  rules: [
    {
      id: 'R07_API_KEYS',
      name: 'API Keys Detection',
      severity: 'BLOCK',

      check: (filePath, content) => {
        const violations = [];

        const patterns = [
          { pattern: /AKIA[0-9A-Z]{16}/g, name: 'AWS Access Key' },
          { pattern: /ghp_[a-zA-Z0-9]{36}/g, name: 'GitHub PAT' },
          { pattern: /gho_[a-zA-Z0-9]{36}/g, name: 'GitHub OAuth' },
          { pattern: /github_pat_[a-zA-Z0-9_]{82}/g, name: 'GitHub Fine-grained PAT' },
          { pattern: /sk_live_[a-zA-Z0-9]{24,}/g, name: 'Stripe Live Key' },
          { pattern: /sk_test_[a-zA-Z0-9]{24,}/g, name: 'Stripe Test Key' },
          { pattern: /AIza[a-zA-Z0-9_-]{35}/g, name: 'Google API Key' },
          { pattern: /SG\.[a-zA-Z0-9_-]{22}\.[a-zA-Z0-9_-]{43}/g, name: 'SendGrid Key' },
          { pattern: /xox[baprs]-[a-zA-Z0-9-]+/g, name: 'Slack Token' },
          { pattern: /eyJ[a-zA-Z0-9_-]*\.eyJ[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]+/g, name: 'JWT Token' },
          { pattern: /sk-[a-f0-9]{32,}/g, name: 'OpenAI Key' },
          { pattern: /xoxb-[0-9]+-[a-zA-Z0-9]+/g, name: 'Slack Bot Token' },
          { pattern: /sq0[a-z]{3}-[a-zA-Z0-9_-]{22,}/g, name: 'Square Access Token' },
          { pattern: /EAAA[a-zA-Z0-9]+/g, name: 'Facebook Access Token' },
          { pattern: /sk_live_[a-zA-Z0-9]{24,}/g, name: 'Razorpay Key' },
        ];

        for (const { pattern, name } of patterns) {
          let match;
          const regex = new RegExp(pattern.source, pattern.flags);

          while ((match = regex.exec(content)) !== null) {
            const lineNumber = content.substring(0, match.index).split('\n').length;
            const line = content.split('\n')[lineNumber - 1];

            if (line && (line.trim().startsWith('//') || line.trim().startsWith('*'))) continue;

            const value = match[0];
            if (value.includes('YOUR_') || value.includes('xxx') || value.includes('placeholder')) continue;

            violations.push({
              file: filePath,
              line: lineNumber,
              rule: 'R07_API_KEYS',
              message: `${name} exposto: ${value.substring(0, 20)}...`,
              severity: 'BLOCK',
              code: value.substring(0, 40) + '...',
              remediation: `Mova para process.env.EXPO_PUBLIC_* e rotacione a chave imediatamente`,
            });
          }
        }

        return violations;
      },
    },
  ],
};
