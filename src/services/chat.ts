// src/services/chat.ts
// Servico de chats - re-exportacao

export { getOrCreateDirectConversation, createGroupConversation, getUserConversations, markAsRead, subscribeToConversation, type ConversationResult } from './chat/chatConversations';
export { getMessages, sendMessage, editMessage, deleteMessage, searchMessages } from './chat/chatMessages';
export { validateChatToken, validateChannelAccess, checkMessageRateLimit, sanitizeMessage, validatePageSize, safeSendMessage, safeGetMessages } from './chat/chatSecurity';
