// src/services/analyticsTracker.js
// Sistema de analytics e tracking - NOVAIX FITNESS

import { supabase } from '../config/supabase';
import { Platform } from 'react-native';

const EVENT_QUEUE = [];
const FLUSH_INTERVAL = 30000;
let flushTimer = null;
let sessionId = null;

const EVENT_TYPES = {
  WORKOUT_STARTED: 'workout_started',
  WORKOUT_COMPLETED: 'workout_completed',
  WORKOUT_SKIPPED: 'workout_skipped',
  EXERCISE_COMPLETED: 'exercise_completed',
  MEAL_LOGGED: 'meal_logged',
  WATER_LOGGED: 'water_logged',
  WEIGHT_LOGGED: 'weight_logged',
  SCREEN_VIEWED: 'screen_viewed',
  FEATURE_USED: 'feature_used',
  SHARE_CLICKED: 'share_clicked',
  NOTIFICATION_RECEIVED: 'notification_received',
  NOTIFICATION_OPENED: 'notification_opened',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  SEARCH_PERFORMED: 'search_performed',
  FILTER_APPLIED: 'filter_applied',
  SUBSCRIPTION_STARTED: 'subscription_started',
  SUBSCRIPTION_CANCELLED: 'subscription_cancelled',
  ACHIEVEMENT_UNLOCKED: 'achievement_unlocked',
  LEVEL_UP: 'level_up',
  STREAK_MILESTONE: 'streak_milestone',
};

export { EVENT_TYPES };

export function trackEvent(eventName: string, properties: Record<string, unknown> = {}, userId: string | null = null) {
  const event = {
    event_name: eventName,
    properties,
    user_id: userId,
    platform: Platform.OS,
    timestamp: new Date().toISOString(),
    session_id: getSessionId(),
  };

  EVENT_QUEUE.push(event);

  if (EVENT_QUEUE.length >= 10) {
    flushEvents();
  }

  if (!flushTimer) {
    flushTimer = setInterval(flushEvents, FLUSH_INTERVAL);
  }
}

export function trackScreenView(screenName: string, userId: string | null = null) {
  trackEvent(EVENT_TYPES.SCREEN_VIEWED, { screen: screenName }, userId);
}

export function trackWorkoutStarted(workoutId: string, workoutName: string, userId: string) {
  trackEvent(EVENT_TYPES.WORKOUT_STARTED, { workout_id: workoutId, workout_name: workoutName }, userId);
}

export function trackWorkoutCompleted(workoutId: string, duration: number, exercisesCompleted: number, userId: string) {
  trackEvent(EVENT_TYPES.WORKOUT_COMPLETED, {
    workout_id: workoutId,
    duration_seconds: duration,
    exercises_completed: exercisesCompleted,
  }, userId);
}

export function trackMealLogged(mealType: string, calories: number, userId: string) {
  trackEvent(EVENT_TYPES.MEAL_LOGGED, { meal_type: mealType, calories }, userId);
}

export function trackWaterLogged(amountMl: number, userId: string) {
  trackEvent(EVENT_TYPES.WATER_LOGGED, { amount_ml: amountMl }, userId);
}

export function trackWeightLogged(weight: number, userId: string) {
  trackEvent(EVENT_TYPES.WEIGHT_LOGGED, { weight }, userId);
}

export function trackAchievementUnlocked(achievementId: string, achievementName: string, userId: string) {
  trackEvent(EVENT_TYPES.ACHIEVEMENT_UNLOCKED, { achievement_id: achievementId, achievement_name: achievementName }, userId);
}

export function trackSubscriptionStarted(planId: string, planName: string, userId: string) {
  trackEvent(EVENT_TYPES.SUBSCRIPTION_STARTED, { plan_id: planId, plan_name: planName }, userId);
}

export function trackSearchPerformed(query: string, resultsCount: number, userId: string) {
  trackEvent(EVENT_TYPES.SEARCH_PERFORMED, { query, results_count: resultsCount }, userId);
}

async function flushEvents() {
  if (EVENT_QUEUE.length === 0) return;

  const events = [...EVENT_QUEUE];
  EVENT_QUEUE.length = 0;

  try {
    await supabase.from('analytics_events').insert(events);
  } catch (err) {
    if (__DEV__) console.warn('Erro ao enviar eventos:', err);
    EVENT_QUEUE.unshift(...events);
  }
}

function getSessionId() {
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  }
  return sessionId;
}

export function getEventStats(userId: string, startDate: string, endDate: string) {
  return (supabase
    .from('analytics_events')
    .select('event_name, count') as any)
    .eq('user_id', userId)
    .gte('timestamp', startDate)
    .lte('timestamp', endDate)
    .group('event_name');
}

export function getUserFunnel(userId: string) {
  return supabase
    .rpc('get_user_funnel', { p_user_id: userId });
}

// --- Functions merged from eventTracker.js ---

let trackerUserId: string | null = null;

export function setTrackerUser(id: string | null) {
  trackerUserId = id;
  sessionId = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
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
  trackEvent(EVENT_TYPES.SCREEN_VIEWED, { screen: screenName });
}

export function trackWorkoutStart(workoutId: string, workoutName: string) {
  trackEvent(EVENT_TYPES.WORKOUT_STARTED, { workout_id: workoutId, workout_name: workoutName });
}

export function trackWorkoutComplete(workoutId: string, duration: number) {
  trackEvent(EVENT_TYPES.WORKOUT_COMPLETED, { workout_id: workoutId, duration });
}

export function trackError(errorName: string, screen: string, message: string) {
  trackEvent('error', { error_name: errorName, screen, message });
}
