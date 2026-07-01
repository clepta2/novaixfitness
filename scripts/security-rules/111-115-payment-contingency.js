// ============================================
// REGRAS 111-115: CONTINGÊNCIA DE PAGAMENTOS
// ============================================
// Nível: ALTO | Tipo: WARNING

/**
 * Regras 111-115:
 * 111. Gateway de contingência (multi-gateway)
 * 112. Reconciliação bancária assíncrona
 * 113. Assinatura HMAC-SHA256 em webhooks
 * 114. Card fingerprint anti-fraude
 * 115. Log sanitizado para PCI compliance
 */

module.exports = {
  name: 'Payment Contingency',
  rules: [
    {
      id: 'R111_MULTI_GATEWAY',
      check: (fp, content) => {
        if (!fp.includes('payment') || !fp.includes('asaas')) return null;
        const hasFallback = content.includes('fallback') || content.includes('backup') || content.includes('retry');
        if (!hasFallback) return { msg: 'Gateway de pagamento deve ter contingência (multi-gateway)', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R112_RECONCILIATION',
      check: (fp, content) => {
        if (!fp.includes('pix') || !fp.includes('payment')) return null;
        const hasReconciliation = content.includes('reconcil') || content.includes('verify') || content.includes('check_status');
        if (!hasReconciliation) return { msg: 'Pix deve ter reconciliação bancária assíncrona', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R113_HMAC_VALIDATION',
      check: (fp, content) => {
        if (!fp.includes('webhook')) return null;
        const hasHMAC = content.includes('hmac') || content.includes('sha256') || content.includes('signature');
        if (!hasHMAC) return { msg: 'Webhook deve ter validação HMAC-SHA256', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R114_CARD_FINGERPRINT',
      check: (fp, content) => {
        if (!fp.includes('payment') || !fp.includes('card')) return null;
        const hasFingerprint = content.includes('fingerprint') || content.includes('card_hash');
        if (!hasFingerprint) return { msg: 'Cartões devem ter fingerprint para detecção de fraude', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R115_PCI_LOG_SANITIZATION',
      check: (fp, content) => {
        if (!fp.includes('payment') || !fp.includes('log')) return null;
        const hasSanitize = content.includes('redact') || content.includes('mask') || content.includes('sanitize');
        if (!hasSanitize) return { msg: 'Logs financeiros devem sanitizar dados sensíveis', severity: 'WARNING' };
        return null;
      },
    },
  ],
};
