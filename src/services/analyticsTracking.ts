// src/services/analyticsTracking.ts
// Delegado de tracking de eventos para Supabase - NOVAIX FITNESS

import { trackEvent as trackerTrackEvent } from './analyticsTracker';

export function trackEvent(eventName: string, params: Record<string, unknown> = {}) {
  // Delega para o tracker de eventos principal unificado
  trackerTrackEvent(eventName, params);
}

export const EVENTS = {
  SCREEN_VIEW: 'screen_view',
  USER_LOGIN: 'user_login',
  USER_SIGNUP: 'user_signup',
  USER_LOGOUT: 'user_logout',
  WORKOUT_START: 'workout_start',
  WORKOUT_COMPLETE: 'workout_complete',
  WORKOUT_CANCEL: 'workout_cancel',
  EXERCISE_COMPLETE: 'exercise_complete',
  POST_CREATE: 'post_create',
  POST_LIKE: 'post_like',
  POST_COMMENT: 'post_comment',
  STORY_CREATE: 'story_create',
  SUBSCRIPTION_START: 'subscription_start',
  COUPON_USE: 'coupon_use',
  COIN_PURCHASE: 'coin_purchase',
  GIFT_SEND: 'gift_send',
  DAILY_CHECK_IN: 'daily_check_in',
  STREAK_MILESTONE: 'streak_milestone',
  ACHIEVEMENT_UNLOCK: 'achievement_unlock',
  LEVEL_UP: 'level_up',
  ERROR_OCCURRED: 'error_occurred',
  NETWORK_ERROR: 'network_error',
} as const;

export function cleanup() {
  // O tracker principal gerencia o próprio ciclo de vida
}
