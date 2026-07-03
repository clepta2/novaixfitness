// src/helpers/sanitize.ts
// ============================================================
// UTILITARIO: sanitize
// TIPO: Input sanitization
// USO: Limpar inputs antes de enviar ao backend
// REGRAS: Usar em todos os inputs que vao para o servidor
// ============================================================

/**
 * Remove tags HTML e scripts perigosos.
 *
 * @example
 * ```ts
 * sanitizeHtml('<script>alert("xss")</script>Hello') // "Hello"
 * sanitizeHtml('<b>Bold</b>') // "Bold"
 * ```
 */
export function sanitizeHtml(input: string): string {
  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
}

/**
 * Remove caracteres especiais perigosos para SQL/NoSQL injection.
 *
 * @example
 * ```ts
 * sanitizeInput("user'; DROP TABLE users;--") // "user DROP TABLE users"
 * ```
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>'";\\]/g, '') // Remove caracteres perigosos
    .replace(/--/g, '') // Remove SQL comments
    .replace(/\b(DROP|DELETE|INSERT|UPDATE|EXEC|EXECUTE)\b/gi, '') // Remove SQL keywords
    .trim();
}

/**
 * Valida e sanitiza email.
 *
 * @example
 * ```ts
 * const result = sanitizeEmail('  USER@EMAIL.COM  ');
 * result.valid // true
 * result.value // "user@email.com"
 * ```
 */
export function sanitizeEmail(email: string): { valid: boolean; value: string; error?: string } {
  const value = email.toLowerCase().trim();

  if (!value) return { valid: false, value, error: 'E-mail obrigatorio' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return { valid: false, value, error: 'E-mail invalido' };
  if (value.length > 254) return { valid: false, value, error: 'E-mail muito longo' };

  return { valid: true, value };
}

/**
 * Valida e sanitiza senha.
 *
 * @example
 * ```ts
 * const result = sanitizePassword('MyP@ss123');
 * result.valid // true
 * result.strength // 4 (de 5)
 * ```
 */
export function sanitizePassword(password: string): { valid: boolean; strength: number; errors: string[] } {
  const errors: string[] = [];

  if (password.length < 8) errors.push('Minimo 8 caracteres');
  if (!/[A-Z]/.test(password)) errors.push('Pelo menos 1 maiuscula');
  if (!/[a-z]/.test(password)) errors.push('Pelo menos 1 minuscula');
  if (!/[0-9]/.test(password)) errors.push('Pelo menos 1 numero');
  if (!/[^A-Za-z0-9]/.test(password)) errors.push('Pelo menos 1 simbolo');

  const strength = 5 - errors.length;

  return { valid: errors.length === 0, strength, errors };
}

/**
 * Trunca string com ellipsis.
 *
 * @example
 * ```ts
 * truncateString('Texto muito longo aqui', 15) // "Texto muito lo..."
 * ```
 */
export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

/**
 * Formata numero com separadores de milhar.
 *
 * @example
 * ```ts
 * formatNumber(1234567) // "1.234.567"
 * ```
 */
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/**
 * Formata moeda brasileira.
 *
 * @example
 * ```ts
 * formatCurrency(129.90) // "R$ 129,90"
 * ```
 */
export function formatCurrency(value: number): string {
  return `R$ ${value.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
}
