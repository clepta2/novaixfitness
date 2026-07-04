// ============================================
// REGRA 21: ERROS DE LOGIN ESPECÍFICOS
// ============================================
// Nível: ALTO | Tipo: WARNING

/**
 * OBJETIVO: Bloquear mensagens de erro que revelam informações.
 */

module.exports = {
  name: 'Generic Auth Errors',
  version: '1.0.0',
  severity: 'WARNING',
  description: 'Bloqueia erros de login específicos demais',

  rules: [
    {
      id: 'R21_AUTH_ERRORS',
      name: 'Specific Auth Error Detection',
      severity: 'WARNING',

      check: (filePath, content) => {
        const violations = [];
        const patterns = [
          /(?:usuário|user|email)\s+(?:não\s+)?(?:existe|encontrado|not\s+found)/gi,
          /(?:senha|password)\s+(?:incorreta|inválida|wrong|incorrect)/gi,
          /(?:email|usuário)\s+válido/gi,
        ];

        for (const pattern of patterns) {
          let match;
          while ((match = pattern.exec(content)) !== null) {
            const lineNumber = content.substring(0, match.index).split('\n').length;
            const line = content.split('\n')[lineNumber - 1];
            if (line && (line.trim().startsWith('//') || line.trim().startsWith('*'))) continue;

            violations.push({
              file: filePath, line: lineNumber, rule: 'R21_AUTH_ERRORS',
              message: 'Erro de login específico demais - permite enumeração de usuários',
              severity: 'WARNING', code: match[0].substring(0, 60),
            });
          }
        }
        return violations;
      },
    },
  ],
};
