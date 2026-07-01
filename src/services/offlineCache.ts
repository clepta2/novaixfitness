// src/services/offlineCache.ts
// Cache de treinos, favoritos e perfil

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Workout } from '../types';

const CACHE_KEYS = {
  WORKOUTS: '@novaix:workouts',
  WORKOUT_DETAILS: '@novaix:workout_details',
  FAVORITES: '@novaix:favorites',
  PROFILE: '@novaix:profile',
  LAST_SYNC: '@novaix:last_sync',
};

const CACHE_EXPIRY = 24 * 60 * 60 * 1000;
const MAX_CACHED_DETAILS = 30;

interface CachedEntry<T> {
  data: T;
  timestamp: number;
}

export async function cacheWorkouts(workouts: Workout[]): Promise<void> {
  try {
    await AsyncStorage.setItem(CACHE_KEYS.WORKOUTS, JSON.stringify({ data: workouts, timestamp: Date.now() }));
  } catch (err) {
    if (__DEV__) console.error('Erro ao cachear workouts:', err);
  }
}

export async function getCachedWorkouts(): Promise<Workout[] | null> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEYS.WORKOUTS);
    if (!raw) return null;
    const { data, timestamp } = JSON.parse(raw) as CachedEntry<Workout[]>;
    if (Date.now() - timestamp > CACHE_EXPIRY) return null;
    return data;
  } catch { return null; }
}

export async function cacheFavorites(favorites: string[]): Promise<void> {
  try {
    await AsyncStorage.setItem(CACHE_KEYS.FAVORITES, JSON.stringify({ data: favorites, timestamp: Date.now() }));
  } catch (err) {
    if (__DEV__) console.error('Erro ao cachear favoritos:', err);
  }
}

export async function getCachedFavorites(): Promise<string[] | null> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEYS.FAVORITES);
    if (!raw) return null;
    const { data, timestamp } = JSON.parse(raw) as CachedEntry<string[]>;
    if (Date.now() - timestamp > CACHE_EXPIRY) return null;
    return data;
  } catch { return null; }
}

export async function cacheProfile(profile: Record<string, unknown>): Promise<void> {
  try {
    await AsyncStorage.setItem(CACHE_KEYS.PROFILE, JSON.stringify({ data: profile, timestamp: Date.now() }));
  } catch (err) {
    if (__DEV__) console.error('Erro ao cachear perfil:', err);
  }
}

export async function getCachedProfile(): Promise<Record<string, unknown> | null> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEYS.PROFILE);
    if (!raw) return null;
    const { data, timestamp } = JSON.parse(raw) as CachedEntry<Record<string, unknown>>;
    if (Date.now() - timestamp > CACHE_EXPIRY) return null;
    return data;
  } catch { return null; }
}

export async function cacheWorkoutDetail(workout: Workout): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEYS.WORKOUT_DETAILS);
    const cache: Record<string, CachedEntry<Workout>> = raw ? JSON.parse(raw) : {};
    cache[workout.id] = { data: workout, timestamp: Date.now() };
    const ids = Object.keys(cache);
    if (ids.length > MAX_CACHED_DETAILS) {
      const sorted = ids.sort((a, b) => cache[a].timestamp - cache[b].timestamp);
      for (let i = 0; i < ids.length - MAX_CACHED_DETAILS; i++) delete cache[sorted[i]];
    }
    await AsyncStorage.setItem(CACHE_KEYS.WORKOUT_DETAILS, JSON.stringify(cache));
  } catch (err) {
    if (__DEV__) console.error('Erro ao cachear detalhe do treino:', err);
  }
}

export async function getCachedWorkoutDetail(workoutId: string): Promise<Workout | null> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEYS.WORKOUT_DETAILS);
    if (!raw) return null;
    const cache: Record<string, CachedEntry<Workout>> = JSON.parse(raw);
    const entry = cache[workoutId];
    if (!entry || Date.now() - entry.timestamp > CACHE_EXPIRY) return null;
    return entry.data;
  } catch { return null; }
}

export async function isWorkoutCached(workoutId: string): Promise<boolean> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEYS.WORKOUT_DETAILS);
    if (!raw) return false;
    const cache: Record<string, CachedEntry<Workout>> = JSON.parse(raw);
    return !!cache[workoutId] && (Date.now() - cache[workoutId].timestamp <= CACHE_EXPIRY);
  } catch { return false; }
}

export async function updateLastSync(): Promise<void> {
  try { await AsyncStorage.setItem(CACHE_KEYS.LAST_SYNC, Date.now().toString()); }
  catch (err) { if (__DEV__) console.error('Erro ao atualizar ultimo sync:', err); }
}

export async function getLastSync(): Promise<number | null> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEYS.LAST_SYNC);
    return raw ? parseInt(raw, 10) : null;
  } catch { return null; }
}
