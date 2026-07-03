// src/utils/cache.ts
// Sistema consolidado de cache - NOVAIX FITNESS
// Combina: cache genérico, chaves nomeadas, gerenciamento de tamanho

import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_PREFIX = '@novaix:cache:';
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutos
const MAX_CACHE_SIZE = 50 * 1024 * 1024; // 50MB

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

// Cache em memoria para acesso rápido
const memoryCache = new Map<string, CacheEntry<any>>();

// ─── TTLs por tipo de dado ──────────────────────────────
export const CACHE_TTL: Record<string, number> = {
  workouts: 24 * 60 * 60 * 1000,      // 24h
  exercises: 7 * 24 * 60 * 60 * 1000,  // 7 dias
  profile: 60 * 60 * 1000,              // 1h
  feed: 30 * 60 * 1000,                 // 30min
  notifications: 15 * 60 * 1000,        // 15min
  categories: 7 * 24 * 60 * 60 * 1000,  // 7 dias
  achievements: 24 * 60 * 60 * 1000,    // 24h
  plans: 60 * 60 * 1000,                // 1h
  default: DEFAULT_TTL,
};

// ─── Chaves nomeadas ────────────────────────────────────
export const CACHE_KEYS = {
  WORKOUTS: '@novaix:workouts',
  WORKOUT_DETAILS: '@novaix:workout_details',
  FAVORITES: '@novaix:favorites',
  PROFILE: '@novaix:profile',
  LAST_SYNC: '@novaix:last_sync',
  PENDING_ACTIONS: '@novaix:pending_actions',
} as const;

// ─── Operações básicas de cache ─────────────────────────
export async function setCache<T>(key: string, data: T, ttl: number = DEFAULT_TTL): Promise<void> {
  const entry: CacheEntry<T> = { data, timestamp: Date.now(), ttl };
  memoryCache.set(key, entry);
  try {
    await AsyncStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(entry));
  } catch (err) {
    if (__DEV__) console.error('Cache set error:', err);
  }
}

export async function getCache<T>(key: string): Promise<T | null> {
  const memEntry = memoryCache.get(key);
  if (memEntry && Date.now() - memEntry.timestamp < memEntry.ttl) {
    return memEntry.data as T;
  }

  try {
    const raw = await AsyncStorage.getItem(`${CACHE_PREFIX}${key}`);
    if (!raw) return null;
    const entry: CacheEntry<T> = JSON.parse(raw);
    if (Date.now() - entry.timestamp > entry.ttl) {
      await AsyncStorage.removeItem(`${CACHE_PREFIX}${key}`);
      memoryCache.delete(key);
      return null;
    }
    memoryCache.set(key, entry);
    return entry.data;
  } catch {
    return null;
  }
}

export async function removeCache(key: string): Promise<void> {
  memoryCache.delete(key);
  try {
    await AsyncStorage.removeItem(`${CACHE_PREFIX}${key}`);
  } catch (err) {
    if (__DEV__) console.warn('Cache remove error:', err);
  }
}

export async function clearAllCache(): Promise<void> {
  memoryCache.clear();
  try {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter(k => k.startsWith(CACHE_PREFIX) || k.startsWith('@novaix:'));
    await AsyncStorage.multiRemove(cacheKeys);
  } catch (err) {
    if (__DEV__) console.warn('Cache clear error:', err);
  }
}

// ─── Cache com fetch automático ─────────────────────────
export async function cachedFetch<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl: number = DEFAULT_TTL
): Promise<T> {
  const cached = await getCache<T>(key);
  if (cached !== null) return cached;

  const data = await fetchFn();
  await setCache(key, data, ttl);
  return data;
}

// ─── Cache por tipo (usa TTL automático) ────────────────
export async function cacheByType<T>(type: string, key: string, data: T): Promise<void> {
  const ttl = CACHE_TTL[type] || CACHE_TTL.default;
  await setCache(`${type}:${key}`, data, ttl);
}

export async function getCachedByType<T>(type: string, key: string): Promise<T | null> {
  return getCache<T>(`${type}:${key}`);
}

// ─── Gerenciamento de tamanho ───────────────────────────
export async function getCacheSize(): Promise<number> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const novaixKeys = keys.filter(k => k.startsWith('@novaix:'));
    const items = await AsyncStorage.multiGet(novaixKeys);
    return items.reduce((total, [, val]) => total + (val ? val.length * 2 : 0), 0);
  } catch {
    return 0;
  }
}

export async function getCacheInfo(): Promise<{
  totalSize: number;
  breakdown: Record<string, { size: number; count: number }>;
  keyCount: number;
  withinLimit: boolean;
}> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const novaixKeys = keys.filter(k => k.startsWith('@novaix:'));
    const items = await AsyncStorage.multiGet(novaixKeys);
    const breakdown: Record<string, { size: number; count: number }> = {};
    let totalSize = 0;
    for (const [key, val] of items) {
      const size = val ? val.length * 2 : 0;
      totalSize += size;
      const shortKey = key.replace('@novaix:', '');
      breakdown[shortKey] = { size, count: val ? JSON.parse(val)?.length || 1 : 0 };
    }
    return { totalSize, breakdown, keyCount: novaixKeys.length, withinLimit: totalSize < MAX_CACHE_SIZE };
  } catch {
    return { totalSize: 0, breakdown: {}, keyCount: 0, withinLimit: true };
  }
}

export async function clearWorkoutCache(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([CACHE_KEYS.WORKOUTS, CACHE_KEYS.WORKOUT_DETAILS]);
    memoryCache.clear();
  } catch (err) {
    if (__DEV__) console.warn('Workout cache clear error:', err);
  }
}
