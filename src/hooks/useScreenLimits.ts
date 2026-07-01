// src/hooks/useScreenLimits.ts
// Hook para limitar acoes por tela - NOVAIX FITNESS

import { useCallback, useRef } from 'react';
import { isAllowed, LIMITS, type LimitKey } from '../utils/rateLimiter';

type ScreenLimitsConfig = {
  [action: string]: { maxAttempts: number; windowMs: number; blockDurationMs?: number };
};

// Limites pre-definidos por tela
export const SCREEN_LIMITS: Record<string, ScreenLimitsConfig> = {
  login: {
    submit: { maxAttempts: 5, windowMs: 15 * 60 * 1000, blockDurationMs: 30 * 60 * 1000 },
  },
  register: {
    submit: { maxAttempts: 3, windowMs: 60 * 60 * 1000, blockDurationMs: 60 * 60 * 1000 },
  },
  forgotPassword: {
    submit: { maxAttempts: 3, windowMs: 15 * 60 * 1000 },
  },
  feed: {
    post: { maxAttempts: 10, windowMs: 60 * 1000, blockDurationMs: 5 * 60 * 1000 },
    comment: { maxAttempts: 20, windowMs: 60 * 1000 },
    like: { maxAttempts: 30, windowMs: 60 * 1000 },
  },
  chat: {
    send: { maxAttempts: 30, windowMs: 60 * 1000, blockDurationMs: 5 * 60 * 1000 },
  },
  paywall: {
    subscribe: { maxAttempts: 5, windowMs: 60 * 60 * 1000 },
  },
  player: {
    complete: { maxAttempts: 10, windowMs: 24 * 60 * 60 * 1000 },
  },
  social: {
    follow: { maxAttempts: 20, windowMs: 60 * 1000 },
    post: { maxAttempts: 10, windowMs: 60 * 1000, blockDurationMs: 5 * 60 * 1000 },
  },
  water: {
    log: { maxAttempts: 30, windowMs: 24 * 60 * 60 * 1000 },
  },
  nutrition: {
    log: { maxAttempts: 20, windowMs: 24 * 60 * 60 * 1000 },
  },
  challenges: {
    create: { maxAttempts: 5, windowMs: 60 * 60 * 1000 },
  },
  admin: {
    delete: { maxAttempts: 20, windowMs: 60 * 1000 },
    ban: { maxAttempts: 10, windowMs: 60 * 1000 },
  },
  settings: {
    save: { maxAttempts: 10, windowMs: 60 * 1000 },
  },
};

export function useScreenLimits(screenName: string) {
  const limitsRef = useRef(SCREEN_LIMITS[screenName] || {});

  const checkLimit = useCallback((action: string): {
    allowed: boolean;
    remaining: number;
    retryAfterMs: number;
  } => {
    const config = limitsRef.current[action];
    if (!config) return { allowed: true, remaining: 999, retryAfterMs: 0 };
    return isAllowed(`${screenName}:${action}`, config);
  }, [screenName]);

  const getTimeUntilReset = useCallback((action: string): number => {
    const config = limitsRef.current[action];
    if (!config) return 0;
    const result = isAllowed(`${screenName}:${action}`, config);
    return result.retryAfterMs;
  }, [screenName]);

  return { checkLimit, getTimeUntilReset };
}
