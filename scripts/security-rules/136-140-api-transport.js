// ============================================
// REGRAS 136-140: TRANSPORTE E CRIPTOGRAFIA
// ============================================
// Nível: ALTO | Tipo: WARNING

/**
 * Regras 136-140:
 * 136. HSTS (HTTP Strict Transport Security)
 * 137. SameSite cookies
 * 138. Sanitização de XSS persistente
 * 139. HPP (HTTP Parameter Pollution)
 * 140. Server header masking
 */

module.exports = {
  name: 'API Transport Security',
  rules: [
    {
      id: 'R136_HSTS',
      check: (fp, content) => {
        if (!content.includes('helmet') || !content.includes('hsts')) return null;
        const hasHSTS = content.includes('hsts') || content.includes('Strict-Transport-Security');
        if (!hasHSTS) return { msg: 'Helmet deve configurar HSTS', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R137_SAMESITE_COOKIES',
      check: (fp, content) => {
        if (!content.includes('cookie') || !content.includes('set')) return null;
        const hasSameSite = content.includes('SameSite') || content.includes('sameSite') || content.includes('same_site');
        if (!hasSameSite) return { msg: 'Cookies devem ter SameSite=Strict ou Lax', severity: 'BLOCK' };
        return null;
      },
    },
    {
      id: 'R138_XSS_SANITIZE',
      check: (fp, content) => {
        if (!content.includes('insert') || !content.includes('body')) return null;
        const hasSanitize = content.includes('sanitize') || content.includes('dompurify') || content.includes('xss');
        if (!hasSanitize) return { msg: 'Texto de entrada deve ser sanitizado contra XSS', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R139_HPP',
      check: (fp, content) => {
        if (!content.includes('hpp') && !content.includes('express')) return null;
        const hasHPP = content.includes('hpp') || content.includes('hpp()');
        if (!hasHPP && content.includes('express')) return { msg: 'Express deve usar middleware HPP', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R140_SERVER_HEADER',
      check: (fp, content) => {
        if (!content.includes('x-powered-by') && !content.includes('X-Powered-By')) return null;
        const hasDisable = content.includes('disable') || content.includes('helmet');
        if (!hasDisable) return { msg: 'X-Powered-By deve ser desativado', severity: 'WARNING' };
        return null;
      },
    },
  ],
};
