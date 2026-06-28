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
const testimonialRoutes = require('../../src/routes/testimonials');
const app = express();
app.use(express.json());
app.use('/api/testimonials', testimonialRoutes);

describe('Testimonial Routes', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('GET /', () => {
    it('deve listar depoimentos publicamente', async () => {
      mockSupabase.from.mockReturnValue(createChainable({ data: [{ id: 1, name: 'Test' }], error: null }));
      const res = await request(app).get('/api/testimonials');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
    });

    it('deve filtrar featured', async () => {
      const chain = createChainable({ data: [], error: null });
      mockSupabase.from.mockReturnValue(chain);
      await request(app).get('/api/testimonials?featured=true');
      expect(chain.eq).toHaveBeenCalledWith('featured', true);
    });

    it('deve retornar erro do Supabase', async () => {
      mockSupabase.from.mockReturnValue(createChainable({ data: null, error: { message: 'DB Error' } }));
      const res = await request(app).get('/api/testimonials');
      expect(res.status).toBe(400);
    });
  });

  describe('POST /', () => {
    it('deve retornar 401 sem token', async () => {
      const res = await request(app).post('/api/testimonials').send({ name: 'Test', content: 'Great app!' });
      expect(res.status).toBe(401);
    });

    it('deve retornar 400 sem name', async () => {
      const res = await request(app).post('/api/testimonials').set('Authorization', 'Bearer token').send({ content: 'Great app!' });
      expect(res.status).toBe(400);
    });

    it('deve retornar 400 com content curto', async () => {
      const res = await request(app).post('/api/testimonials').set('Authorization', 'Bearer token').send({ name: 'Test', content: 'Hi' });
      expect(res.status).toBe(400);
    });

    it('deve retornar 400 com content longo', async () => {
      const res = await request(app).post('/api/testimonials').set('Authorization', 'Bearer token').send({ name: 'Test', content: 'a'.repeat(501) });
      expect(res.status).toBe(400);
    });

    it('deve criar depoimento', async () => {
      const chain = createChainable();
      chain.single.mockResolvedValue({ data: { id: 1 }, error: null });
      mockSupabase.from.mockReturnValue(chain);
      const res = await request(app).post('/api/testimonials').set('Authorization', 'Bearer token').send({ name: 'João Silva', content: 'Excelente aplicativo de treino!', rating: 5 });
      expect(res.status).toBe(200);
    });

    it('deve limitar rating entre 1 e 5', async () => {
      const chain = createChainable();
      chain.single.mockResolvedValue({ data: { id: 1 }, error: null });
      mockSupabase.from.mockReturnValue(chain);
      const res = await request(app).post('/api/testimonials').set('Authorization', 'Bearer token').send({ name: 'Test', content: 'Great app for training!', rating: 10 });
      expect(res.status).toBe(200);
    });

    it('deve usar role padrão Aluno', async () => {
      const chain = createChainable();
      chain.single.mockResolvedValue({ data: { id: 1 }, error: null });
      mockSupabase.from.mockReturnValue(chain);
      await request(app).post('/api/testimonials').set('Authorization', 'Bearer token').send({ name: 'Test', content: 'Great app!' });
      expect(chain.insert).toHaveBeenCalledWith(expect.objectContaining({ role: 'Aluno' }));
    });

    it('deve gerar iniciais do nome', async () => {
      const chain = createChainable();
      chain.single.mockResolvedValue({ data: { id: 1 }, error: null });
      mockSupabase.from.mockReturnValue(chain);
      await request(app).post('/api/testimonials').set('Authorization', 'Bearer token').send({ name: 'Maria Silva', content: 'Great app!' });
      expect(chain.insert).toHaveBeenCalledWith(expect.objectContaining({ initials: 'MS' }));
    });

    it('deve retornar erro do Supabase', async () => {
      const chain = createChainable();
      chain.single.mockResolvedValue({ data: null, error: { message: 'DB Error' } });
      mockSupabase.from.mockReturnValue(chain);
      const res = await request(app).post('/api/testimonials').set('Authorization', 'Bearer token').send({ name: 'Test', content: 'Great app!' });
      expect(res.status).toBe(400);
    });
  });

  describe('GET /my', () => {
    it('deve listar meus depoimentos', async () => {
      mockSupabase.from.mockReturnValue(createChainable({ data: [{ id: 1 }], error: null }));
      const res = await request(app).get('/api/testimonials/my').set('Authorization', 'Bearer token');
      expect(res.status).toBe(200);
    });

    it('deve retornar erro do Supabase', async () => {
      mockSupabase.from.mockReturnValue(createChainable({ data: null, error: { message: 'DB Error' } }));
      const res = await request(app).get('/api/testimonials/my').set('Authorization', 'Bearer token');
      expect(res.status).toBe(400);
    });
  });

  describe('DELETE /:id', () => {
    it('deve deletar depoimento', async () => {
      const chain = createChainable();
      chain.then = jest.fn((resolve) => resolve({ error: null }));
      mockSupabase.from.mockReturnValue(chain);
      const res = await request(app).delete('/api/testimonials/1').set('Authorization', 'Bearer token');
      expect(res.status).toBe(200);
    });

    it('deve retornar erro do Supabase', async () => {
      const chain = createChainable();
      chain.then = jest.fn((resolve) => resolve({ error: { message: 'DB Error' } }));
      mockSupabase.from.mockReturnValue(chain);
      const res = await request(app).delete('/api/testimonials/1').set('Authorization', 'Bearer token');
      expect(res.status).toBe(400);
    });
  });
});
