// src/services/asaas.ts
// Serviço de integração com Asaas API - NOVAIX FITNESS

import { withRetry } from './retry';

const ASAAS_BASE_URL = process.env.ASAAS_ENV === 'sandbox'
  ? 'https://sandbox.asaas.com/api/v3'
  : 'https://api.asaas.com/api/v3';

const ASAAS_API_KEY = process.env.ASAAS_API_KEY;
const defaultHeaders = { 'Content-Type': 'application/json', 'access_token': ASAAS_API_KEY };

interface PlanConfig {
  name: string;
  value: number;
}

const PLANS: Record<string, PlanConfig> = {
  basic: { name: 'Básico', value: 49.90 },
  intermediate: { name: 'Intermediário', value: 79.90 },
  premium: { name: 'Premium', value: 119.90 },
  ultra: { name: 'Ultra Premium', value: 199.90 },
};

async function request(endpoint: string, options: any = {}) {
  return withRetry(async () => {
    const url = `${ASAAS_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: { ...defaultHeaders, ...options.headers },
    });

    const data = await response.json();
    if (!response.ok) {
      const error = new Error(data.errors?.[0]?.description || data.error || 'Erro na API Asaas') as any;
      error.status = response.status;
      throw error;
    }
    return data;
  }, { maxAttempts: 3, baseDelayMs: 1000 });
}


// CLIENTES
interface CreateCustomerParams {
  name: string;
  email: string;
  cpfCnpj?: string;
  phone?: string;
}

async function createCustomer({ name, email, cpfCnpj, phone }: CreateCustomerParams) {
  return request('/customers', {
    method: 'POST',
    body: JSON.stringify({ name, email, cpfCnpj: cpfCnpj?.replace(/\D/g, ''), phone: phone?.replace(/\D/g, ''), externalReference: email }),
  });
}

async function getCustomer(customerId: string) {
  return request(`/customers/${customerId}`);
}

async function findCustomerByEmail(email: string) {
  const data = await request(`/customers?email=${encodeURIComponent(email)}&limit=1`);
  return data.data?.[0] || null;
}

async function findCustomerByExternalReference(reference: string) {
  const data = await request(`/customers?externalReference=${encodeURIComponent(reference)}&limit=1`);
  return data.data?.[0] || null;
}

// ASSINATURAS (SUBSCRIPTIONS)
interface CreateSubscriptionParams {
  customerId: string;
  planType: string;
  billingType: string;
  creditCardToken?: string;
}

async function createSubscription({ customerId, planType, billingType, creditCardToken }: CreateSubscriptionParams) {
  const planConfig = getPlanConfig(planType);
  const payload: any = { customer: customerId, billingType, cycle: 'MONTHLY', value: planConfig.value, description: `NOVAIX FITNESS - Plano ${planConfig.name}`, externalReference: `novaix_${planType}`, paymentMethod: billingType };
  if (billingType === 'CREDIT_CARD' && creditCardToken) payload.creditCardTokenization = creditCardToken;
  return request('/subscriptions', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

async function getSubscription(subscriptionId: string) {
  return request(`/subscriptions/${subscriptionId}`);
}

async function cancelSubscription(subscriptionId: string) {
  return request(`/subscriptions/${subscriptionId}`, { method: 'DELETE' });
}

async function listSubscriptions(customerId: string) {
  const data = await request(`/subscriptions?customer=${customerId}&limit=50`);
  return data.data || [];
}

// COBRANÇAS (PAYMENTS)
interface CreatePaymentParams {
  customerId: string;
  value: number;
  dueDate: string;
  description: string;
  billingType: string;
}

async function createPayment({ customerId, value, dueDate, description, billingType }: CreatePaymentParams) {
  return request('/payments', {
    method: 'POST',
    body: JSON.stringify({ customer: customerId, billingType, value, dueDate, description }),
  });
}

async function getPayment(paymentId: string) {
  return request(`/payments/${paymentId}`);
}

async function getPaymentPixQrCode(paymentId: string) {
  return request(`/payments/${paymentId}/pixQrCode`);
}

async function listPayments(customerId: string, limit = 20) {
  const data = await request(`/payments?customer=${customerId}&limit=${limit}`);
  return data.data || [];
}

// CHECKOUT (link de pagamento)
interface CreateCheckoutLinkParams {
  customerId: string;
  planType: string;
  billingType: string;
  successUrl?: string;
  cancelUrl?: string;
}

async function createCheckoutLink({ customerId, planType, billingType, successUrl }: CreateCheckoutLinkParams) {
  const planConfig = getPlanConfig(planType);
  const payload: any = {
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

// WEBHOOKS
function verifyWebhookToken(token: string) {
  const expected = process.env.ASAAS_WEBHOOK_TOKEN;
  if (!expected) {
    console.error('ASAAS_WEBHOOK_TOKEN não configurado no .env');
    return false;
  }
  return token === expected;
}

function parseWebhookEvent(body: any) {
  const { event, payment, subscription } = body;
  return { event, payment, subscription };
}

// UTILITÁRIOS
function getPlanConfig(planType: string): PlanConfig {
  return PLANS[planType] || PLANS.intermediate;
}

function getPlanValue(planType: string): number {
  return getPlanConfig(planType).value;
}

// TRANSFERÊNCIAS (PIX OUT)
interface CreateTransferParams {
  value: number;
  pixAddressKey: string;
  pixAddressKeyType: string;
  description: string;
}

async function createTransfer({ value, pixAddressKey, pixAddressKeyType, description }: CreateTransferParams) {
  return request('/transfers', {
    method: 'POST',
    body: JSON.stringify({ value, pixAddressKey, pixAddressKeyType, description }),
  });
}

export {
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
