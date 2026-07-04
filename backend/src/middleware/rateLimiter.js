// src/middleware/rateLimiter.ts
// Rate limiting granular por usuário e endpoint - NOVAIX FITNESS

import rateLimit from 'express-rate-limit';

// Rate limiter padrão (100 req / 15 min)
const defaultLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Muitas requisições, tente novamente mais tarde' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter para autenticação (5 tentativas / 15 min)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Muitas tentativas de login, aguarde 15 minutos' },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

// Rate limiter para recuperação de senha (3 / hora)
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: { error: 'Muitas solicitações de recuperação, aguarde 1 hora' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter para criação de conteúdo (10 / min)
const contentCreationLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: 'Muitas criações de conteúdo, aguarde 1 minuto' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter para upload (5 / min)
const uploadLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { error: 'Muitos uploads, aguarde 1 minuto' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter para pagamentos (3 / hora)
const paymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: { error: 'Muitas operações de pagamento, aguarde 1 hora' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter para API pública (30 / min)
const publicApiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { error: 'Limite da API pública atingido' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter para webhooks (100 / min)
const webhookLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { error: 'Muitos webhooks' },
  standardHeaders: true,
  legacyHeaders: false,
});

export {
  defaultLimiter,
  authLimiter,
  passwordResetLimiter,
  contentCreationLimiter,
  uploadLimiter,
  paymentLimiter,
  publicApiLimiter,
  webhookLimiter,
};
