// src/services/security/paymentProtection.ts
// Protecao de pagamentos: frequencia, duplicatas, validacao - NOVAIX FITNESS

import { isAllowed, recordAttempt, LIMITS } from '../../utils/rateLimiter';

const recentPayments = new Map<string, { amount: number; planType: string; timestamp: number }>();
const DUPLICATE_WINDOW_MS = 5 * 60 * 1000;

// Verifica se pagamento pode ser processado
export function canProcessPayment(userId: string): {
  allowed: boolean;
  reason?: string;
  retryAfterMs: number;
} {
  const result = isAllowed(`payment:${userId}`, LIMITS.payment);
  if (!result.allowed) {
    return { allowed: false, reason: 'Aguarde antes de tentar novamente', retryAfterMs: result.retryAfterMs };
  }

  const recent = recentPayments.get(userId);
  if (recent && Date.now() - recent.timestamp < DUPLICATE_WINDOW_MS) {
    return { allowed: false, reason: 'Pagamento recente detectado. Aguarde.', retryAfterMs: DUPLICATE_WINDOW_MS - (Date.now() - recent.timestamp) };
  }

  return { allowed: true, retryAfterMs: 0 };
}

// Registra pagamento processado
export function recordPayment(userId: string, planType: string, amount: number) {
  recordAttempt(`payment:${userId}`);
  recentPayments.set(userId, { planType, amount, timestamp: Date.now() });
}

// Verifica se o valor do pagamento e consistente com o plano
export function validatePaymentAmount(planType: string, amount: number): {
  valid: boolean;
  expected: number;
  message: string;
} {
  const expectedAmounts: Record<string, number[]> = {
    basic: [49.90, 39.90],
    intermediate: [79.90, 59.90],
    premium: [119.90, 89.90],
    ultra: [199.90, 149.90],
  };

  const validAmounts = expectedAmounts[planType];
  if (!validAmounts) {
    return { valid: false, expected: 0, message: 'Plano invalido' };
  }

  const isValid = validAmounts.includes(amount);
  return {
    valid: isValid,
    expected: validAmounts[0],
    message: isValid ? 'Valor valido' : `Valor esperado: R$ ${validAmounts[0]}`,
  };
}

// Valida formato de CPF
export function validateCpf(cpf: string): boolean {
  const cleaned = cpf.replace(/\D/g, '');
  if (cleaned.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cleaned)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(cleaned[i]) * (10 - i);
  let digit = 11 - (sum % 11);
  if (digit > 9) digit = 0;
  if (parseInt(cleaned[9]) !== digit) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cleaned[i]) * (11 - i);
  digit = 11 - (sum % 11);
  if (digit > 9) digit = 0;
  return parseInt(cleaned[10]) === digit;
}

// Valida formato de cartao (formato basico)
export function validateCardNumber(number: string): boolean {
  const cleaned = number.replace(/\D/g, '');
  if (cleaned.length < 13 || cleaned.length > 19) return false;

  // Luhn check
  let sum = 0;
  let isAlternate = false;
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i]);
    if (isAlternate) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    isAlternate = !isAlternate;
  }
  return sum % 10 === 0;
}

// Obtem status de protecao para exibicao
export function getPaymentProtectionStatus(userId: string): {
  recentPayment: boolean;
  attemptsRemaining: number;
} {
  const recent = recentPayments.get(userId);
  const recentPayment = !!(recent && Date.now() - recent.timestamp < DUPLICATE_WINDOW_MS);

  return { recentPayment, attemptsRemaining: LIMITS.payment.maxAttempts };
}
