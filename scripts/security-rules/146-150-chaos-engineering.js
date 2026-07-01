// ============================================
// REGRAS 146-150: CHAOS ENGINEERING
// ============================================
// Nível: ALTO | Tipo: WARNING

/**
 * Regras 146-150:
 * 146. Graceful degradation
 * 147. Chaos testing
 * 148. Adaptive throttling
 * 149. Behavioral WAF
 * 150. Immutable audit logs
 */

module.exports = {
  name: 'Chaos Engineering',
  rules: [
    {
      id: 'R146_GRACEFUL_DEGRADATION',
      check: (fp, content) => {
        if (!content.includes('fallback') || !content.includes('degrade')) return null;
        const hasGraceful = content.includes('graceful') || content.includes('priority') || content.includes('essential');
        if (!hasGraceful) return { msg: 'Sistema deve degradar graciosamente mantendo funções vitais', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R147_CHAOS_TESTING',
      check: (fp, content) => {
        if (!content.includes('test') || !content.includes('fail')) return null;
        const hasChaos = content.includes('chaos') || content.includes('fault') || content.includes('inject');
        if (!hasChaos) return { msg: 'Testes devem incluir cenários de falha deliberada', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R148_ADAPTIVE_THROTTLING',
      check: (fp, content) => {
        if (!content.includes('rate') || !content.includes('limit')) return null;
        const hasAdaptive = content.includes('adaptive') || content.includes('dynamic') || content.includes('health');
        if (!hasAdaptive) return { msg: 'Rate limiting deve ser adaptativo à saúde do sistema', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R149_BEHAVIORAL_WAF',
      check: (fp, content) => {
        if (!content.includes('waf') || !content.includes('cloudflare')) return null;
        const hasBehavioral = content.includes('behavior') || content.includes('fingerprint') || content.includes('ja3');
        if (!hasBehavioral) return { msg: 'WAF deve analisar comportamento, não apenas IP', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R150_IMMUTABLE_AUDIT',
      check: (fp, content) => {
        if (!content.includes('audit') || !content.includes('log')) return null;
        const hasImmutability = content.includes('immutable') || content.includes('append-only') || content.includes('RLS');
        if (!hasImmutability) return { msg: 'Logs de auditoria devem ser imutáveis (INSERT only)', severity: 'WARNING' };
        return null;
      },
    },
  ],
};
