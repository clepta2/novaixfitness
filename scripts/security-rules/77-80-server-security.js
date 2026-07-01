// ============================================
// REGRAS 77-80: SEGURANÇA DO SERVIDOR
// ============================================
// Nível: ALTO | Tipo: WARNING

/**
 * Regras 77-80:
 * 77. Criptografia pós-quântica
 * 78. Computação confidencial
 * 79. Criptografia homomórfica
 * 80. Decepção ativa (Honey Network)
 */

module.exports = {
  name: 'Server Security',
  rules: [
    {
      id: 'R77_POST_QUANTUM',
      check: (fp, content) => {
        if (!content.includes('crypto') && !content.includes('encrypt')) return null;
        const hasModern = content.includes('AES-256') || content.includes('ChaCha20') || content.includes('Ed25519');
        if (!hasModern) return { msg: 'Considere algoritmos pós-quânticos para criptografia', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R78_CONFIDENTIAL_COMPUTING',
      check: (fp, content) => {
        if (!fp.includes('security') && !fp.includes('crypto')) return null;
        return { msg: 'Para dados ultra-sensíveis, considere Intel SGX ou AMD SEV', severity: 'WARNING' };
      },
    },
    {
      id: 'R79_HOMOMORPHIC',
      check: (fp, content) => {
        if (!content.includes('encrypt') || !content.includes('analytics')) return null;
        return { msg: 'Para analytics com dados sensíveis, considere criptografia homomórfica', severity: 'WARNING' };
      },
    },
    {
      id: 'R80_HONEY_NETWORK',
      check: (fp, content) => {
        if (!fp.includes('honey') && !content.includes('honeytoken')) return null;
        return { msg: 'Honey tokens implementados - bom para detecção de intrusão', severity: 'WARNING' };
      },
    },
  ],
};
