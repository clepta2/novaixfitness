// src/utils/logger.js
// Logger seguro - NUNCA usar console.log diretamente

/**
 * USO:
 * import { logger } from '../utils/logger';
 * 
 * logger.dev('debug:', data);      // Só em __DEV__
 * logger.warn('aviso:', data);     // Sempre
 * logger.error('erro:', data);     // Sempre
 */

export const logger = {
  dev: (...args: unknown[]) => {
    if (__DEV__) {
      console.debug('[DEV]', ...args);
    }
  },
  warn: (...args: unknown[]) => {
    console.warn('[WARN]', ...args);
  },
  error: (...args: unknown[]) => {
    console.error('[ERROR]', ...args);
  },
  info: (...args: unknown[]) => {
    if (__DEV__) {
      console.info('[INFO]', ...args);
    }
  },
  perf: (label: string, startTime: number) => {
    if (__DEV__) {
      const duration = Date.now() - startTime;
      console.debug(`[PERF] ${label}: ${duration}ms`);
    }
  },
};

export default logger;
