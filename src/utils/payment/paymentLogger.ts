// src/utils/paymentLogger.ts
// Logs sanitizados de pagamentos - Regra 115/120 - NOVAIX FITNESS
// creditCard/cvv/password → [REDACTED] antes de gravar em disco

import { COLORS } from '../../constants/colors';

type LogLevel = 'info' | 'warn' | 'error' | 'security';

interface PaymentLogEvent {
  level: LogLevel;
  action: string;
  userId?: string;
  paymentId?: string;
  gateway?: string;
  amount?: number;
  metadata?: Record<string, any>;
  timestamp?: number;
}

// Regra 120: Palavras-chave que devem ser sanitizadas nos logs
const SENSITIVE_FIELDS = [
  'creditCard', 'credit_card', 'cardNumber', 'card_number',
  'cvv', 'cvc', 'password', 'senha', 'cpf', 'token',
  'ccv', 'expiryMonth', 'expiryYear', 'expirationMonth',
  'expirationYear', 'cardHolderName', 'card_holder',
];

const SENSITIVE_REGEX = new RegExp(
  `(${SENSITIVE_FIELDS.join('|')})["\\s]*[:=]["\\s]*["']?([^"'\\s,}]+)["']?`,
  'gi'
);

// Regra 115/120: Sanitiza dados sensiveis de qualquer objeto
export function sanitizeCardData(data: any): any {
  if (data === null || data === undefined) return data;
  if (typeof data === 'string') return sanitizeString(data);
  if (typeof data !== 'object') return data;

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeCardData(item));
  }

  const sanitized: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    const lowerKey = key.toLowerCase();
    const isSensitive = SENSITIVE_FIELDS.some(
      (f) => lowerKey.includes(f.toLowerCase())
    );

    if (isSensitive) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeCardData(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

// Sanitiza string com possiveis dados de cartao embutidos
function sanitizeString(str: string): string {
  let sanitized = str.replace(SENSITIVE_REGEX, '$1: [REDACTED]');
  sanitized = sanitized.replace(
    /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g,
    '[REDACTED_CARD]'
  );
  sanitized = sanitized.replace(
    /\b\d{3,4}\b(?=.*(?:cvv|cvc|ccv))/gi,
    '[REDACTED]'
  );
  return sanitized;
}

// Regra 115/120: Registra evento de pagamento sanitizado
export function logPaymentEvent(event: PaymentLogEvent): void {
  const sanitizedEvent = {
    ...event,
    timestamp: event.timestamp || Date.now(),
    metadata: event.metadata ? sanitizeCardData(event.metadata) : undefined,
  };

  const prefix = `[Payment:${event.level.toUpperCase()}]`;
  const message = `${prefix} ${event.action}`;

  if (__DEV__) {
    switch (event.level) {
      case 'error':
        console.error(message, sanitizedEvent);
        break;
      case 'warn':
        console.warn(message, sanitizedEvent);
        break;
      case 'security':
        console.error(`[SECURITY] ${message}`, sanitizedEvent);
        break;
      default:
        console.log(message, sanitizedEvent);
    }
  }
}

// Regra 115: Log de transacao com isolamento de contexto
export function logTransaction(data: {
  paymentId: string;
  gateway: string;
  status: 'success' | 'failed' | 'pending';
  amount?: number;
  userId?: string;
  error?: string;
}): void {
  logPaymentEvent({
    level: data.status === 'failed' ? 'error' : 'info',
    action: `transaction_${data.status}`,
    userId: data.userId,
    paymentId: data.paymentId,
    gateway: data.gateway,
    amount: data.amount,
    metadata: data.error ? { error: data.error } : undefined,
  });
}

// Regra 120: Log de seguranca para tentativas suspeitas
export function logSecurityEvent(data: {
  action: string;
  userId?: string;
  ip?: string;
  fingerprint?: string;
  reason: string;
}): void {
  logPaymentEvent({
    level: 'security',
    action: data.action,
    userId: data.userId,
    metadata: {
      ip: data.ip,
      fingerprint: data.fingerprint ? '[REDACTED]' : undefined,
      reason: data.reason,
    },
  });
}
