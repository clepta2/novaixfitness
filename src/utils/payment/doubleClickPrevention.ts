// src/utils/doubleClickPrevention.ts
// Trava contra cliques duplos no checkout - Regra 107/108 - NOVAIX FITNESS

import { COLORS } from '../../constants/colors';

const LOCK_PREFIX = 'payment_lock_';
const DEFAULT_COOLDOWN_MS = 30_000;

interface LockEntry {
  timestamp: number;
  userId: string;
  expiresAt: number;
}

// In-memory lock store (Redis fallback em producao server-side)
const locks = new Map<string, LockEntry>();

// Regra 107/108: Trava de processamento com ID do usuario (30s minimo)
export function withDoubleClickProtection<T>(
  fn: () => Promise<T>,
  userId: string,
  cooldownMs: number = DEFAULT_COOLDOWN_MS
): Promise<{ ok: boolean; data?: T; error?: string }> {
  const lockKey = `${LOCK_PREFIX}${userId}`;

  if (locks.has(lockKey)) {
    const lock = locks.get(lockKey)!;
    if (Date.now() < lock.expiresAt) {
      return Promise.resolve({
        ok: false,
        error: 'Processando pagamento existente. Aguarde...',
      });
    }
    locks.delete(lockKey);
  }

  locks.set(lockKey, {
    timestamp: Date.now(),
    userId,
    expiresAt: Date.now() + cooldownMs,
  });

  return fn()
    .then((data) => {
      locks.delete(lockKey);
      return { ok: true, data };
    })
    .catch((error) => {
      locks.delete(lockKey);
      return {
        ok: false,
        error: error instanceof Error ? error.message : 'Erro no processamento',
      };
    });
}

// Verifica se o usuario esta bloqueado por pagamento em andamento
export function isPaymentLocked(userId: string): boolean {
  const lock = locks.get(`${LOCK_PREFIX}${userId}`);
  if (!lock) return false;
  if (Date.now() >= lock.expiresAt) {
    locks.delete(`${LOCK_PREFIX}${userId}`);
    return false;
  }
  return true;
}

// Remove trava manualmente (para webhooks de confirmacao)
export function releasePaymentLock(userId: string): void {
  locks.delete(`${LOCK_PREFIX}${userId}`);
}

// Obtem tempo restante da trava
export function getLockRemainingMs(userId: string): number {
  const lock = locks.get(`${LOCK_PREFIX}${userId}`);
  if (!lock) return 0;
  return Math.max(0, lock.expiresAt - Date.now());
}

// Limpa travas expiradas
export function cleanExpiredLocks(): number {
  const now = Date.now();
  let cleaned = 0;
  locks.forEach((lock, key) => {
    if (now >= lock.expiresAt) {
      locks.delete(key);
      cleaned++;
    }
  });
  return cleaned;
}
