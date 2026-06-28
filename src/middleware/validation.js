// src/middleware/validation.js
// Middleware de validação de dados

const VALIDATORS = {
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  password: (v) => v && v.length >= 8,
  name: (v) => v && v.length >= 2 && v.length <= 100,
  weight: (v) => v >= 30 && v <= 200,
  height: (v) => v >= 120 && v <= 220,
  cep: (v) => /^\d{5}-?\d{3}$/.test(v),
  phone: (v) => /^\d{10,11}$/.test(v.replace(/\D/g, '')),
};

const ERROR_MESSAGES = {
  email: 'E-mail inválido',
  password: 'Senha deve ter no mínimo 8 caracteres',
  name: 'Nome deve ter entre 2 e 100 caracteres',
  weight: 'Peso deve ser entre 30 e 200 kg',
  height: 'Altura deve ser entre 120 e 220 cm',
  cep: 'CEP inválido',
  phone: 'Telefone inválido',
};

export function validate(field, value) {
  const validator = VALIDATORS[field];
  if (!validator) return { valid: true };
  const valid = validator(value);
  return { valid, error: valid ? null : ERROR_MESSAGES[field] };
}

export function validateAll(data) {
  const errors = {};
  for (const [field, value] of Object.entries(data)) {
    const result = validate(field, value);
    if (!result.valid) errors[field] = result.error;
  }
  return { valid: Object.keys(errors).length === 0, errors };
}

export function sanitizeString(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/<[^>]*>/g, '').trim();
}

export function sanitizeObject(obj) {
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    sanitized[key] = typeof value === 'string' ? sanitizeString(value) : value;
  }
  return sanitized;
}
