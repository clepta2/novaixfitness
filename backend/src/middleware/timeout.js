// src/middleware/timeout.js
// Middleware de timeout para requisições - NOVAIX FITNESS

const timeout = (ms = 30000) => (req, res, next) => {
  const timer = setTimeout(() => {
    if (!res.headersSent) {
      res.status(408).json({ error: 'Requisição expirou. Tente novamente.' });
    }
  }, ms);

  res.on('finish', () => {
    clearTimeout(timer);
  });

  res.on('close', () => {
    clearTimeout(timer);
  });

  next();
};

const apiTimeout = timeout(30000);
const longTimeout = timeout(60000);
const shortTimeout = timeout(10000);

module.exports = {
  timeout,
  apiTimeout,
  longTimeout,
  shortTimeout,
};
