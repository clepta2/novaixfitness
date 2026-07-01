// src/config/navigation.ts
// Rotas e screens do app

export const ROUTES = {
  // Auth
  LOGIN: 'index',
  REGISTER: 'register',
  FORGOT_PASSWORD: 'forgot-password',
  INTRO: 'intro',
  LANDING: 'landing',

  // Tabs principais
  HOME: '(tabs)/home',
  FEED: '(tabs)/feed',
  LIBRARY: '(tabs)/library',
  PROFILE: '(tabs)/perfil',
  CONFIG: '(tabs)/config',
  HELP: '(tabs)/ajuda',
  GROUP: '(tabs)/group',

  // Treinos
  PLAYER: 'player',
  PLAYER_LIST: 'player-list',
  WORKOUT_DETAIL: 'workout-detail',
  WARMUP: 'warmup',
  RECOVERY: 'recovery',

  // Social
  SOCIAL: 'social',
  FORUM: 'forum',
  BLOG: 'blog',

  // Perfil e progresso
  PROGRESS: 'progress',
  PROGRESS_PHOTOS: 'progress-photos',
  BODY_MEASURES: 'body-measures',
  WEEKLY_PROGRESS: 'weekly-progress',
  GOALS: 'goals',
  ASSESSMENT: 'assessment',

  // Admin
  ADMIN: 'admin',
  ANALYTICS: 'analytics',
  DASHBOARD: 'dashboard',
  COACH_DASHBOARD: 'coach-dashboard',

  // Outros
  NOTIFICATIONS: 'notifications',
  SUBSCRIPTION: 'subscription',
  PAYWALL: 'paywall',
  CHAT: 'chat',
  CHAT_COACH: 'chat-coach',
  NUTRITION: 'nutrition',
  MINDFULNESS: 'mindfulness',
  GAMIFICATION: 'gamification',
  CHALLENGES: 'challenges',
  MARKETPLACE: 'marketplace',
  WEARABLES: 'wearables',
  EXPORT_DATA: 'export-data',
  CHANGELOG: 'changelog',
  LIVE: 'live',
  LIVE_ROOM: 'live-room',
} as const;

export const TAB_ROUTES = [
  ROUTES.HOME,
  ROUTES.FEED,
  ROUTES.LIBRARY,
  ROUTES.PROFILE,
  ROUTES.CONFIG,
] as const;

export const SCREEN_ROUTES = [
  ROUTES.PLAYER,
  ROUTES.PLAYER_LIST,
  ROUTES.WORKOUT_DETAIL,
  ROUTES.SOCIAL,
  ROUTES.FORUM,
  ROUTES.PROGRESS,
  ROUTES.ANALYTICS,
  ROUTES.ADMIN,
] as const;

export const MODAL_ROUTES = [
  ROUTES.PAYWALL,
  ROUTES.SUBSCRIPTION,
  ROUTES.NOTIFICATIONS,
  ROUTES.EXPORT_DATA,
] as const;

export type RouteKey = keyof typeof ROUTES;
export type RouteValue = (typeof ROUTES)[RouteKey];
