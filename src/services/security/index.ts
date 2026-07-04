// src/services/security/index.ts
// Exportações centralizadas de segurança

export { logAction, ACTIONS } from './audit';
export { isBlocked, isBlockedFromPosting, isBlockedFromChatting, isBlockedFromLive, isBlockedFromEverything } from './blocks';
export { checkRateLimit } from './rateLimit';
export { blockUser, unblockUser, getUserBlocks, getActiveBlocks } from './userBlocks';
export { flagContent, getFlaggedContent, reviewFlag } from './moderation';
export { getTrustScore, getAllUsersWithTrust } from './trust';
export { getUserAuditHistory, searchAuditLogs } from './auditHistory';
export { canPerformAction, guardedAction } from './middleware';
export { logAction as logAuditAction, getAuditLogs, cleanupAuditLogs, checkSecurityAlerts } from './auditLog';
export { logLoginAttempt, logPayment, logInjectionAttempt, logRootDetected, logAdminAction } from './auditLogHelpers';
export { RATE_LIMIT_CONFIGS, getRateLimitHeaders } from './rateLimitConfigs';
export type { RateLimitConfig } from './rateLimitConfigs';
export { validateAsaasWebhook, validateWebhookIP, validateWebhookPayload } from './webhookValidator';
export { trackDeclinedCard, isCardSuspicious, isIpSuspicious, getCardStats, cleanOldRecords } from './cardMonitoring';
