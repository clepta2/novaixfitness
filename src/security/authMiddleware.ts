// src/security/authMiddleware.js
// Autenticacao, rate limiting e validacao de input

export const AUTH_REQUIRED_ROUTES = [
  '/api/posts', '/api/comments', '/api/messages',
  '/api/payments', '/api/profile', '/api/workouts',
];

export function requireAuth(handler) {
  return async (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Token de autenticacao necessario' });

    try {
      const { supabase } = await import('../config/supabase');
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (error || !user) return res.status(401).json({ error: 'Token invalido' });
      req.user = user;
      return handler(req, res);
    } catch {
      return res.status(500).json({ error: 'Erro de autenticacao' });
    }
  };
}

const rateLimitStore = new Map();

export function rateLimit({ windowMs = 60000, max = 100 } = {}) {
  return (req, res, next) => {
    const key = `${req.ip}:${req.path}`;
    const now = Date.now();
    const record = rateLimitStore.get(key) || { count: 0, resetAt: now + windowMs };

    if (now > record.resetAt) { record.count = 0; record.resetAt = now + windowMs; }
    record.count++;
    rateLimitStore.set(key, record);

    if (record.count > max) {
      return res.status(429).json({ error: 'Muitas requisicoes', retryAfter: Math.ceil((record.resetAt - now) / 1000) });
    }
    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, max - record.count));
    next();
  };
}

export function validateInput(schema: Record<string, any>) {
  return (req: any, res: any, next: any) => {
    const errors: string[] = [];
    for (const [field, rules] of Object.entries(schema)) {
      const value = req.body[field];
      if (rules.required && (value === undefined || value === null || value === '')) {
        errors.push(`${field} e obrigatorio`); continue;
      }
      if (value !== undefined && value !== null) {
        if (rules.type === 'string' && typeof value !== 'string') errors.push(`${field} deve ser uma string`);
        if (rules.type === 'number' && typeof value !== 'number') errors.push(`${field} deve ser um numero`);
        if (rules.minLength && value.length < rules.minLength) errors.push(`${field} minimo ${rules.minLength} caracteres`);
        if (rules.maxLength && value.length > rules.maxLength) errors.push(`${field} maximo ${rules.maxLength} caracteres`);
        if (rules.pattern && !rules.pattern.test(value)) errors.push(`${field} formato invalido`);
      }
    }
    if (errors.length > 0) return res.status(400).json({ error: 'Dados invalidos', details: errors });
    next();
  };
}
