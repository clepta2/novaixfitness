// src/utils/aiInputFilter.ts
// Filtro de input para IA - Regras 166-170 (NOVAIX FITNESS)

const MAX_INPUT_LENGTH = 500;

const BLACKLIST_PATTERNS = [
  'ignore as regras',
  'ignore as instrucoes',
  'esqueca as regras',
  'esqueça as regras',
  'esqueca as instrucoes',
  'esqueça as instrucoes',
  'reveal system prompt',
  'mostre o system prompt',
  'mostre as instrucoes',
  'reveal your instructions',
  'sudo',
  'admin mode',
  'modo admin',
  'hack mode',
  'modo hack',
  'jailbreak',
  'bypass',
  'contorne',
  'ignore rules',
  'ignore instructions',
  'forget your rules',
  'forget instructions',
  'voce agora e',
  'you are now',
  'act as',
  'aja como',
  'override',
  'override system',
  'new instructions',
  'novas instrucoes',
  'desconsiderar',
  'desconsidere',
  'drop your constraints',
  'remova suas restricoes',
];

const CODE_INJECTION_PATTERNS = [
  /<script\b/i,
  /javascript\s*:/i,
  /on\w+\s*=/i,
  /\beval\s*\(/i,
  /\bexec\s*\(/i,
  /require\s*\(\s*['"]child_process/i,
  /\bfetch\s*\(\s*['"]http/i,
];

function matchesBlacklist(text: string): string | null {
  const lower = text.toLowerCase();
  for (const pattern of BLACKLIST_PATTERNS) {
    if (lower.includes(pattern)) return pattern;
  }
  return null;
}

function hasCodeInjection(text: string): boolean {
  return CODE_INJECTION_PATTERNS.some(p => p.test(text));
}

export interface FilterResult {
  valid: boolean;
  filteredText: string;
  reason?: string;
}

/**
 * Filtra e valida input antes de enviar para IA (Regra 167)
 */
export function filterInput(text: string, maxLength = MAX_INPUT_LENGTH): FilterResult {
  if (!text || typeof text !== 'string') {
    return { valid: false, filteredText: '', reason: 'Input vazio' };
  }

  const trimmed = text.trim();

  if (trimmed.length > maxLength) {
    return {
      valid: false,
      filteredText: trimmed.slice(0, maxLength),
      reason: `Input excede ${maxLength} caracteres`,
    };
  }

  const blacklistMatch = matchesBlacklist(trimmed);
  if (blacklistMatch) {
    return { valid: false, filteredText: '', reason: `Padrao bloqueado detectado: "${blacklistMatch}"` };
  }

  if (hasCodeInjection(trimmed)) {
    return { valid: false, filteredText: '', reason: 'Codigo injetado detectado' };
  }

  return { valid: true, filteredText: trimmed };
}

/**
 * Detecta tentativas de prompt injection (Regra 166)
 */
export function detectPromptInjection(text: string): {
  detected: boolean;
  patterns: string[];
} {
  if (!text) return { detected: false, patterns: [] };

  const found: string[] = [];
  const lower = text.toLowerCase();

  for (const pattern of BLACKLIST_PATTERNS) {
    if (lower.includes(pattern)) found.push(pattern);
  }

  for (const regex of CODE_INJECTION_PATTERNS) {
    if (regex.test(text)) found.push(regex.source);
  }

  return { detected: found.length > 0, patterns: found };
}

/**
 * Sanitiza texto para envio seguro a IA
 */
export function sanitizeForAI(text: string): string {
  if (!text) return '';

  let clean = text.trim().slice(0, MAX_INPUT_LENGTH);
  clean = clean.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  clean = clean.replace(/<[^>]*>/g, '');
  clean = clean.replace(/javascript\s*:/gi, '');

  return clean;
}
