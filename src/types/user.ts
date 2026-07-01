// src/types/user.ts - Tipos de usuario, auth, onboarding

import type { SubscriptionStatus } from './payment';

export type SupabaseUser = { id: string; email: string; user_metadata: Record<string, unknown> };

export type Profile = {
  id: string; name: string; avatar_url: string | null; level: number; xp: number;
  total_workouts: number; current_streak: number; best_streak: number;
  subscription_status: SubscriptionStatus; subscription_plan: string | null; meal_streak: number;
  app_settings?: {
    themeMode?: string;
    darkMode?: boolean;
    [key: string]: unknown;
  };
  current_step?: string;
  [key: string]: unknown;
};

export type OnboardingData = {
  user_id: string; goal?: string; age_range?: string; gender?: string; body_model?: string;
  experience_level?: string; days_per_week?: number; location?: string; preferred_time?: string;
  stress_level?: string; sleep_quality?: string; preferred_muscles?: string[];
  dietary_restrictions?: string[]; instructor_type?: string; referral_source?: string;
  age?: number; weight?: number; height?: number; birth_date?: string;
  gymType?: string; availableDays?: number; sessionDuration?: number;
  allergies?: string; restrictions?: string;
  [key: string]: unknown;
};

export type DailyCheckIn = {
  id: string; user_id: string; check_in_date: string; streak_day: number; xp_awarded: number;
};

export type NotificationType = 'new_follower' | 'workout_reminder' | 'achievement_unlocked' | 'comment' | 'like' | 'live_started' | 'system';

export type Notification = {
  id: string; user_id: string; type: NotificationType; title: string;
  body: string; data?: Record<string, unknown>; read: boolean; created_at: string;
};

export type ProgressPhoto = {
  id: string; user_id: string; image_url: string;
  photo_type: 'front' | 'side' | 'back'; taken_at: string;
};

export type BodyMeasurement = {
  id: string; user_id: string; measurement_type: string;
  value: number; unit: string; measured_at: string;
};
