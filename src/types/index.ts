// src/types/index.ts
// Tipos compartilhados do projeto - NOVAIX FITNESS

// Re-exports from sub-modules
export * from './workout';
export * from './social';
export * from './user';
export * from './payment';
export * from './live';
export * from './analytics';
export * from './gamification';
export * from './creator';
export * from './common';

// ─── User & Auth ───────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  created_at: string;
  updated_at: string;
}

export interface Profile extends User {
  total_xp: number;
  total_workouts: number;
  total_minutes: number;
  max_streak: number;
  current_step: string;
  app_settings?: AppSettings;
  subscription_plan?: string;
  [key: string]: any;
}

export interface AppSettings {
  themeMode?: 'dark' | 'light' | 'system';
  darkMode?: boolean;
  notifications?: NotificationSettings;
  language?: string;
}

export interface NotificationSettings {
  workout_reminder?: boolean;
  workout_completed?: boolean;
  new_workout?: boolean;
  streak?: boolean;
  achievement?: boolean;
  level_up?: boolean;
  weekly_plan?: boolean;
  weekly_summary?: boolean;
  rest_day?: boolean;
  motivational?: boolean;
  system?: boolean;
}

// ─── Workout ───────────────────────────────────────────────
export interface Workout {
  id: string;
  name: string;
  category: string;
  level: string;
  duration: number;
  exercises: Exercise[];
  description?: string;
  video_url?: string;
  thumbnail_url?: string;
  created_at: string;
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  equipment: string;
  description?: string;
  video_url?: string;
  sets?: number;
  reps?: string;
  rest?: number;
}

export interface UserWorkout {
  id: string;
  user_id: string;
  workout_id: string;
  completed: boolean;
  completed_at?: string;
  duration?: number;
  workout?: Workout;
}

export interface WorkoutLog {
  id: string;
  user_workout_id: string;
  exercise_name: string;
  set_number: number;
  reps_done: number;
  weight_kg?: number;
  recorded_at: string;
}

// ─── Nutrition ─────────────────────────────────────────────
export interface MealLog {
  id: string;
  user_id: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  logged_at: string;
}

export interface WaterLog {
  id: string;
  user_id: string;
  amount_ml: number;
  logged_at: string;
}

export interface MealPlan {
  week: DayPlan[];
  summary?: MealPlanSummary;
}

export interface DayPlan {
  day: string;
  meals: Meal[];
  totalCalories: number;
}

export interface Meal {
  type: string;
  name: string;
  items: string[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MealPlanSummary {
  avgCalories: number;
  avgProtein: number;
  avgCarbs: number;
  avgFat: number;
  tips: string[];
}

// ─── Progress ──────────────────────────────────────────────
export interface BodyMeasurement {
  id: string;
  user_id: string;
  weight?: number;
  body_fat?: number;
  chest?: number;
  waist?: number;
  hip?: number;
  arm?: number;
  recorded_at: string;
}

export interface ProgressPhoto {
  id: string;
  user_id: string;
  image_url: string;
  storage_path?: string;
  label: string;
  notes?: string;
  recorded_at: string;
}

// ─── Social ────────────────────────────────────────────────
export interface Post {
  id: string;
  user_id: string;
  content: string;
  image_url?: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  user?: Profile;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user?: Profile;
}

export interface Challenge {
  id: string;
  challenger_id: string;
  challenged_id: string;
  type: 'reps' | 'duration' | 'distance';
  duration: '1day' | '3days' | '1week';
  stake: number;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  challenger_progress?: number;
  challenged_progress?: number;
  created_at: string;
  expires_at: string;
}

// ─── Gamification ──────────────────────────────────────────
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
  unlocked?: boolean;
  unlocked_at?: string;
}

export interface Level {
  level: number;
  minXp: number;
  maxXp: number;
  title: string;
}

// ─── Analytics ─────────────────────────────────────────────
export interface WorkoutAnalytics {
  totalWorkouts: number;
  totalMinutes: number;
  avgDuration: number;
  streak: number;
  byCategory: Record<string, number>;
  byWeek: { date: string; count: number }[];
  byMonth: { date: string; count: number }[];
}

export interface NutritionAnalytics {
  totalMeals: number;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalWater: number;
  daysLogged: number;
}

// ─── API Response ──────────────────────────────────────────
export interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// ─── Common ────────────────────────────────────────────────
export interface SelectOption {
  id: string;
  label: string;
  icon?: string;
  description?: string;
  color?: string;
}

export interface NavigationRoute {
  name: string;
  params?: Record<string, any>;
}
