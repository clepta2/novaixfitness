// src/services/analytics/index.ts
// Exportações centralizadas de analytics

export {
  calculateMuscleBalance,
  getWorkoutAnalytics,
  getWeightHistory,
  getWorkoutFrequency,
  getMonthlyComparison,
  getUserWorkoutAnalytics,
  getNutritionAnalytics,
  getProgressAnalytics,
  getEngagementMetrics,
  generateAnalyticsReport,
} from './analytics';

export {
  getCohortAnalysis,
  getUserRetention,
  getFunnelConversion,
  getUserSegmentation,
  getCohortRetention,
  getConversionFunnel,
} from './analytics-admin';

export {
  getPeriodStart,
  getPeriodDateBounds,
  processWorkoutAnalytics,
  calculateStreak,
} from './analytics-helpers';

export {
  EVENTS,
  trackEvent,
  trackScreenView,
  trackWorkoutStarted,
  trackWorkoutCompleted,
  trackMealLogged,
  trackWaterLogged,
  trackWeightLogged,
  trackAchievementUnlocked,
  trackSubscriptionStarted,
  trackSearchPerformed,
  getEventStats,
  getUserFunnel,
  cleanup,
} from './analytics-tracker';

export {
  setTrackerUser,
  EVENT_TYPES,
} from './eventTracker';

export {
  type PostInsight,
  getPostInsights,
  incrementViews,
  getTopPosts,
} from './postAnalytics';
