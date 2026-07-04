// ============================================
// REGRAS 116-120: DEFESA DE NEGÓCIOS
// ============================================
// Nível: ALTO | Tipo: WARNING

/**
 * Regras 116-120:
 * 116. Delayed payout para contas suspeitas
 * 117. Bloqueio de device switching
 * 118. Zero trust para suporte
 * 119. Assinatura digital de termos
 * 120. Dead man's switch
 */

module.exports = {
  name: 'Business Defense',
  rules: [
    {
      id: 'R116_DELAYED_PAYOUT',
      check: (fp, content) => {
        if (!fp.includes('withdraw') || !fp.includes('payout')) return null;
        const hasDelay = content.includes('hold') || content.includes('delay') || content.includes('review');
        if (!hasDelay) return { msg: 'Saques devem ter período de retenção para contas suspeitas', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R117_DEVICE_SWITCHING',
      check: (fp, content) => {
        if (!fp.includes('session') || !fp.includes('auth')) return null;
        const hasDeviceCheck = content.includes('device') || content.includes('fingerprint') || content.includes('session');
        if (!hasDeviceCheck) return { msg: 'Sessões devem detectar troca de dispositivo', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R118_ZERO_TRUST_SUPPORT',
      check: (fp, content) => {
        if (!fp.includes('admin') || !fp.includes('support')) return null;
        const hasZeroTrust = content.includes('verify') || content.includes('confirm') || content.includes('approval');
        if (!hasZeroTrust) return { msg: 'Ações administrativas devem exigir verificação múltipla', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R119_TERMS_SIGNATURE',
      check: (fp, content) => {
        if (!fp.includes('signup') || !fp.includes('register')) return null;
        const hasTerms = content.includes('terms') || content.includes('accept') || content.includes('consent');
        if (!hasTerms) return { msg: 'Cadastro deve capturar aceite dos termos com IP/hora', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R120_DEAD_MANS_SWITCH',
      check: (fp, content) => {
        if (!fp.includes('monitor') || !fp.includes('alert')) return null;
        const hasKillSwitch = content.includes('kill') || content.includes('switch') || content.includes('panic');
        if (!hasKillSwitch) return { msg: 'Monitoramento deve ter dead man\'s switch', severity: 'WARNING' };
        return null;
      },
    },
  ],
};
