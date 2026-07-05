// src/services/eventTracker.js
// Servico de tracking de eventos - NOVAIX FITNESS

import { supabase } from '../../config/supabase';
import { tryIf } from '../../utils/tryIf';

let userId: string | null = null;
let sessionId: string | null = null;

export function setTrackerUser(id: string | null) {
  userId = id;
  sessionId = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function trackEvent(eventName: string, params: Record<string, unknown> = {}) {
  if (!userId) return;

  const event = {
    user_id: userId,
    session_id: sessionId,
    event_name: eventName,
    params: JSON.stringify(params),
    platform: require('react-native').Platform.OS,
    created_at: new Date().toISOString(),
  };

  const result = await tryIf(async () => {
    await supabase.from('analytics_events').insert(event);
  }, { retries: 1, baseDelay: 500 });
  return result.ok;
}

export const Events = {
  SCREEN_VIEW: 'screen_view',
  WORKOUT_START: 'workout_start',
  WORKOUT_COMPLETE: 'workout_complete',
  WORKOUT_CANCEL: 'workout_cancel',
  EXERCISE_COMPLETE: 'exercise_complete',
  WORKOUT_RATED: 'workout_rated',
  FAVORITE_TOGGLE: 'favorite_toggle',
  SHARE_WORKOUT: 'share_workout',
  COUPON_APPLIED: 'coupon_applied',
  PAYWALL_VIEW: 'paywall_view',
  SUBSCRIPTION_START: 'subscription_start',
  ONBOARDING_STEP: 'onboarding_step',
  ONBOARDING_COMPLETE: 'onboarding_complete',
  SEARCH_QUERY: 'search_query',
  POST_CREATE: 'post_create',
  POST_LIKE: 'post_like',
  NOTIFICATION_OPEN: 'notification_open',
};

export function trackScreen(screenName: string) {
  trackEvent(Events.SCREEN_VIEW, { screen: screenName });
}

export function trackWorkoutStart(workoutId: string, workoutName: string) {
  trackEvent(Events.WORKOUT_START, { workout_id: workoutId, workout_name: workoutName });
}

export function trackWorkoutComplete(workoutId: string, duration: number) {
  trackEvent(Events.WORKOUT_COMPLETE, { workout_id: workoutId, duration });
}

export function trackError(errorName: string, screen: string, message: string) {
  trackEvent('error', { error_name: errorName, screen, message });
}
export const EVENT_TYPES = { PAGE_VIEW: 'page_view', BUTTON_CLICK: 'button_click', FEATURE_USE: 'feature_use', ERROR: 'error' };
