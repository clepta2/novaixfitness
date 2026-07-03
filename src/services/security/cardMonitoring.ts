// src/services/cardMonitoring.ts
// Monitoramento de cartoes recusados - Regra 110 - NOVAIX FITNESS
// Bloqueio apos 3 tentativas falhas (anti-carding)

import { tryIf } from '../../utils/tryIf';

interface DeclinedRecord {
  fingerprint: string;
  userId: string;
  ip: string;
  attempts: number;
  firstAttemptAt: number;
  lastAttemptAt: number;
  reasons: string[];
  blocked: boolean;
  blockedUntil?: number;
}

interface SuspiciousCheckResult {
  suspicious: boolean;
  attempts: number;
  blocked: boolean;
  remainingMs?: number;
  reasons: string[];
}

const MAX_DECLINED_ATTEMPTS = 3;
const BLOCK_DURATION_MS = 24 * 60 * 60 * 1000;
const TRACKING_WINDOW_MS = 60 * 60 * 1000;

// Store em memoria (Redis em producao server-side)
const declinedCards = new Map<string, DeclinedRecord>();
const ipDeclines = new Map<string, { count: number; windowStart: number }>();

const DECLINED_REASONS = [
  'CVC inválido',
  'Cartão Bloqueado',
  'Saldo Insuficiente',
  'Cartão Expirado',
  'Número Inválido',
];

// Regra 110: Registra tentativa de cartao recusado
export async function trackDeclinedCard(
  cardFingerprint: string,
  ip: string,
  userId: string,
  reason: string = 'Desconhecido'
): Promise<void> {
  await tryIf(async () => {
    const now = Date.now();
    const existing = declinedCards.get(cardFingerprint);

    if (existing) {
      const withinWindow = now - existing.firstAttemptAt < TRACKING_WINDOW_MS;
      if (withinWindow) {
        existing.attempts += 1;
        existing.lastAttemptAt = now;
        existing.reasons.push(reason);
        if (existing.attempts >= MAX_DECLINED_ATTEMPTS) {
          existing.blocked = true;
          existing.blockedUntil = now + BLOCK_DURATION_MS;
        }
      } else {
        declinedCards.set(cardFingerprint, {
          fingerprint: cardFingerprint,
          userId,
          ip,
          attempts: 1,
          firstAttemptAt: now,
          lastAttemptAt: now,
          reasons: [reason],
          blocked: false,
        });
      }
    } else {
      declinedCards.set(cardFingerprint, {
        fingerprint: cardFingerprint,
        userId,
        ip,
        attempts: 1,
        firstAttemptAt: now,
        lastAttemptAt: now,
        reasons: [reason],
        blocked: false,
      });
    }

    // Regra 110: Monitora por IP tambem
    const ipRecord = ipDeclines.get(ip);
    if (ipRecord && now - ipRecord.windowStart < TRACKING_WINDOW_MS) {
      ipRecord.count += 1;
    } else {
      ipDeclines.set(ip, { count: 1, windowStart: now });
    }
  }, { retries: 0 });
}

// Regra 110: Verifica se cartao e suspeito/bloqueado
export async function isCardSuspicious(
  fingerprint: string
): Promise<SuspiciousCheckResult> {
  const result = await tryIf(async () => {
    const record = declinedCards.get(fingerprint);
    if (!record) {
      return { suspicious: false, attempts: 0, blocked: false, reasons: [] };
    }

    const now = Date.now();

    // Verifica se bloqueio ainda esta ativo
    if (record.blocked && record.blockedUntil && now < record.blockedUntil) {
      return {
        suspicious: true,
        attempts: record.attempts,
        blocked: true,
        remainingMs: record.blockedUntil - now,
        reasons: record.reasons,
      };
    }

    // Desbloqueio automatico apos janela de tempo
    if (record.blocked && record.blockedUntil && now >= record.blockedUntil) {
      record.blocked = false;
      record.attempts = 0;
      record.reasons = [];
    }

    const withinWindow = now - record.firstAttemptAt < TRACKING_WINDOW_MS;
    return {
      suspicious: withinWindow && record.attempts >= MAX_DECLINED_ATTEMPTS - 1,
      attempts: withinWindow ? record.attempts : 0,
      blocked: record.blocked,
      reasons: withinWindow ? record.reasons : [],
    };
  }, { retries: 0 });

  return result.ok
    ? result.data!
    : { suspicious: false, attempts: 0, blocked: false, reasons: [] };
}

// Verifica se IP tem muitas tentativas (anti-automatizacao)
export function isIpSuspicious(ip: string): boolean {
  const record = ipDeclines.get(ip);
  if (!record) return false;
  const withinWindow = Date.now() - record.windowStart < TRACKING_WINDOW_MS;
  return withinWindow && record.count >= MAX_DECLINED_ATTEMPTS * 5;
}

// Obtem estatisticas de um cartao
export function getCardStats(fingerprint: string): DeclinedRecord | null {
  return declinedCards.get(fingerprint) || null;
}

// Limpa registros antigos
export function cleanOldRecords(): number {
  const now = Date.now();
  let cleaned = 0;
  declinedCards.forEach((record, key) => {
    if (now - record.lastAttemptAt > TRACKING_WINDOW_MS && !record.blocked) {
      declinedCards.delete(key);
      cleaned++;
    }
  });
  return cleaned;
}
