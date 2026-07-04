// src/middleware/logger.ts
// Middleware de logging detalhado - NOVAIX FITNESS

import { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';

const devLogger = morgan('dev');

const prodLogger = morgan('combined', {
  skip: (req: Request, res: Response) => res.statusCode < 400,
});

const apiLogger = morgan(':method :url :status :response-time ms - :res[content-length]', {
  skip: (req: Request) => req.path === '/health',
});

const errorLogger = morgan('combined', {
  skip: (req: Request, res: Response) => res.statusCode < 400,
});

const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const log = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip || req.socket?.remoteAddress,
      userAgent: req.get('user-agent'),
      userId: (req as any).user?.id,
      timestamp: new Date().toISOString(),
    };

    if (res.statusCode >= 400) {
      console.error('[ERROR]', JSON.stringify(log));
    } else if (process.env.NODE_ENV === 'development') {
      console.info('[REQUEST]', JSON.stringify(log));
    }
  });

  next();
};

export {
  devLogger,
  prodLogger,
  apiLogger,
  errorLogger,
  requestLogger,
};
