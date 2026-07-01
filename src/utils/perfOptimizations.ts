// src/utils/perfOptimizations.ts
// Otimizacoes de performance: memoizacao TTL, throttle trailing, lazy load, dedup - NOVAIX FITNESS

type MemoEntry<T> = { value: T; expiry: number };
const memoCache = new Map<string, MemoEntry<unknown>>();

export function memoizeWithTTL<T>(key: string, factory: () => T, ttlMs: number = 5 * 60 * 1000): T {
  const now = Date.now();
  const cached = memoCache.get(key) as MemoEntry<T> | undefined;
  if (cached && now < cached.expiry) return cached.value;
  const value = factory();
  memoCache.set(key, { value, expiry: now + ttlMs });
  return value;
}

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of memoCache) {
    if (now >= entry.expiry) memoCache.delete(key);
  }
}, 60000);

export function throttleWithTrailing<T extends (...args: any[]) => any>(fn: T, limitMs: number): T & { cancel: () => void } {
  let lastCall = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: any[] = [];
  const throttled = (...args: any[]) => {
    lastArgs = args;
    const now = Date.now();
    const remaining = limitMs - (now - lastCall);
    if (remaining <= 0) {
      if (timer) { clearTimeout(timer); timer = null; }
      lastCall = now;
      return fn(...args);
    }
    if (!timer) {
      timer = setTimeout(() => { lastCall = Date.now(); timer = null; fn(...lastArgs); }, remaining);
    }
  };
  throttled.cancel = () => { if (timer) { clearTimeout(timer); timer = null; } };
  return throttled as T & { cancel: () => void };
}

export function dedupeAsync<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const pending = (dedupeAsync as any)._pending as Map<string, Promise<unknown>>;
  if (pending.has(key)) return pending.get(key) as Promise<T>;
  const promise = fn().finally(() => pending.delete(key));
  pending.set(key, promise);
  return promise;
}
(dedupeAsync as any)._pending = new Map<string, Promise<unknown>>();

export function measureSync<T>(label: string, fn: () => T): T {
  if (!__DEV__) return fn();
  const start = performance.now();
  const result = fn();
  const elapsed = performance.now() - start;
  if (elapsed > 16) console.warn(`[perf] ${label}: ${elapsed.toFixed(1)}ms`);
  return result;
}

export async function measureAsync<T>(label: string, fn: () => Promise<T>): Promise<T> {
  if (!__DEV__) return fn();
  const start = performance.now();
  const result = await fn();
  const elapsed = performance.now() - start;
  if (elapsed > 100) console.warn(`[perf] ${label}: ${elapsed.toFixed(1)}ms`);
  return result;
}
