// src/middleware/timeout.ts
// Middleware de timeout para requisições - NOVAIX FITNESS

import { Request, Response, NextFunction } from 'express';

const timeout = (ms = 30000) => (req: Request, res: Response, next: NextFunction) => {
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

export {
  timeout,
  apiTimeout,
  longTimeout,
  shortTimeout,
};
