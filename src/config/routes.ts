// src/config/routes.ts
// Centralized route paths

export const ROUTES = {
  // Root
  ROOT: '/',

  // Auth
  LOGIN: '/',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  INTRO: '/intro',
  LANDING: '/landing',

  // Tabs
  HOME: '/(tabs)/home',
  FEED: '/(tabs)/feed',
  LIBRARY: '/(tabs)/library',
  PROFILE: '/(tabs)/perfil',
  CONFIG: '/(tabs)/config',
  HELP: '/(tabs)/ajuda',
  GROUP: '/(tabs)/group',

  // Onboarding
  ONBOARDING_MODEL: '/onboarding/modelo',

  // Workouts
  PLAYER: '/player',
  PLAYER_LIST: '/player-list',
  WORKOUT_DETAIL: '/workout-detail',

  // Progress
  PROGRESS_PHOTOS: '/progress-photos',
  PROGRESS_INITIAL_PHOTO: '/progress/initialPhoto',
  BODY_MEASURES: '/body-measures',
  WEEKLY_PROGRESS: '/weekly-progress',

  // Social & Gamification
  GAMIFICATION: '/gamification',
  MARKETPLACE: '/marketplace',
  MARKETPLACE_DETAIL: '/marketplace-detail',

  // Monetization
  PAYWALL: '/paywall',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RouteValue = (typeof ROUTES)[RouteKey];
