// ============================================
// REGRAS 166-170: SEGURANÇA DE IA
// ============================================
// Nível: CRÍTICO | Tipo: BLOCK

/**
 * Regras 166-170:
 * 166. System instruction isolada
 * 167. Input filtering (guardrails)
 * 168. Token-based rate limiting
 * 169. PII stripping
 * 170. API key no backend apenas
 */

module.exports = {
  name: 'AI Security',
  rules: [
    {
      id: 'R166_SYSTEM_INSTRUCTION',
      check: (fp, content) => {
        if (!content.includes('gemini') && !content.includes('genAI') && !content.includes('openai')) return null;
        const hasSystemInstruction = content.includes('systemInstruction') || content.includes('system_instruction') || content.includes('system prompt');
        if (!hasSystemInstruction) return { msg: 'IA deve ter system instruction isolada e imutável', severity: 'BLOCK' };
        return null;
      },
    },
    {
      id: 'R167_INPUT_FILTERING',
      check: (fp, content) => {
        // Only require input filtering on files that actually call AI APIs
        const usesAI = content.includes('gemini') || content.includes('genAI') || content.includes('openai') || content.includes('getGenerativeModel');
        if (!usesAI || !content.includes('chat') || !content.includes('message')) return null;
        const hasFilter = content.includes('filter') || content.includes('validate') || content.includes('sanitize') || content.includes('blacklist');
        if (!hasFilter) return { msg: 'Input do chat deve ter filtro antes de enviar para IA', severity: 'BLOCK' };
        return null;
      },
    },
    {
      id: 'R168_TOKEN_RATE_LIMIT',
      check: (fp, content) => {
        if (!content.includes('gemini') || !content.includes('token')) return null;
        const hasRateLimit = content.includes('rate') || content.includes('limit') || content.includes('quota');
        if (!hasRateLimit) return { msg: 'API de IA deve ter rate limiting por tokens', severity: 'BLOCK' };
        return null;
      },
    },
    {
      id: 'R169_PII_STRIpping',
      check: (fp, content) => {
        if (!content.includes('gemini') || !content.includes('context')) return null;
        const hasStrip = content.includes('strip') || content.includes('remove') || content.includes('sanitize') || content.includes('anonymize');
        if (!hasStrip) return { msg: 'Dados enviados para IA devem ter PII removido', severity: 'BLOCK' };
        return null;
      },
    },
    {
      id: 'R170_API_KEY_BACKEND_ONLY',
      check: (fp, content) => {
        if (!content.includes('GEMINI_API_KEY') && !content.includes('OPENAI_API_KEY')) return null;
        const isFrontend = fp.includes('components') || fp.includes('app/') || fp.includes('hooks');
        if (isFrontend) return { msg: 'Chave de API de IA NÃO pode estar no frontend', severity: 'BLOCK' };
        return null;
      },
    },
  ],
};
