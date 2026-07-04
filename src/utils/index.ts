// src/utils/index.ts
// Exportações centralizadas de utilitários - NOVAIX FITNESS

// Security
export {
  encrypt,
  decrypt,
  deriveKey,
  encryptSensitiveData,
  decryptSensitiveData,
  generateIdempotencyKey,
  validateIdempotencyKey,
  generateChallengeKey,
  generateRefundKey,
  generateSubscriptionKey,
  generateWebhookKey,
  isEventProcessed,
  markEventProcessed,
  signWebhook,
  verifyWebhook,
  extractWebhookSignature,
  validateWebhookRequest,
  timingSafeEqual,
  timingSafeStringEqual,
  sanitizeString,
  detectInjection,
  sanitizeObject,
  sanitizeUrl,
  sanitizeHeaders,
  truncateInput,
  isAllowed,
  recordAttempt,
  resetLimiter,
  resetAllLimiters,
  LIMITS,
} from './security/index';

// AI
export { filterInput, detectPromptInjection, sanitizeForAI } from './ai/index';
export { removePII, maskSensitiveData, sanitizeProfileForAI } from './ai/index';
export { sanitizeOutput, detectHarmfulContent, sanitizeErrorForLog, escapeHTML } from './ai/index';
export { sanitizeAIOutput, isAIOutputSafe } from './aiSanitize';

// Payment
export {
  withDoubleClickProtection,
  isPaymentLocked,
  releasePaymentLock,
  getLockRemainingMs,
  cleanExpiredLocks,
  sanitizeCardData,
  logPaymentEvent,
  logTransaction,
  logSecurityEvent,
} from './payment/index';

// Async
export { tryIf, tryIfSilent, tryIfCached } from './async/index';
export { enqueue, dequeue, processQueue, getQueueSize, clearQueue } from './async/index';
export { calculateBackoff, resetBackoff, getCurrentInterval } from './async/index';
export { safeAsync, retryAsync, assertDefined, formatError, protectedCallback } from './async/index';
export { createServiceGuard } from './async/index';
export { retry, retryWithTimeout, retryWithFallback, resetCircuitBreaker } from './async/retry';

// Cache
export {
  CACHE_TTL,
  CACHE_KEYS,
  setCache,
  getCache,
  removeCache,
  clearAllCache,
  cachedFetch,
  cacheByType,
  getCachedByType,
  getCacheSize,
  getCacheInfo,
  clearWorkoutCache,
} from './cache/index';
export {
  useDeepMemo,
  useStableCallback,
  useFilteredList,
  useSortedList,
  useGroupedList,
  deepCompare,
} from './cache/index';
export { memoizeWithTTL, throttleWithTrailing, dedupeAsync, measureSync, measureAsync } from './cache/index';
export { CacheManager, cacheManager, getCachedData, setCachedData, clearCachedData } from '../services/cache/CacheManager';

// Sanitize
export { sanitizeForLog, anonymizeUserId, maskPII } from './sanitize/index';
export {
  maskCPF,
  maskEmail,
  maskPhone,
  maskName,
  maskCreditCard,
  maskPIX,
  maskAddress,
  autoMaskPII,
} from './sanitize/index';

// Validation (NEW)
export {
  validateEmail,
  validateCPF,
  validatePhone,
  validatePassword,
  validateName,
  validateWeight,
  validateHeight,
  validateAge,
  sanitizeInput,
  sanitizeSQL,
  sanitizeXSS,
  validateAll,
  createValidator,
} from './validation';

// UI
export {
  useFadeInUp,
  useStaggeredEntry,
  useAnimatedNumber,
  useAnimatedProgress,
  usePulseGlow,
  useCardPress,
  useCountUp,
  useShimmer,
  usePageTransition,
  useConfetti,
  useShake,
} from './ui/index';
export { SCREEN_WIDTH, SCREEN_HEIGHT, scale } from './ui/index';
export {
  MIN_TOUCH_TARGET,
  isScreenReaderEnabled,
  isReduceMotionEnabled,
  announceForAccessibility,
  setAccessibilityFocus,
  getAccessibilityProps,
  ROLES,
  getState,
  ensureTouchTarget,
  getHint,
  getContrastRatio,
  meetsWCAG_AA,
  meetsWCAG_AAA,
  suggestAccessibleColor,
  meetsTouchTarget,
} from './ui/index';

// Logger (NEW)
export { logger, log } from './logger';

// Formatting (NEW)
export {
  formatNumber,
  formatCurrency,
  formatPercentage,
  formatWeight,
  formatHeight,
  formatTimer,
  formatDurationText,
  truncate,
  capitalize,
  getInitials,
  formatRelativeTime,
} from './formatting';

// Platform (NEW)
export {
  isIOS,
  isAndroid,
  isWeb,
  screenWidth,
  screenHeight,
  verticalScale,
  moderateScale,
  pxToDp,
  dpToPx,
  isSmallScreen,
  isLargeScreen,
  isTablet,
  getResponsiveDimensions,
} from './platform';

// Storage (NEW)
export { storage } from './storage';

// Performance (NEW)
export {
  performanceMonitor,
  debounce,
  throttle,
} from './performance';
