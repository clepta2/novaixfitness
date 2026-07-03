// src/utils/backoff.ts
// Backoff exponencial para retries - NOVAIX FITNESS

let currentInterval = 1000;

/**
 * Calcula delay com backoff exponencial
 * @param attempt - Número da tentativa (0-indexed)
 * @param baseDelay - Delay base em ms (default: 1000)
 * @param maxDelay - Delay máximo em ms (default: 30000)
 * @returns Delay em ms
 */
export function calculateBackoff(attempt: number, baseDelay: number, maxDelay: number): number {
  const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
  currentInterval = delay;
  return delay;
}

/**
 * Reseta o intervalo para o valor base
 */
export function resetBackoff(): void {
  currentInterval = 1000;
}

/**
 * Retorna o intervalo atual
 */
export function getCurrentInterval(): number {
  return currentInterval;
}
