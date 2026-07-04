// src/server.ts
// Servidor Principal - NOVAIX FITNESS

import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';
import supabase from './config/supabase';

import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import workoutRoutes from './routes/workouts';
import exerciseRoutes from './routes/exercises';
import paymentRoutes from './routes/payments';
import webhookRoutes from './routes/webhooks';
import notificationRoutes from './routes/notifications';
import testimonialRoutes from './routes/testimonials';
import faqRoutes from './routes/faqs';
import adminRoutes from './routes/admin';
import marketplaceRoutes from './routes/marketplace';

import { defaultLimiter, authLimiter, webhookLimiter, publicApiLimiter } from './middleware/rateLimiter';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { compressionMiddleware } from './middleware/compression';
import { requestLogger } from './middleware/logger';
import { cacheMiddleware } from './middleware/cache';
import { apiTimeout } from './middleware/timeout';
import { securityHeaders, sanitizeInput, detectSQLInjection } from './middleware/security';

const app = express();
const PORT = process.env.PORT || 3000;

// ===== SEGURANÇA =====
app.use(securityHeaders);
app.use(sanitizeInput);
app.use(detectSQLInjection);

// CORS restritivo
const ALLOWED_ORIGINS = (process.env.CORS_ORIGINS || 'http://localhost:8081,http://localhost:19006')
  .split(',')
  .map(o => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origem não permitida pelo CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ===== MIDDLEWARES GLOBAIS =====
app.use(compressionMiddleware);
app.use(requestLogger);
app.use(express.json({ limit: '10mb' }));
app.use(apiTimeout);

// ===== RATE LIMITING =====
app.use('/api/', defaultLimiter);
app.use('/api/auth', authLimiter);
app.use('/api/webhooks', webhookLimiter);
app.use('/api/posts/public', publicApiLimiter);

// ===== CACHE =====
app.use('/api/faqs', cacheMiddleware(600));
app.use('/api/testimonials', cacheMiddleware(300));

// ===== SWAGGER =====
app.use('/api-docs', (req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:");
  next();
}, swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'NOVAIX FITNESS API',
}));

app.get('/api-docs.json', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// ===== HEALTH CHECK =====
app.get('/health', async (req: Request, res: Response) => {
  const health: Record<string, any> = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    database: 'unknown',
  };

  try {
    const { data, error } = await supabase.from('profiles').select('id').limit(1);
    health.database = error ? 'error' : 'connected';
    if (error) health.dbError = error.message;
  } catch (err: any) {
    health.database = 'disconnected';
    health.dbError = err.message;
  }

  const statusCode = health.database === 'connected' ? 200 : 503;
  res.status(statusCode).json(health);
});

// ===== PUBLIC ENDPOINTS =====
app.get('/api/posts/public', cacheMiddleware(60), async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string, 10) || 3;
    const safeLimit = Math.min(Math.max(limit, 1), 50);

    const { data, error } = await supabase
      .from('posts')
      .select('id, content, likes_count, comments_count, created_at, profiles:user_id(name)')
      .order('created_at', { ascending: false })
      .limit(safeLimit);

    if (error) throw error;
    res.json(data || []);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// ===== ROUTES =====
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/webhooks', webhookRoutes);
app.use('/api/admin', adminRoutes);

// ===== 404 HANDLER =====
app.use(notFoundHandler);

// ===== ERROR HANDLER =====
app.use(errorHandler);

// ===== START =====
const server = app.listen(PORT, () => {
  console.log(`NOVAIX API rodando na porta ${PORT} (${process.env.NODE_ENV || 'development'})`);
});

const gracefulShutdown = (signal: string) => {
  console.log(`${signal} recebido. Encerrando...`);
  server.close(() => {
    console.log('Servidor encerrado.');
    process.exit(0);
  });
  setTimeout(() => {
    console.error('Forçando encerramento.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  gracefulShutdown('uncaughtException');
});

export default app;
