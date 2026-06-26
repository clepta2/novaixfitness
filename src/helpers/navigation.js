// src/helpers/navigation.js
// Helper de Navegação - NOVAIX FITNESS

export const ROUTES = {
  // Auth
  LOGIN: '/',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',

  // Onboarding
  ONBOARDING_GOAL: '/onboarding/objetivo',
  ONBOARDING_GENDER: '/onboarding/genero',
  ONBOARDING_PHYSICAL: '/onboarding/dados-fisicos',
  ONBOARDING_MODEL: '/onboarding/modelo',
  ONBOARDING_AVAILABILITY: '/onboarding/disponibilidade',
  ONBOARDING_GYM_TYPE: '/onboarding/tipo-academia',
  ONBOARDING_EXPERIENCE: '/onboarding/experiencia',
  ONBOARDING_PROCESSING: '/onboarding/processando',

  // Main
  HOME: '/(tabs)/home',
  FEED: '/(tabs)/feed',
  PROFILE: '/(tabs)/perfil',
  HELP: '/(tabs)/ajuda',
  PLAYER: '/player',
  PAYWALL: '/paywall',

  // Profile
  LGPD: '/(tabs)/perfil/lgpd',
};

export const ANIMATIONS = {
  FADE: 'fade',
  SLIDE_RIGHT: 'slide_from_right',
  SLIDE_LEFT: 'slide_from_left',
  SLIDE_BOTTOM: 'slide_from_bottom',
  SLIDE_TOP: 'slide_from_top',
};
