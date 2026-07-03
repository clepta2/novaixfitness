// src/services/chat/index.ts
// Exportações centralizadas de chat

export {
  getOrCreateDirectConversation,
  createGroupConversation,
  getUserConversations,
  markAsRead,
  subscribeToConversation,
  type ConversationResult,
} from './chatConversations';

export { getMessages, sendMessage, editMessage, deleteMessage, searchMessages } from './chatMessages';

export {
  validateChatToken,
  validateChannelAccess,
  checkMessageRateLimit,
  sanitizeMessage,
  validatePageSize,
  safeSendMessage,
  safeGetMessages,
} from './chatSecurity';
