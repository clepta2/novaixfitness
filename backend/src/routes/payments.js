// src/routes/payments.js
// Rotas de Pagamento - Asaas Integration

const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { authenticate } = require('../middleware/auth');
const asaas = require('../services/asaas');
const { validateBody, sanitizeString } = require('../middleware/validate');
const { sanitizeError } = require('../middleware/errorHandler');

async function getOrCreateAsaasCustomerId(userId, email, name, cpfCnpj, phone) {
  const { data: profile } = await supabase.from('profiles').select('asaas_customer_id, name').eq('id', userId).single();
  if (profile?.asaas_customer_id) return profile.asaas_customer_id;

  const customer = await asaas.createCustomer({
    name: profile?.name || name || 'Atleta',
    email,
    cpfCnpj,
    phone,
  });

  await supabase.from('profiles').update({ asaas_customer_id: customer.id }).eq('id', userId);
  return customer.id;
}

// Criar ou buscar cliente no Asaas
router.post('/customer', authenticate, validateBody({
  name: { type: 'string', minLength: 2, maxLength: 100 },
  email: { type: 'email' },
  cpfCnpj: { type: 'string', maxLength: 14 },
  phone: { type: 'string', maxLength: 15 }
}), async (req, res) => {
  try {
    const { name, email, cpfCnpj, phone } = req.body;
    const customerId = await getOrCreateAsaasCustomerId(req.user.id, req.user.email || email, name, cpfCnpj, phone);
    res.json({ customer: { id: customerId } });
  } catch (err) {
    res.status(400).json({ error: sanitizeError(err) });
  }
});

// Criar checkout link (redireciona para pagamento)
router.post('/checkout', authenticate, validateBody({
  planType: { required: true, enum: ['basic', 'intermediate', 'premium', 'ultra'] },
  billingType: { required: true, enum: ['PIX', 'CREDIT_CARD'] },
  cpfCnpj: { type: 'string', maxLength: 14 },
  phone: { type: 'string', maxLength: 15 }
}), async (req, res) => {
  try {
    const { planType, billingType, cpfCnpj, phone } = req.body;

    const customerId = await getOrCreateAsaasCustomerId(req.user.id, req.user.email, null, cpfCnpj, phone);
    const planConfig = asaas.getPlanConfig(planType);
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 3);

    const payment = await asaas.createPayment({
      customerId,
      value: planConfig.value,
      dueDate: dueDate.toISOString().split('T')[0],
      description: `NOVAIX FITNESS - Plano ${planConfig.name} - ${req.user.email}`,
      billingType,
    });

    const pixQrCode = billingType === 'PIX' ? await asaas.getPaymentPixQrCode(payment.id) : null;

    await supabase.from('payments').insert({
      user_id: req.user.id,
      asaas_payment_id: payment.id,
      asaas_customer_id: customerId,
      plan_type: planType,
      billing_type: billingType,
      amount: planConfig.value,
      status: payment.status,
    });

    res.json({
      paymentId: payment.id,
      status: payment.status,
      billingType,
      value: planConfig.value,
      planType,
      pixQrCode,
      invoiceUrl: payment.invoiceUrl,
      bankSlipUrl: payment.bankSlipUrl,
    });
  } catch (err) {
    res.status(400).json({ error: sanitizeError(err) });
  }
});

// Verificar status do pagamento
router.get('/status/:paymentId', authenticate, async (req, res) => {
  try {
    const { data: sub } = await supabase.from('profiles').select('subscription_status, subscription_plan').eq('id', req.user.id).single();
    const pay = req.params.paymentId !== 'null' ? await asaas.getPayment(req.params.paymentId) : null;
    res.json({
      subscription: sub,
      payment: pay ? { id: pay.id, status: pay.status, value: pay.value, paymentDate: pay.paymentDate } : null,
    });
  } catch (err) {
    res.status(400).json({ error: sanitizeError(err) });
  }
});

// Criar assinatura recorrente (após pagamento único ou cartão)
router.post('/subscribe', authenticate, validateBody({
  planType: { required: true, enum: ['basic', 'intermediate', 'premium', 'ultra'] },
  billingType: { enum: ['PIX', 'CREDIT_CARD'] },
  creditCardToken: { type: 'string', maxLength: 200 }
}), async (req, res) => {
  try {
    const { planType, billingType, creditCardToken } = req.body;

    const customerId = await getOrCreateAsaasCustomerId(req.user.id, req.user.email);
    const subscription = await asaas.createSubscription({
      customerId,
      planType,
      billingType: billingType || 'CREDIT_CARD',
      creditCardToken,
    });

    await supabase.from('subscriptions').insert({
      user_id: req.user.id,
      asaas_subscription_id: subscription.id,
      asaas_customer_id: customerId,
      plan_type: planType,
      status: subscription.status,
      value: subscription.value,
    });

    await supabase.from('profiles').update({
      subscription_status: 'active',
      subscription_plan: planType,
      asaas_subscription_id: subscription.id,
      updated_at: new Date(),
    }).eq('id', req.user.id);

    res.json({ subscription });
  } catch (err) {
    res.status(400).json({ error: sanitizeError(err) });
  }
});

// Cancelar assinatura
router.post('/cancel', authenticate, async (req, res) => {
  try {
    const { data: prof } = await supabase.from('profiles').select('asaas_subscription_id').eq('id', req.user.id).single();
    if (prof?.asaas_subscription_id) {
      await asaas.cancelSubscription(prof.asaas_subscription_id);
      await supabase.from('subscriptions').update({ status: 'cancelled' }).eq('asaas_subscription_id', prof.asaas_subscription_id);
    }

    await supabase.from('profiles').update({
      subscription_status: 'cancelled',
      asaas_subscription_id: null,
      updated_at: new Date(),
    }).eq('id', req.user.id);

    res.json({ message: 'Assinatura cancelada' });
  } catch (err) {
    res.status(400).json({ error: sanitizeError(err) });
  }
});

// Listar pagamentos do usuário
router.get('/history', authenticate, async (req, res) => {
  try {
    const { data: p } = await supabase.from('payments').select('*').eq('user_id', req.user.id).order('created_at', { ascending: false }).limit(20);
    res.json(p || []);
  } catch (err) {
    res.status(400).json({ error: sanitizeError(err) });
  }
});

// Efetuar transferência Pix (saque) - Rota Protegida
router.post('/transfer', authenticate, validateBody({
  value: { required: true, type: 'number', min: 1 },
  pixAddressKey: { required: true, type: 'string', minLength: 1, maxLength: 100 },
  pixAddressKeyType: { required: true, enum: ['PHONE', 'CPF', 'CNPJ', 'EMAIL', 'EVP', 'RANDOM'] },
  description: { type: 'string', maxLength: 200 }
}), async (req, res) => {
  try {
    const { value, pixAddressKey, pixAddressKeyType, description } = req.body;

    const transfer = await asaas.createTransfer({
      value: parseFloat(value),
      pixAddressKey: sanitizeString(pixAddressKey),
      pixAddressKeyType,
      description: description ? sanitizeString(description) : 'Transferência Pix',
    });

    res.json({ success: true, transfer });
  } catch (err) {
    res.status(400).json({ error: sanitizeError(err) });
  }
});

module.exports = router;
