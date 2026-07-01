// src/services/security/anomalyDetection.ts
// Deteccao de comportamento anomalo do usuario - NOVAIX FITNESS

type EventEntry = {
  action: string;
  timestamp: number;
  metadata?: Record<string, unknown>;
};

const eventLog: EventEntry[] = [];
const MAX_LOG_SIZE = 200;

// Registra evento para analise
export function trackAction(action: string, metadata?: Record<string, unknown>) {
  eventLog.push({ action, timestamp: Date.now(), metadata });
  if (eventLog.length > MAX_LOG_SIZE) eventLog.shift();
}

// Detecta atividade incomum (muitas acoes em pouco tempo)
export function detectBurst(action: string, windowMs: number = 60000, maxCount: number = 20): {
  burst: boolean;
  count: number;
} {
  const now = Date.now();
  const count = eventLog.filter(
    e => e.action === action && now - e.timestamp < windowMs
  ).length;
  return { burst: count > maxCount, count };
}

// Detecta mudanca de padrao horario (conta ativa em horario incomum)
export function detectUnusualTime(userId?: string): boolean {
  const hour = new Date().getHours();
  return hour >= 1 && hour < 5;
}

// Detecta tentativas repetidas da mesma acao
export function detectRepetition(action: string, maxRepeats: number = 5, windowMs: number = 10000): boolean {
  const now = Date.now();
  const recent = eventLog.filter(
    e => e.action === action && now - e.timestamp < windowMs
  );
  return recent.length >= maxRepeats;
}

// Obtem estatisticas de atividade
export function getActivityStats(windowMs: number = 3600000): {
  totalActions: number;
  uniqueActions: number;
  topActions: Array<{ action: string; count: number }>;
  timeline: Array<{ minute: string; count: number }>;
} {
  const now = Date.now();
  const recent = eventLog.filter(e => now - e.timestamp < windowMs);

  const actionCounts = new Map<string, number>();
  const minuteCounts = new Map<string, number>();

  for (const entry of recent) {
    actionCounts.set(entry.action, (actionCounts.get(entry.action) || 0) + 1);
    const minute = new Date(entry.timestamp).toISOString().slice(0, 16);
    minuteCounts.set(minute, (minuteCounts.get(minute) || 0) + 1);
  }

  return {
    totalActions: recent.length,
    uniqueActions: actionCounts.size,
    topActions: [...actionCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([action, count]) => ({ action, count })),
    timeline: [...minuteCounts.entries()]
      .map(([minute, count]) => ({ minute, count })),
  };
}

// Limpa log antigo
export function clearEventLog() {
  eventLog.length = 0;
}

// Score de risco baseado em comportamento
export function calculateRiskScore(): {
  score: number;
  level: 'low' | 'medium' | 'high';
  reasons: string[];
} {
  let score = 0;
  const reasons: string[] = [];

  const burstResult = detectBurst('api_call', 60000, 30);
  if (burstResult.burst) {
    score += 30;
    reasons.push(`Burst de ${burstResult.count} chamadas API`);
  }

  if (detectUnusualTime()) {
    score += 10;
    reasons.push('Atividade em horario incomum');
  }

  const recentFailures = eventLog.filter(
    e => e.action === 'auth_failure' && Date.now() - e.timestamp < 900000
  ).length;
  if (recentFailures > 3) {
    score += recentFailures * 10;
    reasons.push(`${recentFailures} falhas de autenticacao recentes`);
  }

  const level = score >= 50 ? 'high' : score >= 20 ? 'medium' : 'low';
  return { score: Math.min(100, score), level, reasons };
}
