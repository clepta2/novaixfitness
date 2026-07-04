// __tests__/middleware/subscription.test.js
// Testes do middleware de assinatura - NOVAIX FITNESS

const { mockUser, mockProfile, createChainable } = require('../../test-utils/mocks');

jest.mock('../../src/config/supabase', () => {
  const { mockSupabase } = require('../../test-utils/mocks');
  return mockSupabase;
});

const { requireSubscription, checkFeature, checkLimit, PLANS } = require('../../src/middleware/subscription');
const mockSupabase = require('../../src/config/supabase');

describe('Subscription Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    req = { user: mockUser };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe('requireSubscription', () => {
    it('deve retornar 401 sem usuário', async () => {
      req.user = null;
      const middleware = requireSubscription('basic');
      await middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Usuário não autenticado' });
    });

    it('deve retornar 404 quando perfil não encontrado', async () => {
      const chain = createChainable();
      chain.single.mockResolvedValue({ data: null, error: { message: 'Not found' } });
      mockSupabase.from.mockReturnValue(chain);

      const middleware = requireSubscription('basic');
      await middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('deve retornar 403 quando assinatura inativa (cancelled)', async () => {
      const chain = createChainable();
      chain.single.mockResolvedValue({
        data: { ...mockProfile, subscription_status: 'cancelled' },
        error: null,
      });
      mockSupabase.from.mockReturnValue(chain);

      const middleware = requireSubscription('basic');
      await middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ required: true, currentPlan: 'premium' })
      );
    });

    it('deve retornar 403 quando assinatura inativa (expired)', async () => {
      const chain = createChainable();
      chain.single.mockResolvedValue({
        data: { ...mockProfile, subscription_status: 'expired' },
        error: null,
      });
      mockSupabase.from.mockReturnValue(chain);

      const middleware = requireSubscription('basic');
      await middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('deve retornar 403 quando assinatura inativa (past_due)', async () => {
      const chain = createChainable();
      chain.single.mockResolvedValue({
        data: { ...mockProfile, subscription_status: 'past_due' },
        error: null,
      });
      mockSupabase.from.mockReturnValue(chain);

      const middleware = requireSubscription('basic');
      await middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('deve retornar 403 quando plano free e requer basic', async () => {
      const chain = createChainable();
      chain.single.mockResolvedValue({
        data: { ...mockProfile, subscription_status: 'active', subscription_plan: 'free' },
        error: null,
      });
      mockSupabase.from.mockReturnValue(chain);

      const middleware = requireSubscription('basic');
      await middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ 
          error: expect.stringContaining('basic'),
          currentPlan: 'free'
        })
      );
    });

    it('deve retornar 403 quando plano basic e requer premium', async () => {
      const chain = createChainable();
      chain.single.mockResolvedValue({
        data: { ...mockProfile, subscription_status: 'active', subscription_plan: 'basic' },
        error: null,
      });
      mockSupabase.from.mockReturnValue(chain);

      const middleware = requireSubscription('premium');
      await middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('deve retornar 403 quando plano intermediate e requer ultra', async () => {
      const chain = createChainable();
      chain.single.mockResolvedValue({
        data: { ...mockProfile, subscription_status: 'active', subscription_plan: 'intermediate' },
        error: null,
      });
      mockSupabase.from.mockReturnValue(chain);

      const middleware = requireSubscription('ultra');
      await middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('deve permitir acesso com plano básico para rota basic', async () => {
      const chain = createChainable();
      chain.single.mockResolvedValue({
        data: { ...mockProfile, subscription_status: 'active', subscription_plan: 'basic' },
        error: null,
      });
      mockSupabase.from.mockReturnValue(chain);

      const middleware = requireSubscription('basic');
      await middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.subscription.plan).toBe('basic');
    });

    it('deve permitir acesso com plano premium para rota basic', async () => {
      const chain = createChainable();
      chain.single.mockResolvedValue({ data: mockProfile, error: null });
      mockSupabase.from.mockReturnValue(chain);

      const middleware = requireSubscription('basic');
      await middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.subscription.plan).toBe('premium');
    });

    it('deve permitir acesso com plano ultra para rota premium', async () => {
      const chain = createChainable();
      chain.single.mockResolvedValue({
        data: { ...mockProfile, subscription_status: 'active', subscription_plan: 'ultra' },
        error: null,
      });
      mockSupabase.from.mockReturnValue(chain);

      const middleware = requireSubscription('premium');
      await middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('deve retornar erro quando Supabase falha', async () => {
      const chain = createChainable();
      chain.single.mockRejectedValue(new Error('Database error'));
      mockSupabase.from.mockReturnValue(chain);

      const middleware = requireSubscription('basic');
      await middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao verificar assinatura' });
    });

    it('deve popular req.subscription com dados corretos', async () => {
      const chain = createChainable();
      chain.single.mockResolvedValue({
        data: { 
          ...mockProfile, 
          subscription_status: 'active', 
          subscription_plan: 'intermediate' 
        },
        error: null,
      });
      mockSupabase.from.mockReturnValue(chain);

      const middleware = requireSubscription('basic');
      await middleware(req, res, next);

      expect(req.subscription).toEqual({
        plan: 'intermediate',
        status: 'active',
        config: PLANS.intermediate
      });
    });

    it('deve retornar null como currentPlan quando plan é null', async () => {
      const chain = createChainable();
      chain.single.mockResolvedValue({
        data: { ...mockProfile, subscription_status: 'active', subscription_plan: null },
        error: null,
      });
      mockSupabase.from.mockReturnValue(chain);

      const middleware = requireSubscription('basic');
      await middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ currentPlan: null })
      );
    });

    it('deve funcionar sem plano requerido (default basic)', async () => {
      const chain = createChainable();
      chain.single.mockResolvedValue({ data: mockProfile, error: null });
      mockSupabase.from.mockReturnValue(chain);

      const middleware = requireSubscription();
      await middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe('checkFeature', () => {
    it('deve retornar 403 sem subscription verificada', () => {
      req.subscription = null;
      const middleware = checkFeature('analytics');
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'Assinatura não verificada' });
    });

    it('deve retornar 403 quando feature não disponível no plano', () => {
      req.subscription = { plan: 'basic', config: PLANS.basic };
      const middleware = checkFeature('analytics');
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ 
          feature: 'analytics',
          currentPlan: 'basic'
        })
      );
    });

    it('deve retornar 403 para chat no plano free', () => {
      req.subscription = { plan: 'free', config: PLANS.free };
      const middleware = checkFeature('chat');
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('deve retornar 403 para custom_workouts no plano basic', () => {
      req.subscription = { plan: 'basic', config: PLANS.basic };
      const middleware = checkFeature('custom_workouts');
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('deve permitir feature workouts no plano basic', () => {
      req.subscription = { plan: 'basic', config: PLANS.basic };
      const middleware = checkFeature('workouts');
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('deve permitir feature chat no plano intermediate', () => {
      req.subscription = { plan: 'intermediate', config: PLANS.intermediate };
      const middleware = checkFeature('chat');
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('deve permitir feature analytics no plano premium', () => {
      req.subscription = { plan: 'premium', config: PLANS.premium };
      const middleware = checkFeature('analytics');
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('deve permitir todas as features no plano ultra', () => {
      req.subscription = { plan: 'ultra', config: PLANS.ultra };
      
      const features = ['workouts', 'chat', 'analytics', 'priority', 'favorites', 'custom_workouts', 'export', 'priority_support'];
      
      features.forEach(feature => {
        const middleware = checkFeature(feature);
        middleware(req, res, next);
        expect(next).toHaveBeenCalled();
        jest.clearAllMocks();
      });
    });

    it('deve retornar nome da feature no erro', () => {
      req.subscription = { plan: 'basic', config: PLANS.basic };
      const middleware = checkFeature('export');
      middleware(req, res, next);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ feature: 'export' })
      );
    });
  });

  describe('checkLimit', () => {
    it('deve retornar 403 sem subscription verificada', () => {
      req.subscription = null;
      const middleware = checkLimit('maxWorkouts');
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'Assinatura não verificada' });
    });

    it('deve adicionar limite de maxWorkouts do plano basic', () => {
      req.subscription = { plan: 'basic', config: PLANS.basic };
      const middleware = checkLimit('maxWorkouts');
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.subscriptionLimit).toBe(5);
      expect(req.subscriptionLimitType).toBe('maxWorkouts');
    });

    it('deve adicionar limite de maxWorkouts do plano premium', () => {
      req.subscription = { plan: 'premium', config: PLANS.premium };
      const middleware = checkLimit('maxWorkouts');
      middleware(req, res, next);

      expect(req.subscriptionLimit).toBe(20);
    });

    it('deve adicionar limite de maxMessages do plano intermediate', () => {
      req.subscription = { plan: 'intermediate', config: PLANS.intermediate };
      const middleware = checkLimit('maxMessages');
      middleware(req, res, next);

      expect(req.subscriptionLimit).toBe(10);
    });

    it('deve adicionar limite de maxCustomWorkouts do plano premium', () => {
      req.subscription = { plan: 'premium', config: PLANS.premium };
      const middleware = checkLimit('maxCustomWorkouts');
      middleware(req, res, next);

      expect(req.subscriptionLimit).toBe(15);
    });

    it('deve adicionar limite de maxFavorites do plano basic', () => {
      req.subscription = { plan: 'basic', config: PLANS.basic };
      const middleware = checkLimit('maxFavorites');
      middleware(req, res, next);

      expect(req.subscriptionLimit).toBe(10);
    });

    it('deve retornar -1 para maxFavorites do plano ultra (ilimitado)', () => {
      req.subscription = { plan: 'ultra', config: PLANS.ultra };
      const middleware = checkLimit('maxFavorites');
      middleware(req, res, next);

      expect(req.subscriptionLimit).toBe(-1);
    });

    it('deve ignorar limitType inexistente', () => {
      req.subscription = { plan: 'basic', config: PLANS.basic };
      const middleware = checkLimit('nonExistent');
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.subscriptionLimit).toBeUndefined();
    });
  });

  describe('PLANS', () => {
    it('deve ter todos os 5 planos', () => {
      const planNames = Object.keys(PLANS);
      expect(planNames).toHaveLength(5);
      expect(planNames).toEqual(['free', 'basic', 'intermediate', 'premium', 'ultra']);
    });

    it('deve ter todos os planos com maxWorkouts', () => {
      Object.values(PLANS).forEach(plan => {
        expect(plan.maxWorkouts).toBeDefined();
        expect(typeof plan.maxWorkouts).toBe('number');
        expect(plan.maxWorkouts).toBeGreaterThanOrEqual(0);
      });
    });

    it('deve ter todos os planos com maxMessages', () => {
      Object.values(PLANS).forEach(plan => {
        expect(plan.maxMessages).toBeDefined();
        expect(typeof plan.maxMessages).toBe('number');
      });
    });

    it('deve ter todos os planos com features', () => {
      Object.values(PLANS).forEach(plan => {
        expect(plan.features).toBeDefined();
        expect(Array.isArray(plan.features)).toBe(true);
      });
    });

    it('deve ter limits crescentes por plano', () => {
      expect(PLANS.free.maxWorkouts).toBeLessThan(PLANS.basic.maxWorkouts);
      expect(PLANS.basic.maxWorkouts).toBeLessThan(PLANS.intermediate.maxWorkouts);
      expect(PLANS.intermediate.maxWorkouts).toBeLessThan(PLANS.premium.maxWorkouts);
      expect(PLANS.premium.maxWorkouts).toBeLessThan(PLANS.ultra.maxWorkouts);
    });

    it('deve ter features crescentes por plano', () => {
      expect(PLANS.free.features.length).toBe(0);
      expect(PLANS.basic.features.length).toBeGreaterThan(0);
      expect(PLANS.intermediate.features.length).toBeGreaterThan(PLANS.basic.features.length);
      expect(PLANS.premium.features.length).toBeGreaterThan(PLANS.intermediate.features.length);
      expect(PLANS.ultra.features.length).toBeGreaterThan(PLANS.premium.features.length);
    });

    it('deve ter plano free sem features', () => {
      expect(PLANS.free.features).toEqual([]);
    });

    it('deve ter plano ultra com todas as features', () => {
      expect(PLANS.ultra.features).toContain('workouts');
      expect(PLANS.ultra.features).toContain('chat');
      expect(PLANS.ultra.features).toContain('analytics');
      expect(PLANS.ultra.features).toContain('priority');
      expect(PLANS.ultra.features).toContain('export');
      expect(PLANS.ultra.features).toContain('priority_support');
    });

    it('deve ter maxCustomWorkouts crescente', () => {
      expect(PLANS.free.maxCustomWorkouts).toBe(0);
      expect(PLANS.basic.maxCustomWorkouts).toBe(0);
      expect(PLANS.intermediate.maxCustomWorkouts).toBe(5);
      expect(PLANS.premium.maxCustomWorkouts).toBe(15);
      expect(PLANS.ultra.maxCustomWorkouts).toBe(50);
    });

    it('deve ter maxFavorites crescente', () => {
      expect(PLANS.free.maxFavorites).toBe(5);
      expect(PLANS.basic.maxFavorites).toBe(10);
      expect(PLANS.intermediate.maxFavorites).toBe(25);
      expect(PLANS.premium.maxFavorites).toBe(50);
      expect(PLANS.ultra.maxFavorites).toBe(-1);
    });
  });

  describe('Integração', () => {
    it('deve encadear requireSubscription + checkFeature corretamente', async () => {
      const chain = createChainable();
      chain.single.mockResolvedValue({
        data: { ...mockProfile, subscription_status: 'active', subscription_plan: 'premium' },
        error: null,
      });
      mockSupabase.from.mockReturnValue(chain);

      const subMiddleware = requireSubscription('basic');
      await subMiddleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.subscription.plan).toBe('premium');

      jest.clearAllMocks();
      const featMiddleware = checkFeature('analytics');
      featMiddleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('deve retornar 403 no checkFeature após requireSubscription ok', async () => {
      const chain = createChainable();
      chain.single.mockResolvedValue({
        data: { ...mockProfile, subscription_status: 'active', subscription_plan: 'basic' },
        error: null,
      });
      mockSupabase.from.mockReturnValue(chain);

      const subMiddleware = requireSubscription('basic');
      await subMiddleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.subscription.plan).toBe('basic');

      jest.clearAllMocks();
      const featMiddleware = checkFeature('analytics');
      featMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('deve encadear requireSubscription + checkLimit corretamente', async () => {
      const chain = createChainable();
      chain.single.mockResolvedValue({
        data: { ...mockProfile, subscription_status: 'active', subscription_plan: 'intermediate' },
        error: null,
      });
      mockSupabase.from.mockReturnValue(chain);

      const subMiddleware = requireSubscription('basic');
      await subMiddleware(req, res, next);

      const limitMiddleware = checkLimit('maxWorkouts');
      limitMiddleware(req, res, next);

      expect(req.subscriptionLimit).toBe(10);
    });
  });
});
