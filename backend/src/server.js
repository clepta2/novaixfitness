// src/server.js
// Servidor Principal - NOVAIX FITNESS

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const workoutRoutes = require('./routes/workouts');
const exerciseRoutes = require('./routes/exercises');
const paymentRoutes = require('./routes/payments');
const webhookRoutes = require('./routes/webhooks');
const notificationRoutes = require('./routes/notifications');
const testimonialRoutes = require('./routes/testimonials');
const faqRoutes = require('./routes/faqs');
const adminRoutes = require('./routes/admin');

const { 
  defaultLimiter, 
  authLimiter, 
  webhookLimiter,
  publicApiLimiter 
} = require('./middleware/rateLimiter');
const { 
  errorHandler, 
  notFoundHandler, 
  asyncHandler 
} = require('./middleware/errorHandler');
const { 
  compressionMiddleware 
} = require('./middleware/compression');
const { 
  requestLogger 
} = require('./middleware/logger');
const { 
  cacheMiddleware, 
  invalidateCache 
} = require('./middleware/cache');
const { 
  apiTimeout 
} = require('./middleware/timeout');
const { 
  securityHeaders, 
  sanitizeInput, 
  detectSQLInjection 
} = require('./middleware/security');
const { 
  audit, 
  auditAuth, 
  auditPayment 
} = require('./middleware/audit');

const app = express();
const PORT = process.env.PORT || 3000;
const supabase = require('./config/supabase');

// ===== SEGURANÇA =====
app.use(securityHeaders);
app.use(sanitizeInput);
app.use(detectSQLInjection);

// CORS restritivo — apenas origens permitidas
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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'NOVAIX FITNESS API'
}));

app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// ===== HEALTH CHECK =====
app.get('/health', async (req, res) => {
  const health = {
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
  } catch (err) {
    health.database = 'disconnected';
    health.dbError = err.message;
  }

  const statusCode = health.database === 'connected' ? 200 : 503;
  res.status(statusCode).json(health);
});

// ===== PUBLIC ENDPOINTS =====
app.get('/api/posts/public', cacheMiddleware(60), async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 3;
    const safeLimit = Math.min(Math.max(limit, 1), 50);

    const { data, error } = await supabase
      .from('posts')
      .select('id, content, likes_count, comments_count, created_at, profiles:user_id(name)')
      .order('created_at', { ascending: false })
      .limit(safeLimit);

    if (error) throw error;
    res.json(data || []);
  } catch (err) {
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
app.use('/api/webhooks', webhookRoutes);
app.use('/webhooks', webhookRoutes);
app.use('/api/admin', adminRoutes);

// ===== 404 HANDLER =====
app.use(notFoundHandler);

// ===== ERROR HANDLER =====
app.use(errorHandler);

// ===== GRACEFUL SHUTDOWN =====
const server = app.listen(PORT, () => {
  console.log(`🚀 NOVAIX API rodando na porta ${PORT} (${process.env.NODE_ENV || 'development'})`);
});

const gracefulShutdown = (signal) => {
  console.log(`\n⚠️  ${signal} recebido. Encerrando gracefully...`);
  server.close(() => {
    console.log('✅ Servidor encerrado.');
    process.exit(0);
  });
  setTimeout(() => {
    console.error('❌ Forçando encerramento após timeout.');
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

module.exports = app;
