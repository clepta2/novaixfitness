// src/utils/sanitize.ts
// Sanitização de dados sensíveis (LGPD) - NOVAIX FITNESS

const SENSITIVE_FIELDS = ['password', 'cpf', 'email', 'token', 'secret', 'cardNumber', 'cvv', 'pix'];

/**
 * Remove dados sensíveis de objetos para logs
 */
export function sanitizeForLog(data: Record<string, unknown>): Record<string, unknown> {
  const sanitized = { ...data };

  for (const key of Object.keys(sanitized)) {
    if (SENSITIVE_FIELDS.some(field => key.toLowerCase().includes(field))) {
      sanitized[key] = '[REDACTED]';
    }
  }

  return sanitized;
}

/**
 * Anonimiza userId para logs (não cruza com ID real)
 */
export function anonymizeUserId(userId: string): string {
  if (!userId) return 'anonymous';
  return `user_${userId.slice(0, 8)}_${Date.now().toString(36)}`;
}

/**
 * Mascara PII (email, CPF, telefone)
 */
export function maskPII(value: string): string {
  if (!value) return '';
  if (value.includes('@')) {
    const [local, domain] = value.split('@');
    return `${local.slice(0, 2)}***@${domain}`;
  }
  if (value.length > 4) {
    return `${value.slice(0, 2)}***${value.slice(-2)}`;
  }
  return '***';
}
