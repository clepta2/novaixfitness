// src/services/paymentGateway.ts
// Multi-Gateway Fallback - Regras 111-115 - NOVAIX FITNESS
// Fallback: Asaas -> Stripe -> Mercado Pago

import { tryIf } from '../../utils/tryIf';
import { releasePaymentLock } from '../../utils/doubleClickPrevention';

type GatewayName = 'asaas' | 'stripe' | 'mercadopago';

interface PaymentData {
  amount: number;
  description: string;
  customerId: string;
  billingType: string;
  creditCardToken?: string;
  planType: string;
  userId: string;
}

interface PaymentResult {
  success: boolean;
  gateway: GatewayName;
  paymentId?: string;
  error?: string;
  fallbackAttempted?: boolean;
}

interface GatewayConfig {
  name: GatewayName;
  baseUrl: string;
  apiKey: string;
  timeoutMs: number;
}

// Regra 111: Strategy Pattern para multi-gateway
// SECURITY: All payment gateway calls should go through a backend proxy.
// These keys are used server-side via Supabase Edge Functions or a separate backend.
// Direct client-side usage exposes secret keys in the app binary.
const GATEWAYS: GatewayConfig[] = [
  {
    name: 'asaas',
    baseUrl: process.env.ASAAS_ENV === 'sandbox'
      ? 'https://sandbox.asaas.com/api/v3'
      : 'https://api.asaas.com/api/v3',
    apiKey: process.env.ASAAS_API_KEY || '',
    timeoutMs: 5000,
  },
  {
    name: 'stripe',
    baseUrl: 'https://api.stripe.com/v1',
    apiKey: process.env.STRIPE_SECRET_KEY || '',
    timeoutMs: 5000,
  },
  {
    name: 'mercadopago',
    baseUrl: 'https://api.mercadopago.com/v1',
    apiKey: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
    timeoutMs: 5000,
  },
];

// Regra 111: Processa pagamento com fallback automatico
export async function processWithFallback(
  data: PaymentData
): Promise<PaymentResult> {
  let lastError = '';

  for (const gateway of GATEWAYS) {
    if (!gateway.apiKey) continue;

    const result = await processWithGateway(data, gateway);
    if (result.success) {
      return { ...result, fallbackAttempted: lastError !== '' };
    }

    // Só continua fallback em erros de infraestrutura
    if (isInfrastructureError(result.error)) {
      lastError = result.error || '';
      continue;
    }

    // Erro de negocio (cartao recusado, etc) - nao faz fallback
    return { ...result, fallbackAttempted: false };
  }

  releasePaymentLock(data.userId);
  return {
    success: false,
    gateway: 'asaas',
    error: 'Todos os gateways estao indisponiveis. Tente novamente.',
    fallbackAttempted: true,
  };
}

// Regra 115: Log sanitizado - so registra gateway e status
export async function processPayment(data: PaymentData): Promise<PaymentResult> {
  const startTime = Date.now();
  const result = await processWithFallback(data);
  const duration = Date.now() - startTime;

  if (__DEV__) {
    console.log(
      `[Payment] gateway=${result.gateway} success=${result.success} duration=${duration}ms`
    );
  }

  return result;
}

async function processWithGateway(
  data: PaymentData,
  gateway: GatewayConfig
): Promise<PaymentResult> {
  const result = await tryIf(async () => {
    if (gateway.name === 'asaas') {
      return await processAsaas(data, gateway);
    }
    if (gateway.name === 'stripe') {
      return await processStripe(data, gateway);
    }
    return await processMercadoPago(data, gateway);
  }, { retries: 0, timeout: gateway.timeoutMs });

  if (result.ok) {
    return { success: true, gateway: gateway.name, paymentId: result.data };
  }

  return {
    success: false,
    gateway: gateway.name,
    error: result.error?.message || 'Erro desconhecido',
  };
}

// Regra 111: Asaas como gateway primario
async function processAsaas(data: PaymentData, gateway: GatewayConfig): Promise<string> {
  const payload: any = {
    customer: data.customerId,
    billingType: data.billingType,
    value: data.amount,
    description: data.description,
  };
  if (data.creditCardToken) {
    payload.creditCardTokenization = data.creditCardToken;
  }

  const response = await fetch(`${gateway.baseUrl}/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'access_token': gateway.apiKey,
    },
    body: JSON.stringify(payload),
  });

  const json = await response.json();
  if (!response.ok) {
    const error = new Error(json.errors?.[0]?.description || 'Erro Asaas') as any;
    error.status = response.status;
    throw error;
  }

  return json.id;
}

// Regra 111: Stripe como fallback secundario
async function processStripe(data: PaymentData, gateway: GatewayConfig): Promise<string> {
  const params = new URLSearchParams({
    amount: String(Math.round(data.amount * 100)),
    currency: 'brl',
    'metadata[description]': data.description,
    'metadata[customer]': data.customerId,
    'metadata[userId]': data.userId,
  });
  if (data.creditCardToken) {
    params.append('payment_method_data[type]', 'card');
    params.append('payment_method_data[card][token]', data.creditCardToken);
  }
  const response = await fetch(`${gateway.baseUrl}/payment_intents`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': `Bearer ${gateway.apiKey}` },
    body: params.toString(),
  });
  const json = await response.json();
  if (!response.ok) {
    const error = new Error(json.error?.message || 'Erro Stripe') as any;
    error.status = response.status;
    throw error;
  }
  return json.id;
}

// Regra 111: Mercado Pago como ultimo fallback
async function processMercadoPago(data: PaymentData, gateway: GatewayConfig): Promise<string> {
  const payload: any = {
    transaction_amount: data.amount, description: data.description,
    payment_method_id: data.creditCardToken ? 'credit_card' : 'pix',
    installments: 1, token: data.creditCardToken, external_reference: data.userId,
  };
  const response = await fetch(`${gateway.baseUrl}/payments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${gateway.apiKey}` },
    body: JSON.stringify(payload),
  });
  const json = await response.json();
  if (!response.ok) {
    const error = new Error(json.message || 'Erro Mercado Pago') as any;
    error.status = json.status || 500;
    throw error;
  }
  return String(json.id);
}

function isInfrastructureError(error?: string): boolean {
  if (!error) return false;
  const infraKeywords = ['timeout', '500', '502', '503', 'ECONNREFUSED', 'ETIMEDOUT'];
  return infraKeywords.some((k) => error.includes(k));
}

// Verifica quais gateways estao configurados
export function getAvailableGateways(): GatewayName[] {
  return GATEWAYS.filter((g) => !!g.apiKey).map((g) => g.name);
}
