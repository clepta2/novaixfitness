// ============================================
// REGRAS 66-71: ANÁLISE COMPORTAMENTAL E ALTA ESCALA
// ============================================
// Nível: CRÍTICO | Tipo: BLOCK

/**
 * OBJETIVO: Proteger contra botnets, circuit breaker, proxies anônimos.
 *
 * Regras 66-71:
 * 66. Rate Limit Mandatório em rotas críticas
 * 67. Detecção de anomalias comportamentais
 * 68. Circuit Breaker para APIs externas
 * 69. Bloqueio de proxies/VPNs em rotas financeiras
 * 70. Validação JA3 fingerprint
 * 71. Filas de processamento assíncrono
 */

module.exports = {
  name: 'Behavioral Analysis & High-Scale',
  version: '1.0.0',
  severity: 'BLOCK',
  description: 'Análise comportamental e mitigação de alta escala',

  rules: [
    // R66: Rate Limit Mandatório
    {
      id: 'R66_RATE_LIMIT_MANDATORY',
      name: 'Rate Limit Mandatory',
      severity: 'BLOCK',
      check: (filePath, content) => {
        if (!filePath.includes('route') && !filePath.includes('router')) return [];
        if (!content.includes('post') && !content.includes('put') && !content.includes('delete')) return [];

        const isAuthOrFinance = /auth|login|payment|checkout|asaas|webhook/i.test(content);
        const hasRateLimit = content.includes('rateLimit') || content.includes('rate-limit') || content.includes('limiter') || content.includes('throttle');

        if (isAuthOrFinance && !hasRateLimit) {
          return [{ file: filePath, line: 0, rule: 'R66_RATE_LIMIT_MANDATORY', message: 'Rota crítica sem rate limiting obrigatório', severity: 'BLOCK' }];
        }
        return [];
      },
    },

    // R67: Detecção de Anomalias Comportamentais
    {
      id: 'R67_BEHAVIORAL_ANOMALY',
      name: 'Behavioral Anomaly Detection',
      severity: 'WARNING',
      check: (filePath, content) => {
        if (!content.includes('api') && !content.includes('endpoint')) return [];
        const hasBehaviorCheck = content.includes('behavior') || content.includes('anomaly') || content.includes('baseline') || content.includes('pattern');
        if (!hasBehaviorCheck && content.includes('supabase')) {
          return [{ file: filePath, line: 0, rule: 'R67_BEHAVIORAL_ANOMALY', message: 'Sem detecção de anomalias comportamentais', severity: 'WARNING' }];
        }
        return [];
      },
    },

    // R68: Circuit Breaker
    {
      id: 'R68_CIRCUIT_BREAKER',
      name: 'Circuit Breaker',
      severity: 'WARNING',
      check: (filePath, content) => {
        if (!content.includes('asaas') && !content.includes('external') && !content.includes('third')) return [];
        const hasCircuitBreaker = content.includes('circuit') || content.includes('breaker') || content.includes('fallback') || content.includes('retry');
        if (!hasCircuitBreaker) {
          return [{ file: filePath, line: 0, rule: 'R68_CIRCUIT_BREAKER', message: 'Chamada a API externa sem circuit breaker', severity: 'WARNING' }];
        }
        return [];
      },
    },

    // R69: Bloqueio de Proxies/VPNs
    {
      id: 'R69_PROXY_BLOCK',
      name: 'Proxy/VPN Block',
      severity: 'WARNING',
      check: (filePath, content) => {
        if (!content.includes('payment') && !content.includes('checkout') && !content.includes('asaas')) return [];
        const hasProxyCheck = content.includes('proxy') || content.includes('vpn') || content.includes('tor') || content.includes('anonym');
        if (!hasProxyCheck) {
          return [{ file: filePath, line: 0, rule: 'R69_PROXY_BLOCK', message: 'Rotas financeiras sem verificação de proxy/VPN', severity: 'WARNING' }];
        }
        return [];
      },
    },

    // R70: JA3 Fingerprint
    {
      id: 'R70_JA3_FINGERPRINT',
      name: 'JA3 Fingerprint',
      severity: 'WARNING',
      check: (filePath, content) => {
        if (!content.includes('tls') && !content.includes('ssl') && !content.includes('fingerprint')) return [];
        const hasJA3 = content.includes('ja3') || content.includes('fingerprint') || content.includes('clientHello');
        if (!hasJA3) {
          return [{ file: filePath, line: 0, rule: 'R70_JA3_FINGERPRINT', message: 'Sem validação de JA3 fingerprint para detectar Burp Suite', severity: 'WARNING' }];
        }
        return [];
      },
    },

    // R71: Filas de Processamento
    {
      id: 'R71_ASYNC_QUEUES',
      name: 'Async Processing Queues',
      severity: 'WARNING',
      check: (filePath, content) => {
        if (!content.includes('pdf') && !content.includes('report') && !content.includes('export') && !content.includes('upload')) return [];
        const hasQueue = content.includes('queue') || content.includes('worker') || content.includes('bull') || content.includes('rabbit');
        if (!hasQueue && content.includes('await')) {
          return [{ file: filePath, line: 0, rule: 'R71_ASYNC_QUEUES', message: 'Tarefa pesada processada síncronamente. Use fila de mensageria', severity: 'WARNING' }];
        }
        return [];
      },
    },
  ],
};
