// src/services/security/sanitization.ts
// Sanitizacao e protecao contra injecoes - NOVAIX FITNESS

// Remove caracteres perigosos de input
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/data:text\/html/gi, '')
    .replace(/vbscript:/gi, '')
    .trim();
}

// Sanitiza HTML (remove todas as tags)
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

// Sanitiza para uso em queries SQL (basico - sempre use parametrizado)
export function escapeSql(input: string): string {
  return input.replace(/'/g, "''").replace(/;/g, '');
}

// Valida e sanitiza URL
export function sanitizeUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

// Limita tamanho de string
export function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - 3) + '...';
}

// Sanitiza nome de usuario
export function sanitizeUsername(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9._-]/g, '')
    .replace(/^[._-]/, '')
    .slice(0, 30)
    .toLowerCase();
}

// Sanitiza conteudo de post
export function sanitizePostContent(content: string): string {
  return stripHtml(sanitizeInput(content)).slice(0, 5000);
}

// Detecta padroes suspeitos
export function detectSuspiciousPatterns(input: string): {
  suspicious: boolean;
  patterns: string[];
} {
  const patterns: string[] = [];

  if (/<script/i.test(input)) patterns.push('XSS_SCRIPT');
  if (/javascript:/i.test(input)) patterns.push('XSS_JS');
  if (/on\w+\s*=/i.test(input)) patterns.push('XSS_EVENT');
  if (/union\s+select/i.test(input)) patterns.push('SQL_INJECT');
  if (/drop\s+table/i.test(input)) patterns.push('SQL_DROP');
  if (/;\s*delete/i.test(input)) patterns.push('SQL_DELETE');
  if (/\.\.\//i.test(input)) patterns.push('PATH_TRAVERSAL');
  if (/\$\{.*\}/i.test(input)) patterns.push('TEMPLATE_INJECT');

  return { suspicious: patterns.length > 0, patterns };
}
