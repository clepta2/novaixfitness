// src/types/index.ts - Tipos compartilhados NOVAIX FITNESS

// ─── Utilitários ──────────────────────────────────────────────
export type WithTimestamps<T> = T & { created_at: string; updated_at: string };
export type PaginatedResponse<T> = { data: T[]; page: number; limit: number; total: number; hasMore: boolean };
export type ApiResponse<T> = { data: T; error: null } | { data: null; error: { message: string; code?: string } };

// ─── Auth / User ──────────────────────────────────────────────
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
  // Propriedades adicionais usadas em useProcessing
  age?: number; weight?: number; height?: number; birth_date?: string;
  gymType?: string; availableDays?: number; sessionDuration?: number;
  allergies?: string; restrictions?: string;
  [key: string]: unknown;
};

// ─── Treinos ──────────────────────────────────────────────────
export type ExerciseStep = { step: number; text: string; image: string; title?: string };
export type ExerciseAlternative = { name: string; level: string; reason: string };

export type Exercise = {
  id: string; name: string; sets: number; reps: number; rest: number;
  muscle: string; equipment?: string; video_url?: string; video_id?: string;
  thumbnail_url?: string; weight?: number; steps?: ExerciseStep[];
  tips?: string[]; mistakes?: string[]; alternatives?: ExerciseAlternative[];
};

export type WorkoutLevel = 'Iniciante' | 'Intermediário' | 'Avançado';

export type Workout = {
  id: string; name: string; category: string; level: WorkoutLevel;
  duration: number; duration_minutes?: number; description: string; videoId?: string; video_id?: string;
  equipment: string[]; exercises: Exercise[];
  intensity?: string;
};

// ─── Categorias ───────────────────────────────────────────────
export type Category = {
  id: string; label: string; icon: string; description: string;
  color: string; count?: number; bg?: string; key?: string;
};

// ─── Social / Feed ────────────────────────────────────────────
export type Post = {
  id: string; user_id: string; content: string; image_url: string | null;
  workout_id: string | null; likes_count: number; created_at: string;
  profiles?: { name: string; avatar_url: string | null; level: number };
  isLiked?: boolean; likesCount?: number; commentsCount?: number;
};

export type PostComment = {
  id: string; post_id: string; user_id: string; content: string; created_at: string;
  profiles?: { name: string; avatar_url: string | null };
};

export type ReactionType = 'like' | 'fire' | 'strong' | 'clap' | 'muscle';
export type PostReaction = { id: string; post_id: string; user_id: string; type: ReactionType };

export type Story = {
  id: string; user_id: string; content: string; expires_at: string; created_at: string;
  profiles?: { name: string; avatar_url: string | null };
};

// ─── Social / Follow ──────────────────────────────────────────
export type UserFollow = { id: string; follower_id: string; following_id: string; created_at: string };
export type FollowProfile = { id: string; name: string; avatar_url: string | null; level: number };

// ─── Chat / Mensagens ─────────────────────────────────────────
export type ConversationType = 'direct' | 'group';

export type Conversation = {
  id: string; type: ConversationType; name: string | null; updated_at: string;
  members?: ConversationMember[]; lastMessage?: ChatMessage | null; unreadCount?: number;
};

export type ConversationMember = {
  user_id: string; conversation_id: string; last_read_at?: string; role?: string;
  profiles?: { name: string; avatar_url: string | null };
};

export type MessageType = 'text' | 'image' | 'workout_share';

export type ChatMessage = {
  id: string; conversation_id: string; user_id: string; content: string;
  type: MessageType; reply_to: string | null; edited: boolean;
  deleted: boolean; created_at: string;
  profiles?: { name: string; avatar_url: string | null };
};

// ─── Live Workouts ────────────────────────────────────────────
export type LiveStatus = 'scheduled' | 'live' | 'ended';

export type LiveWorkout = {
  id: string; host_id: string; title: string; description: string | null;
  workout_type: string; is_public: boolean; status: LiveStatus;
  participant_count: number; started_at: string | null; ended_at: string | null;
  created_at: string; profiles?: { name: string; avatar_url: string | null };
};

export type LiveParticipantRole = 'host' | 'participant';

export type LiveParticipant = {
  id: string; live_id: string; user_id: string; role: LiveParticipantRole;
  joined_at: string; left_at: string | null;
  profiles?: { name: string; avatar_url: string | null };
};

export type LiveMessage = {
  id: string; live_id: string; user_id: string; message: string;
  type: string; created_at: string;
  profiles?: { name: string; avatar_url: string | null };
};

export type LiveWorkoutState = {
  id: string; live_id: string; timer_seconds: number; current_exercise?: string; updated_at: string;
};

// ─── Assinatura / Planos ──────────────────────────────────────
export type SubscriptionStatus = 'free' | 'active' | 'premium' | 'cancelled' | 'expired';
export type BillingType = 'monthly' | 'annual';
export type PlanFeature = { text: string; included: boolean };
export type PlanLimits = {
  workouts_per_week: number; ai_chats_per_day: number;
  custom_workouts: number; export_data: boolean; priority_support: boolean;
};

export type Plan = {
  id: string; name: string; price: number; priceText?: string;
  annualPrice?: number; annualPriceText?: string; annualSavings?: string;
  period?: string; annualPeriod?: string; popular?: boolean;
  features: PlanFeature[]; limits?: PlanLimits;
};

// ─── Gamificação ──────────────────────────────────────────────
export type AchievementCategory = 'streak' | 'workout' | 'time' | 'social' | 'level' | 'special';

export type Achievement = {
  id: string; name: string; description: string; icon: string; color?: string;
  category: AchievementCategory; requirement: number; xpReward: number;
  unlocked?: boolean; unlocked_at?: string;
};

export type LevelInfo = {
  level: number; name: string; xpRequired: number; color: string; icon: string; rewards: string[];
};

// ─── Criadores ────────────────────────────────────────────────
export type CreatorStatus = 'active' | 'pending' | 'rejected';

export type CreatorProfile = {
  user_id: string; display_name: string; bio: string; category: string;
  status: CreatorStatus; total_earned: number; subscriber_count: number;
  profiles?: { name: string; avatar_url: string | null };
};

export type ContentType = 'workout' | 'tip' | 'routine' | 'video';

export type CreatorContent = {
  id: string; creator_id: string; title: string; description: string;
  content_type: ContentType; media_url: string | null;
  is_premium: boolean; price_coins: number; created_at: string;
  creator_profiles?: CreatorProfile;
};

export type CreatorSubscription = {
  id: string; creator_id: string; user_id: string; status: string;
  price_brl: number; created_at: string;
};

// ─── Check-in ─────────────────────────────────────────────────
export type DailyCheckIn = {
  id: string; user_id: string; check_in_date: string; streak_day: number; xp_awarded: number;
};

// ─── Notificações ─────────────────────────────────────────────
export type NotificationType = 'new_follower' | 'workout_reminder' | 'achievement_unlocked' | 'comment' | 'like' | 'live_started' | 'system';

export type Notification = {
  id: string; user_id: string; type: NotificationType; title: string;
  body: string; data?: Record<string, unknown>; read: boolean; created_at: string;
};

// ─── Marketplace ──────────────────────────────────────────────
export type MarketplaceProduct = {
  id: string; name: string; description: string; price: number;
  category: string; image_url: string; seller_id: string;
  rating?: number; review_count?: number; created_at: string;
};

export type MarketplaceReview = {
  id: string; product_id: string; user_id: string; rating: number;
  comment: string; created_at: string;
  profiles?: { name: string; avatar_url: string | null };
};

// ─── Analytics ────────────────────────────────────────────────
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

// ─── Payments ─────────────────────────────────────────────────
export type PaymentStatus = 'pending' | 'processing' | 'received' | 'failed' | 'refunded';

export type Payment = {
  id: string; user_id: string; amount: number; status: PaymentStatus;
  payment_method: string; plan_type: string; created_at: string;
};

export type PixPayment = {
  pixQrCode: string; pixCopyPaste: string; expiresAt: string;
};

// ─── Content Moderation ───────────────────────────────────────
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

// ─── Security ─────────────────────────────────────────────────
export type TamperCheck = {
  type: string; detected: boolean; severity: string;
  details: Record<string, unknown>;
};

export type SecurityEvent = {
  id: string; event_type: string; severity: string;
  details?: Record<string, unknown>; platform: string;
  created_at: string;
};

// ─── Offline / Cache ──────────────────────────────────────────
export type PendingAction = {
  id: string; type: string; timestamp: number;
  [key: string]: unknown;
};

export type ExerciseLog = {
  set_number: number; reps_done: number; weight_kg: number;
};

export type CachedEntry<T> = {
  data: T; timestamp: number;
};

// ─── Wearables ────────────────────────────────────────────────
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

// ─── Creator Revenue ──────────────────────────────────────────
export type CreatorRevenue = {
  id: string; creator_id: string; amount: number;
  type: string; created_at: string;
};

export type CreatorStats = {
  activeSubscribers: number; totalContent: number;
  totalEarned: number; subscriberCount: number;
};

// ─── Referral ─────────────────────────────────────────────────
export type Referral = {
  id: string; user_id: string; code: string;
  referral_count: number; created_at: string;
};

export type ReferralReward = {
  id: string; user_id: string; referred_user_id: string;
  reward_type: string; reward_value: number; created_at: string;
};

// ─── Workout Timer ────────────────────────────────────────────
export type TimerPhase = 'idle' | 'exercising' | 'resting' | 'paused' | 'completed';

export type SetLog = {
  exerciseIndex: number; exercise: Exercise; setNumber: number;
  timestamp: number; [key: string]: unknown;
};

export type TimerProgress = {
  exerciseProgress: number; setProgress: number; timerProgress: number;
};

// ─── Challenge ────────────────────────────────────────────────
export type ChallengeType = 'streak_30' | 'workout_count' | 'minutes';

export type FriendChallenge = {
  id: string; challenger_id: string; challenged_id: string;
  challenge_type: ChallengeType; title: string; description: string;
  target_value: number; status: string; winner_id?: string;
  start_date?: string; end_date: string; stake_coins: number;
  created_at: string;
};

export type ChallengeProgress = {
  id: string; challenge_id: string; user_id: string;
  current_value: number; last_updated: string;
};

// ─── AI / Coach ───────────────────────────────────────────────
export type AIRecommendation = {
  type: string; title: string; description: string;
  confidence: number; data?: Record<string, unknown>;
};

export type CoachMessage = {
  id: string; user_id: string; role: 'user' | 'assistant';
  content: string; created_at: string;
};

// ─── Progress Photos ──────────────────────────────────────────
export type ProgressPhoto = {
  id: string; user_id: string; image_url: string;
  photo_type: 'front' | 'side' | 'back'; taken_at: string;
};

export type BodyMeasurement = {
  id: string; user_id: string; measurement_type: string;
  value: number; unit: string; measured_at: string;
};
