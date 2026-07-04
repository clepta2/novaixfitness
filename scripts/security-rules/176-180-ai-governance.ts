// ============================================
// REGRAS 176-180: GOVERNANÇA DE IA
// ============================================
// Nível: ALTO | Tipo: WARNING

/**
 * Regras 176-180:
 * 176. LLM-as-a-Judge para validação
 * 177. Prompt poisoning prevention (RAG)
 * 178. Data drift detection
 * 179. Semantic caching
 * 180. Session reset (rollback)
 */

module.exports = {
  name: 'AI Governance',
  rules: [
    {
      id: 'R176_LLM_JUDGE',
      check: (fp, content) => {
        if (!content.includes('gemini') || !content.includes('response')) return null;
        const hasJudge = content.includes('judge') || content.includes('validate') || content.includes('check');
        if (!hasJudge) return { msg: 'Respostas críticas devem passar por validação secundária', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R177_PROMPT_POISONING',
      check: (fp, content) => {
        if (!content.includes('rag') && !content.includes('database')) return null;
        const hasProtection = content.includes('xml') || content.includes('tag') || content.includes('isolate');
        if (!hasProtection) return { msg: 'Dados de RAG devem ser isolados em tags XML', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R178_DATA_DRIFT',
      check: (fp, content) => {
        if (!content.includes('refusal') || !content.includes('log')) return null;
        const hasMonitor = content.includes('monitor') || content.includes('track') || content.includes('count');
        if (!hasMonitor) return { msg: 'Respostas de recusa devem ser monitoradas', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R179_SEMANTIC_CACHE',
      check: (fp, content) => {
        if (!content.includes('gemini') || !content.includes('chat')) return null;
        const hasCache = content.includes('cache') || content.includes('redis') || content.includes('similar');
        if (!hasCache) return { msg: 'Perguntas repetidas devem usar cache semântico', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R180_SESSION_RESET',
      check: (fp, content) => {
        if (!content.includes('chat') || !content.includes('clear')) return null;
        const hasReset = content.includes('reset') || content.includes('new') || content.includes('clear');
        if (!hasReset) return { msg: 'Chat deve ter botão de "Nova Conversa" para limpar contexto', severity: 'WARNING' };
        return null;
      },
    },
  ],
};
