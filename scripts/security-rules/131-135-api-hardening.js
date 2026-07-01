// ============================================
// REGRAS 131-135: API HARDENING
// ============================================
// Nível: CRÍTICO | Tipo: BLOCK

/**
 * Regras 131-135:
 * 131. Validação estrita com Zod (nunca req.body direto)
 * 132. Verbos HTTP corretos
 * 133. UUID em vez de IDs sequenciais
 * 134. CORS restrito
 * 135. Helmet middleware
 */

module.exports = {
  name: 'API Hardening',
  rules: [
    {
      id: 'R131_NO_REQ_BODY_DIRECT',
      check: (fp, content) => {
        if (!content.includes('req.body') || !content.includes('insert') || !content.includes('update')) return null;
        const hasValidation = content.includes('zod') || content.includes('joi') || content.includes('validate') || content.includes('parse');
        if (!hasValidation) return { msg: 'req.body direto em insert/update é PERIGOSO. Use Zod/Joi', severity: 'BLOCK' };
        return null;
      },
    },
    {
      id: 'R132_HTTP_VERBS',
      check: (fp, content) => {
        if (!content.includes('app.get') || !content.includes('delete')) return null;
        const hasPost = content.includes('app.post') || content.includes('app.delete');
        if (!hasPost && content.includes('delete')) return { msg: 'DELETE via GET é PERIGOSO. Use POST/DELETE', severity: 'BLOCK' };
        return null;
      },
    },
    {
      id: 'R133_UUID_NOT_SEQUENTIAL',
      check: (fp, content) => {
        const hasSequential = /\/api\/[^'"]*\/\d{4,}/g.test(content);
        if (hasSequential) return { msg: 'IDs sequenciais em URLs são PERIGOSOS (IDOR). Use UUIDs', severity: 'BLOCK' };
        return null;
      },
    },
    {
      id: 'R134_CORS_RESTRICTED',
      check: (fp, content) => {
        if (!content.includes('cors') || !content.includes('origin')) return null;
        const hasWildcard = content.includes('origin: *') || content.includes("origin: '*'") || content.includes('origin: "*"');
        if (hasWildcard) return { msg: 'CORS wildcard é PERIGOSO. Use lista restrita', severity: 'BLOCK' };
        return null;
      },
    },
    {
      id: 'R135_HELMET',
      check: (fp, content) => {
        // Helmet is only needed on the main Express server entrypoint
        const isEntrypoint = content.includes('app.listen') || content.includes('server.listen') || fp.endsWith('server.js') || fp.endsWith('app.js');
        if (!isEntrypoint) return null;
        const hasHelmet = content.includes('helmet') || content.includes('Helmet');
        if (!hasHelmet) return { msg: 'Express deve usar Helmet para security headers', severity: 'BLOCK' };
        return null;
      },
    },
  ],
};
