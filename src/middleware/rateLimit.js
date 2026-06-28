// src/middleware/rateLimit.js
// Middleware de rate limiting

const requestCounts = new Map();

export function rateLimit(userId, maxRequests = 100, windowMs = 60000) {
  const now = Date.now();
  const key = userId || 'anonymous';
  
  if (!requestCounts.has(key)) {
    requestCounts.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1 };
  }
  
  const record = requestCounts.get(key);
  
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

export function resetRateLimit(userId) {
  requestCounts.delete(userId || 'anonymous');
}

setInterval(() => {
  const now = Date.now();
  for (const [key, record] of requestCounts.entries()) {
    if (now > record.resetTime) requestCounts.delete(key);
  }
}, 60000);
