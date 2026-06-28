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

jest.mock('../../src/services/asaas', () => ({
  createCustomer: jest.fn().mockResolvedValue({ id: 'cust-123' }),
  getPlanConfig: jest.fn().mockReturnValue({ value: 49.90, name: 'Premium' }),
  createPayment: jest.fn().mockResolvedValue({ id: 'pay-123', status: 'PENDING', invoiceUrl: 'https://invoice.url' }),
  getPaymentPixQrCode: jest.fn().mockResolvedValue({ payload: 'pix-qr' }),
  getPayment: jest.fn().mockResolvedValue({ id: 'pay-123', status: 'CONFIRMED', value: 49.90 }),
  createSubscription: jest.fn().mockResolvedValue({ id: 'sub-123', status: 'ACTIVE', value: 49.90 }),
  cancelSubscription: jest.fn().mockResolvedValue({}),
  createTransfer: jest.fn().mockResolvedValue({ id: 'trans-123' }),
}));

const mockSupabase = require('../../src/config/supabase');
const asaas = require('../../src/services/asaas');
const paymentRoutes = require('../../src/routes/payments');

const app = express();
app.use(express.json());
app.use('/api/payments', paymentRoutes);

describe('Payment Routes', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('POST /customer', () => {
    it('deve retornar 401 sem token', async () => {
      const res = await request(app).post('/api/payments/customer').send({ name: 'Test' });
      expect(res.status).toBe(401);
    });

    it('deve criar cliente quando não existe', async () => {
      const chain = createChainable();
      chain.single.mockResolvedValue({ data: null, error: null });
      mockSupabase.from.mockReturnValue(chain);
      const res = await request(app).post('/api/payments/customer').set('Authorization', 'Bearer token').send({ name: 'Test', email: 'test@test.com' });
      expect(res.status).toBe(200);
      expect(res.body.customer.id).toBe('cust-123');
      expect(asaas.createCustomer).toHaveBeenCalled();
    });

    it('deve retornar cliente existente', async () => {
      const chain = createChainable();
      chain.single.mockResolvedValue({ data: { asaas_customer_id: 'existing-cust' }, error: null });
      mockSupabase.from.mockReturnValue(chain);
      const res = await request(app).post('/api/payments/customer').set('Authorization', 'Bearer token').send({ name: 'Test' });
      expect(res.status).toBe(200);
      expect(res.body.customer.id).toBe('existing-cust');
    });
  });

  describe('POST /checkout', () => {
    it('deve retornar 401 sem token', async () => {
      const res = await request(app).post('/api/payments/checkout').send({ planType: 'premium', billingType: 'PIX' });
      expect(res.status).toBe(401);
    });

    it('deve retornar 400 sem planType', async () => {
      const res = await request(app).post('/api/payments/checkout').set('Authorization', 'Bearer token').send({ billingType: 'PIX' });
      expect(res.status).toBe(400);
    });

    it('deve retornar 400 com planType inválido', async () => {
      const res = await request(app).post('/api/payments/checkout').set('Authorization', 'Bearer token').send({ planType: 'invalid', billingType: 'PIX' });
      expect(res.status).toBe(400);
    });

    it('deve criar checkout PIX', async () => {
      const chain = createChainable();
      chain.single.mockResolvedValue({ data: { asaas_customer_id: 'cust-123' }, error: null });
      chain.then = jest.fn((resolve) => resolve({ data: null, error: null }));
      mockSupabase.from.mockReturnValue(chain);
      const res = await request(app).post('/api/payments/checkout').set('Authorization', 'Bearer token').send({ planType: 'premium', billingType: 'PIX' });
      expect(res.status).toBe(200);
      expect(res.body.paymentId).toBe('pay-123');
      expect(res.body.pixQrCode).toBeDefined();
      expect(asaas.createPayment).toHaveBeenCalled();
      expect(asaas.getPaymentPixQrCode).toHaveBeenCalledWith('pay-123');
    });

    it('deve criar checkout CREDIT_CARD', async () => {
      const chain = createChainable();
      chain.single.mockResolvedValue({ data: { asaas_customer_id: 'cust-123' }, error: null });
      chain.then = jest.fn((resolve) => resolve({ data: null, error: null }));
      mockSupabase.from.mockReturnValue(chain);
      const res = await request(app).post('/api/payments/checkout').set('Authorization', 'Bearer token').send({ planType: 'premium', billingType: 'CREDIT_CARD' });
      expect(res.status).toBe(200);
      expect(res.body.pixQrCode).toBeNull();
      expect(asaas.getPaymentPixQrCode).not.toHaveBeenCalled();
    });
  });

  describe('GET /status/:paymentId', () => {
    it('deve retornar status do pagamento', async () => {
      const chain = createChainable();
      chain.single.mockResolvedValue({ data: { subscription_status: 'active', subscription_plan: 'premium' }, error: null });
      mockSupabase.from.mockReturnValue(chain);
      const res = await request(app).get('/api/payments/status/pay-123').set('Authorization', 'Bearer token');
      expect(res.status).toBe(200);
      expect(res.body.subscription).toBeDefined();
      expect(res.body.payment).toBeDefined();
    });

    it('deve retornar null para paymentId null', async () => {
      const chain = createChainable();
      chain.single.mockResolvedValue({ data: { subscription_status: 'free' }, error: null });
      mockSupabase.from.mockReturnValue(chain);
      const res = await request(app).get('/api/payments/status/null').set('Authorization', 'Bearer token');
      expect(res.status).toBe(200);
      expect(res.body.payment).toBeNull();
    });
  });

  describe('POST /subscribe', () => {
    it('deve criar assinatura', async () => {
      const chain = createChainable();
      chain.single.mockResolvedValue({ data: { asaas_customer_id: 'cust-123' }, error: null });
      chain.then = jest.fn((resolve) => resolve({ data: null, error: null }));
      mockSupabase.from.mockReturnValue(chain);
      const res = await request(app).post('/api/payments/subscribe').set('Authorization', 'Bearer token').send({ planType: 'premium', billingType: 'CREDIT_CARD' });
      expect(res.status).toBe(200);
      expect(res.body.subscription).toBeDefined();
      expect(asaas.createSubscription).toHaveBeenCalled();
    });

    it('deve retornar 400 com planType inválido', async () => {
      const res = await request(app).post('/api/payments/subscribe').set('Authorization', 'Bearer token').send({ planType: 'invalid' });
      expect(res.status).toBe(400);
    });
  });

  describe('POST /cancel', () => {
    it('deve cancelar assinatura', async () => {
      const chain = createChainable();
      chain.single.mockResolvedValue({ data: { asaas_subscription_id: 'sub-123' }, error: null });
      chain.then = jest.fn((resolve) => resolve({ data: null, error: null }));
      mockSupabase.from.mockReturnValue(chain);
      const res = await request(app).post('/api/payments/cancel').set('Authorization', 'Bearer token');
      expect(res.status).toBe(200);
      expect(res.body.message).toContain('cancelada');
      expect(asaas.cancelSubscription).toHaveBeenCalledWith('sub-123');
    });

    it('deve cancelar mesmo sem subscription_id', async () => {
      const chain = createChainable();
      chain.single.mockResolvedValue({ data: { asaas_subscription_id: null }, error: null });
      chain.then = jest.fn((resolve) => resolve({ data: null, error: null }));
      mockSupabase.from.mockReturnValue(chain);
      const res = await request(app).post('/api/payments/cancel').set('Authorization', 'Bearer token');
      expect(res.status).toBe(200);
      expect(asaas.cancelSubscription).not.toHaveBeenCalled();
    });
  });

  describe('GET /history', () => {
    it('deve retornar histórico de pagamentos', async () => {
      const chain = createChainable();
      chain.then = jest.fn((resolve) => resolve({ data: [{ id: 'pay-1' }], error: null }));
      mockSupabase.from.mockReturnValue(chain);
      const res = await request(app).get('/api/payments/history').set('Authorization', 'Bearer token');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('POST /transfer', () => {
    it('deve retornar 400 sem value', async () => {
      const res = await request(app).post('/api/payments/transfer').set('Authorization', 'Bearer token').send({ pixAddressKey: '123', pixAddressKeyType: 'CPF' });
      expect(res.status).toBe(400);
    });

    it('deve retornar 400 com value inválido', async () => {
      const res = await request(app).post('/api/payments/transfer').set('Authorization', 'Bearer token').send({ value: -1, pixAddressKey: '123', pixAddressKeyType: 'CPF' });
      expect(res.status).toBe(400);
    });

    it('deve retornar 400 sem pixAddressKey', async () => {
      const res = await request(app).post('/api/payments/transfer').set('Authorization', 'Bearer token').send({ value: 100, pixAddressKeyType: 'CPF' });
      expect(res.status).toBe(400);
    });

    it('deve retornar 400 com pixAddressKeyType inválido', async () => {
      const res = await request(app).post('/api/payments/transfer').set('Authorization', 'Bearer token').send({ value: 100, pixAddressKey: '123', pixAddressKeyType: 'INVALID' });
      expect(res.status).toBe(400);
    });

    it('deve criar transferência com sucesso', async () => {
      const res = await request(app).post('/api/payments/transfer').set('Authorization', 'Bearer token').send({ value: 100, pixAddressKey: '123', pixAddressKeyType: 'CPF', description: 'Teste' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(asaas.createTransfer).toHaveBeenCalled();
    });

    it('deve usar descrição padrão quando não fornecida', async () => {
      const res = await request(app).post('/api/payments/transfer').set('Authorization', 'Bearer token').send({ value: 50, pixAddressKey: '456', pixAddressKeyType: 'EMAIL' });
      expect(res.status).toBe(200);
    });
  });
});
