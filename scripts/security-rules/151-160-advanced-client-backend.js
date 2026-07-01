// ============================================
// REGRAS 151-160: DEFESA AVANÇADA CLIENTE/BACKEND
// ============================================
// Nível: ALTO | Tipo: WARNING

/**
 * Regras 151-160:
 * 151. Tab-nabbing prevention (rel=noopener)
 * 152. Cache-control para páginas autenticadas
 * 153. Process-level sandboxing (sem globals)
 * 154. Connection pool limits
 * 155. npm ci em vez de npm install
 * 156. Frame busting (clickjacking)
 * 157. AbortController para cancelar requisições
 * 158. crypto.timingSafeEqual
 * 159. Cache poisoning prevention
 * 160. Audit logs imutáveis externos
 */

module.exports = {
  name: 'Advanced Client/Backend Defense',
  rules: [
    {
      id: 'R151_NOOPENER',
      check: (fp, content) => {
        if (!content.includes('target="_blank"') && !content.includes("target='_blank'")) return null;
        const hasNoOpener = content.includes('rel="noopener') || content.includes("rel='noopener") || content.includes('noopener');
        if (!hasNoOpener) return { msg: 'Links externos devem ter rel="noopener noreferrer"', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R152_CACHE_CONTROL',
      check: (fp, content) => {
        if (!content.includes('helmet') && !content.includes('cache')) return null;
        const hasCacheControl = content.includes('no-store') || content.includes('no-cache') || content.includes('Cache-Control');
        if (!hasCacheControl) return { msg: 'Páginas autenticadas devem ter Cache-Control: no-store', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R153_NO_GLOBALS',
      check: (fp, content) => {
        if (!content.includes('server') && !content.includes('app')) return null;
        const hasGlobals = content.includes('global.') || content.includes('global[');
        if (hasGlobals) return { msg: 'Backend deve ser stateless - sem variáveis globais', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R154_CONNECTION_POOL',
      check: (fp, content) => {
        if (!content.includes('supabase') || !content.includes('createClient')) return null;
        const hasPool = content.includes('pool') || content.includes('max') || content.includes('connection');
        if (!hasPool) return { msg: 'Conexões com banco devem usar pool limitado', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R155_NPM_CI',
      check: (fp, content) => {
        if (!content.includes('npm install') && !content.includes('npm i ')) return null;
        const hasCI = content.includes('npm ci');
        if (!hasCI && content.includes('Dockerfile')) return { msg: 'Dockerfile deve usar npm ci em vez de npm install', severity: 'BLOCK' };
        return null;
      },
    },
    {
      id: 'R156_FRAME_BUSTING',
      check: (fp, content) => {
        if (!content.includes('index.html') && !content.includes('index.htm')) return null;
        const hasFrameBust = content.includes('top !== self') || content.includes('X-Frame-Options');
        if (!hasFrameBust) return { msg: 'index.html deve ter frame busting contra clickjacking', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R157_ABORT_CONTROLLER',
      check: (fp, content) => {
        if (!content.includes('fetch') || !content.includes('useEffect')) return null;
        const hasAbort = content.includes('AbortController') || content.includes('abort');
        if (!hasAbort) return { msg: 'fetch em useEffect deve usar AbortController', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R158_TIMING_SAFE_EQUAL',
      check: (fp, content) => {
        if (!content.includes('verify') || !content.includes('token')) return null;
        const hasTimingSafe = content.includes('timingSafeEqual') || content.includes('crypto');
        if (!hasTimingSafe) return { msg: 'Verificação de tokens deve usar crypto.timingSafeEqual', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R159_CACHE_POISONING_PREVENTION',
      check: (fp, content) => {
        if (!content.includes('cache') && !content.includes('nginx')) return null;
        const hasProtection = content.includes('ignore') || content.includes('whitelist') || content.includes('host');
        if (!hasProtection) return { msg: 'Cache deve ignorar headers não autorizados', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R160_IMMUTABLE_EXTERNAL_LOGS',
      check: (fp, content) => {
        if (!content.includes('log') || !content.includes('error')) return null;
        const hasExternal = content.includes('syslog') || content.includes('datadog') || content.includes('axiom') || content.includes('sentry');
        if (!hasExternal) return { msg: 'Logs críticos devem ser enviados para servidor externo imutável', severity: 'WARNING' };
        return null;
      },
    },
  ],
};
