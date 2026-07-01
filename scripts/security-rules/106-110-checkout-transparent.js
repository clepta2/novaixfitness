// ============================================
// REGRAS 106-110: CHECKOUT TRANSPARENTE
// ============================================
// Nível: CRÍTICO | Tipo: BLOCK

/**
 * Regras 106-110:
 * 106. Tokenização direta via SDK (nunca cartão cru no backend)
 * 107. Validação de propriedade do token
 * 108. Trava de timeout no processamento
 * 109. Webhook anti-spoofing com IP validation
 * 110. Filtro de cartões bloqueados
 */

module.exports = {
  name: 'Checkout Transparente',
  rules: [
    {
      id: 'R106_CARD_TOKENIZATION',
      check: (fp, content) => {
        if (!fp.includes('checkout') && !fp.includes('payment')) return null;
        const hasCardData = content.includes('card_number') || content.includes('cvv') || content.includes('cardNumber');
        if (hasCardData) return { msg: 'Cartão cru detectado no backend. Use tokenização do Asaas', severity: 'BLOCK' };
        return null;
      },
    },
    {
      id: 'R107_TOKEN_VALIDATION',
      check: (fp, content) => {
        if (!fp.includes('checkout') || !fp.includes('token')) return null;
        const hasValidation = content.includes('validate') || content.includes('verify') || content.includes('customer');
        if (!hasValidation) return { msg: 'Token de cartão deve ter validação de propriedade', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R108_PAYMENT_LOCK',
      check: (fp, content) => {
        if (!fp.includes('checkout') || !fp.includes('payment')) return null;
        const hasLock = content.includes('lock') || content.includes('redis') || content.includes('mutex');
        if (!hasLock) return { msg: 'Checkout deve ter trava anti-duplicação (Redis lock)', severity: 'BLOCK' };
        return null;
      },
    },
    {
      id: 'R109_WEBHOOK_IP_VALIDATION',
      check: (fp, content) => {
        if (!fp.includes('webhook') || !fp.includes('asaas')) return null;
        const hasIPCheck = content.includes('ip') || content.includes('origin') || content.includes('referer');
        if (!hasIPCheck) return { msg: 'Webhook deve validar IP de origem do Asaas', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R110_CARD_FRAUD_FILTER',
      check: (fp, content) => {
        if (!fp.includes('checkout') || !fp.includes('card')) return null;
        const hasFilter = content.includes('fraud') || content.includes('block') || content.includes('reject');
        if (!hasFilter) return { msg: 'Checkout deve filtrar cartões recusados', severity: 'WARNING' };
        return null;
      },
    },
  ],
};
