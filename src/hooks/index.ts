// src/hooks/index.ts - Main barrel file for all hooks
// Re-exports everything from grouped sub-barrel files

// Core utility hooks
export {
  useAbortController,
  useAsyncOperation,
  useCacheAside,
  useStaticCache,
  useMountedRef,
  useServiceCall,
  useRetryWithFallback,
  useResponsive,
  useIntro,
  INTRO_SLIDES,
  useCreateWorkout,
  LEVEL_COLORS,
  LEVELS,
  STEPS,
  useTranslation,
  useDadosFisicos,
  GENDERS,
  isDateValid,
  useDisponibilidade,
  useGuidedAssessment,
  useScreenLimits,
  SCREEN_LIMITS,
  useGoals,
  useExportData,
  EXPORT_OPTIONS,
  ExportOption,
  useErrorBoundary,
  withErrorBoundary,
} from './_core';

// Analytics hooks
export {
  useAnalytics,
  useAnalyticsData,
  useCohortAnalysis,
  useEngagementMetrics,
  useNutritionAnalytics,
  useProgressAnalytics,
  useUserRetention,
  useUserSegmentation,
  useWorkoutAnalytics,
  useDashboard,
} from './_analytics';

// Workout, Player & Timer hooks
export {
  useWorkoutHistory,
  Period,
  PERIODS,
  useWorkoutDetail,
  useWorkoutTimerTypes,
  ProgressResult,
  SetCompleteResult,
  SetLog,
  SkipResult,
  TimerPhase,
  UseWorkoutTimerReturn,
  usePlayerGestures,
  useWeeklyProgress,
} from './_workout';

// Chat, Social & Feed hooks
export {
  useChatCoach,
  useSocialFeed,
  useFollow,
  usePostComments,
  useUserSearch,
  useFeedData,
  FeedPost,
  useReelsFeed,
  Reel,
  useTrendingContent,
  SuggestedUser,
  TrendingHashtag,
  TrendingPost,
  useRealtimePosts,
  useRealtimeComments,
  useRealtimeLikes,
} from './_chat-social';

// Auth, Security & Subscription hooks
export {
  useLogin,
  useRegister,
  formatPhone,
  validatePhone,
  useSecurity,
  useSubscription,
  useCoupon,
  useReferral,
  useProfileEdit,
  useProgressPhotos,
} from './_auth-security';

// Data, Notifications & Processing hooks
export {
  useRealNotifications,
  NotificationItem,
  useNotificationPrefs,
  useProcessing,
  useGamification,
  useAchievements,
  useRankings,
  useHealthIntegration,
} from './_data';

// UI & Misc hooks (from .js files)
export {
  useProfile,
  useSupabaseData,
  useWorkoutTimer,
  useNetworkStatus,
  useWorkoutTags,
  useLibraryData,
  useOfflineData,
  usePaywallPayment,
  useDebounce,
  useDebouncedCallback,
} from './_ui';
