// src/services/offlineCache.ts
// Cache inteligente para funcionamento offline
// Armazena dados essenciais localmente para acesso sem internet

import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_PREFIX = '@novaix:cache:';
const CACHE_META_KEY = '@novaix:cache_meta';

type CacheEntry<T> = {
  data: T;
  timestamp: number;
  ttlMs: number;
};

type CacheMeta = Record<string, { timestamp: number; size: number }>;

// Tempo de vida padrao por tipo de dado
const DEFAULT_TTL: Record<string, number> = {
  workouts: 24 * 60 * 60 * 1000,      // 24h
  exercises: 7 * 24 * 60 * 60 * 1000,  // 7 dias
  profile: 60 * 60 * 1000,              // 1h
  feed: 30 * 60 * 1000,                 // 30min
  notifications: 15 * 60 * 1000,        // 15min
  categories: 7 * 24 * 60 * 60 * 1000,  // 7 dias
  achievements: 24 * 60 * 60 * 1000,    // 24h
  plans: 60 * 60 * 1000,                // 1h
};

// Salva dados no cache
export async function cacheData<T>(key: string, data: T, ttlMs?: number): Promise<void> {
  try {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttlMs: ttlMs || DEFAULT_TTL[key.split(':')[0]] || 60 * 60 * 1000,
    };
    await AsyncStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(entry));

    // Atualiza meta
    const meta = await getCacheMeta();
    meta[key] = { timestamp: Date.now(), size: JSON.stringify(data).length };
    await AsyncStorage.setItem(CACHE_META_KEY, JSON.stringify(meta));
  } catch (err) {
    if (__DEV__) console.warn('[offlineCache] Erro ao cachear:', key, err);
  }
}

// Recupera dados do cache (null se expirado ou inexistente)
export async function getCachedData<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(`${CACHE_PREFIX}${key}`);
    if (!raw) return null;

    const entry: CacheEntry<T> = JSON.parse(raw);
    const now = Date.now();

    if (now - entry.timestamp > entry.ttlMs) {
      await removeCachedData(key);
      return null;
    }

    return entry.data;
  } catch {
    return null;
  }
}

// Recupera dados ou retorna fallback se offline/cache miss
export async function getCachedOrFallback<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttlMs?: number
): Promise<T> {
  // Tenta cache primeiro
  const cached = await getCachedData<T>(key);
  if (cached !== null) return cached;

  // Tenta buscar da rede
  try {
    const data = await fetchFn();
    await cacheData(key, data, ttlMs);
    return data;
  } catch (err) {
    // Se falhar, tenta cache expirado como ultima opcao
    try {
      const raw = await AsyncStorage.getItem(`${CACHE_PREFIX}${key}`);
      if (raw) {
        const entry: CacheEntry<T> = JSON.parse(raw);
        if (__DEV__) console.warn(`[offlineCache] Usando cache expirado para: ${key}`);
        return entry.data;
      }
    } catch { /* ok */ }
    throw err;
  }
}

// Remove item do cache
export async function removeCachedData(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(`${CACHE_PREFIX}${key}`);
    const meta = await getCacheMeta();
    delete meta[key];
    await AsyncStorage.setItem(CACHE_META_KEY, JSON.stringify(meta));
  } catch {}
}

// Limpa todo o cache
export async function clearAllCache(): Promise<number> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter(k => k.startsWith(CACHE_PREFIX));
    await AsyncStorage.multiRemove(cacheKeys);
    await AsyncStorage.removeItem(CACHE_META_KEY);
    return cacheKeys.length;
  } catch {
    return 0;
  }
}

// Limpa cache expirado
export async function cleanExpiredCache(): Promise<number> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter(k => k.startsWith(CACHE_PREFIX));
    let cleaned = 0;
    const now = Date.now();

    for (const key of cacheKeys) {
      try {
        const raw = await AsyncStorage.getItem(key);
        if (!raw) continue;
        const entry: CacheEntry<unknown> = JSON.parse(raw);
        if (now - entry.timestamp > entry.ttlMs) {
          await AsyncStorage.removeItem(key);
          cleaned++;
        }
      } catch {}
    }

    return cleaned;
  } catch {
    return 0;
  }
}

// Obtem metadados do cache
async function getCacheMeta(): Promise<CacheMeta> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_META_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

// Obtem estatisticas do cache
export async function getCacheStats(): Promise<{
  itemCount: number;
  totalSizeKB: number;
  oldestItem: number | null;
  newestItem: number | null;
  byType: Record<string, number>;
}> {
  try {
    const meta = await getCacheMeta();
    const entries = Object.values(meta);
    const byType: Record<string, number> = {};

    for (const [key] of Object.entries(meta)) {
      const type = key.split(':')[0];
      byType[type] = (byType[type] || 0) + 1;
    }

    const timestamps = entries.map(e => e.timestamp);
    const totalSize = entries.reduce((sum, e) => sum + e.size, 0);

    return {
      itemCount: entries.length,
      totalSizeKB: Math.round(totalSize / 1024),
      oldestItem: timestamps.length > 0 ? Math.min(...timestamps) : null,
      newestItem: timestamps.length > 0 ? Math.max(...timestamps) : null,
      byType,
    };
  } catch {
    return { itemCount: 0, totalSizeKB: 0, oldestItem: null, newestItem: null, byType: {} };
  }
}
