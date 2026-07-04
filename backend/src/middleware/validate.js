// src/middleware/validate.ts
// Middleware de validação de entrada - NOVAIX FITNESS

import { Request, Response, NextFunction } from 'express';

const sanitizeString = (str: any): any => {
  if (typeof str !== 'string') return str;
  return str.replace(/[<>]/g, '').trim();
};

const sanitizeObject = (obj: any): any => {
  if (!obj || typeof obj !== 'object') return obj;
  const sanitized: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
};

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateCpf = (cpf: string): boolean => {
  if (!cpf || typeof cpf !== 'string') return false;
  const digits = cpf.replace(/\D/g, '');
  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(digits[i], 10) * (10 - i);
  let rest = (sum * 10) % 11;
  if (rest === 10) rest = 0;
  if (rest !== parseInt(digits[9], 10)) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(digits[i], 10) * (11 - i);
  rest = (sum * 10) % 11;
  if (rest === 10) rest = 0;
  return rest === parseInt(digits[10], 10);
};

const validatePassword = (password: string): boolean => {
  return typeof password === 'string' && password.length >= 6;
};

const validateRequired = (fields: string[], body: any): string | null => {
  const missing = fields.filter(f => !body[f]);
  if (missing.length > 0) {
    return `Campos obrigatórios: ${missing.join(', ')}`;
  }
  return null;
};

const validateRange = (value: any, min: number, max: number, name: string): string | number => {
  const num = parseInt(value, 10);
  if (isNaN(num) || num < min || num > max) {
    return `${name} deve ser entre ${min} e ${max}`;
  }
  return num;
};

export interface ValidationRule {
  required?: boolean;
  type?: 'string' | 'number' | 'email' | 'cpf' | 'password' | 'array' | 'object';
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  minItems?: number;
  maxItems?: number;
  enum?: any[];
  pattern?: RegExp;
}

export type ValidationSchema = Record<string, ValidationRule>;

const validateQuery = (schema: ValidationSchema) => (req: Request, res: Response, next: NextFunction) => {
  const errors: string[] = [];
  
  for (const [key, rules] of Object.entries(schema)) {
    const value = req.query[key] as string | undefined;
    
    if (rules.required && (value === undefined || value === '')) {
      errors.push(`${key} é obrigatório`);
      continue;
    }
    
    if (value !== undefined && value !== '') {
      if (rules.type === 'number') {
        const num = validateRange(value, rules.min || 1, rules.max || 1000, key);
        if (typeof num === 'string') {
          errors.push(num);
        } else {
          req.query[key] = num as any;
        }
      }
      
      if (rules.enum && !rules.enum.includes(value)) {
        errors.push(`${key} deve ser: ${rules.enum.join(', ')}`);
      }
      
      if (rules.pattern && !rules.pattern.test(value)) {
        errors.push(`${key} formato inválido`);
      }
    }
  }
  
  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join('. ') });
  }
  
  next();
};

const validateBody = (schema: ValidationSchema) => (req: Request, res: Response, next: NextFunction) => {
  const errors: string[] = [];
  
  req.body = sanitizeObject(req.body);
  
  for (const [key, rules] of Object.entries(schema)) {
    const value = req.body[key];
    
    if (rules.required && (value === undefined || value === null || value === '')) {
      errors.push(`${key} é obrigatório`);
      continue;
    }
    
    if (value !== undefined && value !== null && value !== '') {
      if (rules.type === 'email' && !validateEmail(value)) {
        errors.push(`${key} deve ser um email válido`);
      }

      if (rules.type === 'cpf' && !validateCpf(value)) {
        errors.push(`${key} deve ser um CPF válido`);
      }
      
      if (rules.type === 'password' && !validatePassword(value)) {
        errors.push(`${key} deve ter pelo menos 6 caracteres`);
      }
      
      if (rules.type === 'string' && typeof value !== 'string') {
        errors.push(`${key} deve ser uma string`);
      }
      
      if (rules.type === 'number') {
        const num = Number(value);
        if (isNaN(num)) {
          errors.push(`${key} deve ser um número`);
        } else {
          if (rules.min !== undefined && num < rules.min) {
            errors.push(`${key} deve ser no mínimo ${rules.min}`);
          }
          if (rules.max !== undefined && num > rules.max) {
            errors.push(`${key} deve ser no máximo ${rules.max}`);
          }
        }
      }
      
      if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
        errors.push(`${key} deve ter pelo menos ${rules.minLength} caracteres`);
      }
      
      if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
        errors.push(`${key} deve ter no máximo ${rules.maxLength} caracteres`);
      }
      
      if (rules.enum && !rules.enum.includes(value)) {
        errors.push(`${key} deve ser: ${rules.enum.join(', ')}`);
      }
      
      if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
        errors.push(`${key} formato inválido`);
      }

      if (rules.type === 'array') {
        if (!Array.isArray(value)) {
          errors.push(`${key} deve ser um array`);
        } else {
          if (rules.minItems && value.length < rules.minItems) {
            errors.push(`${key} deve ter pelo menos ${rules.minItems} itens`);
          }
          if (rules.maxItems && value.length > rules.maxItems) {
            errors.push(`${key} deve ter no máximo ${rules.maxItems} itens`);
          }
        }
      }

      if (rules.type === 'object') {
        if (typeof value !== 'object' || value === null || Array.isArray(value)) {
          errors.push(`${key} deve ser um objeto`);
        }
      }
    }
  }
  
  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join('. ') });
  }
  
  next();
};

export {
  sanitizeString,
  sanitizeObject,
  validateEmail,
  validatePassword,
  validateCpf,
  validateRequired,
  validateRange,
  validateQuery,
  validateBody,
};
