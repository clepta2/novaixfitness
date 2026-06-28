const request = require('supertest');
const express = require('express');

jest.mock('../../src/services/asaas', () => ({
  verifyWebhookToken: jest.fn(),
}));
jest.mock('../../src/services/paymentHandlers', () => ({
  handlePaymentReceived: jest.fn(),
  handlePaymentCreated: jest.fn(),
  handlePaymentUpdated: jest.fn(),
  handlePaymentOverdue: jest.fn(),
  handlePaymentDeleted: jest.fn(),
  handlePaymentRefunded: jest.fn(),
}));
jest.mock('../../src/services/subscriptionHandlers', () => ({
  handleSubscriptionCreated: jest.fn(),
  handleSubscriptionUpdated: jest.fn(),
  handleSubscriptionDeleted: jest.fn(),
  handleSubscriptionInactivated: jest.fn(),
  handleSubscriptionReactivated: jest.fn(),
}));

const asaas = require('../../src/services/asaas');
const paymentHandlers = require('../../src/services/paymentHandlers');
const subscriptionHandlers = require('../../src/services/subscriptionHandlers');
const webhookRoutes = require('../../src/routes/webhooks');
const app = express();
app.use(express.json());
app.use('/api/webhooks', webhookRoutes);

describe('Webhook Routes', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('POST /asaas', () => {
    it('deve retornar 401 com token inválido', async () => {
      asaas.verifyWebhookToken.mockReturnValue(false);
      const res = await request(app).post('/api/webhooks/asaas').set('asaas-access-token', 'invalid').send({ event: 'TEST' });
      expect(res.status).toBe(401);
    });

    it('deve aceitar PAYMENT_RECEIVED', async () => {
      asaas.verifyWebhookToken.mockReturnValue(true);
      const res = await request(app).post('/api/webhooks/asaas').set('asaas-access-token', 'valid').send({ event: 'PAYMENT_RECEIVED', payment: { id: 'pay-1' } });
      expect(res.status).toBe(200);
      expect(paymentHandlers.handlePaymentReceived).toHaveBeenCalledWith({ id: 'pay-1' });
    });

    it('deve aceitar PAYMENT_CREATED', async () => {
      asaas.verifyWebhookToken.mockReturnValue(true);
      await request(app).post('/api/webhooks/asaas').set('asaas-access-token', 'valid').send({ event: 'PAYMENT_CREATED', payment: { id: 'pay-1' } });
      expect(paymentHandlers.handlePaymentCreated).toHaveBeenCalled();
    });

    it('deve aceitar PAYMENT_UPDATED', async () => {
      asaas.verifyWebhookToken.mockReturnValue(true);
      await request(app).post('/api/webhooks/asaas').set('asaas-access-token', 'valid').send({ event: 'PAYMENT_UPDATED', payment: { id: 'pay-1' } });
      expect(paymentHandlers.handlePaymentUpdated).toHaveBeenCalled();
    });

    it('deve aceitar PAYMENT_OVERDUE', async () => {
      asaas.verifyWebhookToken.mockReturnValue(true);
      await request(app).post('/api/webhooks/asaas').set('asaas-access-token', 'valid').send({ event: 'PAYMENT_OVERDUE', payment: { id: 'pay-1' } });
      expect(paymentHandlers.handlePaymentOverdue).toHaveBeenCalled();
    });

    it('deve aceitar PAYMENT_DELETED', async () => {
      asaas.verifyWebhookToken.mockReturnValue(true);
      await request(app).post('/api/webhooks/asaas').set('asaas-access-token', 'valid').send({ event: 'PAYMENT_DELETED', payment: { id: 'pay-1' } });
      expect(paymentHandlers.handlePaymentDeleted).toHaveBeenCalled();
    });

    it('deve aceitar PAYMENT_REFUNDED', async () => {
      asaas.verifyWebhookToken.mockReturnValue(true);
      await request(app).post('/api/webhooks/asaas').set('asaas-access-token', 'valid').send({ event: 'PAYMENT_REFUNDED', payment: { id: 'pay-1' } });
      expect(paymentHandlers.handlePaymentRefunded).toHaveBeenCalled();
    });

    it('deve aceitar SUBSCRIPTION_CREATED', async () => {
      asaas.verifyWebhookToken.mockReturnValue(true);
      await request(app).post('/api/webhooks/asaas').set('asaas-access-token', 'valid').send({ event: 'SUBSCRIPTION_CREATED', subscription: { id: 'sub-1' } });
      expect(subscriptionHandlers.handleSubscriptionCreated).toHaveBeenCalled();
    });

    it('deve aceitar SUBSCRIPTION_UPDATED', async () => {
      asaas.verifyWebhookToken.mockReturnValue(true);
      await request(app).post('/api/webhooks/asaas').set('asaas-access-token', 'valid').send({ event: 'SUBSCRIPTION_UPDATED', subscription: { id: 'sub-1' } });
      expect(subscriptionHandlers.handleSubscriptionUpdated).toHaveBeenCalled();
    });

    it('deve aceitar SUBSCRIPTION_DELETED', async () => {
      asaas.verifyWebhookToken.mockReturnValue(true);
      await request(app).post('/api/webhooks/asaas').set('asaas-access-token', 'valid').send({ event: 'SUBSCRIPTION_DELETED', subscription: { id: 'sub-1' } });
      expect(subscriptionHandlers.handleSubscriptionDeleted).toHaveBeenCalled();
    });

    it('deve aceitar SUBSCRIPTION_INACTIVATED', async () => {
      asaas.verifyWebhookToken.mockReturnValue(true);
      await request(app).post('/api/webhooks/asaas').set('asaas-access-token', 'valid').send({ event: 'SUBSCRIPTION_INACTIVATED', subscription: { id: 'sub-1' } });
      expect(subscriptionHandlers.handleSubscriptionInactivated).toHaveBeenCalled();
    });

    it('deve aceitar SUBSCRIPTION_REACTIVATED', async () => {
      asaas.verifyWebhookToken.mockReturnValue(true);
      await request(app).post('/api/webhooks/asaas').set('asaas-access-token', 'valid').send({ event: 'SUBSCRIPTION_REACTIVATED', subscription: { id: 'sub-1' } });
      expect(subscriptionHandlers.handleSubscriptionReactivated).toHaveBeenCalled();
    });

    it('deve ignorar eventos desconhecidos', async () => {
      asaas.verifyWebhookToken.mockReturnValue(true);
      const res = await request(app).post('/api/webhooks/asaas').set('asaas-access-token', 'valid').send({ event: 'UNKNOWN_EVENT' });
      expect(res.status).toBe(200);
    });
  });
});
