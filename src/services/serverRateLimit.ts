// src/services/serverRateLimit.ts
// Rate Limiting server-side com bloqueio progressivo - NOVAIX FITNESS
// Regra 5: Rate limiting server-side obrigatório

import AsyncStorage from '@react-native-async-storage/async-storage';
import { tryIf } from '../utils/tryIf';
import { RateLimitConfig } from './security/rateLimitConfigs';

export type { RateLimitConfig } from './security/rateLimitConfigs';

const RATE_LIMIT_PREFIX = 'ratelimit:';

type RateLimitEntry = {
  count: number;
  windowStart: number;
  blockedUntil: number | null;
  blockLevel: number;
};

type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
  blockLevel: number;
};

// Bloqueio progressivo: 1 min → 5 min → 30 min → ban
const PROGRESSIVE_BLOCKS = [
  1 * 60 * 1000,
  5 * 60 * 1000,
  30 * 60 * 1000,
  Infinity,
];

/**
 * Verifica rate limit e incrementa contador
 * Implementa bloqueio progressivo conforme Regra 5
 */
export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const result = await tryIf(async () => {
    const key = `${RATE_LIMIT_PREFIX}${identifier}`;
    const stored = await AsyncStorage.getItem(key);
    const now = Date.now();
    let entry: RateLimitEntry;

    if (stored) {
      entry = JSON.parse(stored);
      if (entry.blockedUntil && now > entry.blockedUntil) {
        entry.blockedUntil = null;
        entry.count = 0;
        entry.windowStart = now;
        entry.blockLevel = 0;
      }
      if (now - entry.windowStart > config.windowMs) {
        entry.count = 0;
        entry.windowStart = now;
      }
    } else {
      entry = { count: 0, windowStart: now, blockedUntil: null, blockLevel: 0 };
    }

    if (entry.blockedUntil && now < entry.blockedUntil) {
      return {
        allowed: false,
        remaining: 0,
        retryAfterMs: entry.blockedUntil - now,
        blockLevel: entry.blockLevel,
      };
    }

    entry.count++;

    if (entry.count > config.maxAttempts) {
      if (config.progressiveBlock !== false) {
        entry.blockLevel = Math.min(entry.blockLevel + 1, PROGRESSIVE_BLOCKS.length - 1);
      }
      const blockDuration = config.blockDurationMs || PROGRESSIVE_BLOCKS[entry.blockLevel] || config.windowMs;
      entry.blockedUntil = now + blockDuration;
      await AsyncStorage.setItem(key, JSON.stringify(entry));
      return { allowed: false, remaining: 0, retryAfterMs: blockDuration, blockLevel: entry.blockLevel };
    }

    await AsyncStorage.setItem(key, JSON.stringify(entry));
    return { allowed: true, remaining: config.maxAttempts - entry.count, retryAfterMs: 0, blockLevel: 0 };
  }, { retries: 1 });

  return result.ok
    ? result.data!
    : { allowed: true, remaining: 999, retryAfterMs: 0, blockLevel: 0 };
}

/**
 * Incrementa contador sem verificar limite
 */
export async function incrementCounter(identifier: string): Promise<void> {
  await tryIf(async () => {
    const key = `${RATE_LIMIT_PREFIX}${identifier}`;
    const stored = await AsyncStorage.getItem(key);
    if (stored) {
      const entry: RateLimitEntry = JSON.parse(stored);
      entry.count++;
      await AsyncStorage.setItem(key, JSON.stringify(entry));
    }
  }, { retries: 1 });
}

/**
 * Reseta rate limit para um identificador
 */
export async function resetRateLimit(identifier: string): Promise<void> {
  await AsyncStorage.removeItem(`${RATE_LIMIT_PREFIX}${identifier}`);
}

/**
 * Reseta todos os rate limits (apenas para testes)
 */
export async function resetAllRateLimits(): Promise<void> {
  const keys = await AsyncStorage.getAllKeys();
  const rateLimitKeys = keys.filter(k => k.startsWith(RATE_LIMIT_PREFIX));
  await AsyncStorage.multiRemove(rateLimitKeys);
}
