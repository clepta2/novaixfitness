// src/middleware/cors.ts
// Configuração CORS personalizada - NOVAIX FITNESS

import cors from 'cors';

const allowedOrigins: string[] = [
  process.env.CLIENT_URL || 'http://localhost:8081',
  process.env.ADMIN_URL || 'http://localhost:3000',
  'https://novaixfitness.com',
  'https://www.novaixfitness.com',
];

const corsOptions: cors.CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Não permitido pelo CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'X-API-Key',
  ],
  exposedHeaders: [
    'X-Total-Count',
    'X-Page-Count',
    'X-Current-Page',
    'X-Rate-Limit-Remaining',
  ],
  credentials: true,
  maxAge: 86400,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

const corsMiddleware = cors(corsOptions);

const strictCors = cors({
  ...corsOptions,
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (origin && allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Acesso negado pelo CORS'));
    }
  },
});

const publicCors = cors({
  origin: true,
  methods: ['GET'],
  allowedHeaders: ['Content-Type'],
  maxAge: 3600,
});

export {
  corsMiddleware,
  strictCors,
  publicCors,
  allowedOrigins,
};
