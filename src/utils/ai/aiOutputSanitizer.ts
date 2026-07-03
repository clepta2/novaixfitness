// src/utils/aiOutputSanitizer.ts
// Sanitizacao de output da IA - Regras 171-175 (NOVAIX FITNESS)

const SCRIPT_TAG_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
const EVENT_HANDLER_REGEX = /\bon\w+\s*=/gi;
const JAVASCRIPT_URL_REGEX = /javascript\s*:/gi;
const DANGEROUS_ATTRS = /style\s*=\s*["'][^"']*expression\s*\(/gi;
const DATA_URI_REGEX = /data\s*:\s*text\/html/gi;
const IFRAME_REGEX = /<iframe\b[^>]*>/gi;
const OBJECT_REGEX = /<object\b[^>]*>/gi;
const EMBED_REGEX = /<embed\b[^>]*>/gi;
const FORM_ACTION_REGEX = /<form\b[^>]*action\s*=/gi;

const ALLOWED_TAGS = ['b', 'i', 'u', 'em', 'strong', 'br', 'p', 'ul', 'ol', 'li', 'h3', 'h4'];

const HARMFUL_PATTERNS = [
  /\b(hack|exploit|vulnerabilidade|falha de seguranca)\b.*\b(como|tutorial|passo)\b/i,
  /\b(comprar|vender|tráfico)\b.*\b(drogas|armas|ilegal)\b/i,
  /\b(suicidio|autolesao|matar)\b/i,
  /\b(promover|incitar)\b.*\b(violencia|odio|discriminacao)\b/i,
];

/**
 * Sanitiza resposta da IA antes de enviar ao frontend (Regra 171)
 * Remove tags executaveis e scripts maliciosos
 */
export function sanitizeOutput(text: string): string {
  if (!text) return '';

  let clean = text;
  clean = clean.replace(SCRIPT_TAG_REGEX, '');
  clean = clean.replace(IFRAME_REGEX, '<!-- removed -->');
  clean = clean.replace(OBJECT_REGEX, '<!-- removed -->');
  clean = clean.replace(EMBED_REGEX, '<!-- removed -->');
  clean = clean.replace(FORM_ACTION_REGEX, '<!-- removed -->');
  clean = clean.replace(EVENT_HANDLER_REGEX, '');
  clean = clean.replace(JAVASCRIPT_URL_REGEX, '');
  clean = clean.replace(DANGEROUS_ATTRS, '');
  clean = clean.replace(DATA_URI_REGEX, '');

  return clean.trim();
}

/**
 * Detecta conteudo prejudicial na resposta da IA (Regra 175)
 */
export function detectHarmfulContent(text: string): {
  safe: boolean;
  reasons: string[];
} {
  if (!text) return { safe: true, reasons: [] };

  const reasons: string[] = [];

  for (const pattern of HARMFUL_PATTERNS) {
    if (pattern.test(text)) {
      reasons.push(pattern.source.slice(0, 40));
    }
  }

  if (text.length > 2000) {
    reasons.push('Resposta excessivamente longa');
  }

  return { safe: reasons.length === 0, reasons };
}

/**
 * Sanitiza JSON de erro removendo chaves de API (Regra 174)
 */
export function sanitizeErrorForLog(error: any, apiKey?: string): string {
  let message = error?.message || error?.toString() || 'Erro desconhecido';

  if (apiKey && message.includes(apiKey)) {
    message = message.replace(new RegExp(apiKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '[REDACTED_KEY]');
  }

  message = message.replace(/sk-[a-zA-Z0-9]{20,}/g, '[REDACTED_KEY]');
  message = message.replace(/AIza[a-zA-Z0-9_-]{35}/g, '[REDACTED_KEY]');

  return message;
}

/**
 * Escapa HTML para exibicao segura de texto da IA
 */
export function escapeHTML(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
