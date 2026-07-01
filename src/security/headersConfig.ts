// src/security/headersConfig.js
// CORS, headers de seguranca, UUID validation

export const CORS_CONFIG = {
  origin: (origin, callback) => {
    const allowed = ['https://novaixfitness.com', 'https://app.novaixfitness.com', 'http://localhost:8081', 'http://localhost:19006'];
    if (!origin || allowed.includes(origin)) callback(null, true);
    else callback(new Error('Origem nao permitida pelo CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  maxAge: 86400,
};

export function securityHeaders(req, res, next) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
}

export function isValidUUID(str) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

export function validateUUID(paramName) {
  return (req, res, next) => {
    if (req.params[paramName] && !isValidUUID(req.params[paramName])) {
      return res.status(400).json({ error: `${paramName} deve ser um UUID valido` });
    }
    next();
  };
}
