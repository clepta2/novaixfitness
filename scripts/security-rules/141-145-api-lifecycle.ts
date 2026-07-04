// ============================================
// REGRAS 141-145: CICLO DE VIDA DA API
// ============================================
// Nível: ALTO | Tipo: WARNING

/**
 * Regras 141-145:
 * 141. Controle de depreciação de versões
 * 142. DTOs para não expor dados internos
 * 143. Timeout rígido no servidor
 * 144. Sanitização de erros de terceiros
 * 145. HMAC em webhooks
 */

module.exports = {
  name: 'API Lifecycle',
  rules: [
    {
      id: 'R141_VERSION_SUNSET',
      check: (fp, content) => {
        if (!content.includes('v1') || !content.includes('deprecated')) return null;
        const hasSunset = content.includes('sunset') || content.includes('deprecation');
        if (!hasSunset) return { msg: 'Versões antigas da API devem ter sunset header', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R142_DTO_PATTERN',
      check: (fp, content) => {
        if (!content.includes('res.json') || !content.includes('select')) return null;
        const hasDTO = content.includes('dto') || content.includes('DTO') || content.includes('sanitized');
        if (!hasDTO) return { msg: 'Responses devem usar DTOs para não expor dados internos', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R143_SERVER_TIMEOUT',
      check: (fp, content) => {
        if (!content.includes('express') || !content.includes('app')) return null;
        const hasTimeout = content.includes('timeout') || content.includes('Timeout');
        if (!hasTimeout) return { msg: 'Express deve ter timeout global (15-30s)', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R144_ERROR_SANITIZATION',
      check: (fp, content) => {
        if (!content.includes('catch') || !content.includes('error')) return null;
        const hasGeneric = content.includes('Internal Server Error') || content.includes('generic') || content.includes('sanitize');
        if (!hasGeneric && content.includes('res.status(500)')) return { msg: 'Erros devem ser sanitizados antes de enviar ao cliente', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R145_HMAC_WEBHOOKS',
      check: (fp, content) => {
        // Only run on actual webhook routes/controllers/services
        const isWebhookFile = fp.includes('webhook') && (fp.includes('routes') || fp.includes('services') || fp.includes('controllers') || fp.includes('server.js'));
        if (!isWebhookFile) return null;
        const hasHMAC = content.includes('hmac') || content.includes('sha256') || content.includes('signature') || content.includes('verifyWebhookToken');
        if (!hasHMAC) return { msg: 'Webhooks devem ter validação HMAC-SHA256 ou Token Seguro', severity: 'BLOCK' };
        return null;
      },
    },
  ],
};
