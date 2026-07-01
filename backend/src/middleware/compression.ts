// src/middleware/compression.ts
// Middleware de compressão de respostas - NOVAIX FITNESS

import { Request, Response } from 'express';
import compression from 'compression';

const shouldCompress = (req: Request, res: Response): boolean => {
  if (req.headers['x-no-compression']) {
    return false;
  }
  return compression.filter(req, res);
};

const compressionMiddleware = compression({
  filter: shouldCompress,
  threshold: 1024,
  level: 6,
  memLevel: 8,
});

const aggressiveCompression = compression({
  filter: shouldCompress,
  threshold: 512,
  level: 9,
  memLevel: 9,
});

export {
  compressionMiddleware,
  aggressiveCompression,
};
