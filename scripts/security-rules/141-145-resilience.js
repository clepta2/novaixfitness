// ============================================
// REGRAS 141-145: RESILIÊNCIA E LGPD
// ============================================
// Nível: ALTO | Tipo: WARNING

/**
 * Regras 141-145:
 * 141. Application-layer encryption
 * 142. Code obfuscation
 * 143. Right to be forgotten
 * 144. Dynamic PII masking
 * 145. Secret rotation
 */

module.exports = {
  name: 'Resilience & LGPD',
  rules: [
    {
      id: 'R141_APP_LAYER_ENCRYPTION',
      check: (fp, content) => {
        if (!content.includes('supabase') || !content.includes('insert')) return null;
        const hasEncryption = content.includes('encrypt') || content.includes('crypto');
        if (!hasEncryption && content.includes('sensitive')) return { msg: 'Dados sensíveis devem ser criptografados antes do Supabase', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R142_REACT_OBFUSCATION',
      check: (fp, content) => {
        if (!fp.includes('metro.config') && !fp.includes('babel.config')) return null;
        const hasConfig = content.includes('minify') || content.includes('terser');
        if (!hasConfig) return { msg: 'Configurar minificação no build do React', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R143_RIGHT_TO_FORGET',
      check: (fp, content) => {
        if (!content.includes('delete') || !content.includes('user')) return null;
        const hasAnonymize = content.includes('anonymize') || content.includes('deleted') || content.includes('cascade');
        if (!hasAnonymize) return { msg: 'Exclusão deve usar anonimização para dados obrigatórios', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R144_DYNAMIC_MASKING',
      check: (fp, content) => {
        if (!content.includes('cpf') && !content.includes('phone')) return null;
        const hasDynamic = content.includes('toggle') || content.includes('reveal') || content.includes('eye');
        if (!hasDynamic) return { msg: 'PII deve ter toggle de visualização com log', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R145_SECRET_ROTATION',
      check: (fp, content) => {
        if (!content.includes('.env') || !content.includes('key')) return null;
        const hasRotation = content.includes('rotate') || content.includes('schedule');
        if (!hasRotation) return { msg: 'Chaves .env devem ter rotação programada', severity: 'WARNING' };
        return null;
      },
    },
  ],
};
