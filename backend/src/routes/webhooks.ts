// src/routes/webhooks.ts
// Webhooks de Pagamento - Asaas

import express, { Request, Response } from 'express';
import crypto from 'crypto';
import asaas from '../services/asaas';
import {
  handlePaymentReceived,
  handlePaymentCreated,
  handlePaymentUpdated,
  handlePaymentOverdue,
  handlePaymentDeleted,
  handlePaymentRefunded,
} from '../services/paymentHandlers';
import {
  handleSubscriptionCreated,
  handleSubscriptionUpdated,
  handleSubscriptionDeleted,
  handleSubscriptionInactivated,
  handleSubscriptionReactivated,
} from '../services/subscriptionHandlers';
import {
  isEventProcessed,
  markEventProcessing,
  markEventCompleted,
  markEventFailed,
} from '../services/webhookIdempotency';

const router = express.Router();
const WEBHOOK_SECRET = process.env.ASAAS_WEBHOOK_SECRET || '';

// Verificacao HMAC-SHA256 da assinatura do webhook
function verifyWebhookSignature(rawBody, signature) {
  if (!WEBHOOK_SECRET || !signature) return false;

  const expectedSig = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(rawBody)
    .digest('hex');

  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSig, 'hex')
    );
  } catch {
    return false;
  }
}

// Middleware para capturar raw body para verificacao HMAC
router.use('/asaas', express.raw({ type: 'application/json' }));

router.post('/asaas', async (req, res) => {
  try {
    // 1. Verificar assinatura HMAC-SHA256
    const signature = req.headers['asaas-access-token'] || req.headers['x-asaas-signature'];
    const rawBody = req.body;

    if (WEBHOOK_SECRET && !verifyWebhookSignature(rawBody, signature)) {
      console.warn('⚠️ Webhook HMAC invalido — possivel tentativa de spoofing');
      return res.status(401).json({ error: 'Assinatura invalida' });
    }

    // Fallback: verificacao por token (compatibilidade)
    const token = req.headers['asaas-access-token'];
    if (!WEBHOOK_SECRET && !asaas.verifyWebhookToken(token)) {
      console.warn('⚠️ Webhook token invalido');
      return res.status(401).json({ error: 'Token invalido' });
    }

    // 2. Parse do body
    const body = typeof rawBody === 'string' ? JSON.parse(rawBody) : rawBody;
    const { event, payment, subscription } = body;

    // 3. Idempotency check — verificar se evento ja foi processado
    const eventId = body.id || body.eventId || `${event}_${payment?.id || subscription?.id}_${Date.now()}`;

    if (await isEventProcessed(eventId)) {
      console.log(`📨 Webhook ${eventId} (${event}) ja processado — ignorando duplicata`);
      return res.json({ received: true, duplicate: true });
    }

    // 4. Marcar evento como processando
    await markEventProcessing(eventId, event, body);

    console.log('📨 Webhook recebido:', event);

    // 5. Processar evento
    let processed = false;
    switch (event) {
      case 'PAYMENT_RECEIVED':
        await handlePaymentReceived(payment);
        processed = true;
        break;
      case 'PAYMENT_CREATED':
        await handlePaymentCreated(payment);
        processed = true;
        break;
      case 'PAYMENT_UPDATED':
        await handlePaymentUpdated(payment);
        processed = true;
        break;
      case 'PAYMENT_OVERDUE':
        await handlePaymentOverdue(payment);
        processed = true;
        break;
      case 'PAYMENT_DELETED':
        await handlePaymentDeleted(payment);
        processed = true;
        break;
      case 'PAYMENT_REFUNDED':
        await handlePaymentRefunded(payment);
        processed = true;
        break;
      case 'SUBSCRIPTION_CREATED':
        await handleSubscriptionCreated(subscription);
        processed = true;
        break;
      case 'SUBSCRIPTION_UPDATED':
        await handleSubscriptionUpdated(subscription);
        processed = true;
        break;
      case 'SUBSCRIPTION_DELETED':
        await handleSubscriptionDeleted(subscription);
        processed = true;
        break;
      case 'SUBSCRIPTION_INACTIVATED':
        await handleSubscriptionInactivated(subscription);
        processed = true;
        break;
      case 'SUBSCRIPTION_REACTIVATED':
        await handleSubscriptionReactivated(subscription);
        processed = true;
        break;
      default:
        console.log('Evento nao tratado:', event);
    }

    // 6. Marcar como concluido
    if (processed) {
      await markEventCompleted(eventId);
    }

    res.json({ received: true, approved: true, status: 'APPROVED' });
  } catch (err) {
    console.error('Erro no webhook:', err.message);

    // Marcar falha para retry via dead-letter queue
    try {
      const eventId = req.body?.id || `unknown_${Date.now()}`;
      await markEventFailed(eventId, req.body?.event || 'unknown', req.body, err);
    } catch (dlqErr) {
      console.error('Erro ao registrar falha na DLQ:', dlqErr.message);
    }

    res.status(500).json({ error: 'Erro interno' });
  }
});

module.exports = router;
