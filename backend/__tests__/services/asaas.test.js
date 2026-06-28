const originalFetch = global.fetch;

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  global.fetch = originalFetch;
});

const asaas = require('../../src/services/asaas');

describe('Asaas Service', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('getPlanConfig', () => {
    it('deve retornar config do plano básico', () => {
      const config = asaas.getPlanConfig('basic');
      expect(config.name).toBe('Básico');
      expect(config.value).toBe(49.90);
    });

    it('deve retornar config do plano premium', () => {
      const config = asaas.getPlanConfig('premium');
      expect(config.name).toBe('Premium');
      expect(config.value).toBe(119.90);
    });

    it('deve retornar intermediate como fallback', () => {
      const config = asaas.getPlanConfig('invalid');
      expect(config.name).toBe('Intermediário');
    });
  });

  describe('getPlanValue', () => {
    it('deve retornar valor do plano', () => {
      expect(asaas.getPlanValue('basic')).toBe(49.90);
      expect(asaas.getPlanValue('ultra')).toBe(199.90);
    });
  });

  describe('verifyWebhookToken', () => {
    it('deve retornar true com token correto', () => {
      process.env.ASAAS_WEBHOOK_TOKEN = 'any-token';
      expect(asaas.verifyWebhookToken('any-token')).toBe(true);
    });

    it('deve retornar false com token incorreto', () => {
      process.env.ASAAS_WEBHOOK_TOKEN = 'correct-token';
      expect(asaas.verifyWebhookToken('wrong-token')).toBe(false);
    });

    it('deve retornar false sem token configurado', () => {
      delete process.env.ASAAS_WEBHOOK_TOKEN;
      expect(asaas.verifyWebhookToken('any-token')).toBe(false);
    });
  });

  describe('parseWebhookEvent', () => {
    it('deve parsear evento', () => {
      const result = asaas.parseWebhookEvent({ event: 'PAYMENT_RECEIVED', payment: { id: 'pay-1' }, subscription: null });
      expect(result.event).toBe('PAYMENT_RECEIVED');
      expect(result.payment.id).toBe('pay-1');
    });
  });

  describe('createCustomer', () => {
    it('deve criar cliente', async () => {
      global.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ id: 'cust-1' }) });
      const result = await asaas.createCustomer({ name: 'Test', email: 't@t.com' });
      expect(result.id).toBe('cust-1');
      expect(global.fetch).toHaveBeenCalled();
    });

    it('deve remover não-dígitos de cpfCnpj', async () => {
      global.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ id: 'cust-1' }) });
      await asaas.createCustomer({ cpfCnpj: '123.456.789-00' });
      const body = JSON.parse(global.fetch.mock.calls[0][1].body);
      expect(body.cpfCnpj).toBe('12345678900');
    });
  });

  describe('createPayment', () => {
    it('deve criar pagamento', async () => {
      global.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ id: 'pay-1', status: 'PENDING' }) });
      const result = await asaas.createPayment({ customerId: 'cust-1', value: 49.90, dueDate: '2024-01-01', description: 'Test', billingType: 'PIX' });
      expect(result.id).toBe('pay-1');
    });
  });

  describe('createSubscription', () => {
    it('deve criar assinatura', async () => {
      global.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ id: 'sub-1' }) });
      const result = await asaas.createSubscription({ customerId: 'cust-1', planType: 'premium', billingType: 'CREDIT_CARD' });
      expect(result.id).toBe('sub-1');
    });
  });

  describe('cancelSubscription', () => {
    it('deve cancelar assinatura', async () => {
      global.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({}) });
      await asaas.cancelSubscription('sub-1');
      expect(global.fetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ method: 'DELETE' }));
    });
  });

  describe('request', () => {
    it('deve lançar erro para resposta não-ok', async () => {
      global.fetch.mockResolvedValue({ ok: false, json: () => Promise.resolve({ errors: [{ description: 'Invalid' }] }) });
      await expect(asaas.request('/test')).rejects.toThrow('Invalid');
    });

    it('deve usar mensagem de erro genérica', async () => {
      global.fetch.mockResolvedValue({ ok: false, json: () => Promise.resolve({}) });
      await expect(asaas.request('/test')).rejects.toThrow('Erro na API Asaas');
    });
  });

  describe('getCustomer', () => {
    it('deve buscar cliente por ID', async () => {
      global.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ id: 'cust-1', name: 'Test' }) });
      const result = await asaas.getCustomer('cust-1');
      expect(result.id).toBe('cust-1');
    });
  });

  describe('findCustomerByEmail', () => {
    it('deve buscar cliente por email', async () => {
      global.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ data: [{ id: 'cust-1' }] }) });
      const result = await asaas.findCustomerByEmail('test@test.com');
      expect(result.id).toBe('cust-1');
    });

    it('deve retornar null quando não encontrar', async () => {
      global.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ data: [] }) });
      const result = await asaas.findCustomerByEmail('none@test.com');
      expect(result).toBeNull();
    });
  });

  describe('findCustomerByExternalReference', () => {
    it('deve buscar por referência externa', async () => {
      global.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ data: [{ id: 'cust-1' }] }) });
      const result = await asaas.findCustomerByExternalReference('ref-123');
      expect(result.id).toBe('cust-1');
    });
  });

  describe('getSubscription', () => {
    it('deve buscar assinatura', async () => {
      global.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ id: 'sub-1', status: 'ACTIVE' }) });
      const result = await asaas.getSubscription('sub-1');
      expect(result.id).toBe('sub-1');
    });
  });

  describe('listSubscriptions', () => {
    it('deve listar assinaturas', async () => {
      global.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ data: [{ id: 'sub-1' }] }) });
      const result = await asaas.listSubscriptions('cust-1');
      expect(result).toHaveLength(1);
    });
  });

  describe('getPayment', () => {
    it('deve buscar pagamento', async () => {
      global.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ id: 'pay-1', status: 'CONFIRMED' }) });
      const result = await asaas.getPayment('pay-1');
      expect(result.id).toBe('pay-1');
    });
  });

  describe('getPaymentPixQrCode', () => {
    it('deve buscar QR code PIX', async () => {
      global.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ payload: 'pix-qr' }) });
      const result = await asaas.getPaymentPixQrCode('pay-1');
      expect(result.payload).toBe('pix-qr');
    });
  });

  describe('listPayments', () => {
    it('deve listar pagamentos', async () => {
      global.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ data: [{ id: 'pay-1' }] }) });
      const result = await asaas.listPayments('cust-1');
      expect(result).toHaveLength(1);
    });
  });

  describe('createCheckoutLink', () => {
    it('deve criar link de checkout', async () => {
      global.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ id: 'checkout-1', url: 'https://checkout.asaas.com' }) });
      const result = await asaas.createCheckoutLink({ customerId: 'cust-1', planType: 'premium', billingType: 'PIX' });
      expect(result.id).toBe('checkout-1');
    });
  });

  describe('createTransfer', () => {
    it('deve criar transferência', async () => {
      global.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ id: 'trans-1' }) });
      const result = await asaas.createTransfer({ value: 100, pixAddressKey: '123', pixAddressKeyType: 'CPF', description: 'Teste' });
      expect(result.id).toBe('trans-1');
    });
  });
});
