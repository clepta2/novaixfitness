// src/services/index.ts
// Barrel principal - re-exports de todos os subdiretórios
// Mantém compatibilidade com imports existentes via '../services'

// ═══ Security ═══
export {
  logAction, ACTIONS,
  isBlocked, isBlockedFromPosting, isBlockedFromChatting, isBlockedFromLive, isBlockedFromEverything,
  checkRateLimit,
  blockUser, unblockUser, getUserBlocks, getActiveBlocks,
  flagContent, getFlaggedContent, reviewFlag,
  getTrustScore, getAllUsersWithTrust,
  getUserAuditHistory, searchAuditLogs,
  canPerformAction, guardedAction,
  logAuditAction, getAuditLogs, cleanupAuditLogs, checkSecurityAlerts,
  logLoginAttempt, logPayment, logInjectionAttempt, logRootDetected, logAdminAction,
  RATE_LIMIT_CONFIGS, getRateLimitHeaders,
  validateAsaasWebhook, validateWebhookIP, validateWebhookPayload,
  trackDeclinedCard, isCardSuspicious, isIpSuspicious, getCardStats, cleanOldRecords,
} from './security';
export type { RateLimitConfig } from './security';

// ═══ AI ═══
export {
  askGeminiCoach, saveChatMessage, getChatHistory, limitHistory, clearChatHistory, analyzeMealText,
  generateWithAI,
  buildWorkoutPrompt, buildNutritionPrompt, buildAnalysisPrompt,
  parseWorkoutRecommendation, parseNutritionAdvice, parseProgressAnalysis,
  getFallbackRecommendation, getFallbackNutrition, getFallbackAnalysis, getFallbackMotivation,
  COACH_SYSTEM_INSTRUCTION, NUTRITION_SYSTEM_INSTRUCTION, ANALYSIS_SYSTEM_INSTRUCTION,
  checkTokenLimit, incrementTokenUsage, estimateTokenCount, resetTokenUsage,
  getCachedResponse, cacheResponse, clearAICache,
  getMealLogs, saveMealLog,
} from './ai';

// ═══ Payment ═══
export {
  createCheckout, getPaymentStatus, cancelSubscription, PLANS,
  processWithFallback, processPayment, getAvailableGateways,
  tokenizeCard, validatePaymentToken, isTokenValid, sanitizeTokenForBackend,
  getUserPlan, checkFeatureAccess, getUsageStats,
  createSubscription, getSubscriptionHistory,
} from './payment';

// ═══ Analytics ═══
export {
  calculateMuscleBalance, getWorkoutAnalytics, getWeightHistory, getWorkoutFrequency,
  getMonthlyComparison, getUserWorkoutAnalytics, getNutritionAnalytics,
  getProgressAnalytics, getEngagementMetrics, generateAnalyticsReport,
  getCohortAnalysis, getUserRetention, getFunnelConversion, getUserSegmentation,
  getCohortRetention, getConversionFunnel,
  getPeriodStart, getPeriodDateBounds, processWorkoutAnalytics, calculateStreak,
  EVENTS, trackEvent, trackScreenView, trackWorkoutStarted, trackWorkoutCompleted,
  trackMealLogged, trackWaterLogged, trackWeightLogged, trackAchievementUnlocked,
  trackSubscriptionStarted, trackSearchPerformed, getEventStats, getUserFunnel, cleanup,
  setTrackerUser, EVENT_TYPES,
  getPostInsights, incrementViews, getTopPosts,
} from './analytics';
export type { PostInsight } from './analytics';

// ═══ Chat ═══
export {
  getOrCreateDirectConversation, createGroupConversation, getUserConversations, markAsRead, subscribeToConversation,
  getMessages, sendMessage, editMessage, deleteMessage, searchMessages,
  validateChatToken, validateChannelAccess, checkMessageRateLimit, sanitizeMessage,
  validatePageSize, safeSendMessage, safeGetMessages,
} from './chat';
export type { ConversationResult } from './chat';

// ═══ Workout ═══
export {
  saveCompleteWorkout,
  setupWorkoutReminders, sendStreakProtectionReminder, sendPostWorkoutReminder,
  sendWeeklySummaryReminder, cancelAllWorkoutReminders, getActiveReminders, scheduleHydrationReminder,
  requestNotificationPermissions,
  generateWorkoutPlan, saveWorkoutPlan, getUserWorkoutPlan, generateMealPlan,
  shouldAdaptPlan, analyzeUserPerformance, adaptWorkoutPlan, saveAdaptation, getAdaptationReason,
  loadWeeklyPlan, saveWeeklyPlan, updateDayPlan,
} from './workout';

// ═══ Social ═══
export {
  getFeed, createPost, deletePost, toggleLike, getComments, addComment, deleteComment,
  followUser, unfollowUser, getFollowers, getFollowing, isFollowing, shareWorkout, getTrendingPosts, searchUsers,
  getActiveStories, createStory, viewStory, deleteStory, getStoryViewers, cleanupExpiredStories,
  getDuels, acceptDuel, completeDuel, getActiveDuelsCount,
} from './social';
export type { Post, Comment, User } from './social';

// ═══ Notifications ═══
export {
  sendWorkoutCompletedNotification, sendStreakNotification, sendAchievementNotification,
  sendLevelUpNotification, sendNewWorkoutNotification, sendWeeklySummaryNotification,
  sendRestReminder, sendMotivationalNotification, sendWorkoutReminder,
  getNotifications, deleteNotification, markAllAsRead,
  setupWorkoutReminders as setupNotifReminders, sendStreakProtectionReminder as sendStreakProt,
  sendPostWorkoutReminder as sendPostWorkout, sendWeeklySummaryReminder as sendWeeklySum,
  scheduleHydrationReminder as scheduleHydr, cancelAllScheduled, cancelAllWorkoutReminders as cancelAllWork,
  getActiveReminders as getActiveNotif, setupNotificationListeners, saveNotificationToDB, getUnreadCount,
  getPrefsForSettings, setNotificationPref, getNotificationPrefs,
  registerForPushNotificationsAsync, addNotificationReceivedListener, addNotificationResponseListener,
  scheduleWorkoutReminder, scheduleWeeklyPlanReminder, scheduleRestDayReminder,
} from './notifications';

// ═══ Offline ═══
export {
  cacheWorkouts, getCachedWorkouts, cacheFavorites, getCachedFavorites,
  cacheProfile, getCachedProfile, cacheWorkoutDetail, getCachedWorkoutDetail, isWorkoutCached,
  cacheExerciseLogs, getCachedExerciseLogs,
  addPendingAction, getPendingActions, clearPendingAction, clearAllPendingActions,
  getLastSync, updateLastSync,
  isOnline,   cacheWorkoutsForUser, cacheDailyWorkout, getCachedDailyWorkout,
  cacheLibrary, getCachedLibrary, queueWorkoutCompletion, queueFavoriteAction,
  getPendingActionsCount,
  startAutoSync, stopAutoSync, forceSyncNow,
} from './offline';

// ═══ Gamification ═══
export {
  calculateLevel, addXP, getGamificationData, recordWorkoutCompletion, awardActionXP,
  updateMaxStreak, awardXP, checkAchievements, getRankings, getUserRank,
  getUserAchievements, getXPForNextLevel, getLevelProgress, getUserGamificationProfile,
} from './gamification';
