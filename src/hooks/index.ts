// src/hooks/index.ts
// Exportação centralizada de hooks - NOVAIX FITNESS

// Core hooks
export { useSupabaseData } from './useSupabaseData';
export { default as useWorkoutTimer } from './useWorkoutTimer';
export { useNetworkStatus } from './useNetworkStatus';
export { useLibraryData } from './useLibraryData';
export { useDebounce, useDebouncedCallback } from './useDebounce';
export { useRealtimePosts } from './useRealtimePosts';
export { useRealtimeComments } from './useRealtimeComments';
export { useRealtimeLikes } from './useRealtimeLikes';

// Auth hooks
export { default as useLogin } from './useLogin';
export { useRegister } from './useRegister';

// Workout hooks
export { default as useWorkoutPlayer } from './useWorkoutPlayer';
export { useWorkoutDetail } from './useWorkoutDetail';
export { useWorkoutHistory } from './useWorkoutHistory';
export { useWorkoutForm } from './useWorkoutForm';
export { useCreateWorkout } from './useCreateWorkout';
export { default as usePlayerList } from './usePlayerList';

// Gamification hooks
export { useGamification } from './useGamification';

// Subscription hooks
export { useSubscription } from './useSubscription';

// Data hooks
export { useHomeData } from './useHomeData';
export { useFeedData } from './useFeedData';
export { useFeedStories } from './useFeedStories';
export { useMarketplaceData } from './useMarketplaceData';
export { useWeeklyProgress } from './useWeeklyProgress';
export { useGoals } from './useGoals';

// Profile hooks
export { useProfileEdit } from './useProfileEdit';
export { useProgressPhotos } from './useProgressPhotos';

// Feature hooks
export { useAnalytics } from './useAnalytics';
export { useCohortAnalysis as useAnalyticsAdmin } from './useAnalyticsAdmin';
export { useAnalyticsData } from './useAnalyticsData';
export { useChatCoach } from './useChatCoach';
export { useExportData } from './useExportData';
export { useGuidedAssessment } from './useGuidedAssessment';
export { useHaptic } from './useHaptic';
export { useIntro } from './useIntro';
export { useNotificationPrefs } from './useNotificationPrefs';
export { default as useOfflineStatus } from './useOfflineStatus';
export { default as usePaymentProcessing } from './usePaymentProcessing';
export { default as useProcessing } from './useProcessing';
export { useRateLimit } from './useRateLimit';
export { useRealNotifications } from './useRealNotifications';
export { useReelsFeed } from './useReelsFeed';
export { useResponsive } from './useResponsive';
export { useScreenLimits } from './useScreenLimits';
export { useSecurity } from './useSecurity';
export { useServiceCall } from './useServiceCall';
export { useSocialFeed } from './useSocialFeed';
export { useTrendingContent } from './useTrendingContent';
export { useTutorial } from './useTutorial';
export { useVacationMode } from './useVacationMode';

// NEW: Performance & Optimization hooks
export { useAbortController } from './useAbortController';
export { useCacheAside, clearCache } from './useCacheAside';
export { useCachedQuery } from './useCachedQuery';
export { usePerformanceMonitor, useMeasureTime } from './usePerformanceMonitor';
export { useMemoryOptimization } from './useMemoryOptimization';
export { useRetry } from './useRetry';
export { useLogger } from './useLogger';

// NEW: UI hooks
export { useDebouncedValue } from './useDebouncedValue';
export { useOptimistic } from './useOptimistic';
export { useInfiniteScroll } from './useInfiniteScroll';
export { useRealtimeSubscription } from './useRealtimeSubscription';

// NEW: Form & Validation hooks
export { useFormValidation, validators } from './useFormValidation';

// NEW: Feature hooks
export { useChallenge } from './useChallenge';

// NEW: Utility hooks
export { useLazyLoad } from './useLazyLoad';
export { useErrorBoundary } from './useErrorBoundary';
export { usePrevious } from './usePrevious';
export { useUpdateEffect } from './useUpdateEffect';
export { useCounter } from './useCounter';
