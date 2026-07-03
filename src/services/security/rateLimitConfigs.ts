// src/services/rateLimitConfigs.ts
// Configurações de rate limit por ação - NOVAIX FITNESS
// Regra 5: diferentes limites por ação

export type RateLimitConfig = {
  maxAttempts: number;
  windowMs: number;
  blockDurationMs?: number;
  progressiveBlock?: boolean;
};

/**
 * Configurações predefinidas por ação
 * Conforme Regra 5: login (5/min), registro (3/hora), API geral (100/min)
 */
export const RATE_LIMIT_CONFIGS: Record<string, RateLimitConfig> = {
  login: {
    maxAttempts: 5,
    windowMs: 60 * 1000,
    blockDurationMs: 60 * 1000,
    progressiveBlock: true,
  },
  register: {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000,
    blockDurationMs: 60 * 60 * 1000,
    progressiveBlock: true,
  },
  forgotPassword: {
    maxAttempts: 3,
    windowMs: 15 * 60 * 1000,
    blockDurationMs: 15 * 60 * 1000,
    progressiveBlock: true,
  },
  payment: {
    maxAttempts: 5,
    windowMs: 60 * 60 * 1000,
    blockDurationMs: 60 * 60 * 1000,
    progressiveBlock: true,
  },
  apiGeneral: {
    maxAttempts: 100,
    windowMs: 60 * 1000,
    blockDurationMs: 5 * 60 * 1000,
    progressiveBlock: false,
  },
  webhook: {
    maxAttempts: 50,
    windowMs: 60 * 1000,
    blockDurationMs: 10 * 60 * 1000,
    progressiveBlock: true,
  },
} as const;

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
  blockLevel: number;
};

/**
 * Retorna headers HTTP para resposta 429
 */
export function getRateLimitHeaders(
  result: RateLimitResult,
  config: RateLimitConfig
): Record<string, string> {
  const headers: Record<string, string> = {
    'X-RateLimit-Limit': config.maxAttempts.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(
      (Date.now() + (result.retryAfterMs || config.windowMs)) / 1000
    ).toString(),
  };

  if (!result.allowed) {
    headers['Retry-After'] = Math.ceil(result.retryAfterMs / 1000).toString();
  }

  return headers;
}
