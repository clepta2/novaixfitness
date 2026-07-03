// src/utils/inputSanitizer.ts
// Sanitização em todo boundary de entrada - NOVAIX FITNESS
// Regra 6: Sanitizar TODO input: API, forms, URLs, headers

/**
 * Padrões de injection a serem detectados
 */
const INJECTION_PATTERNS = [
  /<script[\s>]/i,           // XSS
  /javascript:/i,            // XSS
  /on\w+\s*=/i,              // Event handlers
  /union\s+select/i,         // SQL injection
  /drop\s+table/i,           // SQL injection
  /insert\s+into/i,          // SQL injection
  /delete\s+from/i,          // SQL injection
  /\.\.\//,                  // Path traversal
  /\.\.\\/,                  // Path traversal (Windows)
  /\$\{.*\}/,                // Template injection
  /\{\{.*\}\}/,              // Template injection
  /eval\s*\(/i,              // Code injection
  /exec\s*\(/i,              // Code injection
];

/**
 * Sanitiza string removendo caracteres perigosos
 */
export function sanitizeString(input: string): string {
  if (!input || typeof input !== 'string') return '';

  let sanitized = input;

  // Remover null bytes
  sanitized = sanitized.replace(/\0/g, '');

  // Remover tags HTML
  sanitized = sanitized.replace(/<[^>]*>/g, '');

  // Decodificar entidades HTML
  sanitized = sanitized
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/');

  // Remover caracteres de controle
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // Truncar se muito longo (prevenir DoS)
  const MAX_LENGTH = 10000;
  if (sanitized.length > MAX_LENGTH) {
    sanitized = sanitized.slice(0, MAX_LENGTH);
  }

  return sanitized.trim();
}

/**
 * Valida formato de email
 */
export function validateEmail(email: string): {
  valid: boolean;
  error?: string;
} {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email é obrigatório' };
  }

  const sanitized = sanitizeString(email);

  // Formato básico
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(sanitized)) {
    return { valid: false, error: 'Formato de email inválido' };
  }

  // Verificar comprimento
  if (sanitized.length > 254) {
    return { valid: false, error: 'Email muito longo' };
  }

  // Verificar partes
  const [local, domain] = sanitized.split('@');
  if (local.length > 64) {
    return { valid: false, error: 'Parte local do email muito longa' };
  }

  if (domain.length > 253) {
    return { valid: false, error: 'Domínio muito longo' };
  }

  return { valid: true };
}

/**
 * Valida CPF brasileiro
 */
export function validateCPF(cpf: string): {
  valid: boolean;
  error?: string;
} {
  if (!cpf || typeof cpf !== 'string') {
    return { valid: false, error: 'CPF é obrigatório' };
  }

  // Remover formatação
  const numbers = cpf.replace(/\D/g, '');

  // Verificar comprimento
  if (numbers.length !== 11) {
    return { valid: false, error: 'CPF deve ter 11 dígitos' };
  }

  // Verificar se todos dígitos são iguais
  if (/^(\d)\1{10}$/.test(numbers)) {
    return { valid: false, error: 'CPF inválido' };
  }

  // Validar dígitos verificadores
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(numbers.charAt(i)) * (10 - i);
  }
  let remainder = 11 - (sum % 11);
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(numbers.charAt(9))) {
    return { valid: false, error: 'CPF inválido' };
  }

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(numbers.charAt(i)) * (11 - i);
  }
  remainder = 11 - (sum % 11);
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(numbers.charAt(10))) {
    return { valid: false, error: 'CPF inválido' };
  }

  return { valid: true };
}

/**
 * Detecta padrões de injection em input
 */
export function detectInjection(input: string): {
  safe: boolean;
  patterns: string[];
} {
  if (!input || typeof input !== 'string') {
    return { safe: true, patterns: [] };
  }

  const detected: string[] = [];

  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(input)) {
      detected.push(pattern.source);
    }
  }

  return {
    safe: detected.length === 0,
    patterns: detected,
  };
}

/**
 * Sanitiza objeto inteiro (para forms/API)
 */
export function sanitizeObject<T extends Record<string, unknown>>(
  obj: T
): T {
  const sanitized = { ...obj };

  for (const [key, value] of Object.entries(sanitized)) {
    if (typeof value === 'string') {
      (sanitized as any)[key] = sanitizeString(value);
    }
  }

  return sanitized;
}

/**
 * Sanitiza URL removendo componentes perigosos
 */
export function sanitizeUrl(url: string): string {
  if (!url || typeof url !== 'string') return '';

  let sanitized = url.trim();

  // Remover javascript: e data:
  sanitized = sanitized.replace(/^(javascript|data|vbscript):/i, '');

  // Remover characters de controle
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  return sanitized;
}

/**
 * Sanitiza headers HTTP customizados
 */
export function sanitizeHeaders(
  headers: Record<string, string>
): Record<string, string> {
  const sanitized: Record<string, string> = {};

  for (const [key, value] of Object.entries(headers)) {
    // Sanitizar chave
    const sanitizedKey = key.replace(/[^\w-]/g, '');

    // Sanitizar valor
    const sanitizedValue = sanitizeString(value);

    if (sanitizedKey && sanitizedValue) {
      sanitized[sanitizedKey] = sanitizedValue;
    }
  }

  return sanitized;
}

/**
 * Trunca input longo antes de processar
 * Conforme Regra 6: truncar inputs longos
 */
export function truncateInput(
  input: string,
  maxLength = 10000
): string {
  if (!input || typeof input !== 'string') return '';
  return input.slice(0, maxLength);
}
