// src/services/aiRateLimit.ts
// Rate limiting por tokens para IA - Regra 168 (NOVAIX FITNESS)

import AsyncStorage from '@react-native-async-storage/async-storage';
import { tryIf } from '../../utils/tryIf';

const TOKEN_LIMIT = 2000;
const WINDOW_MS = 60 * 60 * 1000; // 1 hora
const STORAGE_PREFIX = '@novaix_ai_tokens:';

interface TokenRecord {
  tokens: number[];
  blockedUntil: number | null;
}

function getStorageKey(userId: string): string {
  return `${STORAGE_PREFIX}${userId}`;
}

function cleanOldTokens(tokens: number[], windowMs: number): number[] {
  const now = Date.now();
  return tokens.filter(t => now - t < windowMs);
}

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Verifica se o usuario pode usar tokens (Regra 168)
 */
export async function checkTokenLimit(
  userId: string,
  estimatedTokens: number
): Promise<{ allowed: boolean; remaining: number; retryAfterMs: number }> {
  const result = await tryIf(async () => {
    const raw = await AsyncStorage.getItem(getStorageKey(userId));
    if (!raw) return { allowed: true, remaining: TOKEN_LIMIT, retryAfterMs: 0 };

    const record: TokenRecord = JSON.parse(raw);

    if (record.blockedUntil && Date.now() < record.blockedUntil) {
      return { allowed: false, remaining: 0, retryAfterMs: record.blockedUntil - Date.now() };
    }

    const validTokens = cleanOldTokens(record.tokens, WINDOW_MS);
    const usedTokens = validTokens.reduce((sum, t) => sum + t, 0);
    const remaining = TOKEN_LIMIT - usedTokens;

    if (remaining < estimatedTokens) {
      const oldestToken = validTokens[0];
      const retryAfterMs = oldestToken
        ? oldestToken + WINDOW_MS - Date.now()
        : WINDOW_MS;
      return { allowed: false, remaining: 0, retryAfterMs };
    }

    return { allowed: true, remaining: remaining - estimatedTokens, retryAfterMs: 0 };
  }, { retries: 1 });

  return result.ok
    ? result.data
    : { allowed: true, remaining: TOKEN_LIMIT, retryAfterMs: 0 };
}

/**
 * Incrementa uso de tokens apos resposta da IA
 */
export async function incrementTokenUsage(userId: string, tokensUsed: number): Promise<void> {
  await tryIf(async () => {
    const raw = await AsyncStorage.getItem(getStorageKey(userId));
    const record: TokenRecord = raw
      ? JSON.parse(raw)
      : { tokens: [], blockedUntil: null };

    const validTokens = cleanOldTokens(record.tokens, WINDOW_MS);
    validTokens.push(Date.now());

    const usedTokens = validTokens.reduce((sum, t) => sum + t, 0);
    if (usedTokens >= TOKEN_LIMIT) {
      record.blockedUntil = Date.now() + WINDOW_MS;
    }

    record.tokens = validTokens;
    await AsyncStorage.setItem(getStorageKey(userId), JSON.stringify(record));
  }, { retries: 1 });
}

/**
 * Retorna tokens estimados de um texto
 */
export function estimateTokenCount(text: string): number {
  return estimateTokens(text);
}

/**
 * Reseta o contador de tokens de um usuario
 */
export async function resetTokenUsage(userId: string): Promise<void> {
  await tryIf(async () => {
    await AsyncStorage.removeItem(getStorageKey(userId));
  }, { retries: 1 });
}
