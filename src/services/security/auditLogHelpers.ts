// src/services/auditLogHelpers.ts
// Funções de conveniência para audit log - NOVAIX FITNESS
// Regra 10: helpers para registrar ações críticas

import { logAction } from './auditLog';

/**
 * Registra tentativa de login
 */
export async function logLoginAttempt(
  userId: string,
  success: boolean,
  ip?: string,
  device?: string
): Promise<void> {
  await logAction(
    userId,
    'login',
    { success },
    success ? 'success' : 'failure',
    ip,
    device
  );
}

/**
 * Registra pagamento
 */
export async function logPayment(
  userId: string,
  amount: number,
  planId: string,
  success: boolean,
  ip?: string
): Promise<void> {
  await logAction(
    userId,
    'payment',
    { amount, planId },
    success ? 'success' : 'failure',
    ip
  );
}

/**
 * Registra tentativa de injection
 */
export async function logInjectionAttempt(
  userId: string,
  input: string,
  patterns: string[],
  ip?: string
): Promise<void> {
  await logAction(
    userId,
    'injection_attempt',
    { input: input.slice(0, 100), patterns },
    'failure',
    ip
  );
}

/**
 * Registra detecção de root/jailbreak
 */
export async function logRootDetected(
  userId: string,
  deviceInfo: Record<string, unknown>,
  ip?: string
): Promise<void> {
  await logAction(
    userId,
    'root_detected',
    deviceInfo,
    'failure',
    ip
  );
}

/**
 * Registra ação administrativa
 */
export async function logAdminAction(
  adminId: string,
  targetUserId: string,
  action: string,
  details: Record<string, unknown> = {}
): Promise<void> {
  await logAction(
    adminId,
    'admin_action',
    { targetUserId, action, ...details },
    'success'
  );
}
