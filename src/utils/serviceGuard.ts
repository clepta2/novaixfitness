// src/utils/serviceGuard.ts
// Guard system para proteger services async - NOVAIX FITNESS

import { formatError } from './asyncHandler';
import { trackError } from '../services/errorTracker';
import type { ErrorSeverity } from '../services/errorTracker';

export type ServiceResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; code?: string };

export type ServiceOptions = {
  serviceName: string;
  offlineMessage?: string;
  log?: boolean;
  /** Severidade padrao para erros deste service */
  defaultSeverity?: ErrorSeverity;
};

function isOffline(): boolean {
  return typeof navigator !== 'undefined' && navigator.onLine === false;
}

export function createServiceGuard(options: ServiceOptions) {
  const {
    serviceName,
    offlineMessage = 'Sem conexao',
    log = __DEV__,
    defaultSeverity = 'medium',
  } = options;

  function onFail(err: unknown, context: string): string {
    const message = formatError(err);
    if (log) console.error(`[${serviceName}/${context}]`, message);
    trackError(err, `${serviceName}.${context}`, defaultSeverity);
    return message;
  }

  return {
    guard: async <T>(fn: () => Promise<T>): Promise<ServiceResult<T>> => {
      if (isOffline()) return { ok: false, error: offlineMessage, code: 'OFFLINE' };
      try {
        return { ok: true, data: await fn() };
      } catch (err) {
        return { ok: false, error: onFail(err, 'guard') };
      }
    },

    guardWithRetry: async <T>(
      fn: () => Promise<T>,
      maxRetries = 2,
      delayMs = 1000
    ): Promise<ServiceResult<T>> => {
      let lastError = '';
      for (let i = 0; i <= maxRetries; i++) {
        if (isOffline()) return { ok: false, error: offlineMessage, code: 'OFFLINE' };
        try {
          return { ok: true, data: await fn() };
        } catch (err) {
          lastError = formatError(err);
          if (i < maxRetries) {
            await new Promise(r => setTimeout(r, delayMs * (i + 1)));
          }
        }
      }
      if (log) console.error(`[${serviceName}] falhou apos ${maxRetries + 1} tentativas:`, lastError);
      trackError(new Error(lastError), `${serviceName}.retry`, 'high', { maxRetries });
      return { ok: false, error: lastError };
    },

    guardSupabase: async <T>(
      fn: () => Promise<{ data: T | null; error: { message: string } | null }>
    ): Promise<ServiceResult<T>> => {
      if (isOffline()) return { ok: false, error: offlineMessage, code: 'OFFLINE' };
      try {
        const { data, error } = await fn();
        if (error) {
          if (log) console.error(`[${serviceName}]`, error.message);
          trackError(new Error(error.message), `${serviceName}.supabase`, defaultSeverity);
          return { ok: false, error: error.message };
        }
        if (data === null || data === undefined) {
          return { ok: false, error: 'Dados nao encontrados', code: 'NOT_FOUND' };
        }
        return { ok: true, data };
      } catch (err) {
        return { ok: false, error: onFail(err, 'supabase') };
      }
    },
  };
}
