// __tests__/routes/exercises.test.js
// Testes completos do módulo de exercícios - NOVAIX FITNESS

const request = require('supertest');
const express = require('express');
const { mockUser, mockProfile, createChainable } = require('../../test-utils/mocks');

jest.mock('../../src/config/supabase', () => {
  const { mockSupabase } = require('../../test-utils/mocks');
  return mockSupabase;
});
jest.mock('../../src/middleware/cache', () => ({
  cacheMiddleware: () => (req, res, next) => next(),
  invalidateCache: () => (req, res, next) => next(),
}));
jest.mock('../../src/middleware/timeout', () => ({
  apiTimeout: (req, res, next) => next(),
}));

const mockSupabase = require('../../src/config/supabase');
const exerciseRoutes = require('../../src/routes/exercises');

const app = express();
app.use(express.json());
app.use('/api/exercises', exerciseRoutes);

const mockExercise = {
  id: 'ex-123',
  name: 'Supino Reto',
  muscle_group: 'Peito',
  equipment: 'Halteres',
  difficulty: 'Intermediário',
  isPremium: false,
  steps: [{ step: 1, title: 'Posição', text: 'Deite no banco' }],
  tips: ['Mantenha os pés firmes'],
  mistakes: ['Não rebolar']
};

const mockPremiumExercise = {
  ...mockExercise,
  id: 'ex-premium',
  name: 'Supino Decline',
  isPremium: true
};

const mockExerciseLog = {
  id: 'log-123',
  user_id: 'user-123',
  exercise_id: 'ex-123',
  exercise_name: 'Supino Reto',
  sets: 4,
  reps: 10,
  weight_kg: 60,
  notes: 'Bom treino',
  logged_at: new Date().toISOString()
};

describe('Exercise Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ===================================================================
  // GET /api/exercises
  // ===================================================================
  describe('GET /', () => {
    it('deve listar exercícios publicamente', async () => {
      mockSupabase.from.mockReturnValue(
        createChainable({ data: [mockExercise], error: null, count: 1 })
      );

      const res = await request(app).get('/api/exercises');

      expect(res.status).toBe(200);
      expect(res.body.exercises).toHaveLength(1);
      expect(res.body.total).toBe(1);
      expect(res.body.hasMore).toBe(false);
    });

    it('deve retornar estrutura completa', async () => {
      mockSupabase.from.mockReturnValue(
        createChainable({ data: [mockExercise], error: null, count: 50 })
      );

      const res = await request(app).get('/api/exercises');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('exercises');
      expect(res.body).toHaveProperty('total');
      expect(res.body).toHaveProperty('limit');
      expect(res.body).toHaveProperty('offset');
      expect(res.body.total).toBe(50);
    });

    it('deve filtrar por grupo muscular', async () => {
      const chain = createChainable({ data: [mockExercise], error: null, count: 1 });
      mockSupabase.from.mockReturnValue(chain);

      await request(app).get('/api/exercises?muscle=Peito');

      expect(chain.eq).toHaveBeenCalledWith('muscle_group', 'Peito');
    });

    it('deve filtrar por equipamento', async () => {
      const chain = createChainable({ data: [mockExercise], error: null, count: 1 });
      mockSupabase.from.mockReturnValue(chain);

      await request(app).get('/api/exercises?equipment=Halteres');

      expect(chain.eq).toHaveBeenCalledWith('equipment', 'Halteres');
    });

    it('deve filtrar por dificuldade', async () => {
      const chain = createChainable({ data: [mockExercise], error: null, count: 1 });
      mockSupabase.from.mockReturnValue(chain);

      await request(app).get('/api/exercises?difficulty=Iniciante');

      expect(chain.eq).toHaveBeenCalledWith('difficulty', 'Iniciante');
    });

    it('deve rejeitar dificuldade inválida', async () => {
      const res = await request(app).get('/api/exercises?difficulty=Invalid');

      expect(res.status).toBe(400);
    });

    it('deve buscar por nome', async () => {
      const chain = createChainable({ data: [mockExercise], error: null, count: 1 });
      mockSupabase.from.mockReturnValue(chain);

      await request(app).get('/api/exercises?search=Supino');

      expect(chain.ilike).toHaveBeenCalledWith('name', '%Supino%');
    });

    it('deve sanitizar busca', async () => {
      const chain = createChainable({ data: [], error: null, count: 0 });
      mockSupabase.from.mockReturnValue(chain);

      await request(app).get('/api/exercises?search=<script>');

      expect(chain.ilike).toHaveBeenCalledWith('name', '%script%');
    });

    it('deve limitar results com query params', async () => {
      const chain = createChainable({ data: [], error: null, count: 0 });
      mockSupabase.from.mockReturnValue(chain);

      await request(app).get('/api/exercises?limit=5&offset=10');

      expect(chain.range).toHaveBeenCalledWith(10, 14);
    });

    it('deve retornar erro do Supabase', async () => {
      mockSupabase.from.mockReturnValue(
        createChainable({ data: null, error: { message: 'DB Error' }, count: 0 })
      );

      const res = await request(app).get('/api/exercises');

      expect(res.status).toBe(500);
    });
  });

  // ===================================================================
  // GET /api/exercises/:id
  // ===================================================================
  describe('GET /:id', () => {
    it('deve buscar exercício por ID', async () => {
      const chain = createChainable();
      chain.single.mockResolvedValue({ data: mockExercise, error: null });
      mockSupabase.from.mockReturnValue(chain);

      const res = await request(app).get('/api/exercises/ex-123');

      expect(res.status).toBe(200);
      expect(res.body.id).toBe('ex-123');
      expect(res.body.name).toBe('Supino Reto');
    });

    it('deve retornar 404 para exercício inexistente', async () => {
      const chain = createChainable();
      chain.single.mockResolvedValue({ data: null, error: { message: 'Not found' } });
      mockSupabase.from.mockReturnValue(chain);

      const res = await request(app).get('/api/exercises/nonexistent');

      expect(res.status).toBe(404);
      expect(res.body.error).toContain('não encontrado');
    });

    it('deve sanitizar ID', async () => {
      const chain = createChainable();
      chain.single.mockResolvedValue({ data: mockExercise, error: null });
      mockSupabase.from.mockReturnValue(chain);

      await request(app).get('/api/exercises/<script>');

      expect(chain.eq).toHaveBeenCalledWith('id', 'script');
    });
  });

  // ===================================================================
  // GET /api/exercises/muscle/:muscle
  // ===================================================================
  describe('GET /muscle/:muscle', () => {
    it('deve retornar exercícios por grupo muscular', async () => {
      mockSupabase.from.mockReturnValue(
        createChainable({ data: [mockExercise], error: null })
      );

      const res = await request(app).get('/api/exercises/muscle/Peito');

      expect(res.status).toBe(200);
      expect(res.body.muscle).toBe('Peito');
      expect(res.body.exercises).toHaveLength(1);
    });

    it('deve retornar 400 para grupo muscular inválido', async () => {
      const res = await request(app).get('/api/exercises/muscle/InvalidGroup');

      expect(res.status).toBe(400);
      expect(res.body.validGroups).toBeDefined();
      expect(res.body.validGroups).toContain('Peito');
      expect(res.body.validGroups).toContain('Pernas');
    });

    it('deve aceitar grupos musculares válidos', async () => {
      const simpleGroups = ['Peito', 'Costas', 'Pernas', 'Ombros', 'Lombar'];

      for (const group of simpleGroups) {
        mockSupabase.from.mockReturnValue(
          createChainable({ data: [], error: null })
        );

        const res = await request(app).get(`/api/exercises/muscle/${group}`);
        expect(res.status).toBe(200);
        expect(res.body.muscle).toBe(group);
      }
    });
  });

  // ===================================================================
  // GET /api/exercises/equipment/:equipment
  // ===================================================================
  describe('GET /equipment/:equipment', () => {
    it('deve retornar exercícios por equipamento', async () => {
      mockSupabase.from.mockReturnValue(
        createChainable({ data: [mockExercise], error: null })
      );

      const res = await request(app).get('/api/exercises/equipment/Halteres');

      expect(res.status).toBe(200);
      expect(res.body.equipment).toBe('Halteres');
      expect(res.body.exercises).toBeDefined();
    });

    it('deve retornar lista vazia para equipamento sem exercícios', async () => {
      mockSupabase.from.mockReturnValue(
        createChainable({ data: [], error: null })
      );

      const res = await request(app).get('/api/exercises/equipment/Inexistente');

      expect(res.status).toBe(200);
      expect(res.body.exercises).toHaveLength(0);
    });
  });

  // ===================================================================
  // GET /api/exercises/premium/list
  // ===================================================================
  describe('GET /premium/list', () => {
    it('deve retornar 401 sem token', async () => {
      const res = await request(app).get('/api/exercises/premium/list');

      expect(res.status).toBe(401);
    });

    it('deve retornar 403 para plano free', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
      
      const chain = createChainable();
      chain.single.mockResolvedValue({
        data: { ...mockProfile, subscription_status: 'active', subscription_plan: 'free' },
        error: null
      });
      mockSupabase.from.mockReturnValue(chain);

      const res = await request(app)
        .get('/api/exercises/premium/list')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(403);
    });

    it('deve listar exercícios premium com assinatura', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
      
      const profileChain = createChainable();
      profileChain.single.mockResolvedValue({ data: mockProfile, error: null });
      
      const exerciseChain = createChainable({ data: [mockPremiumExercise], error: null });
      
      mockSupabase.from
        .mockReturnValueOnce(profileChain)
        .mockReturnValueOnce(exerciseChain);

      const res = await request(app)
        .get('/api/exercises/premium/list')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(200);
      expect(res.body.exercises).toHaveLength(1);
      expect(res.body.exercises[0].isPremium).toBe(true);
    });
  });

  // ===================================================================
  // POST /api/exercises/:id/log
  // ===================================================================
  describe('POST /:id/log', () => {
    it('deve retornar 401 sem autenticação', async () => {
      const res = await request(app)
        .post('/api/exercises/ex-123/log')
        .send({ sets: 4, reps: 10 });

      expect(res.status).toBe(401);
    });

    it('deve retornar 400 sem sets', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });

      const res = await request(app)
        .post('/api/exercises/ex-123/log')
        .set('Authorization', 'Bearer valid-token')
        .send({ reps: 10, weight: 60 });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('sets e reps');
    });

    it('deve retornar 400 sem reps', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });

      const res = await request(app)
        .post('/api/exercises/ex-123/log')
        .set('Authorization', 'Bearer valid-token')
        .send({ sets: 4, weight: 60 });

      expect(res.status).toBe(400);
    });

    it('deve retornar 404 para exercício inexistente', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
      
      const chain = createChainable();
      chain.single.mockResolvedValue({ data: null, error: { message: 'Not found' } });
      mockSupabase.from.mockReturnValue(chain);

      const res = await request(app)
        .post('/api/exercises/nonexistent/log')
        .set('Authorization', 'Bearer valid-token')
        .send({ sets: 4, reps: 10 });

      expect(res.status).toBe(404);
    });

    it('deve criar log com sucesso', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
      
      const exerciseChain = createChainable();
      exerciseChain.single.mockResolvedValue({ data: { id: 'ex-123', name: 'Supino Reto' }, error: null });
      
      const logChain = createChainable();
      logChain.single.mockResolvedValue({ data: mockExerciseLog, error: null });
      
      mockSupabase.from
        .mockReturnValueOnce(exerciseChain)
        .mockReturnValueOnce(logChain);

      const res = await request(app)
        .post('/api/exercises/ex-123/log')
        .set('Authorization', 'Bearer valid-token')
        .send({ sets: 4, reps: 10, weight: 60, notes: 'Bom treino' });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.log.exercise_name).toBe('Supino Reto');
    });

    it('deve criar log sem notes', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
      
      const exerciseChain = createChainable();
      exerciseChain.single.mockResolvedValue({ data: { id: 'ex-123', name: 'Supino' }, error: null });
      
      const logChain = createChainable();
      logChain.single.mockResolvedValue({ data: mockExerciseLog, error: null });
      
      mockSupabase.from
        .mockReturnValueOnce(exerciseChain)
        .mockReturnValueOnce(logChain);

      const res = await request(app)
        .post('/api/exercises/ex-123/log')
        .set('Authorization', 'Bearer valid-token')
        .send({ sets: 4, reps: 10 });

      expect(res.status).toBe(201);
    });

    it('deve sanitizar notes', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
      
      const exerciseChain = createChainable();
      exerciseChain.single.mockResolvedValue({ data: { id: 'ex-123', name: 'Supino' }, error: null });
      
      const logChain = createChainable();
      logChain.single.mockResolvedValue({ data: mockExerciseLog, error: null });
      
      mockSupabase.from
        .mockReturnValueOnce(exerciseChain)
        .mockReturnValueOnce(logChain);

      await request(app)
        .post('/api/exercises/ex-123/log')
        .set('Authorization', 'Bearer valid-token')
        .send({ sets: 4, reps: 10, notes: '<script>alert(1)</script>' });

      expect(logChain.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          notes: expect.not.stringContaining('<')
        })
      );
    });
  });

  // ===================================================================
  // GET /api/exercises/:id/history
  // ===================================================================
  describe('GET /:id/history', () => {
    it('deve retornar 401 sem autenticação', async () => {
      const res = await request(app).get('/api/exercises/ex-123/history');

      expect(res.status).toBe(401);
    });

    it('deve retornar histórico de logs', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
      mockSupabase.from.mockReturnValue(
        createChainable({ data: [mockExerciseLog], error: null, count: 1 })
      );

      const res = await request(app)
        .get('/api/exercises/ex-123/history')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(200);
      expect(res.body.logs).toHaveLength(1);
      expect(res.body.total).toBe(1);
      expect(res.body.hasMore).toBe(false);
    });

    it('deve retornar hasMore quando há mais logs', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
      mockSupabase.from.mockReturnValue(
        createChainable({ data: [mockExerciseLog], error: null, count: 50 })
      );

      const res = await request(app)
        .get('/api/exercises/ex-123/history')
        .set('Authorization', 'Bearer valid-token');

      expect(res.body.hasMore).toBe(true);
    });

    it('deve validar limit e offset', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
      mockSupabase.from.mockReturnValue(
        createChainable({ data: [], error: null, count: 0 })
      );

      const res = await request(app)
        .get('/api/exercises/ex-123/history?limit=5&offset=10')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(200);
      expect(res.body.limit).toBe(5);
      expect(res.body.offset).toBe(10);
    });

    it('deve retornar lista vazia sem logs', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
      mockSupabase.from.mockReturnValue(
        createChainable({ data: [], error: null, count: 0 })
      );

      const res = await request(app)
        .get('/api/exercises/ex-123/history')
        .set('Authorization', 'Bearer valid-token');

      expect(res.body.logs).toHaveLength(0);
      expect(res.body.total).toBe(0);
    });
  });

  // ===================================================================
  // GET /api/exercises/:id/stats
  // ===================================================================
  describe('GET /:id/stats', () => {
    it('deve retornar 401 sem autenticação', async () => {
      const res = await request(app).get('/api/exercises/ex-123/stats');

      expect(res.status).toBe(401);
    });

    it('deve retornar zeros quando sem logs', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
      mockSupabase.from.mockReturnValue(
        createChainable({ data: [], error: null })
      );

      const res = await request(app)
        .get('/api/exercises/ex-123/stats')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(200);
      expect(res.body.totalSessions).toBe(0);
      expect(res.body.maxWeight).toBe(0);
      expect(res.body.totalVolume).toBe(0);
      expect(res.body.personalBest).toBeNull();
      expect(res.body.lastSession).toBeNull();
    });

    it('deve calcular estatísticas corretamente', async () => {
      const logs = [
        { sets: 4, reps: 10, weight_kg: 60, logged_at: '2024-01-15' },
        { sets: 4, reps: 8, weight_kg: 65, logged_at: '2024-01-10' },
        { sets: 3, reps: 12, weight_kg: 50, logged_at: '2024-01-05' }
      ];

      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
      mockSupabase.from.mockReturnValue(
        createChainable({ data: logs, error: null })
      );

      const res = await request(app)
        .get('/api/exercises/ex-123/stats')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(200);
      expect(res.body.totalSessions).toBe(3);
      expect(res.body.maxWeight).toBe(65);
      expect(res.body.totalVolume).toBe(4 * 10 * 60 + 4 * 8 * 65 + 3 * 12 * 50);
    });

    it('deve identificar personal best', async () => {
      const logs = [
        { sets: 4, reps: 10, weight_kg: 60, logged_at: '2024-01-15' },
        { sets: 5, reps: 10, weight_kg: 70, logged_at: '2024-01-10' }
      ];

      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
      mockSupabase.from.mockReturnValue(
        createChainable({ data: logs, error: null })
      );

      const res = await request(app)
        .get('/api/exercises/ex-123/stats')
        .set('Authorization', 'Bearer valid-token');

      expect(res.body.personalBest).toBeDefined();
      expect(res.body.personalBest.weight).toBe(70);
      expect(res.body.personalBest.sets).toBe(5);
    });

    it('deve retornar lastSession', async () => {
      const logs = [
        { sets: 4, reps: 10, weight_kg: 60, logged_at: '2024-01-15' }
      ];

      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
      mockSupabase.from.mockReturnValue(
        createChainable({ data: logs, error: null })
      );

      const res = await request(app)
        .get('/api/exercises/ex-123/stats')
        .set('Authorization', 'Bearer valid-token');

      expect(res.body.lastSession).toBeDefined();
      expect(res.body.lastSession.sets).toBe(4);
      expect(res.body.lastSession.weight).toBe(60);
    });

    it('deve tratar weight_kg como 0 quando null', async () => {
      const logs = [
        { sets: 4, reps: 10, weight_kg: null, logged_at: '2024-01-15' }
      ];

      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
      mockSupabase.from.mockReturnValue(
        createChainable({ data: logs, error: null })
      );

      const res = await request(app)
        .get('/api/exercises/ex-123/stats')
        .set('Authorization', 'Bearer valid-token');

      expect(res.body.maxWeight).toBe(0);
      expect(res.body.totalVolume).toBe(0);
    });
  });

  // ===================================================================
  // GET /api/exercises/meta/*
  // ===================================================================
  describe('GET /meta/groups', () => {
    it('deve retornar 10 grupos musculares', async () => {
      const res = await request(app).get('/api/exercises/meta/groups');

      expect(res.status).toBe(200);
      expect(res.body.muscleGroups).toHaveLength(10);
    });

    it('deve incluir grupos esperados', async () => {
      const res = await request(app).get('/api/exercises/meta/groups');

      expect(res.body.muscleGroups).toContain('Peito');
      expect(res.body.muscleGroups).toContain('Costas');
      expect(res.body.muscleGroups).toContain('Pernas');
      expect(res.body.muscleGroups).toContain('Ombros');
      expect(res.body.muscleGroups).toContain('Braços');
    });
  });

  describe('GET /meta/equipment', () => {
    it('deve retornar lista de equipamentos', async () => {
      const res = await request(app).get('/api/exercises/meta/equipment');

      expect(res.status).toBe(200);
      expect(res.body.equipment).toContain('Halteres');
      expect(res.body.equipment).toContain('Barra');
      expect(res.body.equipment).toContain('Máquina');
    });

    it('deve ter pelo menos 10 equipamentos', async () => {
      const res = await request(app).get('/api/exercises/meta/equipment');

      expect(res.body.equipment.length).toBeGreaterThanOrEqual(10);
    });
  });

  describe('GET /meta/difficulties', () => {
    it('deve retornar 3 níveis', async () => {
      const res = await request(app).get('/api/exercises/meta/difficulties');

      expect(res.status).toBe(200);
      expect(res.body.difficulties).toEqual(['Iniciante', 'Intermediário', 'Avançado']);
    });
  });

  // ===================================================================
  // Error paths
  // ===================================================================
  describe('Error handling', () => {
    it('deve retornar 500 quando muscle route falha', async () => {
      mockSupabase.from.mockReturnValue(
        createChainable({ data: null, error: { message: 'DB Error' } })
      );

      const res = await request(app).get('/api/exercises/muscle/Peito');
      expect(res.status).toBe(500);
    });

    it('deve retornar 500 quando equipment route falha', async () => {
      mockSupabase.from.mockReturnValue(
        createChainable({ data: null, error: { message: 'DB Error' } })
      );

      const res = await request(app).get('/api/exercises/equipment/Halteres');
      expect(res.status).toBe(500);
    });

    it('deve retornar 500 quando premium route falha', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
      
      const profileChain = createChainable();
      profileChain.single.mockResolvedValue({ data: mockProfile, error: null });
      
      const exerciseChain = createChainable({ data: null, error: { message: 'DB Error' } });
      
      mockSupabase.from
        .mockReturnValueOnce(profileChain)
        .mockReturnValueOnce(exerciseChain);

      const res = await request(app)
        .get('/api/exercises/premium/list')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(500);
    });

    it('deve retornar 500 quando log insert falha', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
      
      const exerciseChain = createChainable();
      exerciseChain.single.mockResolvedValue({ data: { id: 'ex-123', name: 'Supino' }, error: null });
      
      const logChain = createChainable();
      logChain.single.mockResolvedValue({ data: null, error: { message: 'Insert failed' } });
      
      mockSupabase.from
        .mockReturnValueOnce(exerciseChain)
        .mockReturnValueOnce(logChain);

      const res = await request(app)
        .post('/api/exercises/ex-123/log')
        .set('Authorization', 'Bearer valid-token')
        .send({ sets: 4, reps: 10 });

      expect(res.status).toBe(500);
    });

    it('deve retornar 500 quando history route falha', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
      mockSupabase.from.mockReturnValue(
        createChainable({ data: null, error: { message: 'DB Error' }, count: 0 })
      );

      const res = await request(app)
        .get('/api/exercises/ex-123/history')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(500);
    });

    it('deve retornar 500 quando stats route falha', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
      mockSupabase.from.mockReturnValue(
        createChainable({ data: null, error: { message: 'DB Error' } })
      );

      const res = await request(app)
        .get('/api/exercises/ex-123/stats')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(500);
    });
  });
});
