// ============================================
// REGRAS 121-125: ALTA PERFORMANCE
// ============================================
// Nível: ALTO | Tipo: WARNING

/**
 * Regras 121-125:
 * 121. Contador Redis para likes/views
 * 122. Throttling de feed ao vivo
 * 123. Cursor-based pagination
 * 124. Connection reaping
 * 125. Cache-aside pattern
 */

module.exports = {
  name: 'High Performance',
  rules: [
    {
      id: 'R121_REDIS_COUNTERS',
      check: (fp, content) => {
        if (!content.includes('like') && !content.includes('view') && !content.includes('count')) return null;
        const hasRedis = content.includes('redis') || content.includes('INCR') || content.includes('cache');
        if (!hasRedis && content.includes('update')) return { msg: 'Contadores de alta frequência devem usar Redis', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R122_FEED_THROTTLING',
      check: (fp, content) => {
        if (!content.includes('feed') || !content.includes('realtime')) return null;
        const hasThrottle = content.includes('throttle') || content.includes('batch') || content.includes('debounce');
        if (!hasThrottle) return { msg: 'Feed ao vivo deve usar throttling/batching', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R123_CURSOR_PAGINATION',
      check: (fp, content) => {
        if (!content.includes('offset') || !content.includes('limit')) return null;
        const hasCursor = content.includes('cursor') || content.includes('after') || content.includes('before');
        if (!hasCursor && content.includes('offset')) return { msg: 'Use paginação baseada em cursor em vez de OFFSET', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R124_CONNECTION_REAPING',
      check: (fp, content) => {
        if (!content.includes('websocket') && !content.includes('socket')) return null;
        const hasReaping = content.includes('ping') || content.includes('pong') || content.includes('timeout') || content.includes('reap');
        if (!hasReaping) return { msg: 'WebSocket deve ter connection reaping', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R125_CACHE_ASIDE',
      check: (fp, content) => {
        if (!content.includes('supabase') || !content.includes('select')) return null;
        const hasCache = content.includes('cache') || content.includes('redis') || content.includes('ttl');
        if (!hasCache && content.includes('select')) return { msg: 'Dados estáticos devem usar cache-aside pattern', severity: 'WARNING' };
        return null;
      },
    },
  ],
};
