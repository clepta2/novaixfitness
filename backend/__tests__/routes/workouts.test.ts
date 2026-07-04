// __tests__/routes/workouts.test.js
const request = require('supertest');
const express = require('express');
const { mockUser, mockProfile, mockWorkout, createChainable } = require('../../test-utils/mocks');

jest.mock('../../src/config/supabase', () => {
  const { mockSupabase } = require('../../test-utils/mocks');
  return mockSupabase;
});

jest.mock('../../src/middleware/cache', () => ({
  cacheMiddleware: () => (req, res, next) => next(),
  invalidateCache: () => (req, res, next) => next(),
}));

jest.mock('../../src/middleware/audit', () => ({
  auditWorkout: (req, res, next) => next(),
  audit: () => (req, res, next) => next(),
}));

jest.mock('../../src/middleware/timeout', () => ({
  apiTimeout: (req, res, next) => next(),
}));

jest.mock('../../src/middleware/subscription', () => ({
  requireSubscription: () => (req, res, next) => {
    req.subscription = {
      plan: 'premium', status: 'active',
      config: { maxWorkouts: 50, maxMessages: 50, maxCustomWorkouts: 15, maxFavorites: 50, features: ['workouts', 'chat', 'analytics', 'favorites', 'custom_workouts'] }
    };
    if (req.headers['x-test-limit'] === 'reached') {
      req.subscription.config.maxWorkouts = 0;
    }
    next();
  },
  checkFeature: () => (req, res, next) => next(),
  checkLimit: () => (req, res, next) => next(),
}));

jest.mock('../../src/middleware/auth', () => ({
  authenticate: (req, res, next) => {
    if (!req.headers.authorization) return res.status(401).json({ error: 'No token' });
    req.user = { id: 'user-123', email: 'test@test.com' };
    next();
  }
}));

const mockSupabase = require('../../src/config/supabase');
const workoutRoutes = require('../../src/routes/workouts');

const app = express();
app.use(express.json());
app.use('/api/workouts', workoutRoutes);

describe('Workout Routes', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('GET /', () => {
    it('deve listar treinos', async () => {
      mockSupabase.from.mockReturnValue(createChainable({ data: [mockWorkout], error: null, count: 1 }));
      const res = await request(app).get('/api/workouts');
      expect(res.status).toBe(200);
      expect(res.body.workouts).toHaveLength(1);
    });

    it('deve filtrar por categoria', async () => {
      const chain = createChainable({ data: [], error: null, count: 0 });
      mockSupabase.from.mockReturnValue(chain);
      await request(app).get('/api/workouts?category=Cardio');
      expect(chain.eq).toHaveBeenCalledWith('category', 'Cardio');
    });

    it('deve filtrar por nível', async () => {
      const chain = createChainable({ data: [], error: null, count: 0 });
      mockSupabase.from.mockReturnValue(chain);
      await request(app).get('/api/workouts?level=beginner');
      expect(chain.eq).toHaveBeenCalledWith('level', 'beginner');
    });

    it('deve filtrar isPremium', async () => {
      const chain = createChainable({ data: [], error: null, count: 0 });
      mockSupabase.from.mockReturnValue(chain);
      await request(app).get('/api/workouts?isPremium=true');
      expect(chain.eq).toHaveBeenCalledWith('is_premium', true);
    });

    it('deve buscar por nome', async () => {
      const chain = createChainable({ data: [], error: null, count: 0 });
      mockSupabase.from.mockReturnValue(chain);
      await request(app).get('/api/workouts?search=Peito');
      expect(chain.ilike).toHaveBeenCalledWith('name', '%Peito%');
    });

    it('deve rejeitar nível inválido', async () => {
      const res = await request(app).get('/api/workouts?level=invalid');
      expect(res.status).toBe(400);
    });
  });

  describe('GET /premium', () => {
    it('deve retornar 401 sem token', async () => {
      const res = await request(app).get('/api/workouts/premium');
      expect(res.status).toBe(401);
    });

    it('deve listar treinos premium', async () => {
      mockSupabase.from.mockReturnValue(createChainable({ data: [mockWorkout], error: null, count: 1 }));
      const res = await request(app).get('/api/workouts/premium').set('Authorization', 'Bearer token');
      expect(res.status).toBe(200);
      expect(res.body.workouts).toBeDefined();
    });
  });

  describe('GET /:id', () => {
    it('deve buscar treino', async () => {
      const chain = createChainable();
      chain.single.mockResolvedValue({ data: mockWorkout, error: null });
      mockSupabase.from.mockReturnValue(chain);
      const res = await request(app).get('/api/workouts/workout-123');
      expect(res.status).toBe(200);
      expect(res.body.id).toBe('workout-123');
    });

    it('deve retornar 404', async () => {
      const chain = createChainable();
      chain.single.mockResolvedValue({ data: null, error: { message: 'Not found' } });
      mockSupabase.from.mockReturnValue(chain);
      const res = await request(app).get('/api/workouts/nonexistent');
      expect(res.status).toBe(404);
    });

    it('deve bloquear premium para free', async () => {
      const workoutChain = createChainable();
      workoutChain.single.mockResolvedValue({ data: { ...mockWorkout, is_premium: true }, error: null });
      const userChain = createChainable();
      userChain.single.mockResolvedValue({ data: { user: mockUser }, error: null });
      const profileChain = createChainable();
      profileChain.single.mockResolvedValue({ data: { subscription_status: 'active', subscription_plan: 'free' }, error: null });
      mockSupabase.from.mockReturnValueOnce(workoutChain).mockReturnValueOnce(userChain).mockReturnValueOnce(profileChain);
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
      const res = await request(app).get('/api/workouts/premium-w').set('Authorization', 'Bearer token');
      expect(res.status).toBe(403);
    });

    it('deve permitir premium com assinatura', async () => {
      const workoutChain = createChainable();
      workoutChain.single.mockResolvedValue({ data: { ...mockWorkout, is_premium: true }, error: null });
      const userChain = createChainable();
      userChain.single.mockResolvedValue({ data: { user: mockUser }, error: null });
      const profileChain = createChainable();
      profileChain.single.mockResolvedValue({ data: { subscription_status: 'active', subscription_plan: 'premium' }, error: null });
      mockSupabase.from.mockReturnValueOnce(workoutChain).mockReturnValueOnce(userChain).mockReturnValueOnce(profileChain);
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
      const res = await request(app).get('/api/workouts/premium-w').set('Authorization', 'Bearer token');
      expect(res.status).toBe(200);
    });
  });

  describe('POST /:id/complete', () => {
    it('deve retornar 401 sem auth', async () => {
      const res = await request(app).post('/api/workouts/workout-123/complete').send({ rating: 5 });
      expect(res.status).toBe(401);
    });

    it('deve retornar 403 quando limite atingido', async () => {
      const workoutChain = createChainable();
      workoutChain.single.mockResolvedValue({ data: mockWorkout, error: null });
      const countChain = createChainable();
      countChain.then = jest.fn((resolve) => resolve({ data: null, error: null, count: 50 }));
      mockSupabase.from.mockReturnValueOnce(workoutChain).mockReturnValueOnce(countChain);
      const res = await request(app).post('/api/workouts/workout-123/complete').set('Authorization', 'Bearer token').set('x-test-limit', 'reached').send({ rating: 4 });
      expect(res.status).toBe(403);
      expect(res.body.limit).toBe(true);
    });

    it('deve concluir treino', async () => {
      const workoutChain = createChainable();
      workoutChain.single.mockResolvedValue({ data: mockWorkout, error: null });
      const countChain = createChainable();
      countChain.then = jest.fn((resolve) => resolve({ data: null, error: null, count: 5 }));
      const upsertChain = createChainable();
      upsertChain.single.mockResolvedValue({ data: { id: 'uw-123' }, error: null });
      mockSupabase.from.mockReturnValueOnce(workoutChain).mockReturnValueOnce(countChain).mockReturnValueOnce(upsertChain);
      mockSupabase.rpc.mockResolvedValue({ error: null });
      const res = await request(app).post('/api/workouts/workout-123/complete').set('Authorization', 'Bearer token').send({ rating: 5, duration: 45 });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(mockSupabase.rpc).toHaveBeenCalled();
    });

    it('deve validar rating', async () => {
      mockSupabase.from.mockReturnValue(createChainable());
      const res = await request(app).post('/api/workouts/workout-123/complete').set('Authorization', 'Bearer token').send({ rating: 10 });
      expect(res.status).toBe(400);
    });
  });

  describe('GET /user/history', () => {
    it('deve retornar histórico', async () => {
      mockSupabase.from.mockReturnValue(createChainable({ data: [], error: null, count: 0 }));
      const res = await request(app).get('/api/workouts/user/history').set('Authorization', 'Bearer token');
      expect(res.status).toBe(200);
      expect(res.body.history).toBeDefined();
    });
  });

  describe('GET /user/stats', () => {
    it('deve retornar stats', async () => {
      const profileChain = createChainable();
      profileChain.single.mockResolvedValue({ data: mockProfile, error: null });
      const countChain = createChainable();
      countChain.then = jest.fn((resolve) => resolve({ data: null, error: null, count: 50 }));
      const favChain = createChainable();
      favChain.then = jest.fn((resolve) => resolve({ data: null, error: null, count: 10 }));
      const recentChain = createChainable();
      recentChain.then = jest.fn((resolve) => resolve({ data: [{ rating: 5 }], error: null }));
      mockSupabase.from.mockReturnValueOnce(profileChain).mockReturnValueOnce(countChain).mockReturnValueOnce(favChain).mockReturnValueOnce(recentChain);
      const res = await request(app).get('/api/workouts/user/stats').set('Authorization', 'Bearer token');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('totalWorkouts');
    });

    it('deve retornar zeros sem perfil', async () => {
      const profileChain = createChainable();
      profileChain.single.mockResolvedValue({ data: null, error: null });
      const countChain = createChainable();
      countChain.then = jest.fn((resolve) => resolve({ data: null, error: null, count: 0 }));
      const favChain = createChainable();
      favChain.then = jest.fn((resolve) => resolve({ data: null, error: null, count: 0 }));
      const recentChain = createChainable();
      recentChain.then = jest.fn((resolve) => resolve({ data: [], error: null }));
      mockSupabase.from.mockReturnValueOnce(profileChain).mockReturnValueOnce(countChain).mockReturnValueOnce(favChain).mockReturnValueOnce(recentChain);
      const res = await request(app).get('/api/workouts/user/stats').set('Authorization', 'Bearer token');
      expect(res.body.totalWorkouts).toBe(0);
      expect(res.body.averageRating).toBe(0);
    });
  });

  describe('POST /:id/favorite', () => {
    it('deve adicionar favorito', async () => {
      const existChain = createChainable();
      existChain.single.mockResolvedValue({ data: null, error: null });
      const insertChain = createChainable();
      insertChain.then = jest.fn((resolve) => resolve({ data: null, error: null }));
      mockSupabase.from.mockReturnValueOnce(existChain).mockReturnValueOnce(insertChain);
      const res = await request(app).post('/api/workouts/workout-123/favorite').set('Authorization', 'Bearer token');
      expect(res.status).toBe(200);
      expect(res.body.favorited).toBe(true);
    });

    it('deve remover favorito', async () => {
      const existChain = createChainable();
      existChain.single.mockResolvedValue({ data: { id: 'fav-123' }, error: null });
      const deleteChain = createChainable();
      deleteChain.then = jest.fn((resolve) => resolve({ data: null, error: null }));
      mockSupabase.from.mockReturnValueOnce(existChain).mockReturnValueOnce(deleteChain);
      const res = await request(app).post('/api/workouts/workout-123/favorite').set('Authorization', 'Bearer token');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('favorited');
    });
  });

  describe('GET /user/favorites', () => {
    it('deve retornar favoritos', async () => {
      mockSupabase.from.mockReturnValue(createChainable({ data: [], error: null, count: 0 }));
      const res = await request(app).get('/api/workouts/user/favorites').set('Authorization', 'Bearer token');
      expect(res.status).toBe(200);
      expect(res.body.favorites).toBeDefined();
    });
  });

  describe('GET /user/recommended', () => {
    it('deve retornar recomendações', async () => {
      const profileChain = createChainable();
      profileChain.single.mockResolvedValue({ data: mockProfile, error: null });
      const workoutChain = createChainable({ data: [mockWorkout], error: null });
      mockSupabase.from.mockReturnValueOnce(profileChain).mockReturnValueOnce(workoutChain);
      const res = await request(app).get('/api/workouts/user/recommended').set('Authorization', 'Bearer token');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('recommendations');
    });
  });

  describe('POST /custom', () => {
    it('deve retornar 400 sem campos obrigatórios', async () => {
      const res = await request(app).post('/api/workouts/custom').set('Authorization', 'Bearer token').send({ name: 'Treino' });
      expect(res.status).toBe(400);
    });
  });

  describe('GET /user/custom', () => {
    it('deve listar custom workouts', async () => {
      mockSupabase.from.mockReturnValue(createChainable({ data: [{ id: 'c1' }], error: null }));
      const res = await request(app).get('/api/workouts/user/custom').set('Authorization', 'Bearer token');
      expect(res.status).toBe(200);
      expect(res.body.customWorkouts).toBeDefined();
    });
  });

  describe('DELETE /custom/:id', () => {
    it('deve deletar custom workout', async () => {
      const chain = createChainable();
      chain.then = jest.fn((resolve) => resolve({ data: null, error: null }));
      mockSupabase.from.mockReturnValue(chain);
      const res = await request(app).delete('/api/workouts/custom/custom-123').set('Authorization', 'Bearer token');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('POST /:id/share', () => {
    it('deve gerar link', async () => {
      const chain = createChainable();
      chain.single.mockResolvedValue({ data: mockWorkout, error: null });
      mockSupabase.from.mockReturnValue(chain);
      const res = await request(app).post('/api/workouts/workout-123/share').set('Authorization', 'Bearer token');
      expect(res.status).toBe(200);
      expect(res.body.url).toContain('novaixfitness.com');
    });

    it('deve retornar 404', async () => {
      const chain = createChainable();
      chain.single.mockResolvedValue({ data: null, error: null });
      mockSupabase.from.mockReturnValue(chain);
      const res = await request(app).post('/api/workouts/nonexistent/share').set('Authorization', 'Bearer token');
      expect(res.status).toBe(404);
    });
  });

  describe('GET /meta/categories', () => {
    it('deve retornar categorias', async () => {
      mockSupabase.from.mockReturnValue(createChainable({ data: [{ category: 'A' }, { category: 'B' }], error: null }));
      const res = await request(app).get('/api/workouts/meta/categories');
      expect(res.status).toBe(200);
      expect(res.body.categories).toHaveLength(2);
    });
  });

  describe('GET /meta/levels', () => {
    it('deve retornar níveis', async () => {
      const res = await request(app).get('/api/workouts/meta/levels');
      expect(res.status).toBe(200);
      expect(res.body.levels).toHaveLength(3);
    });
  });
});
