// src/utils/piiRemover.ts
// Remocao de dados pessoais (PII) antes de enviar a IA - Regra 169 (NOVAIX FITNESS)

const CPF_REGEX = /\d{3}\.?\d{3}\.?\d{3}-?\d{2}/g;
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const PHONE_REGEX = /(\(?\d{2}\)?\s?)?\d{4,5}-?\d{4}/g;
const CREDIT_CARD_REGEX = /\d{4}\s?\d{4}\s?\d{4}\s?\d{4}/g;
const PIX_KEY_REGEX = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;

const REPLACEMENTS: [RegExp, string][] = [
  [CPF_REGEX, '[CPF]'],
  [EMAIL_REGEX, '[EMAIL]'],
  [PHONE_REGEX, '[TELEFONE]'],
  [CREDIT_CARD_REGEX, '[CARTAO]'],
  [PIX_KEY_REGEX, '[PIX]'],
];

/**
 * Remove PII de texto antes de enviar ao Gemini (Regra 169)
 */
export function removePII(text: string): string {
  if (!text) return '';

  let clean = text;
  for (const [pattern, replacement] of REPLACEMENTS) {
    clean = clean.replace(pattern, replacement);
  }
  return clean;
}

/**
 * Mascara dados sensiveis de um objeto antes de enviar a IA
 */
export function maskSensitiveData(data: Record<string, any>): Record<string, any> {
  if (!data || typeof data !== 'object') return data;

  const masked = { ...data };

  const sensitiveFields = ['cpf', 'email', 'phone', 'telefone', 'celular', 'creditCard', 'cardNumber'];

  for (const key of Object.keys(masked)) {
    const lower = key.toLowerCase();
    const isSensitive = sensitiveFields.some(f => lower.includes(f));

    if (isSensitive && typeof masked[key] === 'string') {
      masked[key] = '[REDACTED]';
    } else if (typeof masked[key] === 'object' && masked[key] !== null) {
      masked[key] = maskSensitiveData(masked[key]);
    }
  }

  return masked;
}

/**
 * Remove PII de contexto do usuario antes de enviar ao coach IA
 */
export function sanitizeProfileForAI(profile: Record<string, any>): Record<string, any> {
  const safe = { ...profile };

  delete safe.cpf;
  delete safe.email;
  delete safe.phone;
  delete safe.telefone;
  delete safe.celular;
  delete safe.lastName;
  delete safe.sobrenome;
  delete safe.fullName;
  delete safe.endereco;
  delete safe.address;

  if (safe.name) {
    const parts = safe.name.split(' ');
    safe.firstName = parts[0];
    delete safe.name;
  }

  return safe;
}
