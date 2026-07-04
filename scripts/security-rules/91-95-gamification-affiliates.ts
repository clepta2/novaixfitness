// ============================================
// REGRAS 91-95: AFILIADOS E GAMIFICAÇÃO
// ============================================
// Nível: ALTO | Tipo: WARNING

/**
 * Regras 91-95:
 * 91. Click fingerprinting para afiliados
 * 92. Auto-referral blocking
 * 93. Server-side points calculation
 * 94. Atomic transactions para resgates
 * 95. Invite tokens criptografados
 */

module.exports = {
  name: 'Affiliates & Gamification',
  rules: [
    {
      id: 'R91_CLICK_FINGERPRINT',
      check: (fp, content) => {
        if (!fp.includes('affiliate') || !fp.includes('ref')) return null;
        const hasFingerprint = content.includes('fingerprint') || content.includes('hash') || content.includes('redis');
        if (!hasFingerprint) return { msg: 'Links de afiliados devem usar click fingerprinting', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R92_SELF_REFERRAL',
      check: (fp, content) => {
        if (!fp.includes('referral') || !fp.includes('affiliate')) return null;
        const hasSelfCheck = content.includes('self') || content.includes('same') || content.includes('own');
        if (!hasSelfCheck) return { msg: 'Sistema deve bloquear self-referral', severity: 'BLOCK' };
        return null;
      },
    },
    {
      id: 'R93_SERVER_SIDE_POINTS',
      check: (fp, content) => {
        if (!fp.includes('gamification') || !fp.includes('points') || !fp.includes('xp')) return null;
        const hasServerCalc = content.includes('server') || content.includes('backend') || content.includes('calculate');
        if (!hasServerCalc) return { msg: 'Pontos de gamificação devem ser calculados no backend', severity: 'BLOCK' };
        return null;
      },
    },
    {
      id: 'R94_ATOMIC_TRANSACTIONS',
      check: (fp, content) => {
        if (!fp.includes('redeem') || !fp.includes('reward') || !fp.includes('coupon')) return null;
        const hasTransaction = content.includes('transaction') || content.includes('atomic') || content.includes('lock');
        if (!hasTransaction) return { msg: 'Resgates devem usar transações atômicas', severity: 'BLOCK' };
        return null;
      },
    },
    {
      id: 'R95_INVITE_TOKENS',
      check: (fp, content) => {
        if (!fp.includes('invite') || !fp.includes('link')) return null;
        const hasSecureToken = content.includes('uuid') || content.includes('jwt') || content.includes('crypto');
        if (!hasSecureToken) return { msg: 'Links de convite devem usar tokens seguros', severity: 'BLOCK' };
        return null;
      },
    },
  ],
};
