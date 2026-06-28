// src/middleware/logger.js
// Middleware de logging detalhado - NOVAIX FITNESS

const morgan = require('morgan');

const devLogger = morgan('dev');

const prodLogger = morgan('combined', {
  skip: (req, res) => res.statusCode < 400,
});

const apiLogger = morgan(':method :url :status :response-time ms - :res[content-length]', {
  skip: (req, res) => req.path === '/health',
});

const errorLogger = morgan('combined', {
  skip: (req, res) => res.statusCode < 400,
});

const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const log = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip || req.connection?.remoteAddress,
      userAgent: req.get('user-agent'),
      userId: req.user?.id,
      timestamp: new Date().toISOString(),
    };

    if (res.statusCode >= 400) {
      console.error('[ERROR]', JSON.stringify(log));
    } else if (process.env.NODE_ENV === 'development') {
      console.log('[REQUEST]', JSON.stringify(log));
    }
  });

  next();
};

module.exports = {
  devLogger,
  prodLogger,
  apiLogger,
  errorLogger,
  requestLogger,
};
