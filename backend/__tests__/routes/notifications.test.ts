const request = require('supertest');
const express = require('express');
const { mockUser, createChainable } = require('../../test-utils/mocks');

jest.mock('../../src/config/supabase', () => {
  const { mockSupabase } = require('../../test-utils/mocks');
  return mockSupabase;
});
jest.mock('../../src/middleware/auth', () => ({
  authenticate: (req, res, next) => {
    if (!req.headers.authorization) return res.status(401).json({ error: 'No token' });
    req.user = { id: 'user-123' };
    next();
  }
}));
jest.mock('node-fetch', () => {
  const fn = jest.fn().mockResolvedValue({ json: () => Promise.resolve({ data: { status: 'ok' } }) });
  fn.default = fn;
  return fn;
});

global.fetch = jest.fn().mockResolvedValue({ json: () => Promise.resolve({ data: { status: 'ok' } }) });

const mockSupabase = require('../../src/config/supabase');
const notificationRoutes = require('../../src/routes/notifications');
const app = express();
app.use(express.json());
app.use('/api/notifications', notificationRoutes);

describe('Notification Routes', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('POST /send', () => {
    it('deve retornar 401 sem token', async () => {
      const res = await request(app).post('/api/notifications/send').send({ title: 'Test', body: 'Hello' });
      expect(res.status).toBe(401);
    });

    it('deve retornar 400 sem title', async () => {
      const res = await request(app).post('/api/notifications/send').set('Authorization', 'Bearer token').send({ body: 'Hello' });
      expect(res.status).toBe(400);
    });

    it('deve retornar 404 sem push_token', async () => {
      const chain = createChainable();
      chain.single.mockResolvedValue({ data: { push_token: null }, error: null });
      mockSupabase.from.mockReturnValue(chain);
      const res = await request(app).post('/api/notifications/send').set('Authorization', 'Bearer token').send({ title: 'Test', body: 'Hello' });
      expect(res.status).toBe(404);
    });

    it('deve retornar 403 para marketing sem consent', async () => {
      const chain = createChainable();
      chain.single.mockResolvedValue({ data: { push_token: 'token', consent_marketing: false }, error: null });
      mockSupabase.from.mockReturnValue(chain);
      const res = await request(app).post('/api/notifications/send').set('Authorization', 'Bearer token').send({ title: 'Test', body: 'Hello', type: 'marketing' });
      expect(res.status).toBe(403);
    });

    it('deve enviar notificação com sucesso', async () => {
      const chain = createChainable();
      chain.single.mockResolvedValue({ data: { push_token: 'token', consent_marketing: true }, error: null });
      mockSupabase.from.mockReturnValue(chain);
      const res = await request(app).post('/api/notifications/send').set('Authorization', 'Bearer token').send({ title: 'Test', body: 'Hello', type: 'reminder' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('POST /send-bulk', () => {
    it('deve retornar 401 sem token', async () => {
      const res = await request(app).post('/api/notifications/send-bulk').send({ title: 'Test', body: 'Hello' });
      expect(res.status).toBe(401);
    });

    it('deve retornar sent: 0 sem profiles', async () => {
      const chain = createChainable();
      chain.then = jest.fn((resolve) => resolve({ data: [], error: null }));
      mockSupabase.from.mockReturnValue(chain);
      const res = await request(app).post('/api/notifications/send-bulk').set('Authorization', 'Bearer token').send({ title: 'Test', body: 'Hello' });
      expect(res.status).toBe(200);
      expect(res.body.sent).toBe(0);
    });

    it('deve filtrar por marketing', async () => {
      const chain = createChainable();
      chain.then = jest.fn((resolve) => resolve({ data: [], error: null }));
      mockSupabase.from.mockReturnValue(chain);
      await request(app).post('/api/notifications/send-bulk').set('Authorization', 'Bearer token').send({ title: 'Test', body: 'Hello', type: 'marketing' });
      expect(chain.eq).toHaveBeenCalledWith('consent_marketing', true);
    });

    it('deve filtrar por subscription_status', async () => {
      const chain = createChainable();
      chain.then = jest.fn((resolve) => resolve({ data: [], error: null }));
      mockSupabase.from.mockReturnValue(chain);
      await request(app).post('/api/notifications/send-bulk').set('Authorization', 'Bearer token').send({ title: 'Test', body: 'Hello', filter: { subscription_status: 'active' } });
      expect(chain.eq).toHaveBeenCalledWith('subscription_status', 'active');
    });

    it('deve enviar notificações em massa', async () => {
      const chain = createChainable();
      chain.then = jest.fn((resolve) => resolve({ data: [{ push_token: 'token1' }, { push_token: 'token2' }], error: null }));
      mockSupabase.from.mockReturnValue(chain);
      const res = await request(app).post('/api/notifications/send-bulk').set('Authorization', 'Bearer token').send({ title: 'Test', body: 'Hello' });
      expect(res.status).toBe(200);
      expect(res.body.sent).toBe(2);
    });

    it('deve retornar 400 sem title', async () => {
      const res = await request(app).post('/api/notifications/send-bulk').set('Authorization', 'Bearer token').send({ body: 'Hello' });
      expect(res.status).toBe(400);
    });

    it('deve filtrar profiles sem push_token', async () => {
      const chain = createChainable();
      chain.then = jest.fn((resolve) => resolve({ data: [{ push_token: 'token1' }, { push_token: null }, { push_token: 'token2' }], error: null }));
      mockSupabase.from.mockReturnValue(chain);
      const res = await request(app).post('/api/notifications/send-bulk').set('Authorization', 'Bearer token').send({ title: 'Test', body: 'Hello' });
      expect(res.status).toBe(200);
      expect(res.body.sent).toBe(2);
    });
  });

  describe('POST /schedule-reminder', () => {
    it('deve retornar 401 sem token', async () => {
      const res = await request(app).post('/api/notifications/schedule-reminder').send({ hour: 19, minute: 0 });
      expect(res.status).toBe(401);
    });

    it('deve retornar 404 sem push_token', async () => {
      const chain = createChainable();
      chain.single.mockResolvedValue({ data: { push_token: null }, error: null });
      mockSupabase.from.mockReturnValue(chain);
      const res = await request(app).post('/api/notifications/schedule-reminder').set('Authorization', 'Bearer token').send({ hour: 19, minute: 0 });
      expect(res.status).toBe(404);
    });

    it('deve agendar lembrete', async () => {
      const chain = createChainable();
      chain.single.mockResolvedValue({ data: { push_token: 'token' }, error: null });
      mockSupabase.from.mockReturnValue(chain);
      const res = await request(app).post('/api/notifications/schedule-reminder').set('Authorization', 'Bearer token').send({ hour: 19, minute: 30 });
      expect(res.status).toBe(200);
      expect(res.body.scheduled).toBe(true);
    });

    it('deve agendar para amanhã quando hora já passou', async () => {
      const chain = createChainable();
      chain.single.mockResolvedValue({ data: { push_token: 'token' }, error: null });
      mockSupabase.from.mockReturnValue(chain);
      const res = await request(app).post('/api/notifications/schedule-reminder').set('Authorization', 'Bearer token').send({ hour: 0, minute: 0 });
      expect(res.status).toBe(200);
    });
  });
});
