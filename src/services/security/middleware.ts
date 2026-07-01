// src/services/security/middleware.js
// Middleware de verificação

import { isBlocked } from './blocks';
import { checkRateLimit } from './rateLimit';
import { logAction } from './audit';

interface ActionResult {
  allowed: boolean;
  blocked: boolean;
  blockReason?: string;
  blockSeverity?: string;
  rateLimited: boolean;
  rateLimitCount?: number;
  rateLimitMax?: number;
}

interface GuardedError extends Error {
  blocked?: boolean;
  rateLimited?: boolean;
  severity?: string;
}

export async function canPerformAction(userId: string, actionType: string, blockType: string): Promise<ActionResult> {
  const [blockResult, rateResult] = await Promise.all([
    isBlocked(userId, blockType),
    checkRateLimit(userId, actionType),
  ]);

  const block = blockResult || { blocked: false };
  const rate = rateResult || { allowed: true };

  return {
    allowed: !block.blocked && rate.allowed,
    blocked: block.blocked || false,
    blockReason: block.reason,
    blockSeverity: block.severity,
    rateLimited: !rate.allowed,
    rateLimitCount: (rate as any).count,
    rateLimitMax: (rate as any).limit,
  };
}

export async function guardedAction<T>(userId: string, actionType: string, blockType: string, actionFn: () => T | Promise<T>): Promise<T> {
  const check = await canPerformAction(userId, actionType, blockType);

  if (!check.allowed) {
    const error: GuardedError = new Error(check.blocked
      ? `Conta bloqueada: ${check.blockReason}`
      : `Muitas ações. Tente novamente em alguns minutos.`
    );
    error.blocked = check.blocked;
    error.rateLimited = check.rateLimited;
    error.severity = check.blockSeverity;
    throw error;
  }

  await logAction(userId, actionType, blockType);
  return actionFn();
}
