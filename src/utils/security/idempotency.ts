// src/utils/idempotency.ts
// Geração e validação de Idempotency Keys - NOVAIX FITNESS
// Regra 2: Toda chamada financeira deve incluir Idempotency-Key

import * as Crypto from 'expo-crypto';

type IdempotencyConfig = {
  action: string;
  userId: string;
  cycle?: string;
  timestamp?: number;
};

type ValidationResult = {
  valid: boolean;
  key?: string;
  error?: string;
};

/**
 * Gera Idempotency Key no formato: {acao}_{userId}_{timestamp ou ciclo}
 * Formato único e imutável conforme Regra 2
 */
export function generateIdempotencyKey(
  config: IdempotencyConfig
): string {
  const { action, userId, cycle, timestamp } = config;

  if (!action || !userId) {
    throw new Error('Ação e userId são obrigatórios');
  }

  const ts = timestamp || Date.now();
  const cyclePart = cycle || ts.toString(36);

  return `${action}_${userId}_${cyclePart}`;
}

/**
 * Valida formato da Idempotency Key
 */
export function validateIdempotencyKey(key: string): ValidationResult {
  if (!key) {
    return { valid: false, error: 'Chave de idempotência é obrigatória' };
  }

  const parts = key.split('_');
  if (parts.length < 3) {
    return {
      valid: false,
      error: 'Formato inválido: esperado {ação}_{userId}_{ciclo}',
    };
  }

  const [action, userId] = parts;

  if (!action || !userId) {
    return {
      valid: false,
      error: 'Ação e userId não podem ser vazios',
    };
  }

  // Validar caracteres permitidos
  const validPattern = /^[a-zA-Z0-9]+$/;
  if (!validPattern.test(action) || !validPattern.test(userId)) {
    return {
      valid: false,
      error: 'Caracteres inválidos na chave',
    };
  }

  return { valid: true, key };
}

/**
 * Gera chave para desafio de pagamento
 * Formato: desafio_{userId}_{cicloMensal}
 */
export function generateChallengeKey(
  userId: string,
  monthlyCycle?: string
): string {
  const cycle = monthlyCycle || new Date().toISOString().slice(0, 7); // YYYY-MM
  return generateIdempotencyKey({
    action: 'desafio',
    userId,
    cycle,
  });
}

/**
 * Gera chave para reembolso
 * Formato: reembolso_{userId}_{timestamp}
 */
export function generateRefundKey(userId: string): string {
  return generateIdempotencyKey({
    action: 'reembolso',
    userId,
  });
}

/**
 * Gera chave para assinatura
 * Formato: assinatura_{userId}_{plano}_{ciclo}
 */
export function generateSubscriptionKey(
  userId: string,
  planId: string,
  cycle?: string
): string {
  return generateIdempotencyKey({
    action: `assinatura_${planId}`,
    userId,
    cycle,
  });
}

/**
 * Gera chave para webhook de pagamento
 * Formato: webhook_{eventId}_{timestamp}
 */
export function generateWebhookKey(
  eventId: string,
  timestamp?: number
): string {
  return generateIdempotencyKey({
    action: 'webhook',
    userId: eventId,
    timestamp,
  });
}

/**
 * Dedup para webhooks
 * Verifica se evento já foi processado
 */
const processedEvents = new Map<string, number>();

export function isEventProcessed(eventId: string): boolean {
  return processedEvents.has(eventId);
}

export function markEventProcessed(
  eventId: string,
  ttlMs = 24 * 60 * 60 * 1000 // 24 horas
): void {
  processedEvents.set(eventId, Date.now());

  // Limpar eventos expirados
  const now = Date.now();
  for (const [key, timestamp] of processedEvents.entries()) {
    if (now - timestamp > ttlMs) {
      processedEvents.delete(key);
    }
  }
}

/**
 * Hash da chave para armazenamento seguro
 */
export async function hashIdempotencyKey(key: string): Promise<string> {
  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    key,
    { encoding: Crypto.CryptoEncoding.BASE64 }
  );
}
