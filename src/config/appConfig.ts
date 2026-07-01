// src/config/appConfig.ts
// Configuracao centralizada de limites e constantes do app

export const APP_LIMITS = {
  // Imagens
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_IMAGES_PER_POST: 10,

  // Conteudo
  MAX_STORY_DURATION_MS: 5000, // 5 segundos
  MAX_BIO_CHARS: 150,

  // Cache e performance
  CACHE_TTL_SHORT: 30 * 1000, // 30s
  CACHE_TTL_MEDIUM: 5 * 60 * 1000, // 5min
  CACHE_TTL_LONG: 30 * 60 * 1000, // 30min
  DEBOUNCE_DELAY: 300,

  // Treinos
  WORKOUT_REST_DEFAULT: 60, // segundos
  WORKOUT_MAX_SETS: 10,
  WORKOUT_MAX_REPS: 100,

  // Paginacao
  PAGINATION_LIMIT: 20,
  PAGINATION_MAX: 100,

  // Tempo
  TIMER_INTERVAL_MS: 1000,
  ANIMATION_DURATION_MS: 300,
} as const;

export const APP_CONFIG = {
  name: 'NOVAIX FITNESS',
  version: '1.0.0',
  buildNumber: 1,
} as const;

export type AppLimits = typeof APP_LIMITS;
