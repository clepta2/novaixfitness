// src/services/eventTracker.js
// Servico de tracking de eventos - NOVAIX FITNESS

import { supabase } from '../config/supabase';

let userId = null;
let sessionId = null;

export function setTrackerUser(id) {
  userId = id;
  sessionId = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function trackEvent(eventName, params = {}) {
  if (!userId) return;

  const event = {
    user_id: userId,
    session_id: sessionId,
    event_name: eventName,
    params: JSON.stringify(params),
    platform: require('react-native').Platform.OS,
    created_at: new Date().toISOString(),
  };

  try {
    await supabase.from('analytics_events').insert(event);
  } catch {}
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

export function trackScreen(screenName) {
  trackEvent(Events.SCREEN_VIEW, { screen: screenName });
}

export function trackWorkoutStart(workoutId, workoutName) {
  trackEvent(Events.WORKOUT_START, { workout_id: workoutId, workout_name: workoutName });
}

export function trackWorkoutComplete(workoutId, duration) {
  trackEvent(Events.WORKOUT_COMPLETE, { workout_id: workoutId, duration });
}

export function trackError(errorName, screen, message) {
  trackEvent('error', { error_name: errorName, screen, message });
}
