// ============================================
// REGRAS 171-175: SAÍDA DE IA
// ============================================
// Nível: ALTO | Tipo: WARNING

/**
 * Regras 171-175:
 * 171. Sanitização de output da IA
 * 172. Histórico limitado (sliding window)
 * 173. Temperature baixa
 * 174. Máscara de chaves em logs
 * 175. Cleanup de sessões inativas
 */

module.exports = {
  name: 'AI Output Security',
  rules: [
    {
      id: 'R171_OUTPUT_SANITIZATION',
      check: (fp, content) => {
        if (!content.includes('gemini') || !content.includes('response')) return null;
        const hasSanitize = content.includes('sanitize') || content.includes('dompurify') || content.includes('escape');
        if (!hasSanitize) return { msg: 'Output da IA deve ser sanitizado antes de enviar ao cliente', severity: 'BLOCK' };
        return null;
      },
    },
    {
      id: 'R172_CONTEXT_WINDOW',
      check: (fp, content) => {
        if (!content.includes('history') || !content.includes('message')) return null;
        const hasLimit = content.includes('limit') || content.includes('slice') || content.includes('last');
        if (!hasLimit) return { msg: 'Histórico de chat deve ter janela deslizante (últimas 4-5 msgs)', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R173_TEMPERATURE_LOCK',
      check: (fp, content) => {
        if (!content.includes('temperature') && !content.includes('topP')) return null;
        const hasLock = content.includes('0.1') || content.includes('0.2') || content.includes('0.3');
        if (!hasLock) return { msg: 'Temperature da IA deve ser baixa (0.1-0.3)', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R174_KEY_MASKING_LOGS',
      check: (fp, content) => {
        if (!content.includes('gemini') || !content.includes('error')) return null;
        const hasMask = content.includes('redact') || content.includes('mask') || content.includes('REDACTED');
        if (!hasMask) return { msg: 'Chaves de API devem ser mascaradas em logs de erro', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R175_AI_SOCKET_CLEANUP',
      check: (fp, content) => {
        if (!content.includes('socket') || !content.includes('ai')) return null;
        const hasCleanup = content.includes('close') || content.includes('disconnect') || content.includes('timeout');
        if (!hasCleanup) return { msg: 'Sessões de IA inativas devem ser desconectadas após 2min', severity: 'WARNING' };
        return null;
      },
    },
  ],
};
