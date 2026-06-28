// src/routes/webhooks.js
// Webhooks de Pagamento - Asaas

const express = require('express');
const router = express.Router();
const asaas = require('../services/asaas');
const {
  handlePaymentReceived,
  handlePaymentCreated,
  handlePaymentUpdated,
  handlePaymentOverdue,
  handlePaymentDeleted,
  handlePaymentRefunded,
} = require('../services/paymentHandlers');
const {
  handleSubscriptionCreated,
  handleSubscriptionUpdated,
  handleSubscriptionDeleted,
  handleSubscriptionInactivated,
  handleSubscriptionReactivated,
} = require('../services/subscriptionHandlers');

router.post('/asaas', async (req, res) => {
  try {
    const token = req.headers['asaas-access-token'];

    if (!asaas.verifyWebhookToken(token)) {
      console.warn('⚠️ Webhook token inválido');
      return res.status(401).json({ error: 'Token inválido' });
    }

    const { event, payment, subscription } = req.body;

    console.log('📨 Webhook recebido:', event);

    switch (event) {
      case 'PAYMENT_RECEIVED':
        await handlePaymentReceived(payment);
        break;

      case 'PAYMENT_CREATED':
        await handlePaymentCreated(payment);
        break;

      case 'PAYMENT_UPDATED':
        await handlePaymentUpdated(payment);
        break;

      case 'PAYMENT_OVERDUE':
        await handlePaymentOverdue(payment);
        break;

      case 'PAYMENT_DELETED':
        await handlePaymentDeleted(payment);
        break;

      case 'PAYMENT_REFUNDED':
        await handlePaymentRefunded(payment);
        break;

      case 'SUBSCRIPTION_CREATED':
        await handleSubscriptionCreated(subscription);
        break;

      case 'SUBSCRIPTION_UPDATED':
        await handleSubscriptionUpdated(subscription);
        break;

      case 'SUBSCRIPTION_DELETED':
        await handleSubscriptionDeleted(subscription);
        break;

      case 'SUBSCRIPTION_INACTIVATED':
        await handleSubscriptionInactivated(subscription);
        break;

      case 'SUBSCRIPTION_REACTIVATED':
        await handleSubscriptionReactivated(subscription);
        break;

      default:
        console.log('Evento não tratado:', event);
    }

    res.json({ received: true, approved: true, status: 'APPROVED' });
  } catch (err) {
    console.error('Erro no webhook:', err.message);
    res.status(500).json({ error: 'Erro interno' });
  }
});

module.exports = router;
