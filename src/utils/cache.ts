// src/utils/cache.ts
// Sistema de cache para dados - NOVAIX FITNESS

import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_PREFIX = '@novaix:cache:';
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutos

export const CACHE_KEYS = {
  WORKOUTS: '@novaix:workouts',
  WORKOUT_DETAILS: '@novaix:workout_details',
  FAVORITES: '@novaix:favorites',
  PROFILE: '@novaix:profile',
  LAST_SYNC: '@novaix:last_sync',
  PENDING_ACTIONS: '@novaix:pending_actions',
} as const;

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

// Cache em memoria para acesso rapido
const memoryCache = new Map<string, CacheEntry<any>>();

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
  // Verificar memoria primeiro
  const memEntry = memoryCache.get(key);
  if (memEntry && Date.now() - memEntry.timestamp < memEntry.ttl) {
    return memEntry.data as T;
  }

  // Verificar AsyncStorage
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
  } catch {}
}

export async function clearAllCache(): Promise<void> {
  memoryCache.clear();
  try {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter(k => k.startsWith(CACHE_PREFIX));
    await AsyncStorage.multiRemove(cacheKeys);
  } catch {}
}

// Cache com fetch automatico
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
