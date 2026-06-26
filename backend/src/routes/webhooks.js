// src/routes/webhooks.js
// Webhooks de Pagamento - Asaas

const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const asaas = require('../services/asaas');

router.post('/asaas', async (req, res) => {
  try {
    const token = req.headers['asaas-access-token'];

    if (!asaas.verifyWebhookToken(token)) {
      console.warn('⚠️ Webhook token inválido');
      return res.status(401).json({ error: 'Token inválido' });
    }

    const { event, payment, subscription } = req.body;

    console.log('📨 Webhook Asaas recebido:', event);

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

    res.json({ received: true });
  } catch (err) {
    console.error('Erro no webhook:', err);
    res.status(500).json({ error: err.message });
  }
});

// ========================================
// HANDLERS DE PAGAMENTO
// ========================================

async function handlePaymentReceived(payment) {
  const customerId = payment.customer;
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('asaas_customer_id', customerId)
    .single();

  if (!profile) {
    console.warn('Perfil não encontrado para customer:', customerId);
    return;
  }

  await supabase
    .from('payments')
    .update({
      status: 'RECEIVED',
      paid_at: payment.paymentDate || new Date(),
    })
    .eq('asaas_payment_id', payment.id);

  await supabase
    .from('profiles')
    .update({
      subscription_status: 'active',
      updated_at: new Date(),
    })
    .eq('id', profile.id);

  console.log('✅ Pagamento confirmado para user:', profile.id);
}

async function handlePaymentCreated(payment) {
  const customerId = payment.customer;
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('asaas_customer_id', customerId)
    .single();

  if (!profile) return;

  await supabase.from('payments').upsert({
    user_id: profile.id,
    asaas_payment_id: payment.id,
    asaas_customer_id: customerId,
    amount: payment.value,
    status: payment.status,
    billing_type: payment.billingType,
  }, { onConflict: 'asaas_payment_id' });
}

async function handlePaymentUpdated(payment) {
  await supabase
    .from('payments')
    .update({ status: payment.status })
    .eq('asaas_payment_id', payment.id);
}

async function handlePaymentOverdue(payment) {
  const customerId = payment.customer;
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('asaas_customer_id', customerId)
    .single();

  if (!profile) return;

  await supabase
    .from('payments')
    .update({ status: 'OVERDUE' })
    .eq('asaas_payment_id', payment.id);

  await supabase
    .from('profiles')
    .update({
      subscription_status: 'overdue',
      updated_at: new Date(),
    })
    .eq('id', profile.id);

  console.log('⚠️ Pagamento atrasado para user:', profile.id);
}

async function handlePaymentDeleted(payment) {
  await supabase
    .from('payments')
    .update({ status: 'DELETED' })
    .eq('asaas_payment_id', payment.id);
}

async function handlePaymentRefunded(payment) {
  const customerId = payment.customer;
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('asaas_customer_id', customerId)
    .single();

  if (!profile) return;

  await supabase
    .from('payments')
    .update({ status: 'REFUNDED' })
    .eq('asaas_payment_id', payment.id);

  await supabase
    .from('profiles')
    .update({
      subscription_status: 'free',
      subscription_plan: null,
      updated_at: new Date(),
    })
    .eq('id', profile.id);

  console.log('💸 Reembolso processado para user:', profile.id);
}

// ========================================
// HANDLERS DE ASSINATURA
// ========================================

async function handleSubscriptionCreated(subscription) {
  const customerId = subscription.customer;
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('asaas_customer_id', customerId)
    .single();

  if (!profile) return;

  await supabase.from('subscriptions').upsert({
    user_id: profile.id,
    asaas_subscription_id: subscription.id,
    asaas_customer_id: customerId,
    plan_type: determinePlanType(subscription.value),
    status: subscription.status,
    value: subscription.value,
  }, { onConflict: 'asaas_subscription_id' });

  await supabase
    .from('profiles')
    .update({
      subscription_status: 'active',
      subscription_plan: determinePlanType(subscription.value),
      asaas_subscription_id: subscription.id,
      updated_at: new Date(),
    })
    .eq('id', profile.id);

  console.log('✅ Assinatura criada para user:', profile.id);
}

async function handleSubscriptionUpdated(subscription) {
  await supabase
    .from('subscriptions')
    .update({ status: subscription.status })
    .eq('asaas_subscription_id', subscription.id);
}

async function handleSubscriptionDeleted(subscription) {
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('asaas_subscription_id', subscription.id)
    .single();

  if (!sub) return;

  await supabase
    .from('subscriptions')
    .update({ status: 'cancelled' })
    .eq('asaas_subscription_id', subscription.id);

  await supabase
    .from('profiles')
    .update({
      subscription_status: 'cancelled',
      asaas_subscription_id: null,
      updated_at: new Date(),
    })
    .eq('id', sub.user_id);

  console.log('❌ Assinatura cancelada para user:', sub.user_id);
}

async function handleSubscriptionInactivated(subscription) {
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('asaas_subscription_id', subscription.id)
    .single();

  if (!sub) return;

  await supabase
    .from('subscriptions')
    .update({ status: 'inactive' })
    .eq('asaas_subscription_id', subscription.id);

  await supabase
    .from('profiles')
    .update({
      subscription_status: 'inactive',
      updated_at: new Date(),
    })
    .eq('id', sub.user_id);
}

async function handleSubscriptionReactivated(subscription) {
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('asaas_subscription_id', subscription.id)
    .single();

  if (!sub) return;

  await supabase
    .from('subscriptions')
    .update({ status: 'active' })
    .eq('asaas_subscription_id', subscription.id);

  await supabase
    .from('profiles')
    .update({
      subscription_status: 'active',
      updated_at: new Date(),
    })
    .eq('id', sub.user_id);
}

// ========================================
// UTILITÁRIOS
// ========================================

function determinePlanType(value) {
  if (value <= 49.90) return 'basic';
  if (value <= 79.90) return 'intermediate';
  return 'premium';
}

module.exports = router;
