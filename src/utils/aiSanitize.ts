// src/utils/aiSanitize.ts
// Sanitização de output de IA - NOVAIX FITNESS

/**
 * Remove potenciais ataques de prompt injection e conteúdo malicioso
 * de respostas de IA antes de enviar ao cliente
 */
export function sanitizeAIOutput(output: string): string {
  if (!output || typeof output !== 'string') return '';

  let sanitized = output;

  // Remove tags HTML/SCRIPT perigosas
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');

  // Remove patterns de prompt injection comuns
  const injectionPatterns = [
    /ignore\s+(previous|all|above)\s+instructions/gi,
    /you\s+are\s+now\s+(a|an)\s+/gi,
    /system\s*:\s*/gi,
    /assistant\s*:\s*/gi,
    /\[INST\]/gi,
    /<<SYS>>/gi,
    /<\|im_start\|>/gi,
    /<\|im_end\|>/gi,
  ];

  for (const pattern of injectionPatterns) {
    sanitized = sanitized.replace(pattern, '[REDACTED]');
  }

  // Remove caracteres de controle perigosos
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // Limita tamanho para prevenir abuso
  const MAX_LENGTH = 4000;
  if (sanitized.length > MAX_LENGTH) {
    sanitized = sanitized.substring(0, MAX_LENGTH) + '...';
  }

  return sanitized.trim();
}

/**
 * Valida se o output da IA contém apenas texto seguro
 */
export function isAIOutputSafe(output: string): boolean {
  if (!output) return false;

  // Verifica se não contém HTML/JS perigoso
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /data:text\/html/i,
  ];

  return !dangerousPatterns.some(pattern => pattern.test(output));
}