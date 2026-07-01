// src/services/securityAdvanced.ts
// Servicos de seguranca avancados - NOVAIX FITNESS

import { supabase } from '../config/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RATE_LIMIT_KEY = '@novaix:rate_limits';
const AUDIT_LOG_KEY = '@novaix:audit_logs';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

interface AuditLog {
  timestamp: string;
  action: string;
  userId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
}

const DEFAULT_RATE_LIMITS: Record<string, { maxRequests: number; windowMs: number }> = {
  login: { maxRequests: 5, windowMs: 60000 },
  signup: { maxRequests: 3, windowMs: 300000 },
  password_reset: { maxRequests: 3, windowMs: 300000 },
  api_call: { maxRequests: 100, windowMs: 60000 },
  payment: { maxRequests: 10, windowMs: 3600000 },
};

export async function checkRateLimit(action: string, identifier: string): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const config = DEFAULT_RATE_LIMITS[action] || DEFAULT_RATE_LIMITS.api_call;
  const key = `${RATE_LIMIT_KEY}:${action}:${identifier}`;

  try {
    const stored = await AsyncStorage.getItem(key);
    const entry: RateLimitEntry = stored ? JSON.parse(stored) : { count: 0, resetAt: Date.now() + config.windowMs };

    if (Date.now() > entry.resetAt) {
      entry.count = 0;
      entry.resetAt = Date.now() + config.windowMs;
    }

    entry.count++;
    await AsyncStorage.setItem(key, JSON.stringify(entry));

    const allowed = entry.count <= config.maxRequests;
    const remaining = Math.max(0, config.maxRequests - entry.count);

    if (!allowed) {
      await logAudit('rate_limit_exceeded', undefined, { action, identifier, count: entry.count });
    }

    return { allowed, remaining, resetAt: entry.resetAt };
  } catch {
    return { allowed: true, remaining: config.maxRequests, resetAt: Date.now() + config.windowMs };
  }
}

export async function logAudit(action: string, userId?: string, details?: Record<string, unknown>): Promise<void> {
  const log: AuditLog = {
    timestamp: new Date().toISOString(),
    action,
    userId,
    details,
  };

  try {
    const stored = await AsyncStorage.getItem(AUDIT_LOG_KEY);
    const logs: AuditLog[] = stored ? JSON.parse(stored) : [];
    logs.push(log);

    if (logs.length > 100) {
      logs.splice(0, logs.length - 100);
    }

    await AsyncStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(logs));

    if (__DEV__) {
      console.info('[Audit]', action, userId, details);
    }
  } catch {}
}

export async function getAuditLogs(limit: number = 50): Promise<AuditLog[]> {
  try {
    const stored = await AsyncStorage.getItem(AUDIT_LOG_KEY);
    const logs: AuditLog[] = stored ? JSON.parse(stored) : [];
    return logs.slice(-limit);
  } catch {
    return [];
  }
}

export async function clearAuditLogs(): Promise<void> {
  try {
    await AsyncStorage.removeItem(AUDIT_LOG_KEY);
  } catch {}
}

export async function detectSuspiciousActivity(userId: string): Promise<boolean> {
  try {
    const logs = await getAuditLogs(100);
    const userLogs = logs.filter(l => l.userId === userId);

    const failedLogins = userLogs.filter(l => l.action === 'login_failed').length;
    if (failedLogins > 5) {
      await logAudit('suspicious_activity', userId, { reason: 'multiple_failed_logins', count: failedLogins });
      return true;
    }

    const passwordResets = userLogs.filter(l => l.action === 'password_reset').length;
    if (passwordResets > 3) {
      await logAudit('suspicious_activity', userId, { reason: 'multiple_password_resets', count: passwordResets });
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

export async function validateInput(input: string, type: 'email' | 'password' | 'name' | 'phone'): Promise<{ valid: boolean; error?: string }> {
  switch (type) {
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input)) return { valid: false, error: 'Email invalido' };
      break;
    case 'password':
      if (input.length < 8) return { valid: false, error: 'Senha deve ter no minimo 8 caracteres' };
      if (!/[A-Z]/.test(input)) return { valid: false, error: 'Senha deve conter ao menos uma letra maiuscula' };
      if (!/[a-z]/.test(input)) return { valid: false, error: 'Senha deve conter ao menos uma letra minuscula' };
      if (!/[0-9]/.test(input)) return { valid: false, error: 'Senha deve conter ao menos um numero' };
      break;
    case 'name':
      if (input.length < 2) return { valid: false, error: 'Nome deve ter no minimo 2 caracteres' };
      if (input.length > 100) return { valid: false, error: 'Nome muito longo' };
      break;
    case 'phone':
      const phoneRegex = /^\+?[1-9]\d{1,14}$/;
      if (!phoneRegex.test(input.replace(/\D/g, ''))) return { valid: false, error: 'Telefone invalido' };
      break;
  }
  return { valid: true };
}

export async function sanitizeString(input: string): Promise<string> {
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, 1000);
}

export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const array = new Uint8Array(length);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    for (let i = 0; i < length; i++) array[i] = Math.floor(Math.random() * 256);
  }
  for (let i = 0; i < length; i++) {
    result += chars.charAt(array[i] % chars.length);
  }
  return result;
}

export function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}
