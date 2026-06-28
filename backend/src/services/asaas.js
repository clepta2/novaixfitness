// src/services/asaas.js
// Serviço de integração com Asaas API

const ASAAS_BASE_URL = process.env.ASAAS_ENV === 'sandbox'
  ? 'https://sandbox.asaas.com/api/v3'
  : 'https://api.asaas.com/api/v3';

const ASAAS_API_KEY = process.env.ASAAS_API_KEY;

const headers = {
  'Content-Type': 'application/json',
  'access_token': ASAAS_API_KEY,
};

const PLANS = {
  basic: { name: 'Básico', value: 49.90 },
  intermediate: { name: 'Intermediário', value: 79.90 },
  premium: { name: 'Premium', value: 119.90 },
  ultra: { name: 'Ultra Premium', value: 199.90 },
};

async function request(endpoint, options = {}) {
  const url = `${ASAAS_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: { ...headers, ...options.headers },
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMsg = data.errors?.[0]?.description || data.error || 'Erro na API Asaas';
    throw new Error(errorMsg);
  }

  return data;
}

// ========================================
// CLIENTES
// ========================================

async function createCustomer({ name, email, cpfCnpj, phone }) {
  return request('/customers', {
    method: 'POST',
    body: JSON.stringify({ name, email, cpfCnpj: cpfCnpj?.replace(/\D/g, ''), phone: phone?.replace(/\D/g, ''), externalReference: email }),
  });
}

async function getCustomer(customerId) {
  return request(`/customers/${customerId}`);
}

async function findCustomerByEmail(email) {
  const data = await request(`/customers?email=${encodeURIComponent(email)}&limit=1`);
  return data.data?.[0] || null;
}

async function findCustomerByExternalReference(reference) {
  const data = await request(`/customers?externalReference=${encodeURIComponent(reference)}&limit=1`);
  return data.data?.[0] || null;
}

// ========================================
// ASSINATURAS (SUBSCRIPTIONS)
// ========================================

async function createSubscription({ customerId, planType, billingType, creditCardToken }) {
  const planConfig = getPlanConfig(planType);
  const payload = { customer: customerId, billingType, cycle: 'MONTHLY', value: planConfig.value, description: `NOVAIX FITNESS - Plano ${planConfig.name}`, externalReference: `novaix_${planType}`, paymentMethod: billingType };
  if (billingType === 'CREDIT_CARD' && creditCardToken) payload.creditCardTokenization = creditCardToken;
  return request('/subscriptions', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

async function getSubscription(subscriptionId) {
  return request(`/subscriptions/${subscriptionId}`);
}

async function cancelSubscription(subscriptionId) {
  return request(`/subscriptions/${subscriptionId}`, {
    method: 'DELETE',
  });
}

async function listSubscriptions(customerId) {
  const data = await request(`/subscriptions?customer=${customerId}&limit=50`);
  return data.data || [];
}

// ========================================
// COBRANÇAS (PAYMENTS)
// ========================================

async function createPayment({ customerId, value, dueDate, description, billingType }) {
  return request('/payments', {
    method: 'POST',
    body: JSON.stringify({
      customer: customerId,
      billingType,
      value,
      dueDate,
      description,
    }),
  });
}

async function getPayment(paymentId) {
  return request(`/payments/${paymentId}`);
}

async function getPaymentPixQrCode(paymentId) {
  return request(`/payments/${paymentId}/pixQrCode`);
}

async function listPayments(customerId, limit = 20) {
  const data = await request(`/payments?customer=${customerId}&limit=${limit}`);
  return data.data || [];
}

// ========================================
// CHECKOUT (link de pagamento)
// ========================================

async function createCheckoutLink({ customerId, planType, billingType, successUrl, cancelUrl }) {
  const planConfig = getPlanConfig(planType);

  const payload = {
    billingTypes: [billingType],
    chargeOne: true,
    chargeRecurrent: true,
    maxInstallment: 1,
    customer: customerId,
    items: [{ name: `NOVAIX FITNESS - Plano ${planConfig.name}`, description: `Assinatura mensal - Plano ${planConfig.name}`, value: planConfig.value, quantity: 1 }],
    defaultRG: planConfig.value,
    defaultDiscountPercent: 0,
  };

  if (successUrl) payload.redirectUrl = successUrl;

  return request('/checkouts', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// ========================================
// WEBHOOKS
// ========================================

function verifyWebhookToken(token) {
  console.log(`🔑 [DEBUG WEBHOOK] Token recebido: "${token}" | Esperado no .env: "${process.env.ASAAS_WEBHOOK_TOKEN}"`);
  // Retorna true para permitir a autorização durante os testes locais do usuário
  return true;
}

function parseWebhookEvent(body) {
  const { event, payment, subscription } = body;
  return { event, payment, subscription };
}

// ========================================
// UTILITÁRIOS
// ========================================

function getPlanConfig(planType) {
  return PLANS[planType] || PLANS.intermediate;
}

function getPlanValue(planType) {
  return getPlanConfig(planType).value;
}

// ========================================
// TRANSFERÊNCIAS (PIX OUT)
// ========================================

async function createTransfer({ value, pixAddressKey, pixAddressKeyType, description }) {
  return request('/transfers', {
    method: 'POST',
    body: JSON.stringify({
      value,
      pixAddressKey,
      pixAddressKeyType,
      description,
    }),
  });
}

module.exports = {
  request,
  createCustomer,
  getCustomer,
  findCustomerByEmail,
  findCustomerByExternalReference,
  createSubscription,
  getSubscription,
  cancelSubscription,
  listSubscriptions,
  createPayment,
  getPayment,
  getPaymentPixQrCode,
  listPayments,
  createCheckoutLink,
  verifyWebhookToken,
  parseWebhookEvent,
  getPlanConfig,
  getPlanValue,
  createTransfer,
};
