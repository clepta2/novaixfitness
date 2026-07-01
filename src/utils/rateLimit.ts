// src/utils/rateLimit.js
// Utilitarios de rate limiting para chamadas de API - NOVAIX FITNESS

const callTimestamps = new Map<string, number>();

export function throttle(key, intervalMs = 1000) {
  const now = Date.now();
  const lastCall = callTimestamps.get(key) || 0;

  if (now - lastCall < intervalMs) {
    return false;
  }

  callTimestamps.set(key, now);
  return true;
}

export function debounce<T extends (...args: any[]) => void>(fn: T, delayMs = 300) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delayMs);
  };
}

export function canMakeCall(key, minIntervalMs = 200) {
  return throttle(key, minIntervalMs);
}

export function resetThrottle(key) {
  callTimestamps.delete(key);
}

export function resetAllThrottles() {
  callTimestamps.clear();
}
