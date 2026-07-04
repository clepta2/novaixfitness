jest.mock('../../src/config/supabase', () => {
  const { mockSupabase } = require('../../test-utils/mocks');
  return mockSupabase;
});
jest.mock('../../src/services/subscriptionHandlers', () => ({
  determinePlanType: jest.fn().mockReturnValue('premium'),
}));

const { mockSupabase, createChainable } = require('../../test-utils/mocks');
const { handlePaymentReceived, handlePaymentCreated, handlePaymentUpdated, handlePaymentOverdue, handlePaymentDeleted, handlePaymentRefunded } = require('../../src/services/paymentHandlers');

describe('Payment Handlers', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('handlePaymentReceived', () => {
    it('deve atualizar pagamento e perfil', async () => {
      const profileChain = createChainable();
      profileChain.single.mockResolvedValue({ data: { id: 'user-1' }, error: null });
      const paymentChain = createChainable();
      paymentChain.single.mockResolvedValue({ data: { plan_type: 'premium' }, error: null });
      const updateChain = createChainable();
      updateChain.then = jest.fn((resolve) => resolve({ error: null }));
      mockSupabase.from
        .mockReturnValueOnce(profileChain)
        .mockReturnValueOnce(updateChain)
        .mockReturnValueOnce(paymentChain)
        .mockReturnValueOnce(updateChain);

      await handlePaymentReceived({ id: 'pay-1', customer: 'cust-1', paymentDate: '2024-01-01' });

      expect(mockSupabase.from).toHaveBeenCalledTimes(4);
    });

    it('deve ignorar quando perfil não encontrado', async () => {
      const chain = createChainable();
      chain.single.mockResolvedValue({ data: null, error: null });
      mockSupabase.from.mockReturnValue(chain);

      await handlePaymentReceived({ id: 'pay-1', customer: 'cust-1' });

      expect(mockSupabase.from).toHaveBeenCalledTimes(1);
    });
  });

  describe('handlePaymentCreated', () => {
    it('deve criar registro de pagamento', async () => {
      const profileChain = createChainable();
      profileChain.single.mockResolvedValue({ data: { id: 'user-1' }, error: null });
      const upsertChain = createChainable();
      upsertChain.then = jest.fn((resolve) => resolve({ error: null }));
      mockSupabase.from
        .mockReturnValueOnce(profileChain)
        .mockReturnValueOnce(upsertChain);

      await handlePaymentCreated({ id: 'pay-1', customer: 'cust-1', value: 49.90, status: 'PENDING', billingType: 'PIX' });

      expect(mockSupabase.from).toHaveBeenCalledTimes(2);
    });

    it('deve ignorar quando perfil não encontrado', async () => {
      const chain = createChainable();
      chain.single.mockResolvedValue({ data: null, error: null });
      mockSupabase.from.mockReturnValue(chain);

      await handlePaymentCreated({ id: 'pay-1', customer: 'cust-1' });

      expect(mockSupabase.from).toHaveBeenCalledTimes(1);
    });
  });

  describe('handlePaymentUpdated', () => {
    it('deve atualizar status', async () => {
      const chain = createChainable();
      chain.then = jest.fn((resolve) => resolve({ error: null }));
      mockSupabase.from.mockReturnValue(chain);

      await handlePaymentUpdated({ id: 'pay-1', status: 'CONFIRMED' });

      expect(chain.update).toHaveBeenCalledWith({ status: 'CONFIRMED' });
    });
  });

  describe('handlePaymentOverdue', () => {
    it('deve marcar como atrasado', async () => {
      const profileChain = createChainable();
      profileChain.single.mockResolvedValue({ data: { id: 'user-1' }, error: null });
      const updateChain = createChainable();
      updateChain.then = jest.fn((resolve) => resolve({ error: null }));
      mockSupabase.from
        .mockReturnValueOnce(profileChain)
        .mockReturnValueOnce(updateChain)
        .mockReturnValueOnce(updateChain);

      await handlePaymentOverdue({ id: 'pay-1', customer: 'cust-1' });

      expect(mockSupabase.from).toHaveBeenCalledTimes(3);
    });

    it('deve ignorar quando perfil não encontrado', async () => {
      const chain = createChainable();
      chain.single.mockResolvedValue({ data: null, error: null });
      mockSupabase.from.mockReturnValue(chain);

      await handlePaymentOverdue({ id: 'pay-1', customer: 'cust-1' });

      expect(mockSupabase.from).toHaveBeenCalledTimes(1);
    });
  });

  describe('handlePaymentDeleted', () => {
    it('deve marcar como deletado', async () => {
      const chain = createChainable();
      chain.then = jest.fn((resolve) => resolve({ error: null }));
      mockSupabase.from.mockReturnValue(chain);

      await handlePaymentDeleted({ id: 'pay-1' });

      expect(chain.update).toHaveBeenCalledWith({ status: 'DELETED' });
    });
  });

  describe('handlePaymentRefunded', () => {
    it('deve processar reembolso', async () => {
      const profileChain = createChainable();
      profileChain.single.mockResolvedValue({ data: { id: 'user-1' }, error: null });
      const updateChain = createChainable();
      updateChain.then = jest.fn((resolve) => resolve({ error: null }));
      mockSupabase.from
        .mockReturnValueOnce(profileChain)
        .mockReturnValueOnce(updateChain)
        .mockReturnValueOnce(updateChain);

      await handlePaymentRefunded({ id: 'pay-1', customer: 'cust-1' });

      expect(mockSupabase.from).toHaveBeenCalledTimes(3);
    });

    it('deve ignorar quando perfil não encontrado', async () => {
      const chain = createChainable();
      chain.single.mockResolvedValue({ data: null, error: null });
      mockSupabase.from.mockReturnValue(chain);

      await handlePaymentRefunded({ id: 'pay-1', customer: 'cust-1' });

      expect(mockSupabase.from).toHaveBeenCalledTimes(1);
    });
  });
});
