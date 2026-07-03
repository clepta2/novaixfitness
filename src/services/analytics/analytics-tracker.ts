// src/services/analytics-tracker.ts
// Tracking de eventos consolidado - NOVAIX FITNESS

import { supabase } from '../../config/supabase';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { tryIf } from '../../utils/tryIf';

const QUEUE_KEY = '@novaix:analytics_queue';

// ─── Fila e configuração ───────────────────────────────────
let EVENT_QUEUE: Record<string, unknown>[] = [];
const FLUSH_INTERVAL = 30000;
let flushTimer: ReturnType<typeof setInterval> | null = null;
let sessionId: string | null = null;
let loaded = false;

async function loadQueue() {
  if (loaded) return;
  await tryIf(async () => {
    const raw = await AsyncStorage.getItem(QUEUE_KEY);
    if (raw) EVENT_QUEUE = JSON.parse(raw);
  }, { retries: 2, baseDelay: 500 });
  loaded = true;
}

async function saveQueue() {
  await tryIf(async () => {
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(EVENT_QUEUE));
  }, { retries: 2, baseDelay: 500 });
}

// ─── Constantes de eventos (unificadas) ────────────────────
export const EVENTS = {
  SCREEN_VIEW: 'screen_view',
  USER_LOGIN: 'user_login',
  USER_SIGNUP: 'user_signup',
  USER_LOGOUT: 'user_logout',
  WORKOUT_START: 'workout_start',
  WORKOUT_STARTED: 'workout_started',
  WORKOUT_COMPLETE: 'workout_complete',
  WORKOUT_COMPLETED: 'workout_completed',
  WORKOUT_CANCEL: 'workout_cancel',
  WORKOUT_SKIPPED: 'workout_skipped',
  EXERCISE_COMPLETE: 'exercise_complete',
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
  SUBSCRIPTION_START: 'subscription_start',
  SUBSCRIPTION_STARTED: 'subscription_started',
  SUBSCRIPTION_CANCELLED: 'subscription_cancelled',
  POST_CREATE: 'post_create',
  POST_LIKE: 'post_like',
  POST_COMMENT: 'post_comment',
  STORY_CREATE: 'story_create',
  COUPON_USE: 'coupon_use',
  COIN_PURCHASE: 'coin_purchase',
  GIFT_SEND: 'gift_send',
  DAILY_CHECK_IN: 'daily_check_in',
  ACHIEVEMENT_UNLOCK: 'achievement_unlock',
  ACHIEVEMENT_UNLOCKED: 'achievement_unlocked',
  LEVEL_UP: 'level_up',
  STREAK_MILESTONE: 'streak_milestone',
  ERROR_OCCURRED: 'error_occurred',
  NETWORK_ERROR: 'network_error',
} as const;

// ─── Tracking genérico ─────────────────────────────────────
export function trackEvent(eventName: string, properties: Record<string, unknown> = {}, userId: string | null = null) {
  loadQueue().then(() => {
    const event = {
      event_name: eventName,
      properties,
      user_id: userId,
      platform: Platform.OS,
      timestamp: new Date().toISOString(),
      session_id: getSessionId(),
    };

    EVENT_QUEUE.push(event);
    saveQueue();

    if (EVENT_QUEUE.length >= 10) flushEvents();
    if (!flushTimer) flushTimer = setInterval(flushEvents, FLUSH_INTERVAL);
  });
}

// ─── Helpers de tracking ───────────────────────────────────
export function trackScreenView(screenName: string, userId: string | null = null) {
  trackEvent(EVENTS.SCREEN_VIEW, { screen: screenName }, userId);
}

export function trackWorkoutStarted(workoutId: string, workoutName: string, userId: string) {
  trackEvent(EVENTS.WORKOUT_STARTED, { workout_id: workoutId, workout_name: workoutName }, userId);
}

export function trackWorkoutCompleted(workoutId: string, duration: number, exercisesCompleted: number, userId: string) {
  trackEvent(EVENTS.WORKOUT_COMPLETED, { workout_id: workoutId, duration_seconds: duration, exercises_completed: exercisesCompleted }, userId);
}

export function trackMealLogged(mealType: string, calories: number, userId: string) {
  trackEvent(EVENTS.MEAL_LOGGED, { meal_type: mealType, calories }, userId);
}

export function trackWaterLogged(amountMl: number, userId: string) {
  trackEvent(EVENTS.WATER_LOGGED, { amount_ml: amountMl }, userId);
}

export function trackWeightLogged(weight: number, userId: string) {
  trackEvent(EVENTS.WEIGHT_LOGGED, { weight }, userId);
}

export function trackAchievementUnlocked(achievementId: string, achievementName: string, userId: string) {
  trackEvent(EVENTS.ACHIEVEMENT_UNLOCKED, { achievement_id: achievementId, achievement_name: achievementName }, userId);
}

export function trackSubscriptionStarted(planId: string, planName: string, userId: string) {
  trackEvent(EVENTS.SUBSCRIPTION_STARTED, { plan_id: planId, plan_name: planName }, userId);
}

export function trackSearchPerformed(query: string, resultsCount: number, userId: string) {
  trackEvent(EVENTS.SEARCH_PERFORMED, { query, results_count: resultsCount }, userId);
}

// ─── Queries de eventos ────────────────────────────────────
export function getEventStats(userId: string, startDate: string, endDate: string) {
  return (supabase.from('analytics_events').select('event_name, count') as any)
    .eq('user_id', userId)
    .gte('timestamp', startDate)
    .lte('timestamp', endDate)
    .group('event_name');
}

export function getUserFunnel(userId: string) {
  return supabase.rpc('get_user_funnel', { p_user_id: userId });
}

// ─── Flush e sessão ────────────────────────────────────────
async function flushEvents() {
  await loadQueue();
  if (EVENT_QUEUE.length === 0) return;
  const events = [...EVENT_QUEUE];
  EVENT_QUEUE = [];
  await saveQueue();
  const result = await tryIf(async () => {
    await supabase.from('analytics_events').insert(events);
  }, { retries: 1, baseDelay: 500 });
  if (!result.ok) {
    EVENT_QUEUE.unshift(...events);
    await saveQueue();
  }
}

function getSessionId(): string {
  if (!sessionId) sessionId = `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  return sessionId;
}

export function cleanup() {
  if (flushTimer) { clearInterval(flushTimer); flushTimer = null; }
}
