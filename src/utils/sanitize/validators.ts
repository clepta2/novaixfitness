// src/utils/validators.ts
// Framework de validacao generico - NOVAIX FITNESS
// Validações específicas (email, cpf, phone, password) → src/helpers/validation.ts

export type ValidationRule<T> = {
  test: (value: T) => boolean;
  message: string;
};

export type ValidationResult = {
  valid: boolean;
  errors: string[];
};

export function validate<T>(value: T, rules: ValidationRule<T>[]): ValidationResult {
  const errors: string[] = [];
  for (const rule of rules) {
    if (!rule.test(value)) errors.push(rule.message);
  }
  return { valid: errors.length === 0, errors };
}

export const Rules = {
  required: (label: string): ValidationRule<string | null | undefined> => ({
    test: (v) => v !== null && v !== undefined && v !== '',
    message: `${label} e obrigatorio`,
  }),
  minLength: (min: number, label: string): ValidationRule<string> => ({
    test: (v) => v.length >= min,
    message: `${label} deve ter pelo menos ${min} caracteres`,
  }),
  maxLength: (max: number, label: string): ValidationRule<string> => ({
    test: (v) => v.length <= max,
    message: `${label} deve ter no maximo ${max} caracteres`,
  }),
  email: (): ValidationRule<string> => ({
    test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    message: 'E-mail invalido',
  }),
  pattern: (regex: RegExp, message: string): ValidationRule<string> => ({
    test: (v) => regex.test(v),
    message,
  }),
  positive: (label: string): ValidationRule<number> => ({
    test: (v) => v > 0,
    message: `${label} deve ser positivo`,
  }),
  range: (min: number, max: number, label: string): ValidationRule<number> => ({
    test: (v) => v >= min && v <= max,
    message: `${label} deve estar entre ${min} e ${max}`,
  }),
};

export function validateFields(
  fields: Record<string, { value: any; rules: ValidationRule<any>[] }>
): ValidationResult {
  const errors: string[] = [];
  for (const [name, { value, rules }] of Object.entries(fields)) {
    const result = validate(value, rules);
    if (!result.valid) errors.push(...result.errors);
  }
  return { valid: errors.length === 0, errors };
}
