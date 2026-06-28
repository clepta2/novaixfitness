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

const mockSupabase = require('../../src/config/supabase');
const faqRoutes = require('../../src/routes/faqs');
const app = express();
app.use(express.json());
app.use('/api/faqs', faqRoutes);

describe('FAQ Routes', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('GET /', () => {
    it('deve listar FAQs publicamente', async () => {
      mockSupabase.from.mockReturnValue(createChainable({ data: [{ id: 1, question: 'Q', answer: 'A' }], error: null }));
      const res = await request(app).get('/api/faqs');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
    });

    it('deve filtrar por category', async () => {
      const chain = createChainable({ data: [], error: null });
      mockSupabase.from.mockReturnValue(chain);
      await request(app).get('/api/faqs?category=treino');
      expect(chain.eq).toHaveBeenCalledWith('category', 'treino');
    });

    it('deve retornar erro do Supabase', async () => {
      mockSupabase.from.mockReturnValue(createChainable({ data: null, error: { message: 'DB Error' } }));
      const res = await request(app).get('/api/faqs');
      expect(res.status).toBe(400);
    });
  });

  describe('POST /', () => {
    it('deve retornar 401 sem token', async () => {
      const res = await request(app).post('/api/faqs').send({ question: 'Q', answer: 'A' });
      expect(res.status).toBe(401);
    });

    it('deve retornar 400 sem question', async () => {
      const res = await request(app).post('/api/faqs').set('Authorization', 'Bearer token').send({ answer: 'A' });
      expect(res.status).toBe(400);
    });

    it('deve criar FAQ', async () => {
      const chain = createChainable();
      chain.single.mockResolvedValue({ data: { id: 1 }, error: null });
      mockSupabase.from.mockReturnValue(chain);
      const res = await request(app).post('/api/faqs').set('Authorization', 'Bearer token').send({ question: 'Q', answer: 'A', category: 'treino', sort_order: 1 });
      expect(res.status).toBe(200);
    });
  });

  describe('PUT /:id', () => {
    it('deve atualizar FAQ', async () => {
      const chain = createChainable();
      chain.single.mockResolvedValue({ data: { id: 1 }, error: null });
      mockSupabase.from.mockReturnValue(chain);
      const res = await request(app).put('/api/faqs/1').set('Authorization', 'Bearer token').send({ question: 'New Q' });
      expect(res.status).toBe(200);
    });
  });

  describe('DELETE /:id', () => {
    it('deve deletar FAQ', async () => {
      const chain = createChainable();
      chain.then = jest.fn((resolve) => resolve({ error: null }));
      mockSupabase.from.mockReturnValue(chain);
      const res = await request(app).delete('/api/faqs/1').set('Authorization', 'Bearer token');
      expect(res.status).toBe(200);
    });
  });
});
