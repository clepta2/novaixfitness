// src/types/analytics.ts - Tipos de analytics, seguranca, moderacao, wearables

export type AnalyticsEvent = {
  id: string; event_name: string; event_data?: Record<string, unknown>;
  platform: string; app_version: string; created_at: string;
};

export type WorkoutAnalytics = {
  totalWorkouts: number; totalMinutes: number; avgDuration: number;
  streak: number; byDay: Record<string, number>;
};

export type NutritionAnalytics = {
  totalMeals: number; totalCalories: number; totalProtein: number;
  totalCarbs: number; totalFat: number; totalWater: number;
  daysLogged: number; avgCaloriesPerDay: number; avgWaterPerDay: number;
};

export type EngagementMetrics = {
  screenViews: number; featuresUsed: number; daysActive: number;
  engagementRate: number; totalEvents: number;
};

export type UserSegmentation = {
  segments: Record<string, unknown[]>;
  stats: {
    total: number; free: number; basic: number; premium: number;
    powerUsers: number; newUsers: number;
  };
};

export type ModerationResult = {
  clean: boolean; flags: ModerationFlag[];
  severity: 'clean' | 'moderate' | 'severe';
  suggestion: string | null;
};

export type ModerationFlag = {
  type: string; category?: string; word?: string;
  pattern?: string; severity: string;
};

export type ImageModerationResult = {
  clean: boolean; flags: { type: string; severity: string; message: string }[];
  severity: string;
};

export type TamperCheck = {
  type: string; detected: boolean; severity: string;
  details: Record<string, unknown>;
};

export type SecurityEvent = {
  id: string; event_type: string; severity: string;
  details?: Record<string, unknown>; platform: string;
  created_at: string;
};

export type PendingAction = {
  id: string; type: string; timestamp: number;
  [key: string]: unknown;
};

export type CachedEntry<T> = {
  data: T; timestamp: number;
};

export type HeartRateReading = {
  id: string; user_id: string; bpm: number; source: string;
  recorded_at: string;
};

export type DailySteps = {
  user_id: string; date: string; steps: number;
};

export type SleepData = {
  user_id: string; date: string; hours: number; quality: string | null;
};

export type DailyWearableSummary = {
  heartRate: number | null; calories: number;
  steps: number; sleepHours: number; sleepQuality: string | null;
};

export type AIRecommendation = {
  type: string; title: string; description: string;
  confidence: number; data?: Record<string, unknown>;
};

export type CoachMessage = {
  id: string; user_id: string; role: 'user' | 'assistant';
  content: string; created_at: string;
};
