// src/services/offline/offlineCache.ts
// Cache genérico e cache de treinos/favoritos/perfil

import AsyncStorage from '@react-native-async-storage/async-storage';
import { CACHE_KEYS } from '../../utils/cache';
import { tryIf } from '../../utils/tryIf';
import { supabase } from '../../config/supabase';

const CACHE_EXPIRY = 24 * 60 * 60 * 1000;
const MAX_CACHED_DETAILS = 30;
const LIBRARY_KEY = '@novaix:library_cache';
const DAILY_WORKOUT_KEY = '@novaix:daily_workout';
const QUEUE_KEY = '@novaix:pending_actions';

// ═══════════════════════════════════════════
// CACHE genérico com TTL
// ═══════════════════════════════════════════

async function cacheSet(key: string, data: unknown) {
  await AsyncStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() })).catch(() => {});
}

async function cacheGet<T>(key: string, expiry = CACHE_EXPIRY): Promise<T | null> {
  const raw = await AsyncStorage.getItem(key).catch(() => null);
  if (!raw) return null;
  const { data, timestamp } = JSON.parse(raw);
  if (Date.now() - timestamp > expiry) return null;
  return data as T;
}

// ═══════════════════════════════════════════
// CACHE de treinos
// ═══════════════════════════════════════════

export async function cacheWorkouts(workouts: unknown[]) {
  await cacheSet(CACHE_KEYS.WORKOUTS, workouts);
}

export async function getCachedWorkouts() {
  return cacheGet(CACHE_KEYS.WORKOUTS);
}

export async function cacheWorkoutDetail(workout: { id: string }) {
  const raw = await AsyncStorage.getItem(CACHE_KEYS.WORKOUT_DETAILS).catch(() => null);
  const cache = raw ? JSON.parse(raw) : {};
  cache[workout.id] = { workout, timestamp: Date.now() };
  const ids = Object.keys(cache);
  if (ids.length > MAX_CACHED_DETAILS) {
    const sorted = ids.sort((a, b) => cache[a].timestamp - cache[b].timestamp);
    for (let i = 0; i < ids.length - MAX_CACHED_DETAILS; i++) delete cache[sorted[i]];
  }
  await AsyncStorage.setItem(CACHE_KEYS.WORKOUT_DETAILS, JSON.stringify(cache)).catch(() => {});
}

export async function getCachedWorkoutDetail(workoutId: string) {
  const raw = await AsyncStorage.getItem(CACHE_KEYS.WORKOUT_DETAILS).catch(() => null);
  if (!raw) return null;
  const cache = JSON.parse(raw);
  const entry = cache[workoutId];
  if (!entry || Date.now() - entry.timestamp > CACHE_EXPIRY) return null;
  return entry.workout;
}

export async function isWorkoutCached(workoutId: string) {
  const raw = await AsyncStorage.getItem(CACHE_KEYS.WORKOUT_DETAILS).catch(() => null);
  if (!raw) return false;
  const cache = JSON.parse(raw);
  return !!cache[workoutId] && (Date.now() - cache[workoutId].timestamp <= CACHE_EXPIRY);
}

// ═══════════════════════════════════════════
// CACHE de favoritos e perfil
// ═══════════════════════════════════════════

export async function cacheFavorites(favorites: unknown[]) {
  await cacheSet(CACHE_KEYS.FAVORITES, favorites);
}

export async function getCachedFavorites() {
  return cacheGet(CACHE_KEYS.FAVORITES);
}

export async function cacheProfile(profile: unknown) {
  await cacheSet(CACHE_KEYS.PROFILE, profile);
}

export async function getCachedProfile() {
  return cacheGet(CACHE_KEYS.PROFILE);
}

// ═══════════════════════════════════════════
// CACHE de biblioteca e treino do dia
// ═══════════════════════════════════════════

export async function cacheLibrary(workouts: unknown[]) {
  await cacheSet(LIBRARY_KEY, workouts);
}

export async function getCachedLibrary() {
  return cacheGet(LIBRARY_KEY);
}

export async function cacheDailyWorkout(workout: unknown) {
  await cacheSet(DAILY_WORKOUT_KEY, workout);
}

export async function getCachedDailyWorkout() {
  return cacheGet(DAILY_WORKOUT_KEY);
}

export async function cacheWorkoutsForUser(userId: string) {
  if (!userId) return;
  await tryIf(async () => {
    const { data } = await supabase
      .from('user_plans').select('*').eq('user_id', userId).eq('is_active', true);
    if (data) await cacheWorkouts(data);
  }, { retries: 1, baseDelay: 500 });
}

// ═══════════════════════════════════════════
// CACHE de logs de exercícios
// ═══════════════════════════════════════════

export async function cacheExerciseLogs(userWorkoutId: string, exerciseName: string, logs: unknown[]) {
  await AsyncStorage.setItem(`${QUEUE_KEY}:logs:${userWorkoutId}:${exerciseName}`, JSON.stringify(logs)).catch(() => {});
}

export async function getCachedExerciseLogs(userWorkoutId: string, exerciseName: string) {
  const raw = await AsyncStorage.getItem(`${QUEUE_KEY}:logs:${userWorkoutId}:${exerciseName}`).catch(() => null);
  return raw ? JSON.parse(raw) : [];
}
