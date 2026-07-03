// src/middleware/rateLimit.ts
// Middleware de rate limiting

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfter?: number;
}

const requestCounts = new Map<string, RateLimitRecord>();
const MAX_ENTRIES = 10000;

export function rateLimit(userId: string, maxRequests: number = 100, windowMs: number = 60000): RateLimitResult {
  const now = Date.now();
  const key = userId || 'anonymous';
  
  if (!requestCounts.has(key)) {
    if (requestCounts.size >= MAX_ENTRIES) {
      const oldestKey = requestCounts.keys().next().value;
      if (oldestKey) requestCounts.delete(oldestKey);
    }
    requestCounts.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1 };
  }
  
  const record = requestCounts.get(key)!;
  
  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + windowMs;
    return { allowed: true, remaining: maxRequests - 1 };
  }
  
  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0, retryAfter: Math.ceil((record.resetTime - now) / 1000) };
  }
  
  record.count++;
  return { allowed: true, remaining: maxRequests - record.count };
}

export function resetRateLimit(userId: string): void {
  requestCounts.delete(userId || 'anonymous');
}

// Cleanup antigo a cada 60 segundos
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of requestCounts.entries()) {
      if (now > record.resetTime) requestCounts.delete(key);
    }
  }, 60000);
}
