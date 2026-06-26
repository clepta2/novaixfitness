// src/routes/payments.js
// Rotas de Pagamento - Asaas Integration

const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { authenticate } = require('../middleware/auth');
const asaas = require('../services/asaas');

// Criar ou buscar cliente no Asaas
router.post('/customer', authenticate, async (req, res) => {
  try {
    const { name, email, cpfCnpj, phone } = req.body;
    const userEmail = req.user.email || email;

    let customer = await asaas.findCustomerByEmail(userEmail);

    if (!customer) {
      customer = await asaas.createCustomer({
        name: name || req.user.user_metadata?.name || 'Atleta',
        email: userEmail,
        cpfCnpj,
        phone,
      });
    }

    await supabase
      .from('profiles')
      .update({ asaas_customer_id: customer.id })
      .eq('id', req.user.id);

    res.json({ customer });
  } catch (err) {
    console.error('Erro ao criar cliente Asaas:', err);
    res.status(400).json({ error: err.message });
  }
});

// Criar checkout link (redireciona para pagamento)
router.post('/checkout', authenticate, async (req, res) => {
  try {
    const { planType, billingType, cpfCnpj, phone } = req.body;

    if (!['basic', 'intermediate', 'premium'].includes(planType)) {
      return res.status(400).json({ error: 'Plano inválido' });
    }

    if (!['PIX', 'CREDIT_CARD'].includes(billingType)) {
      return res.status(400).json({ error: 'Tipo de pagamento inválido' });
    }

    let { data: profile } = await supabase
      .from('profiles')
      .select('asaas_customer_id, name')
      .eq('id', req.user.id)
      .single();

    if (!profile?.asaas_customer_id) {
      const customer = await asaas.createCustomer({
        name: profile?.name || req.user.user_metadata?.name || 'Atleta',
        email: req.user.email,
        cpfCnpj,
        phone,
      });

      await supabase
        .from('profiles')
        .update({ asaas_customer_id: customer.id })
        .eq('id', req.user.id);

      profile = { ...profile, asaas_customer_id: customer.id };
    }

    const planConfig = asaas.getPlanConfig(planType);
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 3);

    const payment = await asaas.createPayment({
      customerId: profile.asaas_customer_id,
      value: planConfig.value,
      dueDate: dueDate.toISOString().split('T')[0],
      description: `NOVAIX FITNESS - Plano ${planConfig.name} - ${req.user.email}`,
      billingType,
    });

    let pixQrCode = null;
    if (billingType === 'PIX') {
      pixQrCode = await asaas.getPaymentPixQrCode(payment.id);
    }

    await supabase.from('payments').insert({
      user_id: req.user.id,
      asaas_payment_id: payment.id,
      asaas_customer_id: profile.asaas_customer_id,
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
    console.error('Erro ao criar checkout:', err);
    res.status(400).json({ error: err.message });
  }
});

// Verificar status do pagamento
router.get('/status/:paymentId', authenticate, async (req, res) => {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_status, subscription_plan')
      .eq('id', req.user.id)
      .single();

    let payment = null;
    if (req.params.paymentId !== 'null') {
      payment = await asaas.getPayment(req.params.paymentId);
    }

    res.json({
      subscription: profile,
      payment: payment ? {
        id: payment.id,
        status: payment.status,
        value: payment.value,
        paymentDate: payment.paymentDate,
      } : null,
    });
  } catch (err) {
    console.error('Erro ao verificar status:', err);
    res.status(400).json({ error: err.message });
  }
});

// Criar assinatura recorrente (após pagamento único ou cartão)
router.post('/subscribe', authenticate, async (req, res) => {
  try {
    const { planType, billingType, creditCardToken } = req.body;

    if (!['basic', 'intermediate', 'premium'].includes(planType)) {
      return res.status(400).json({ error: 'Plano inválido' });
    }

    let { data: profile } = await supabase
      .from('profiles')
      .select('asaas_customer_id, name')
      .eq('id', req.user.id)
      .single();

    if (!profile?.asaas_customer_id) {
      const customer = await asaas.createCustomer({
        name: profile?.name || req.user.user_metadata?.name || 'Atleta',
        email: req.user.email,
      });

      await supabase
        .from('profiles')
        .update({ asaas_customer_id: customer.id })
        .eq('id', req.user.id);

      profile = { ...profile, asaas_customer_id: customer.id };
    }

    const subscription = await asaas.createSubscription({
      customerId: profile.asaas_customer_id,
      planType,
      billingType: billingType || 'CREDIT_CARD',
      creditCardToken,
    });

    await supabase.from('subscriptions').insert({
      user_id: req.user.id,
      asaas_subscription_id: subscription.id,
      asaas_customer_id: profile.asaas_customer_id,
      plan_type: planType,
      status: subscription.status,
      value: subscription.value,
    });

    await supabase
      .from('profiles')
      .update({
        subscription_status: 'active',
        subscription_plan: planType,
        asaas_subscription_id: subscription.id,
        updated_at: new Date(),
      })
      .eq('id', req.user.id);

    res.json({ subscription });
  } catch (err) {
    console.error('Erro ao criar assinatura:', err);
    res.status(400).json({ error: err.message });
  }
});

// Cancelar assinatura
router.post('/cancel', authenticate, async (req, res) => {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('asaas_subscription_id')
      .eq('id', req.user.id)
      .single();

    if (profile?.asaas_subscription_id) {
      await asaas.cancelSubscription(profile.asaas_subscription_id);

      await supabase
        .from('subscriptions')
        .update({ status: 'cancelled' })
        .eq('asaas_subscription_id', profile.asaas_subscription_id);
    }

    await supabase
      .from('profiles')
      .update({
        subscription_status: 'cancelled',
        asaas_subscription_id: null,
        updated_at: new Date(),
      })
      .eq('id', req.user.id);

    res.json({ message: 'Assinatura cancelada' });
  } catch (err) {
    console.error('Erro ao cancelar assinatura:', err);
    res.status(400).json({ error: err.message });
  }
});

// Listar pagamentos do usuário
router.get('/history', authenticate, async (req, res) => {
  try {
    const { data: payments } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    res.json(payments || []);
  } catch (err) {
    console.error('Erro ao listar pagamentos:', err);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
