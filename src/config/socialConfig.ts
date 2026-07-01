// src/config/socialConfig.ts
// Limites e configuracoes de social

export const SOCIAL_LIMITS = {
  // Posts
  MAX_POST_LENGTH: 2000,
  MAX_HASHTAGS_PER_POST: 10,
  POST_IMAGE_QUALITY: 0.8,

  // Comentarios
  MAX_COMMENT_LENGTH: 500,
  MAX_COMMENT_DEPTH: 3, // niveis de reply

  // Stories
  MAX_STORY_CAPTION: 200,
  MAX_STORY_ITEMS: 15,

  // Mensagens
  MAX_MESSAGE_LENGTH: 1000,
  MAX_ATTACHMENTS: 5,

  // Busca
  MIN_SEARCH_LENGTH: 2,
  MAX_SEARCH_RESULTS: 50,

  // Mentions
  MENTION_SEARCH_LIMIT: 5,

  // Replies
  MAX_REPLY_DEPTH: 1,

  // Story Highlights
  STORY_HIGHLIGHT_LIMIT: 10,
} as const;

export const SOCIAL_FEATURES = {
  ENABLE_REACTIONS: true,
  ENABLE_BOOKMARKS: true,
  ENABLE_SHARING: true,
  ENABLE_REPORTING: true,
  ENABLE_BLOCKING: true,
} as const;

// Midia avancada
export const MAX_VIDEO_DURATION = 60;
export const MAX_CAROUSEL_IMAGES = 10;

export const SUPPORTED_MOODS = [
  'Motivado',
  'Feliz',
  'Cansado',
  'Ansioso',
  'Orgulhoso',
  'Determinado',
] as const;

export const { MENTION_SEARCH_LIMIT, MAX_REPLY_DEPTH, STORY_HIGHLIGHT_LIMIT } = SOCIAL_LIMITS;

export type SocialLimits = typeof SOCIAL_LIMITS;
export type MoodType = (typeof SUPPORTED_MOODS)[number];
