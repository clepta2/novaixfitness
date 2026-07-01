// ============================================
// REGRAS 136-140: CRIPTOGRAFIA AVANÇADA
// ============================================
// Nível: ALTO | Tipo: WARNING

/**
 * Regras 136-140:
 * 136. Criptografia em nível de linha (AES-256-GCM)
 * 137. Ofuscação de código React
 * 138. LGPD/GDPR compliance
 * 139. Mascaramento de PII
 * 140. Rotação de chaves
 */

module.exports = {
  name: 'Advanced Crypto & Compliance',
  rules: [
    {
      id: 'R136_ROW_ENCRYPTION',
      check: (fp, content) => {
        if (!content.includes('sensitive') || !content.includes('encrypt')) return null;
        const hasAES = content.includes('AES') || content.includes('256') || content.includes('GCM');
        if (!hasAES) return { msg: 'Dados sensíveis devem usar AES-256-GCM antes de salvar', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R137_CODE_OBFUSCATION',
      check: (fp, content) => {
        if (!fp.includes('webpack') && !fp.includes('vite') && !fp.includes('build')) return null;
        const hasObfuscation = content.includes('minify') || content.includes('obfuscate') || content.includes('terser');
        if (!hasObfuscation) return { msg: 'Build de produção deve usar ofuscação de código', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R138_LGPD_COMPLIANCE',
      check: (fp, content) => {
        if (!content.includes('delete') || !content.includes('profile')) return null;
        const hasLGPD = content.includes('lgpd') || content.includes('gdpr') || content.includes('anonymize');
        if (!hasLGPD) return { msg: 'Exclusão de conta deve seguir LGPD (anonimização)', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R139_PII_MASKING',
      check: (fp, content) => {
        if (!content.includes('cpf') && !content.includes('phone') && !content.includes('email')) return null;
        const hasMask = content.includes('mask') || content.includes('hide') || content.includes('****');
        if (!hasMask) return { msg: 'PII deve ser mascarado na UI por padrão', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R140_KEY_ROTATION',
      check: (fp, content) => {
        if (!content.includes('api_key') || !content.includes('secret')) return null;
        const hasRotation = content.includes('rotate') || content.includes('expire') || content.includes('revoke');
        if (!hasRotation) return { msg: 'Chaves devem ter plano de rotação periódica', severity: 'WARNING' };
        return null;
      },
    },
  ],
};
