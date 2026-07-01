// ============================================
// REGRAS 61-65: COMPLIANCE AVANÇADO
// ============================================
// Nível: ALTO | Tipo: WARNING

/**
 * OBJETIVO: Compliance financeiro e antifraude avançado.
 */

module.exports = {
  name: 'Advanced Compliance',
  version: '1.0.0',
  severity: 'WARNING',
  description: 'Compliance financeiro avançado',

  rules: [
    {
      id: 'R61_VELOCITY_ABUSE',
      name: 'Velocity Abuse Detection',
      severity: 'WARNING',
      check: (filePath, content) => {
        if (!content.includes('checkout') && !content.includes('payment')) return [];
        const hasVelocity = content.includes('velocity') || content.includes('rate') || content.includes('throttle');
        if (!hasVelocity) {
          return [{ file: filePath, line: 0, rule: 'R61_VELOCITY_ABUSE', message: 'Checkout sem detecção de velocity abuse', severity: 'WARNING' }];
        }
        return [];
      },
    },
    {
      id: 'R62_SELF_PAYMENT',
      name: 'Self-Payment Prevention',
      severity: 'WARNING',
      check: (filePath, content) => {
        if (!content.includes('payment') || !content.includes('transfer')) return [];
        const hasSelfCheck = content.includes('self') || content.includes('same') || content.includes('identical');
        if (!hasSelfCheck) {
          return [{ file: filePath, line: 0, rule: 'R62_SELF_PAYMENT', message: 'Transferências sem verificação de self-payment', severity: 'WARNING' }];
        }
        return [];
      },
    },
    {
      id: 'R63_GEO_FRAUD',
      name: 'Geo-Fraud Detection',
      severity: 'WARNING',
      check: (filePath, content) => {
        if (!content.includes('payment') && !content.includes('card')) return [];
        const hasGeo = content.includes('country') || content.includes('geo') || content.includes('location');
        if (!hasGeo) {
          return [{ file: filePath, line: 0, rule: 'R63_GEO_FRAUD', message: 'Pagamentos sem verificação geográfica para fraude', severity: 'WARNING' }];
        }
        return [];
      },
    },
    {
      id: 'R64_LOG_MASKING_FINANCIAL',
      name: 'Financial Log Masking',
      severity: 'WARNING',
      check: (filePath, content) => {
        if (!content.includes('cpf') && !content.includes('cnpj') && !content.includes('pix_key')) return [];
        if (content.includes('console.log') && (content.includes('cpf') || content.includes('pix'))) {
          return [{ file: filePath, line: 0, rule: 'R64_LOG_MASKING_FINANCIAL', message: 'Dados financeiros em logs sem ofuscação', severity: 'WARNING' }];
        }
        return [];
      },
    },
    {
      id: 'R65_KILL_SWITCH_FINANCIAL',
      name: 'Financial Kill Switch',
      severity: 'WARNING',
      check: (filePath, content) => {
        if (!filePath.includes('payment') && !filePath.includes('checkout') && !filePath.includes('asaas')) return [];
        const hasKillSwitch = content.includes('KILL_SWITCH') || content.includes('FINANCIAL_KILL');
        if (!hasKillSwitch) {
          return [{ file: filePath, line: 0, rule: 'R65_KILL_SWITCH_FINANCIAL', message: 'Sistema financeiro sem kill switch de emergência', severity: 'WARNING' }];
        }
        return [];
      },
    },
  ],
};
