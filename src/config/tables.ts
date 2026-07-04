// src/config/tables.ts
// Centralized Supabase table names

export const TABLES = {
  // Users & Profiles
  PROFILES: 'profiles',
  USER_FOLLOWS: 'user_follows',
  USER_BLOCKS: 'user_blocks',
  USER_TRUST: 'user_trust',
  USER_DEVICES: 'user_devices',
  USER_INTERACTIONS: 'user_interactions',

  // Social & Content
  POSTS: 'posts',
  POST_LIKES: 'post_likes',
  POST_COMMENTS: 'post_comments',
  POST_REACTIONS: 'post_reactions',
  SAVED_POSTS: 'saved_posts',
  STORIES: 'stories',
  STORY_VIEWS: 'story_views',
  FAVORITES: 'favorites',

  // Community Analytics
  POST_VIEWS: 'post_views',
  USER_MUTES: 'user_mutes',

  // Chat & Messaging
  CONVERSATIONS: 'conversations',
  CONVERSATION_MEMBERS: 'conversation_members',
  MESSAGES: 'messages',
  COACH_CHAT_MESSAGES: 'coach_chat_messages',

  // Workouts & Fitness
  WORKOUTS: 'workouts',
  USER_WORKOUTS: 'user_workouts',
  CUSTOM_WORKOUTS: 'custom_workouts',
  USER_EXERCISE_LOGS: 'user_exercise_logs',
  EXERCISES: 'exercises',
  WORKOUT_GROUPS: 'workout_groups',
  FITNESS_ASSESSMENTS: 'fitness_assessments',
  USER_PLANS: 'user_plans',
  PLAN_ADAPTATIONS: 'plan_adaptations',
  SHORT_TERM_GOALS: 'short_term_goals',

  // Live
  LIVE_WORKOUTS: 'live_workouts',
  LIVE_PARTICIPANTS: 'live_participants',
  LIVE_MESSAGES: 'live_messages',
  LIVE_WORKOUT_STATE: 'live_workout_state',

  // Gamification
  XP_LOGS: 'xp_logs',
  USER_ACHIEVEMENTS: 'user_achievements',
  DAILY_CHECK_INS: 'daily_check_ins',
  GYM_CHECK_INS: 'gym_check_ins',
  FRIEND_CHALLENGES: 'friend_challenges',
  CHALLENGE_PROGRESS: 'challenge_progress',
  CHALLENGE_HISTORY: 'challenge_history',
  DUELS: 'duels',
  DAILY_CHALLENGES: 'daily_challenges',

  // Notifications
  NOTIFICATIONS: 'notifications',

  // Moderation & Security
  REPORTS: 'reports',
  CONTENT_FLAGS: 'content_flags',
  MODERATION_CUSTOM_WORDS: 'moderation_custom_words',
  BLOCKED_USERS: 'blocked_users',
  BLOCKED_IPS: 'blocked_ips',
  SECURITY_EVENTS: 'security_events',
  LOGIN_ATTEMPTS: 'login_attempts',
  LOGIN_LOCATIONS: 'login_locations',
  ADMIN_2FA: 'admin_2fa',
  AUDIT_LOG: 'audit_log',

  // Subscriptions & Monetization
  SUBSCRIPTIONS: 'subscriptions',
  WALLET: 'wallet',
  COIN_PACKAGES: 'coin_packages',
  GIFT_CATALOG: 'gift_catalog',
  GIFT_TRANSACTIONS: 'gift_transactions',
  GIFT_RANKINGS: 'gift_rankings',
  COUPONS: 'coupons',
  COUPON_USAGE: 'coupon_usage',
  PAYMENTS: 'payments',
  COACH_WITHDRAWALS: 'coach_withdrawals',

  // Creator
  CREATOR_PROFILES: 'creator_profiles',
  CREATOR_CONTENT: 'creator_content',
  CREATOR_SUBSCRIPTIONS: 'creator_subscriptions',
  CREATOR_REVENUE: 'creator_revenue',

  // Marketplace
  MARKETPLACE_PRODUCTS: 'marketplace_products',
  MARKETPLACE_CATEGORIES: 'marketplace_categories',
  MARKETPLACE_FAVORITES: 'marketplace_favorites',
  MARKETPLACE_REVIEWS: 'marketplace_reviews',

  // Analytics
  ANALYTICS_EVENTS: 'analytics_events',
  AB_TEST_ASSIGNMENTS: 'ab_test_assignments',
  AB_TEST_CONVERSIONS: 'ab_test_conversions',
  AB_TEST_EVENTS: 'ab_test_events',

  // Health & Wearables
  DAILY_STEPS: 'daily_steps',
  SLEEP_DATA: 'sleep_data',
  SLEEP_LOGS: 'sleep_logs',
  HEART_RATE_READINGS: 'heart_rate_readings',
  STEP_LOGS: 'step_logs',

  // Body & Nutrition
  WEIGHT_LOGS: 'weight_logs',
  CALORIE_LOGS: 'calorie_logs',
  ENERGY_LOGS: 'energy_logs',
  MEAL_LOGS: 'meal_logs',
  WATER_LOGS: 'water_logs',
  BODY_MEASUREMENTS: 'body_measurements',
  PHYSICAL_PROGRESS: 'physical_progress',
  SUPPLEMENT_LOGS: 'supplement_logs',
  SHOPPING_LISTS: 'shopping_lists',
  USER_MEAL_PLANS: 'user_meal_plans',

  // Onboarding
  ONBOARDING_V2: 'onboarding_v2',

  // Groups
  GROUP_MEMBERS: 'group_members',
  GROUP_POSTS: 'group_posts',

  // Referrals
  REFERRALS: 'referrals',
  REFERRAL_REWARDS: 'referral_rewards',

  // AI & Features
  AI_CHAT_LOGS: 'ai_chat_logs',
  FEATURE_FLAGS: 'feature_flags',

  // Data & Monitoring
  DATA_DELETION_REQUESTS: 'data_deletion_requests',
  CRASH_REPORTS: 'crash_reports',
  HANDLED_ERRORS: 'handled_errors',
} as const;

export type TableKey = keyof typeof TABLES;
export type TableValue = (typeof TABLES)[TableKey];
