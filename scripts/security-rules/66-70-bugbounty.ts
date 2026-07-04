// ============================================
// REGRAS 66-70: BUG BOUNTY PREPARATION
// ============================================
// Nível: ALTO | Tipo: WARNING

/**
 * OBJETIVO: Preparar para programas de Bug Bounty.
 */

module.exports = {
  name: 'Bug Bounty Preparation',
  version: '1.0.0',
  severity: 'WARNING',
  description: 'Preparação para Bug Bounty',

  rules: [
    {
      id: 'R66_SESSION_REVOCATION',
      name: 'Session Revocation on Logout',
      severity: 'WARNING',
      check: (filePath, content) => {
        if (!content.includes('logout') && !content.includes('signOut')) return [];
        const hasRevocation = content.includes('revoke') || content.includes('invalidate') || content.includes('blacklist');
        if (!hasRevocation) {
          return [{ file: filePath, line: 0, rule: 'R66_SESSION_REVOCATION', message: 'Logout sem invalidação de sessão no backend', severity: 'WARNING' }];
        }
        return [];
      },
    },
    {
      id: 'R67_HOST_HEADER',
      name: 'Host Header Injection',
      severity: 'WARNING',
      check: (filePath, content) => {
        if (!content.includes('host') || !content.includes('email')) return [];
        const hasBaseUrl = content.includes('BASE_URL') || content.includes('base_url');
        if (!hasBaseUrl && content.includes('req.headers.host')) {
          return [{ file: filePath, line: 0, rule: 'R67_HOST_HEADER', message: 'Host header injection - use BASE_URL constante', severity: 'WARNING' }];
        }
        return [];
      },
    },
    {
      id: 'R68_INPUT_TRUNCATION',
      name: 'Input Truncation',
      severity: 'WARNING',
      check: (filePath, content) => {
        if (!content.includes('input') && !content.includes('field')) return [];
        const hasMaxLength = content.includes('max') || content.includes('length') || content.includes('limit');
        if (!hasMaxLength && content.includes('zod') || content.includes('joi')) {
          return [{ file: filePath, line: 0, rule: 'R68_INPUT_TRUNCATION', message: 'Schema de validação sem max length', severity: 'WARNING' }];
        }
        return [];
      },
    },
    {
      id: 'R69_CSRF_PROTECTION',
      name: 'CSRF Protection',
      severity: 'WARNING',
      check: (filePath, content) => {
        if (!content.includes('cookie') || !content.includes('session')) return [];
        const hasSameSite = content.includes('SameSite') || content.includes('sameSite') || content.includes('csrf');
        if (!hasSameSite) {
          return [{ file: filePath, line: 0, rule: 'R69_CSRF_PROTECTION', message: 'Cookies sem SameSite - vulnerável a CSRF', severity: 'WARNING' }];
        }
        return [];
      },
    },
    {
      id: 'R70_ENUMERATION_PREVENTION',
      name: 'User Enumeration Prevention',
      severity: 'WARNING',
      check: (filePath, content) => {
        if (!content.includes('403') || !content.includes('404')) return [];
        const hasGenericError = content.includes('generic') || content.includes('same');
        if (!hasGenericError) {
          return [{ file: filePath, line: 0, rule: 'R70_ENUMERATION_PREVENTION', message: 'Erros 403/404 diferentes permitem enumeração de usuários', severity: 'WARNING' }];
        }
        return [];
      },
    },
  ],
};
