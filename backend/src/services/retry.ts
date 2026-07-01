// src/services/retry.ts
// Utilitário de retry com exponential backoff - NOVAIX FITNESS

interface RetryOptions {
  maxAttempts?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  backoffMultiplier?: number;
  retryableErrors?: number[];
  timeoutMs?: number;
}

const DEFAULT_OPTIONS: Required<Omit<RetryOptions, 'timeoutMs'>> = {
  maxAttempts: 3,
  baseDelayMs: 500,
  maxDelayMs: 10000,
  backoffMultiplier: 2,
  retryableErrors: [408, 429, 500, 502, 503, 504],
};

function calculateDelay(attempt: number, opts: Required<Omit<RetryOptions, 'timeoutMs'>>): number {
  const delay = opts.baseDelayMs * Math.pow(opts.backoffMultiplier, attempt - 1);
  const jitter = Math.random() * opts.baseDelayMs * 0.5;
  return Math.min(delay + jitter, opts.maxDelayMs);
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function withRetry<T>(fn: (attempt: number) => Promise<T>, options: RetryOptions = {}): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options } as Required<Omit<RetryOptions, 'timeoutMs'>>;
  let lastError: any;

  for (let attempt = 1; attempt <= opts.maxAttempts; attempt++) {
    try {
      return await fn(attempt);
    } catch (err: any) {
      lastError = err;

      const statusCode = err.status || err.statusCode || 0;
      const isRetryable = opts.retryableErrors.includes(statusCode)
        || err.code === 'ECONNRESET'
        || err.code === 'ETIMEDOUT'
        || err.code === 'ENOTFOUND'
        || err.message?.includes('fetch failed')
        || err.message?.includes('network');

      if (attempt >= opts.maxAttempts || !isRetryable) {
        throw lastError;
      }

      const delay = calculateDelay(attempt, opts);
      console.warn(
        `[Retry] Tentativa ${attempt}/${opts.maxAttempts} falhou.`,
        `Retentando em ${Math.round(delay)}ms...`,
        `Erro: ${err.message}`
      );
      await sleep(delay);
    }
  }

  throw lastError;
}

async function retryFetch(url: string, fetchOptions: RequestInit = {}, retryOptions: RetryOptions = {}): Promise<Response> {
  return withRetry(async () => {
    const controller = new AbortController();
    const timeout = setTimeout(
      () => controller.abort(),
      retryOptions.timeoutMs || 15000
    );

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });

      if (!response.ok) {
        const error = new Error(`HTTP ${response.status}: ${response.statusText}`) as any;
        error.status = response.status;
        error.response = response;
        throw error;
      }

      return response;
    } finally {
      clearTimeout(timeout);
    }
  }, retryOptions);
}

export { withRetry, retryFetch, sleep, calculateDelay };
export type { RetryOptions };
