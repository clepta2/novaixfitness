// src/services/security/authProtection.ts
// Protecao de autenticacao: tentativas, lockout, validacao - NOVAIX FITNESS

import { isAllowed, recordAttempt, resetLimiter, LIMITS } from '../../utils/rateLimiter';

const failedAttempts = new Map<string, number>();
const lockouts = new Map<string, number>();

const MAX_FAILED_BEFORE_LOCKOUT = 5;
const LOCKOUT_DURATION_MS = 30 * 60 * 1000;

// Verifica se o usuario pode tentar login
export function canAttemptLogin(identifier: string): {
  allowed: boolean;
  reason?: string;
  retryAfterMs: number;
} {
  const lockoutEnd = lockouts.get(identifier);
  if (lockoutEnd && Date.now() < lockoutEnd) {
    return { allowed: false, reason: 'Conta temporariamente bloqueada', retryAfterMs: lockoutEnd - Date.now() };
  }

  const result = isAllowed(`login:${identifier}`, LIMITS.login);
  if (!result.allowed) {
    return { allowed: false, reason: 'Muitas tentativas. Aguarde.', retryAfterMs: result.retryAfterMs };
  }

  return { allowed: true, retryAfterMs: 0 };
}

// Registra tentativa de login falha
export function recordFailedLogin(identifier: string): { locked: boolean; attempts: number } {
  const attempts = (failedAttempts.get(identifier) || 0) + 1;
  failedAttempts.set(identifier, attempts);

  if (attempts >= MAX_FAILED_BEFORE_LOCKOUT) {
    lockouts.set(identifier, Date.now() + LOCKOUT_DURATION_MS);
    return { locked: true, attempts };
  }

  return { locked: false, attempts };
}

// Registra login bem-sucedido - limpa contadores
export function recordSuccessfulLogin(identifier: string) {
  failedAttempts.delete(identifier);
  lockouts.delete(identifier);
  resetLimiter(`login:${identifier}`);
}

// Verifica se registro e permitido
export function canRegister(email: string): {
  allowed: boolean;
  reason?: string;
  retryAfterMs: number;
} {
  const result = isAllowed(`register:${email}`, LIMITS.register);
  if (!result.allowed) {
    return { allowed: false, reason: 'Muitas tentativas de registro', retryAfterMs: result.retryAfterMs };
  }
  return { allowed: true, retryAfterMs: 0 };
}

// Verifica se recuperação de senha e permitida
export function canResetPassword(email: string): {
  allowed: boolean;
  reason?: string;
  retryAfterMs: number;
} {
  const result = isAllowed(`forgot:${email}`, LIMITS.forgotPassword);
  if (!result.allowed) {
    return { allowed: false, reason: 'Muitas solicitacoes', retryAfterMs: result.retryAfterMs };
  }
  return { allowed: true, retryAfterMs: 0 };
}

// Valida senha forte
export function validatePasswordStrength(password: string): {
  valid: boolean;
  score: number;
  issues: string[];
} {
  const issues: string[] = [];
  let score = 0;

  if (password.length >= 8) score++;
  else issues.push('Minimo 8 caracteres');

  if (password.length >= 12) score++;

  if (/[A-Z]/.test(password)) score++;
  else issues.push('Pelo menos 1 letra maiuscula');

  if (/[a-z]/.test(password)) score++;
  else issues.push('Pelo menos 1 letra minuscula');

  if (/[0-9]/.test(password)) score++;
  else issues.push('Pelo menos 1 numero');

  if (/[^A-Za-z0-9]/.test(password)) score++;
  else issues.push('Pelo menos 1 caractere especial');

  const commonPatterns = ['123456', 'password', 'qwerty', 'abc123', '111111', 'novaix'];
  if (commonPatterns.some(p => password.toLowerCase().includes(p))) {
    score = Math.max(0, score - 2);
    issues.push('Senha muito comum');
  }

  return { valid: score >= 4, score, issues };
}

// Valida formato de email
export function validateEmailFormat(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email) && email.length <= 254;
}

// Gera delay exponencial entre tentativas
export function getBackoffDelay(attempt: number): number {
  return Math.min(1000 * Math.pow(2, attempt), 60000);
}

// Verifica se o usuario esta bloqueado
export function isLockedOut(identifier: string): boolean {
  const lockoutEnd = lockouts.get(identifier);
  if (!lockoutEnd) return false;
  if (Date.now() >= lockoutEnd) {
    lockouts.delete(identifier);
    return false;
  }
  return true;
}

// Obtem numero de tentativas falhas
export function getFailedAttempts(identifier: string): number {
  return failedAttempts.get(identifier) || 0;
}
