// src/middleware/validate.js
// Middleware de validação de entrada - NOVAIX FITNESS

const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str.replace(/[<>]/g, '').trim();
};

const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  const sanitized = {};
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

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return typeof password === 'string' && password.length >= 6;
};

const validateRequired = (fields, body) => {
  const missing = fields.filter(f => !body[f]);
  if (missing.length > 0) {
    return `Campos obrigatórios: ${missing.join(', ')}`;
  }
  return null;
};

const validateRange = (value, min, max, name) => {
  const num = parseInt(value, 10);
  if (isNaN(num) || num < min || num > max) {
    return `${name} deve ser entre ${min} e ${max}`;
  }
  return num;
};

const validateQuery = (schema) => (req, res, next) => {
  const errors = [];
  
  for (const [key, rules] of Object.entries(schema)) {
    const value = req.query[key];
    
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
          req.query[key] = num;
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

const validateBody = (schema) => (req, res, next) => {
  const errors = [];
  
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
    }
  }
  
  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join('. ') });
  }
  
  next();
};

module.exports = {
  sanitizeString,
  sanitizeObject,
  validateEmail,
  validatePassword,
  validateRequired,
  validateRange,
  validateQuery,
  validateBody,
};
