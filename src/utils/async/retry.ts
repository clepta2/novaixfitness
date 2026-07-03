// src/utils/async/retry.ts
// Sistema de retry avançado com backoff e circuit breaker - NOVAIX FITNESS

interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  jitter?: boolean;
  onRetry?: (error: Error, attempt: number) => void;
  circuitBreaker?: {
    threshold: number;
    resetTimeout: number;
  };
}

interface RetryResult<T> {
  ok: boolean;
  data?: T;
  error?: Error;
  attempts: number;
  duration: number;
}

// Circuit breaker state
const circuitBreakers = new Map<string, { failures: number; lastFailure: number; isOpen: boolean }>();

/**
 * Retry avançado com exponential backoff e circuit breaker
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<RetryResult<T>> {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 30000,
    backoffMultiplier = 2,
    jitter = true,
    onRetry,
    circuitBreaker,
  } = options;

  const startTime = Date.now();
  let lastError: Error | null = null;

  // Verificar circuit breaker
  if (circuitBreaker) {
    const key = fn.toString().slice(0, 100);
    const state = circuitBreakers.get(key);

    if (state?.isOpen) {
      const timeSinceLastFailure = Date.now() - state.lastFailure;
      if (timeSinceLastFailure < circuitBreaker.resetTimeout) {
        return {
          ok: false,
          error: new Error('Circuit breaker is open'),
          attempts: 0,
          duration: Date.now() - startTime,
        };
      }
      // Reset circuit breaker
      circuitBreakers.delete(key);
    }
  }

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const data = await fn();
      return {
        ok: true,
        data,
        attempts: attempt + 1,
        duration: Date.now() - startTime,
      };
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));

      // Chamar callback de retry
      if (onRetry && attempt < maxRetries) {
        onRetry(lastError, attempt + 1);
      }

      // Atualizar circuit breaker
      if (circuitBreaker) {
        const key = fn.toString().slice(0, 100);
        const state = circuitBreakers.get(key) || { failures: 0, lastFailure: 0, isOpen: false };
        state.failures++;
        state.lastFailure = Date.now();

        if (state.failures >= circuitBreaker.threshold) {
          state.isOpen = true;
        }

        circuitBreakers.set(key, state);
      }

      // Se é último attempt, não esperar
      if (attempt === maxRetries) break;

      // Calcular delay com exponential backoff
      let delay = Math.min(baseDelay * Math.pow(backoffMultiplier, attempt), maxDelay);

      // Adicionar jitter aleatório (20%)
      if (jitter) {
        const jitterAmount = delay * 0.2;
        delay = delay + (Math.random() * jitterAmount * 2 - jitterAmount);
      }

      await new Promise(r => setTimeout(r, delay));
    }
  }

  return {
    ok: false,
    error: lastError || new Error('Unknown error'),
    attempts: maxRetries + 1,
    duration: Date.now() - startTime,
  };
}

/**
 * Retry com timeout
 */
export async function retryWithTimeout<T>(
  fn: () => Promise<T>,
  timeoutMs: number,
  options: RetryOptions = {}
): Promise<RetryResult<T>> {
  return retry(
    () =>
      Promise.race([
        fn(),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), timeoutMs)
        ),
      ]),
    options
  );
}

/**
 * Retry com fallback
 */
export async function retryWithFallback<T>(
  primaryFn: () => Promise<T>,
  fallbackFn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<RetryResult<T>> {
  const primaryResult = await retry(primaryFn, options);

  if (primaryResult.ok) {
    return primaryResult;
  }

  const fallbackResult = await retry(fallbackFn, {
    ...options,
    maxRetries: 1,
  });

  return fallbackResult.ok ? fallbackResult : primaryResult;
}

/**
 * Limpar circuit breaker
 */
export function resetCircuitBreaker(key?: string): void {
  if (key) {
    circuitBreakers.delete(key);
  } else {
    circuitBreakers.clear();
  }
}

/**
 * Obter status do circuit breaker
 */
export function getCircuitBreakerStatus(key: string): { isOpen: boolean; failures: number } | null {
  const state = circuitBreakers.get(key);
  if (!state) return null;
  return { isOpen: state.isOpen, failures: state.failures };
}

export default retry;
