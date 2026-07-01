// src/hooks/useRetryWithFallback.ts
// Hook para retry com fallback automatico - NOVAIX FITNESS

import { useState, useCallback, useRef } from 'react';
import { trackError } from '../services/errorTracker';

type RetryOptions = {
  maxRetries?: number;
  baseDelayMs?: number;
  backoffMultiplier?: number;
  onError?: (error: string, attempt: number) => void;
};

type RetryResult<T> = {
  data: T | null;
  error: string | null;
  retriesUsed: number;
};

export function useRetryWithFallback() {
  const [loading, setLoading] = useState(false);
  const mountedRef = useRef(true);

  const execute = useCallback(async <T>(
    primary: () => Promise<T>,
    fallback: () => Promise<T> | T,
    options: RetryOptions = {}
  ): Promise<RetryResult<T>> => {
    const { maxRetries = 2, baseDelayMs = 1000, backoffMultiplier = 2, onError } = options;
    setLoading(true);

    let lastError = '';
    let retriesUsed = 0;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const data = await primary();
        if (mountedRef.current) setLoading(false);
        return { data, error: null, retriesUsed };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        lastError = message;
        retriesUsed = attempt + 1;
        trackError(err, 'useRetryWithFallback', 'medium', { attempt, maxRetries });
        onError?.(message, attempt);

        if (attempt < maxRetries) {
          const delay = baseDelayMs * Math.pow(backoffMultiplier, attempt);
          await new Promise(r => setTimeout(r, delay));
        }
      }
    }

    // Todos os retries falharam, tentar fallback
    try {
      const data = await fallback();
      if (mountedRef.current) setLoading(false);
      return { data, error: null, retriesUsed };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      trackError(err, 'useRetryWithFallback:fallback', 'high');
      if (mountedRef.current) setLoading(false);
      return { data: null, error: message, retriesUsed };
    }
  }, []);

  return { loading, execute };
}
