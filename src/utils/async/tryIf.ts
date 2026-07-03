// src/utils/tryIf.ts
// Utilitário de tratamento de erros com retry - NOVAIX FITNESS

import AsyncStorage from '@react-native-async-storage/async-storage';
import { calculateBackoff } from './backoff';

interface TryIfOptions {
  retries?: number;
  baseDelay?: number;
  maxDelay?: number;
  timeout?: number;
  signal?: AbortSignal;
  onRetry?: (error: Error, attempt: number) => void;
  onFail?: (error: Error) => void;
}

interface TryIfResult<T> {
  ok: boolean;
  data?: T;
  error?: Error;
  attempts: number;
}

/**
 * Executa função assíncrona com retry, backoff exponencial e timeout
 *
 * @example
 * const result = await tryIf(
 *   () => supabase.from('posts').select('*'),
 *   { retries: 3, baseDelay: 1000, timeout: 5000 }
 * );
 *
 * if (result.ok) {
 *   // processar result.data
 * } else {
 *   // tratamento de erro
 * }
 */
export async function tryIf<T>(
  fn: () => Promise<T>,
  options: TryIfOptions = {}
): Promise<TryIfResult<T>> {
  const { retries = 3, baseDelay = 1000, maxDelay = 30000, timeout, signal, onRetry, onFail } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      if (signal?.aborted) throw new Error('Aborted');

      const fnPromise = fn();
      const data = timeout
        ? await Promise.race([
            fnPromise,
            new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error('Timeout')), timeout)
            )
          ])
        : await fnPromise;

      return { ok: true, data, attempts: attempt + 1 };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (signal?.aborted) break;

      if (attempt < retries) {
        const delay = calculateBackoff(attempt, baseDelay, maxDelay);
        onRetry?.(lastError, attempt + 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  onFail?.(lastError!);
  return { ok: false, error: lastError!, attempts: retries + 1 };
}

/**
 * Executa função com retry silencioso (sem callbacks)
 */
export async function tryIfSilent<T>(
  fn: () => Promise<T>,
  retries = 3
): Promise<TryIfResult<T>> {
  return tryIf(fn, { retries, baseDelay: 500 });
}

/**
 * Executa função com retry + cache em AsyncStorage
 *
 * @example
 * const result = await tryIfCached(
 *   () => supabase.from('workouts').select('*'),
 *   'workouts_cache',
 *   { cacheTTL: 10 * 60 * 1000, retries: 2 }
 * );
 */
export async function tryIfCached<T>(
  fn: () => Promise<T>,
  cacheKey: string,
  options: TryIfOptions & { cacheTTL?: number } = {}
): Promise<TryIfResult<T>> {
  const { cacheTTL = 5 * 60 * 1000, ...tryOptions } = options;

  try {
    const raw = await AsyncStorage.getItem(cacheKey);
    if (raw) {
      const cached = JSON.parse(raw);
      if (Date.now() - cached.timestamp < cacheTTL) {
        return { ok: true, data: cached.data, attempts: 0 };
      }
    }
  } catch {}

  const result = await tryIf(fn, tryOptions);

  if (result.ok) {
    try {
      await AsyncStorage.setItem(cacheKey, JSON.stringify({ data: result.data, timestamp: Date.now() }));
    } catch {}
  }

  return result;
}
