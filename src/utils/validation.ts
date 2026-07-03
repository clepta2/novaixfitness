// src/utils/validation.ts
// Sistema centralizado de validação - NOVAIX FITNESS

export interface ValidationResult {
  valid: boolean;
  error?: string;
  sanitized?: string;
}

export interface ValidationRule {
  test: (value: string) => boolean;
  message: string;
  sanitize?: (value: string) => string;
}

// ─── Validadores de domínio ────────────────────────────────

export function validateEmail(email: string): ValidationResult {
  const cleaned = email.trim().toLowerCase();
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  if (!cleaned) return { valid: false, error: 'Email é obrigatório' };
  if (!regex.test(cleaned)) return { valid: false, error: 'Email inválido' };
  if (cleaned.length > 254) return { valid: false, error: 'Email muito longo' };
  
  return { valid: true, sanitized: cleaned };
}

export function validateCPF(cpf: string): ValidationResult {
  const cleaned = cpf.replace(/\D/g, '');
  
  if (!cleaned) return { valid: false, error: 'CPF é obrigatório' };
  if (cleaned.length !== 11) return { valid: false, error: 'CPF deve ter 11 dígitos' };
  if (/^(\d)\1{10}$/.test(cleaned)) return { valid: false, error: 'CPF inválido' };
  
  // Validação dos dígitos verificadores
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(cleaned[i]) * (10 - i);
  let remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== parseInt(cleaned[9])) return { valid: false, error: 'CPF inválido' };
  
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cleaned[i]) * (11 - i);
  remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== parseInt(cleaned[10])) return { valid: false, error: 'CPF inválido' };
  
  return { valid: true, sanitized: cleaned };
}

export function validatePhone(phone: string): ValidationResult {
  const cleaned = phone.replace(/\D/g, '');
  
  if (!cleaned) return { valid: false, error: 'Telefone é obrigatório' };
  if (cleaned.length < 10 || cleaned.length > 11) return { valid: false, error: 'Telefone inválido' };
  if (!/^(\d{2})9?\d{8}$/.test(cleaned)) return { valid: false, error: 'Telefone inválido' };
  
  return { valid: true, sanitized: cleaned };
}

export function validatePassword(password: string): ValidationResult & { strength: 'weak' | 'medium' | 'strong' } {
  if (!password) return { valid: false, error: 'Senha é obrigatória', strength: 'weak' };
  if (password.length < 8) return { valid: false, error: 'Senha deve ter pelo menos 8 caracteres', strength: 'weak' };
  if (password.length > 128) return { valid: false, error: 'Senha muito longa', strength: 'weak' };
  
  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  let score = 0;
  
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  if (password.length >= 12) score++;
  
  if (score >= 4) strength = 'strong';
  else if (score >= 2) strength = 'medium';
  
  // Verificar padrões fracos
  const weakPatterns = ['123456', 'password', 'qwerty', 'abc123', 'letmein'];
  if (weakPatterns.some(p => password.toLowerCase().includes(p))) {
    return { valid: false, error: 'Senha muito fraca', strength: 'weak' };
  }
  
  return { valid: true, strength };
}

export function validateName(name: string): ValidationResult {
  const cleaned = name.trim();
  
  if (!cleaned) return { valid: false, error: 'Nome é obrigatório' };
  if (cleaned.length < 2) return { valid: false, error: 'Nome muito curto' };
  if (cleaned.length > 100) return { valid: false, error: 'Nome muito longo' };
  if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(cleaned)) return { valid: false, error: 'Nome deve conter apenas letras' };
  
  return { valid: true, sanitized: cleaned };
}

export function validateWeight(weight: number | string): ValidationResult {
  const num = typeof weight === 'string' ? parseFloat(weight) : weight;
  
  if (isNaN(num)) return { valid: false, error: 'Peso inválido' };
  if (num < 20) return { valid: false, error: 'Peso muito baixo' };
  if (num > 300) return { valid: false, error: 'Peso muito alto' };
  
  return { valid: true, sanitized: String(Math.round(num * 10) / 10) };
}

export function validateHeight(height: number | string): ValidationResult {
  const num = typeof height === 'string' ? parseFloat(height) : height;
  
  if (isNaN(num)) return { valid: false, error: 'Altura inválida' };
  if (num < 100) return { valid: false, error: 'Altura muito baixa' };
  if (num < 100 || num > 250) return { valid: false, error: 'Altura inválida' };
  
  return { valid: true, sanitized: String(Math.round(num)) };
}

export function validateAge(age: number | string): ValidationResult {
  const num = typeof age === 'string' ? parseInt(age) : age;
  
  if (isNaN(num)) return { valid: false, error: 'Idade inválida' };
  if (num < 13) return { valid: false, error: 'Idade mínima: 13 anos' };
  if (num > 120) return { valid: false, error: 'Idade inválida' };
  
  return { valid: true, sanitized: String(num) };
}

// ─── Sanitização de entrada ────────────────────────────────

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>"'`;]/g, '') // Remove caracteres perigosos
    .replace(/\s+/g, ' '); // Normaliza espaços
}

export function sanitizeSQL(input: string): string {
  return input
    .replace(/['";\\]/g, '') // Remove caracteres SQL perigosos
    .replace(/--/g, '') // Remove comentários SQL
    .replace(/\/\*[\s\S]*?\*\//g, ''); // Remove blocos de comentário
}

export function sanitizeXSS(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// ─── Validador em lote ─────────────────────────────────────

export function validateAll(validations: Array<() => ValidationResult>): ValidationResult {
  for (const validate of validations) {
    const result = validate();
    if (!result.valid) return result;
  }
  return { valid: true };
}

// ─── Hook de validação ─────────────────────────────────────

export function createValidator<T>(
  value: T,
  rules: ValidationRule[]
): ValidationResult {
  const stringValue = String(value);
  
  for (const rule of rules) {
    if (!rule.test(stringValue)) {
      return { valid: false, error: rule.message };
    }
  }
  
  const sanitized = rules.reduce(
    (val, rule) => rule.sanitize ? rule.sanitize(val) : val,
    stringValue
  );
  
  return { valid: true, sanitized };
}
