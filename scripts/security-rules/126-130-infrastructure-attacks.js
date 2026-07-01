// ============================================
// REGRAS 126-130: ATAQUES DE INFRAESTRUTURA
// ============================================
// Nível: CRÍTICO | Tipo: BLOCK

/**
 * Regras 126-130:
 * 126. Deserialização insegura
 * 127. Subdomain takeover
 * 128. Error information disclosure
 * 129. IDOR em uploads
 * 130. JSON bomb
 */

module.exports = {
  name: 'Infrastructure Attacks',
  rules: [
    {
      id: 'R126_INSECURE_DESERIALIZATION',
      check: (fp, content) => {
        const hasUnsafe = content.includes('eval(') || content.includes('new Function(') || content.includes('unserialize');
        if (hasUnsafe) return { msg: 'Deserialização insegura detectada. Use Zod para validação', severity: 'BLOCK' };
        return null;
      },
    },
    {
      id: 'R127_SUBDOMAIN_TAKEOVER',
      check: (fp, content) => {
        if (!content.includes('dns') && !content.includes('cname') && !content.includes('subdomain')) return null;
        const hasAudit = content.includes('audit') || content.includes('check') || content.includes('verify');
        if (!hasAudit) return { msg: 'DNS deve ter auditoria periódica contra subdomain takeover', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R128_ERROR_DISCLOSURE',
      check: (fp, content) => {
        if (!content.includes('error') || !content.includes('handler')) return null;
        const hasGeneric = content.includes('Internal Server Error') || content.includes('generic') || content.includes('sanitize');
        if (!hasGeneric && content.includes('stack')) return { msg: 'Error handler deve retornar mensagem genérica', severity: 'BLOCK' };
        return null;
      },
    },
    {
      id: 'R129_UPLOAD_IDOR',
      check: (fp, content) => {
        if (!content.includes('upload') || !content.includes('file')) return null;
        const hasUUID = content.includes('uuid') || content.includes('random') || content.includes('hash');
        if (!hasUUID) return { msg: 'Uploads devem usar UUID para nomes de arquivo', severity: 'BLOCK' };
        return null;
      },
    },
    {
      id: 'R130_JSON_BOMB',
      check: (fp, content) => {
        if (!content.includes('express.json') && !content.includes('bodyParser')) return null;
        const hasLimit = content.includes('limit') || content.includes('size');
        if (!hasLimit) return { msg: 'express.json() deve ter limite de tamanho (10kb-1mb)', severity: 'BLOCK' };
        return null;
      },
    },
  ],
};
