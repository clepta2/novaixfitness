// ============================================
// REGRAS 146-150: CLIENTE VS BACKEND
// ============================================
// Nível: ALTO | Tipo: WARNING

/**
 * Regras 146-150:
 * 146. State-clearing no logout
 * 147. CSP (Content Security Policy)
 * 148. Variáveis de ambiente públicas vs privadas
 * 149. Queries parametrizadas
 * 150. Session revocation list
 */

module.exports = {
  name: 'Client vs Backend',
  rules: [
    {
      id: 'R146_STATE_CLEARING',
      check: (fp, content) => {
        if (!content.includes('logout') || !content.includes('signOut')) return null;
        const hasClearState = content.includes('reset') || content.includes('clear') || content.includes('initial');
        if (!hasClearState) return { msg: 'Logout deve limpar todo o estado da aplicação', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R147_CSP',
      check: (fp, content) => {
        if (!content.includes('helmet') && !content.includes('csp')) return null;
        const hasCSP = content.includes('csp') || content.includes('Content-Security-Policy');
        if (!hasCSP) return { msg: 'Helmet deve configurar Content Security Policy', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R148_PUBLIC_VS_PRIVATE_ENV',
      check: (fp, content) => {
        if (!content.includes('REACT_APP_') && !content.includes('EXPO_PUBLIC_')) return null;
        const hasSecrets = content.includes('SECRET') || content.includes('PRIVATE_KEY') || content.includes('API_KEY');
        if (hasSecrets) return { msg: 'Variáveis privadas NÃO devem estar no build do cliente', severity: 'BLOCK' };
        return null;
      },
    },
    {
      id: 'R149_PARAMETERIZED_QUERIES',
      check: (fp, content) => {
        if (!content.includes('query') || !content.includes('select')) return null;
        const hasParameterized = content.includes('$1') || content.includes('?') || content.includes('.eq(');
        if (!hasParameterized && content.includes('SELECT')) return { msg: 'Queries devem ser parametrizadas', severity: 'BLOCK' };
        return null;
      },
    },
    {
      id: 'R150_SESSION_REVOCATION',
      check: (fp, content) => {
        if (!content.includes('logout') || !content.includes('session')) return null;
        const hasRevocation = content.includes('revoke') || content.includes('blacklist') || content.includes('invalidate');
        if (!hasRevocation) return { msg: 'Logout deve revogar sessão no backend (Redis blacklist)', severity: 'WARNING' };
        return null;
      },
    },
  ],
};
