const request = require('supertest');
const express = require('express');
const { mockUser, mockProfile, createChainable } = require('../../test-utils/mocks');

jest.mock('../../src/config/supabase', () => {
  const { mockSupabase } = require('../../test-utils/mocks');
  return mockSupabase;
});

jest.mock('../../src/middleware/auth', () => ({
  authenticate: (req, res, next) => {
    if (!req.headers.authorization) return res.status(401).json({ error: 'No token' });
    req.user = { id: 'user-123', email: 'test@test.com' };
    next();
  }
}));

const mockSupabase = require('../../src/config/supabase');
const userRoutes = require('../../src/routes/users');

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

describe('User Routes', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('GET /profile', () => {
    it('deve retornar 401 sem token', async () => {
      const res = await request(app).get('/api/users/profile');
      expect(res.status).toBe(401);
    });

    it('deve retornar perfil do usuário', async () => {
      const chain = createChainable();
      chain.single.mockResolvedValue({ data: mockProfile, error: null });
      mockSupabase.from.mockReturnValue(chain);
      const res = await request(app).get('/api/users/profile').set('Authorization', 'Bearer token');
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Test User');
    });

    it('deve retornar erro quando perfil não existe', async () => {
      const chain = createChainable();
      chain.single.mockResolvedValue({ data: null, error: { message: 'Not found' } });
      mockSupabase.from.mockReturnValue(chain);
      const res = await request(app).get('/api/users/profile').set('Authorization', 'Bearer token');
      expect(res.status).toBe(400);
    });
  });

  describe('PUT /profile', () => {
    it('deve retornar 401 sem token', async () => {
      const res = await request(app).put('/api/users/profile').send({ name: 'New Name' });
      expect(res.status).toBe(401);
    });

    it('deve atualizar perfil com name', async () => {
      const chain = createChainable();
      chain.single.mockResolvedValue({ data: { ...mockProfile, name: 'New Name' }, error: null });
      mockSupabase.from.mockReturnValue(chain);
      const res = await request(app).put('/api/users/profile').set('Authorization', 'Bearer token').send({ name: 'New Name' });
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('New Name');
    });

    it('deve atualizar perfil com avatar_url', async () => {
      const chain = createChainable();
      chain.single.mockResolvedValue({ data: { ...mockProfile, avatar_url: 'https://img.com/avatar.jpg' }, error: null });
      mockSupabase.from.mockReturnValue(chain);
      const res = await request(app).put('/api/users/profile').set('Authorization', 'Bearer token').send({ avatar_url: 'https://img.com/avatar.jpg' });
      expect(res.status).toBe(200);
    });

    it('deve atualizar perfil com onboarding', async () => {
      const chain = createChainable();
      chain.single.mockResolvedValue({ data: mockProfile, error: null });
      mockSupabase.from.mockReturnValue(chain);
      const res = await request(app).put('/api/users/profile').set('Authorization', 'Bearer token').send({ onboarding: { goal: 'fitness' } });
      expect(res.status).toBe(200);
    });

    it('deve sanitizar name com HTML', async () => {
      const chain = createChainable();
      chain.single.mockResolvedValue({ data: mockProfile, error: null });
      mockSupabase.from.mockReturnValue(chain);
      const res = await request(app).put('/api/users/profile').set('Authorization', 'Bearer token').send({ name: '<script>alert(1)</script>' });
      expect(res.status).toBe(200);
    });

    it('deve retornar erro do Supabase', async () => {
      const chain = createChainable();
      chain.single.mockResolvedValue({ data: null, error: { message: 'DB Error' } });
      mockSupabase.from.mockReturnValue(chain);
      const res = await request(app).put('/api/users/profile').set('Authorization', 'Bearer token').send({ name: 'Test' });
      expect(res.status).toBe(400);
    });
  });

  describe('POST /onboarding', () => {
    it('deve retornar 401 sem token', async () => {
      const res = await request(app).post('/api/users/onboarding').send({ goal: 'fitness' });
      expect(res.status).toBe(401);
    });

    it('deve salvar onboarding', async () => {
      const chain = createChainable();
      chain.single.mockResolvedValue({ data: mockProfile, error: null });
      mockSupabase.from.mockReturnValue(chain);
      const res = await request(app).post('/api/users/onboarding').set('Authorization', 'Bearer token').send({ goal: 'fitness', level: 'intermediate' });
      expect(res.status).toBe(200);
    });

    it('deve sanitizar dados do onboarding', async () => {
      const chain = createChainable();
      chain.single.mockResolvedValue({ data: mockProfile, error: null });
      mockSupabase.from.mockReturnValue(chain);
      const res = await request(app).post('/api/users/onboarding').set('Authorization', 'Bearer token').send({ goal: '<b>fitness</b>' });
      expect(res.status).toBe(200);
    });

    it('deve retornar erro do Supabase', async () => {
      const chain = createChainable();
      chain.single.mockResolvedValue({ data: null, error: { message: 'DB Error' } });
      mockSupabase.from.mockReturnValue(chain);
      const res = await request(app).post('/api/users/onboarding').set('Authorization', 'Bearer token').send({ goal: 'fitness' });
      expect(res.status).toBe(400);
    });
  });
});
