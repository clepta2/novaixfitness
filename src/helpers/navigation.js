// src/helpers/navigation.js
// Helper de Navegação - NOVAIX FITNESS

export const ROUTES = {
  // Auth
  LOGIN: '/',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',

  // Onboarding
  ONBOARDING_GOAL: '/onboarding/objetivo',
  ONBOARDING_GENDER: '/onboarding/dados-fisicos',
  ONBOARDING_PHYSICAL: '/onboarding/dados-fisicos',
  ONBOARDING_MODEL: '/onboarding/modelo',
  ONBOARDING_AVAILABILITY: '/onboarding/disponibilidade',
  ONBOARDING_GYM_TYPE: '/onboarding/tipo-academia',
  ONBOARDING_EXPERIENCE: '/onboarding/experiencia',
  ONBOARDING_PROCESSING: '/onboarding/processando',

  // Tabs
  HOME: '/(tabs)/home',
  FEED: '/(tabs)/feed',
  PROFILE: '/(tabs)/perfil',
  LIBRARY: '/(tabs)/library',
  HELP: '/(tabs)/ajuda',

  // Features
  PLAYER: '/player',
  PLAYER_LIST: '/player-list',
  PAYWALL: '/paywall',
  SUBSCRIPTION: '/subscription',
  CHAT_COACH: '/chat-coach',
  DASHBOARD: '/dashboard',
  ANALYTICS: '/analytics',
  SETTINGS: '/(tabs)/perfil',
  WARMUP: '/warmup',
  RECOVERY: '/recovery',
  NOTIFICATIONS: '/notifications',
  ADMIN: '/admin',

  // Profile sub-pages
  LGPD: '/(tabs)/perfil/lgpd',
  HISTORY: '/(tabs)/perfil/history',
  LINKS: '/(tabs)/perfil/links',
  TERMS: '/(tabs)/perfil/termos',

  // Body & Progress
  BODY_MEASURES: '/body-measures',
  PROGRESS_PHOTOS: '/progress-photos',
  WEEKLY_PROGRESS: '/weekly-progress',
  EXPORT_DATA: '/export-data',
  WORKOUT_DETAIL: '/workout-detail',
};

export const PLANS = {
  FREE: 'free',
  BASIC: 'basic',
  INTERMEDIATE: 'intermediate',
  PREMIUM: 'premium',
  ULTRA: 'ultra',
};

export const ANIMATIONS = {
  FADE: 'fade',
  SLIDE_RIGHT: 'slide_from_right',
  SLIDE_LEFT: 'slide_from_left',
  SLIDE_BOTTOM: 'slide_from_bottom',
  SLIDE_TOP: 'slide_from_top',
};
