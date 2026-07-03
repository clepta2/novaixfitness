// src/services/semanticCache.ts
// Cache semantico para respostas de IA - Regra 178/179 (NOVAIX FITNESS)

import AsyncStorage from '@react-native-async-storage/async-storage';
import { tryIf } from '../../utils/tryIf';

const CACHE_PREFIX = '@novaix_ai_cache:';
const DEFAULT_TTL_MS = 60 * 60 * 1000; // 1 hora
const MAX_CACHE_ENTRIES = 100;

interface CacheEntry {
  query: string;
  response: string;
  timestamp: number;
  ttl: number;
  hitCount: number;
}

/**
 * Normaliza query para comparacao semantica basica
 */
function normalizeQuery(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Calcula similaridade entre duas queries (Jaccard simplificado)
 */
function similarity(a: string, b: string): number {
  const wordsA = new Set(a.split(' '));
  const wordsB = new Set(b.split(' '));
  const intersection = new Set([...wordsA].filter(w => wordsB.has(w)));
  const union = new Set([...wordsA, ...wordsB]);
  return union.size === 0 ? 0 : intersection.size / union.size;
}

/**
 * Busca cache semantico para uma query (Regra 179)
 */
export async function getCachedResponse(query: string): Promise<string | null> {
  const normalizedQuery = normalizeQuery(query);

  const result = await tryIf(async () => {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter(k => k.startsWith(CACHE_PREFIX));

    if (cacheKeys.length === 0) return null;

    const entries = await AsyncStorage.multiGet(cacheKeys);
    const now = Date.now();

    let bestMatch: CacheEntry | null = null;
    let bestScore = 0;

    for (const [, raw] of entries) {
      if (!raw) continue;
      const entry: CacheEntry = JSON.parse(raw);

      if (now - entry.timestamp > entry.ttl) continue;

      const entryNormalized = normalizeQuery(entry.query);
      const score = similarity(normalizedQuery, entryNormalized);

      if (score >= 0.99 && score > bestScore) {
        bestMatch = entry;
        bestScore = score;
      }
    }

    if (bestMatch) {
      bestMatch.hitCount++;
      await AsyncStorage.setItem(
        `${CACHE_PREFIX}${bestMatch.query.slice(0, 50)}`,
        JSON.stringify(bestMatch)
      );
      return bestMatch.response;
    }

    return null;
  }, { retries: 1 });

  return result.ok ? result.data : null;
}

/**
 * Armazena resposta no cache semantico (Regra 179)
 */
export async function cacheResponse(
  query: string,
  response: string,
  ttl: number = DEFAULT_TTL_MS
): Promise<void> {
  const entry: CacheEntry = {
    query,
    response,
    timestamp: Date.now(),
    ttl,
    hitCount: 0,
  };

  await tryIf(async () => {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter(k => k.startsWith(CACHE_PREFIX));

    if (cacheKeys.length >= MAX_CACHE_ENTRIES) {
      const entries = await AsyncStorage.multiGet(cacheKeys);
      const sorted = entries
        .map(([, raw]) => (raw ? JSON.parse(raw) : null))
        .filter(Boolean)
        .sort((a: CacheEntry, b: CacheEntry) => a.hitCount - b.hitCount);

      if (sorted.length > 0) {
        await AsyncStorage.removeItem(`${CACHE_PREFIX}${sorted[0].query.slice(0, 50)}`);
      }
    }

    const key = `${CACHE_PREFIX}${query.slice(0, 50)}`;
    await AsyncStorage.setItem(key, JSON.stringify(entry));
  }, { retries: 1 });
}

/**
 * Limpa todo o cache de IA
 */
export async function clearAICache(): Promise<void> {
  await tryIf(async () => {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter(k => k.startsWith(CACHE_PREFIX));
    if (cacheKeys.length > 0) {
      await AsyncStorage.multiRemove(cacheKeys);
    }
  }, { retries: 1 });
}
