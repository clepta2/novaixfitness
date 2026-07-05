// src/middleware/validation.ts
// Middleware de validação de dados

interface ValidationResult {
  valid: boolean;
  error?: string | null;
}

interface ValidationErrors {
  [field: string]: string | null;
}

interface ValidateAllResult {
  valid: boolean;
  errors: ValidationErrors;
}

const VALIDATORS: Record<string, (v: any) => boolean> = {
  email: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  password: (v: string) => !!v && v.length >= 8,
  name: (v: string) => !!v && v.length >= 2 && v.length <= 100,
  weight: (v: number) => v >= 30 && v <= 200,
  height: (v: number) => v >= 120 && v <= 220,
  cep: (v: string) => /^\d{5}-?\d{3}$/.test(v),
  phone: (v: string) => /^\d{10,11}$/.test(v.replace(/\D/g, '')),
};

const ERROR_MESSAGES: Record<string, string> = {
  email: 'E-mail inválido',
  password: 'Senha deve ter no mínimo 8 caracteres',
  name: 'Nome deve ter entre 2 e 100 caracteres',
  weight: 'Peso deve ser entre 30 e 200 kg',
  height: 'Altura deve ser entre 120 e 220 cm',
  cep: 'CEP inválido',
  phone: 'Telefone inválido',
};

export function validate(field: string, value: any): ValidationResult {
  const validator = VALIDATORS[field];
  if (!validator) return { valid: true, error: null };
  const valid = validator(value);
  return { valid, error: valid ? null : ERROR_MESSAGES[field] };
}

export function validateAll(data: Record<string, any>): ValidateAllResult {
  const errors: ValidationErrors = {};
  for (const [field, value] of Object.entries(data)) {
    const result = validate(field, value);
    if (!result.valid) errors[field] = result.error ?? null;
  }
  return { valid: Object.keys(errors).length === 0, errors };
}

export function sanitizeString(str: any): string {
  if (typeof str !== 'string') return String(str);
  return str.replace(/<[^>]*>/g, '').trim();
}

export function sanitizeObject(obj: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    sanitized[key] = typeof value === 'string' ? sanitizeString(value) : value;
  }
  return sanitized;
}
