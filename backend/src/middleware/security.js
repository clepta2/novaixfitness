// src/middleware/security.js
// Middleware de segurança avançada - NOVAIX FITNESS

const helmet = require('helmet');

const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.supabase.co"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
});

const ipBlacklist = new Set();

const ipWhitelist = new Set([
  '127.0.0.1',
  '::1',
  '::ffff:127.0.0.1',
]);

const blockBlacklistedIP = (req, res, next) => {
  const clientIP = req.ip || req.connection?.remoteAddress;
  
  if (ipBlacklist.has(clientIP)) {
    return res.status(403).json({ error: 'Acesso negado' });
  }
  
  next();
};

const whitelistOnly = (req, res, next) => {
  const clientIP = req.ip || req.connection?.remoteAddress;
  
  if (ipWhitelist.size > 0 && !ipWhitelist.has(clientIP)) {
    return res.status(403).json({ error: 'Acesso não permitido' });
  }
  
  next();
};

const addToBlacklist = (ip) => ipBlacklist.add(ip);
const removeFromBlacklist = (ip) => ipBlacklist.delete(ip);
const addToWhitelist = (ip) => ipWhitelist.add(ip);
const removeFromWhitelist = (ip) => ipWhitelist.delete(ip);

const sanitizeInput = (req, res, next) => {
  const sanitize = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;
    
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        sanitized[key] = value
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/javascript:/gi, '')
          .replace(/on\w+\s*=/gi, '')
          .trim();
      } else if (typeof value === 'object') {
        sanitized[key] = sanitize(value);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  };

  if (req.body) req.body = sanitize(req.body);
  if (req.query) req.query = sanitize(req.query);
  if (req.params) req.params = sanitize(req.params);
  
  next();
};

const detectSQLInjection = (req, res, next) => {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|FETCH|DECLARE|TRUNCATE)\b)/i,
    /(--|;|\/\*|\*\/|xp_|sp_)/i,
    /(\b(OR|AND)\b\s+\d+\s*=\s*\d+)/i,
    /(CHAR\(|CONCAT\(|0x[0-9a-f]+)/i,
  ];

  const checkValue = (value) => {
    if (typeof value !== 'string') return false;
    return sqlPatterns.some(pattern => pattern.test(value));
  };

  const checkObject = (obj) => {
    if (!obj || typeof obj !== 'object') return false;
    return Object.values(obj).some(value => {
      if (typeof value === 'string') return checkValue(value);
      if (typeof value === 'object') return checkObject(value);
      return false;
    });
  };

  if (checkObject(req.body) || checkObject(req.query) || checkObject(req.params)) {
    console.warn('Possível tentativa de SQL injection detectada:', {
      ip: req.ip,
      path: req.path,
      method: req.method,
      timestamp: new Date().toISOString(),
    });
    return res.status(400).json({ error: 'Entrada inválida detectada' });
  }

  next();
};

module.exports = {
  securityHeaders,
  blockBlacklistedIP,
  whitelistOnly,
  addToBlacklist,
  removeFromBlacklist,
  addToWhitelist,
  removeFromWhitelist,
  sanitizeInput,
  detectSQLInjection,
};
