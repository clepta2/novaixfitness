// src/middleware/errorHandler.js
// Handler centralizado de erros - NOVAIX FITNESS

const { reportError } = require('../services/errorReporter');

class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
  }
}

class ValidationError extends AppError {
  constructor(message, details = {}) {
    super(message, 400, 'VALIDATION_ERROR');
    this.details = details;
  }
}

class NotFoundError extends AppError {
  constructor(resource = 'Recurso') {
    super(`${resource} não encontrado`, 404, 'NOT_FOUND');
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Não autorizado') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

class ForbiddenError extends AppError {
  constructor(message = 'Acesso negado') {
    super(message, 403, 'FORBIDDEN');
  }
}

class ConflictError extends AppError {
  constructor(message = 'Conflito de dados') {
    super(message, 409, 'CONFLICT');
  }
}

class RateLimitError extends AppError {
  constructor(message = 'Muitas requisições') {
    super(message, 429, 'RATE_LIMIT_EXCEEDED');
  }
}

const errorHandler = (err, req, res, next) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      error: err.message,
      code: err.code,
      ...(err.details && { details: err.details }),
    });
  }

  console.error('Erro não tratado:', err);
  reportError(err, { path: req?.originalUrl, method: req?.method, ip: req?.ip });

  return res.status(500).json({
    error: 'Erro interno do servidor',
    code: 'INTERNAL_ERROR',
  });
};

const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    code: 'ROUTE_NOT_FOUND',
    path: req.originalUrl,
  });
};

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const SAFE_MESSAGES = {
  'Invalid login credentials': 'Credenciais invalidas',
  'User already registered': 'Email ja cadastrado',
  'Email not confirmed': 'Email nao confirmado',
  'Password should be at least 6 characters': 'Senha deve ter no minimo 6 caracteres',
  'Signup requires a valid password': 'Senha invalida',
  'Email not found': 'Email nao encontrado',
  'Token has expired': 'Sessao expirada, faca login novamente',
  'Invalid or expired token': 'Sessao expirada, faca login novamente',
};

function sanitizeError(err) {
  if (err.isOperational) return err.message;
  const msg = err.message || '';
  if (SAFE_MESSAGES[msg]) return SAFE_MESSAGES[msg];
  if (msg.includes('ECONNREFUSED') || msg.includes('ENOTFOUND')) return 'Servico indisponivel';
  if (msg.includes('duplicate key') || msg.includes('unique constraint')) return 'Registro duplicado';
  if (msg.includes('violates foreign key')) return 'Referencia invalida';
  if (msg.includes('violates not-null')) return 'Campo obrigatorio ausente';
  return 'Erro interno do servidor';
}

module.exports = {
  AppError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  RateLimitError,
  errorHandler,
  notFoundHandler,
  asyncHandler,
  sanitizeError,
};
