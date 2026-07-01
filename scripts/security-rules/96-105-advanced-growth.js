// ============================================
// REGRAS 96-105: GROWTH E ANTI-FRAUDE
// ============================================
// Nível: ALTO | Tipo: WARNING

/**
 * Regras 96-105:
 * 96. Device attestation (emuladores)
 * 97. Cookie stuffing prevention
 * 98. Gamification cooldown
 * 99. CPF único para Asaas
 * 100. Invite usage limits
 * 101. Invite token expiry
 * 102. Referrer validation
 * 103. Velocity check para afiliados
 * 104. Account linking
 * 105. Fraud scoring
 */

module.exports = {
  name: 'Advanced Growth Security',
  rules: [
    {
      id: 'R96_DEVICE_ATTESTATION',
      check: (fp, content) => {
        if (!content.includes('affiliate') && !content.includes('gamification')) return null;
        const hasAttestation = content.includes('attestation') || content.includes('integrity') || content.includes('device');
        if (!hasAttestation) return { msg: 'Considere device attestation para prevenir emuladores', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R97_COOKIE_STUFFING',
      check: (fp, content) => {
        if (!fp.includes('affiliate') || !fp.includes('cookie')) return null;
        const hasProtection = content.includes('referer') || content.includes('origin') || content.includes('iframe');
        if (!hasProtection) return { msg: 'Links de afiliados devem verificar Referer', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R98_GAMIFICATION_COOLDOWN',
      check: (fp, content) => {
        if (!fp.includes('gamification') || !fp.includes('points')) return null;
        const hasCooldown = content.includes('cooldown') || content.includes('throttle') || content.includes('redis');
        if (!hasCooldown) return { msg: 'Gamificação deve ter cooldown anti-script', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R99_CPF_UNIQUE',
      check: (fp, content) => {
        if (!fp.includes('asaas') || !fp.includes('payment')) return null;
        const hasUnique = content.includes('unique') || content.includes('cpf') || content.includes('cnpj');
        if (!hasUnique) return { msg: 'CPF/CNPJ no Asaas deve ter constraint UNIQUE', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R100_INVITE_LIMITS',
      check: (fp, content) => {
        if (!fp.includes('invite') || !fp.includes('limit')) return null;
        const hasLimit = content.includes('limit') || content.includes('max') || content.includes('count');
        if (!hasLimit) return { msg: 'Convites devem ter limite de uso', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R101_INVITE_EXPIRY',
      check: (fp, content) => {
        if (!fp.includes('invite') || !fp.includes('token')) return null;
        const hasExpiry = content.includes('expiry') || content.includes('expires') || content.includes('ttl');
        if (!hasExpiry) return { msg: 'Tokens de convite devem ter expiração', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R102_REFERER_VALIDATION',
      check: (fp, content) => {
        if (!fp.includes('affiliate') || !fp.includes('click')) return null;
        const hasValidation = content.includes('referer') || content.includes('origin') || content.includes('validate');
        if (!hasValidation) return { msg: 'Cliques de afiliados devem validar Referer', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R103_AFFILIATE_VELOCITY',
      check: (fp, content) => {
        if (!fp.includes('affiliate') || !fp.includes('commission')) return null;
        const hasVelocity = content.includes('velocity') || content.includes('rate') || content.includes('limit');
        if (!hasVelocity) return { msg: 'Comissões de afiliados devem ter velocity check', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R104_ACCOUNT_LINKING',
      check: (fp, content) => {
        if (!fp.includes('asaas') || !fp.includes('account')) return null;
        const hasLinking = content.includes('link') || content.includes('connect') || content.includes('verify');
        if (!hasLinking) return { msg: 'Contas Asaas devem ser verificadas e linkadas', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R105_FRAUD_SCORING',
      check: (fp, content) => {
        if (!fp.includes('fraud') || !fp.includes('risk')) return null;
        const hasScoring = content.includes('score') || content.includes('risk') || content.includes('check');
        if (!hasScoring) return { msg: 'Sistema deve ter fraud scoring', severity: 'WARNING' };
        return null;
      },
    },
  ],
};
