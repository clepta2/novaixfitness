// src/services/auditLog.ts
// Logging e auditoria para ações críticas - NOVAIX FITNESS
// Regra 10: Audit log para toda ação crítica

import AsyncStorage from '@react-native-async-storage/async-storage';
import { tryIf } from '../../utils/tryIf';
import { sanitizeForLog, anonymizeUserId } from '../../utils/sanitize';

const AUDIT_LOG_PREFIX = 'audit:';
const MAX_LOGS_PER_USER = 1000;
const RETENTION_DAYS = 90;

export type AuditAction =
  | 'login'
  | 'logout'
  | 'register'
  | 'password_change'
  | 'password_reset'
  | 'payment'
  | 'refund'
  | 'subscription_change'
  | 'account_delete'
  | 'data_export'
  | 'profile_update'
  | 'workout_complete'
  | 'challenge_join'
  | 'admin_action'
  | 'security_event'
  | 'injection_attempt'
  | 'root_detected';

export type AuditLogEntry = {
  id: string;
  timestamp: number;
  userId: string;
  action: AuditAction;
  details: Record<string, unknown>;
  ip?: string;
  device?: string;
  result: 'success' | 'failure';
};

export type AuditLogResult = {
  ok: boolean;
  logs?: AuditLogEntry[];
  total?: number;
  error?: string;
};

function generateLogId(): string {
  return `audit_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Registra ação crítica no audit log
 * Conforme Regra 10: timestamp, userId, ação, IP, resultado
 */
export async function logAction(
  userId: string,
  action: AuditAction,
  details: Record<string, unknown> = {},
  result: 'success' | 'failure' = 'success',
  ip?: string,
  device?: string
): Promise<{ ok: boolean; error?: string }> {
  const logResult = await tryIf(async () => {
    const entry: AuditLogEntry = {
      id: generateLogId(),
      timestamp: Date.now(),
      userId: anonymizeUserId(userId),
      action,
      details: sanitizeForLog(details),
      ip,
      device,
      result,
    };

    const key = `${AUDIT_LOG_PREFIX}${userId}`;
    const stored = await AsyncStorage.getItem(key);
    let logs: AuditLogEntry[] = stored ? JSON.parse(stored) : [];

    logs.unshift(entry);
    if (logs.length > MAX_LOGS_PER_USER) {
      logs = logs.slice(0, MAX_LOGS_PER_USER);
    }

    await AsyncStorage.setItem(key, JSON.stringify(logs));
    return entry;
  }, { retries: 2, baseDelay: 100 });

  return logResult.ok
    ? { ok: true }
    : { ok: false, error: logResult.error?.message || 'Erro ao registrar audit log' };
}

/**
 * Busca logs de auditoria de um usuário
 */
export async function getAuditLogs(
  userId: string,
  limit = 100
): Promise<AuditLogResult> {
  const result = await tryIf(async () => {
    const key = `${AUDIT_LOG_PREFIX}${userId}`;
    const stored = await AsyncStorage.getItem(key);

    if (!stored) return { logs: [], total: 0 };

    const logs: AuditLogEntry[] = JSON.parse(stored);
    const now = Date.now();
    const retentionMs = RETENTION_DAYS * 24 * 60 * 60 * 1000;
    const validLogs = logs.filter(l => now - l.timestamp < retentionMs);

    return { logs: validLogs.slice(0, limit), total: validLogs.length };
  }, { retries: 1 });

  return result.ok
    ? { ok: true, ...result.data! }
    : { ok: false, error: result.error?.message || 'Erro ao buscar audit logs' };
}

/**
 * Limpa logs expirados
 */
export async function cleanupAuditLogs(): Promise<{ cleaned: number }> {
  const result = await tryIf(async () => {
    const keys = await AsyncStorage.getAllKeys();
    const auditKeys = keys.filter(k => k.startsWith(AUDIT_LOG_PREFIX));
    let cleaned = 0;
    const now = Date.now();
    const retentionMs = RETENTION_DAYS * 24 * 60 * 60 * 1000;

    for (const key of auditKeys) {
      const stored = await AsyncStorage.getItem(key);
      if (!stored) continue;
      const logs: AuditLogEntry[] = JSON.parse(stored);
      const validLogs = logs.filter(l => now - l.timestamp < retentionMs);
      if (validLogs.length < logs.length) {
        await AsyncStorage.setItem(key, JSON.stringify(validLogs));
        cleaned += logs.length - validLogs.length;
      }
    }
    return { cleaned };
  }, { retries: 1 });

  return result.ok ? result.data! : { cleaned: 0 };
}

/**
 * Verifica alertas de segurança (5+ falhas de login)
 */
export async function checkSecurityAlerts(
  userId: string,
  windowMs = 15 * 60 * 1000
): Promise<{ alert: boolean; failedLogins: number; lastFailure?: number }> {
  const result = await tryIf(async () => {
    const logsResult = await getAuditLogs(userId, 100);
    if (!logsResult.ok || !logsResult.logs) {
      return { alert: false, failedLogins: 0 };
    }

    const now = Date.now();
    const recentFailures = logsResult.logs.filter(
      log => log.action === 'login' && log.result === 'failure' && now - log.timestamp < windowMs
    );

    return {
      alert: recentFailures.length >= 5,
      failedLogins: recentFailures.length,
      lastFailure: recentFailures[0]?.timestamp,
    };
  }, { retries: 1 });

  return result.ok ? result.data! : { alert: false, failedLogins: 0 };
}
