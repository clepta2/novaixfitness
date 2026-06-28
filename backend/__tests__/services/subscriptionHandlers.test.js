jest.mock('../../src/config/supabase', () => {
  const { mockSupabase } = require('../../test-utils/mocks');
  return mockSupabase;
});

const { mockSupabase, createChainable } = require('../../test-utils/mocks');
const { determinePlanType, handleSubscriptionCreated, handleSubscriptionUpdated, handleSubscriptionDeleted, handleSubscriptionInactivated, handleSubscriptionReactivated } = require('../../src/services/subscriptionHandlers');

describe('Subscription Handlers', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('determinePlanType', () => {
    it('deve retornar basic para valor <= 49.90', () => {
      expect(determinePlanType(49.90)).toBe('basic');
      expect(determinePlanType(30)).toBe('basic');
    });

    it('deve retornar intermediate para valor <= 79.90', () => {
      expect(determinePlanType(79.90)).toBe('intermediate');
      expect(determinePlanType(60)).toBe('intermediate');
    });

    it('deve retornar premium para valor <= 119.90', () => {
      expect(determinePlanType(119.90)).toBe('premium');
      expect(determinePlanType(100)).toBe('premium');
    });

    it('deve retornar ultra para valor > 119.90', () => {
      expect(determinePlanType(199.90)).toBe('ultra');
      expect(determinePlanType(150)).toBe('ultra');
    });
  });

  describe('handleSubscriptionCreated', () => {
    it('deve criar assinatura e atualizar perfil', async () => {
      const profileChain = createChainable();
      profileChain.single.mockResolvedValue({ data: { id: 'user-1' }, error: null });
      const upsertChain = createChainable();
      upsertChain.then = jest.fn((resolve) => resolve({ error: null }));
      const updateChain = createChainable();
      updateChain.then = jest.fn((resolve) => resolve({ error: null }));
      mockSupabase.from
        .mockReturnValueOnce(profileChain)
        .mockReturnValueOnce(upsertChain)
        .mockReturnValueOnce(updateChain);

      await handleSubscriptionCreated({ id: 'sub-1', customer: 'cust-1', value: 119.90, status: 'ACTIVE' });

      expect(mockSupabase.from).toHaveBeenCalledTimes(3);
    });

    it('deve ignorar quando perfil não encontrado', async () => {
      const chain = createChainable();
      chain.single.mockResolvedValue({ data: null, error: null });
      mockSupabase.from.mockReturnValue(chain);

      await handleSubscriptionCreated({ id: 'sub-1', customer: 'cust-1', value: 49.90 });

      expect(mockSupabase.from).toHaveBeenCalledTimes(1);
    });
  });

  describe('handleSubscriptionUpdated', () => {
    it('deve atualizar status', async () => {
      const chain = createChainable();
      chain.then = jest.fn((resolve) => resolve({ error: null }));
      mockSupabase.from.mockReturnValue(chain);

      await handleSubscriptionUpdated({ id: 'sub-1', status: 'ACTIVE' });

      expect(chain.update).toHaveBeenCalledWith({ status: 'ACTIVE' });
    });
  });

  describe('handleSubscriptionDeleted', () => {
    it('deve cancelar assinatura', async () => {
      const subChain = createChainable();
      subChain.single.mockResolvedValue({ data: { user_id: 'user-1' }, error: null });
      const updateChain = createChainable();
      updateChain.then = jest.fn((resolve) => resolve({ error: null }));
      mockSupabase.from
        .mockReturnValueOnce(subChain)
        .mockReturnValueOnce(updateChain)
        .mockReturnValueOnce(updateChain);

      await handleSubscriptionDeleted({ id: 'sub-1' });

      expect(mockSupabase.from).toHaveBeenCalledTimes(3);
    });

    it('deve ignorar quando assinatura não encontrada', async () => {
      const chain = createChainable();
      chain.single.mockResolvedValue({ data: null, error: null });
      mockSupabase.from.mockReturnValue(chain);

      await handleSubscriptionDeleted({ id: 'sub-1' });

      expect(mockSupabase.from).toHaveBeenCalledTimes(1);
    });
  });

  describe('handleSubscriptionInactivated', () => {
    it('deve inativar assinatura', async () => {
      const subChain = createChainable();
      subChain.single.mockResolvedValue({ data: { user_id: 'user-1' }, error: null });
      const updateChain = createChainable();
      updateChain.then = jest.fn((resolve) => resolve({ error: null }));
      mockSupabase.from
        .mockReturnValueOnce(subChain)
        .mockReturnValueOnce(updateChain)
        .mockReturnValueOnce(updateChain);

      await handleSubscriptionInactivated({ id: 'sub-1' });

      expect(mockSupabase.from).toHaveBeenCalledTimes(3);
    });

    it('deve ignorar quando assinatura não encontrada', async () => {
      const chain = createChainable();
      chain.single.mockResolvedValue({ data: null, error: null });
      mockSupabase.from.mockReturnValue(chain);

      await handleSubscriptionInactivated({ id: 'sub-1' });

      expect(mockSupabase.from).toHaveBeenCalledTimes(1);
    });
  });

  describe('handleSubscriptionReactivated', () => {
    it('deve reativar assinatura', async () => {
      const subChain = createChainable();
      subChain.single.mockResolvedValue({ data: { user_id: 'user-1' }, error: null });
      const updateChain = createChainable();
      updateChain.then = jest.fn((resolve) => resolve({ error: null }));
      mockSupabase.from
        .mockReturnValueOnce(subChain)
        .mockReturnValueOnce(updateChain)
        .mockReturnValueOnce(updateChain);

      await handleSubscriptionReactivated({ id: 'sub-1' });

      expect(mockSupabase.from).toHaveBeenCalledTimes(3);
    });

    it('deve ignorar quando assinatura não encontrada', async () => {
      const chain = createChainable();
      chain.single.mockResolvedValue({ data: null, error: null });
      mockSupabase.from.mockReturnValue(chain);

      await handleSubscriptionReactivated({ id: 'sub-1' });

      expect(mockSupabase.from).toHaveBeenCalledTimes(1);
    });
  });
});
