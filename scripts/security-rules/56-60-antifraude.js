// ============================================
// REGRAS 56-60: INTELIGÊNCIA ANTIFRAUDE
// ============================================
// Nível: ALTO | Tipo: WARNING

/**
 * OBJETIVO: Detectar padrões de fraude e lavagem de dinheiro.
 */

module.exports = {
  name: 'Anti-Fraud Intelligence',
  version: '1.0.0',
  severity: 'WARNING',
  description: 'Detecção de fraude e lavagem de dinheiro',

  rules: [
    {
      id: 'R56_AUTO_PAYMENT',
      name: 'Auto-Payment Prevention',
      severity: 'WARNING',
      check: (filePath, content) => {
        if (!content.includes('payment') && !content.includes('transfer')) return [];
        const hasBuyerSellerCheck = content.includes('buyer') && content.includes('seller') ||
          content.includes('sender') && content.includes('receiver');
        if (!hasBuyerSellerCheck) {
          return [{ file: filePath, line: 0, rule: 'R56_AUTO_PAYMENT', message: 'Verificar se buyer e seller não são a mesma pessoa (anti-lavagem)', severity: 'WARNING' }];
        }
        return [];
      },
    },
    {
      id: 'R57_GEO_MISMATCH',
      name: 'Geo-IP Mismatch',
      severity: 'WARNING',
      check: (filePath, content) => {
        if (!content.includes('payment') && !content.includes('checkout')) return [];
        const hasGeoCheck = content.includes('geo') || content.includes('location') || content.includes('ip');
        if (!hasGeoCheck) {
          return [{ file: filePath, line: 0, rule: 'R57_GEO_MISMATCH', message: 'Checkout sem verificação geográfica para detectar cartão clonado', severity: 'WARNING' }];
        }
        return [];
      },
    },
    {
      id: 'R58_LOG_MASKING',
      name: 'Financial Log Masking',
      severity: 'WARNING',
      check: (filePath, content) => {
        if (!content.includes('cpf') && !content.includes('pix') && !content.includes('card')) return [];
        if (content.includes('console.log') && (content.includes('cpf') || content.includes('pix'))) {
          return [{ file: filePath, line: 0, rule: 'R58_LOG_MASKING', message: 'Dados financeiros em logs sem mascaramento', severity: 'WARNING' }];
        }
        return [];
      },
    },
    {
      id: 'R59_KILL_SWITCH',
      name: 'Financial Kill Switch',
      severity: 'WARNING',
      check: (filePath, content) => {
        if (!filePath.includes('payment') && !filePath.includes('checkout')) return [];
        const hasKillSwitch = content.includes('KILL_SWITCH') || content.includes('maintenance') || content.includes('disable');
        if (!hasKillSwitch) {
          return [{ file: filePath, line: 0, rule: 'R59_KILL_SWITCH', message: 'Endpoints de pagamento sem kill switch de emergência', severity: 'WARNING' }];
        }
        return [];
      },
    },
    {
      id: 'R60_PCI_COMPLIANCE',
      name: 'PCI-DSS Compliance',
      severity: 'WARNING',
      check: (filePath, content) => {
        if (!content.includes('card') && !content.includes('payment')) return [];
        const hasTokenization = content.includes('token') || content.includes('tokenize');
        if (!hasTokenization && content.includes('card')) {
          return [{ file: filePath, line: 0, rule: 'R60_PCI_COMPLIANCE', message: 'Cartão sem tokenização - PCI-DSS não conformado', severity: 'WARNING' }];
        }
        return [];
      },
    },
  ],
};
