// ============================================
// REGRAS 86-90: SEGURANÇA DE E-MAIL
// ============================================
// Nível: ALTO | Tipo: WARNING

/**
 * Regras 86-90:
 * 86. Passkeys/WebAuthn
 * 87. mTLS para APIs críticas
 * 88. Blacklist de e-mails descartáveis
 * 89. SPF/DKIM/DMARC
 * 90. Detecção de viagem impossível
 */

module.exports = {
  name: 'Email Security',
  rules: [
    {
      id: 'R86_PASSKEYS',
      check: (fp, content) => {
        if (!fp.includes('auth') || !fp.includes('login')) return null;
        const hasPasskey = content.includes('passkey') || content.includes('webauthn') || content.includes('biometric');
        if (!hasPasskey) return { msg: 'Considere implementar Passkeys/WebAuthn como alternativa a senhas', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R87_MTLS',
      check: (fp, content) => {
        if (!fp.includes('api') || !fp.includes('internal')) return null;
        const hasMTLS = content.includes('mtls') || content.includes('mutual') || content.includes('certificate');
        if (!hasMTLS) return { msg: 'APIs internas devem usar mTLS', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R88_DISPOSABLE_EMAIL',
      check: (fp, content) => {
        if (!fp.includes('signup') && !fp.includes('register')) return null;
        const hasBlacklist = content.includes('blacklist') || content.includes('disposable') || content.includes('tempmail');
        if (!hasBlacklist) return { msg: 'Cadastro deve verificar e-mails descartáveis', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R89_SPF_DKIM',
      check: (fp, content) => {
        if (!fp.includes('email') || !fp.includes('send')) return null;
        const hasSPF = content.includes('spf') || content.includes('dkim') || content.includes('dmarc');
        if (!hasSPF) return { msg: 'Envio de e-mails deve ter SPF/DKIM/DMARC configurado', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R90_IMPOSSIBLE_TRAVEL',
      check: (fp, content) => {
        if (!fp.includes('session') || !fp.includes('auth')) return null;
        const hasGeoCheck = content.includes('geo') || content.includes('location') || content.includes('travel');
        if (!hasGeoCheck) return { msg: 'Detecção de viagem impossível em sessões', severity: 'WARNING' };
        return null;
      },
    },
  ],
};
