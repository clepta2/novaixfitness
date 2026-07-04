// ============================================
// REGRAS 81-85: SEGURANÇA DO CHAT
// ============================================
// Nível: ALTO | Tipo: WARNING

/**
 * Regras 81-85:
 * 81. Autenticação JWT no WebSocket Handshake
 * 82. Validação de escopo de canal
 * 83. Rate limiting para mensagens
 * 84. Sanitização de texto em tempo real
 * 85. Paginação no histórico
 */

module.exports = {
  name: 'Chat Security',
  rules: [
    {
      id: 'R81_WS_AUTH',
      check: (fp, content) => {
        // Só verificar arquivos que implementam WebSocket real
        const isWebSocketFile = content.includes('socket.io') || content.includes('WebSocket') || content.includes('ws://') || content.includes('wss://');
        if (!isWebSocketFile) return null;
        const hasAuth = content.includes('jwt') || content.includes('token') || content.includes('auth');
        if (!hasAuth) return { msg: 'WebSocket deve exigir autenticação JWT no handshake', severity: 'BLOCK' };
        return null;
      },
    },
    {
      id: 'R82_CHANNEL_SCOPE',
      check: (fp, content) => {
        // Só verificar arquivos que implementam canais de chat
        const isChannelFile = content.includes('channel') || content.includes('subscribe') || content.includes('room');
        if (!isChannelFile) return null;
        const hasValidation = content.includes('validate') || content.includes('permission') || content.includes('scope') || content.includes('auth');
        if (!hasValidation) return { msg: 'Canais de chat devem validar permissão do usuário', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R83_CHAT_RATE_LIMIT',
      check: (fp, content) => {
        if (!fp.includes('chat') || !fp.includes('message')) return null;
        const hasRate = content.includes('rate') || content.includes('limit') || content.includes('throttle');
        if (!hasRate) return { msg: 'Chat deve ter rate limiting por mensagem', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R84_CHAT_SANITIZE',
      check: (fp, content) => {
        if (!fp.includes('chat') || !fp.includes('message')) return null;
        const hasSanitize = content.includes('sanitize') || content.includes('escape') || content.includes('strip');
        if (!hasSanitize) return { msg: 'Mensagens de chat devem ser sanitizadas contra XSS', severity: 'BLOCK' };
        return null;
      },
    },
    {
      id: 'R85_CHAT_PAGINATION',
      check: (fp, content) => {
        if (!fp.includes('chat') || !fp.includes('history')) return null;
        const hasPagination = content.includes('limit') || content.includes('cursor') || content.includes('offset');
        if (!hasPagination) return { msg: 'Histórico de chat deve ter paginação', severity: 'WARNING' };
        return null;
      },
    },
  ],
};
