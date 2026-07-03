// src/hooks/useRetry.ts
// Hook para operações com retry automático - NOVAIX FITNESS

import { useState, useCallback, useRef } from 'react';
import { retry, RetryOptions } from '../utils/async/retry';

interface UseRetryOptions extends RetryOptions {
  immediate?: boolean;
}

interface UseRetryResult<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  attempts: number;
  execute: () => Promise<T | null>;
  reset: () => void;
  retry: () => Promise<T | null>;
}

/**
 * Hook para operações com retry automático
 */
export function useRetry<T>(
  fn: () => Promise<T>,
  options: UseRetryOptions = {}
): UseRetryResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [attempts, setAttempts] = useState(0);
  const fnRef = useRef(fn);
  fnRef.current = fn;
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const execute = useCallback(async (): Promise<T | null> => {
    setIsLoading(true);
    setError(null);

    const result = await retry(() => fnRef.current(), optionsRef.current);

    setData(result.data || null);
    setError(result.error || null);
    setAttempts(result.attempts);
    setIsLoading(false);

    return result.data || null;
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setIsLoading(false);
    setError(null);
    setAttempts(0);
  }, []);

  return {
    data,
    isLoading,
    error,
    attempts,
    execute,
    reset,
    retry: execute,
  };
}

export default useRetry;
