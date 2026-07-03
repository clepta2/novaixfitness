// src/services/payment.js
// Serviço de pagamento - Asaas Integration - NOVAIX FITNESS

import { supabase } from '../../config/supabase';
import { tryIf } from '../../utils/tryIf';

const API_BASE = process.env.EXPO_PUBLIC_API_URL;

async function apiRequest(endpoint, options: any = {}) {
  const result = await tryIf(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    const response = await fetch(`${API_BASE}/api${endpoint}`, {
      ...(options as any),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erro na requisicao');
    }

    return data;
  }, { retries: 2, baseDelay: 500 });

  if (!result.ok) {
    if (__DEV__) console.error('Erro na API de pagamento:', result.error);
    throw result.error!;
  }
  return result.data!;
}

export const PLANS = {
  basic: {
    id: 'basic',
    name: 'Básico',
    price: 49.90,
    priceText: 'R$ 49,90',
    period: '/mês',
    features: [
      { text: 'Treinos personalizados', included: true },
      { text: 'Cronômetro inteligente', included: true },
      { text: 'Treinos limitados', included: true },
      { text: 'Suporte via e-mail', included: true },
      { text: 'Coach IA', included: false },
    ],
  },
  intermediate: {
    id: 'intermediate',
    name: 'Intermediário',
    price: 79.90,
    priceText: 'R$ 79,90',
    period: '/mês',
    popular: true,
    features: [
      { text: 'Treinos personalizados', included: true },
      { text: 'Cronômetro inteligente', included: true },
      { text: 'Treinos ilimitados', included: true },
      { text: 'Suporte prioritário', included: true },
      { text: 'Coach IA', included: true },
    ],
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    price: 119.90,
    priceText: 'R$ 119,90',
    period: '/mês',
    features: [
      { text: 'Treinos personalizados', included: true },
      { text: 'Cronômetro inteligente', included: true },
      { text: 'Treinos ilimitados', included: true },
      { text: 'Suporte VIP', included: true },
      { text: 'Coach IA + Nutrição', included: true },
    ],
  },
  ultra: {
    id: 'ultra',
    name: 'Ultra Premium',
    price: 199.90,
    priceText: 'R$ 199,90',
    period: '/mês',
    features: [
      { text: 'Treinos personalizados', included: true },
      { text: 'Cronômetro inteligente', included: true },
      { text: 'Treinos ilimitados', included: true },
      { text: 'Suporte VIP 24h', included: true },
      { text: 'Coach IA + Nutrição + Personal', included: true },
    ],
  },
};

export async function createCheckout(planType, billingType, customerData = {}) {
  return apiRequest('/payments/checkout', {
    method: 'POST',
    body: JSON.stringify({ planType, billingType, ...customerData }),
  });
}

export async function getPaymentStatus(paymentId) {
  return apiRequest(`/payments/status/${paymentId}`);
}

export async function createSubscription(planType, billingType, creditCardToken) {
  return apiRequest('/payments/subscribe', {
    method: 'POST',
    body: JSON.stringify({ planType, billingType, creditCardToken }),
  });
}

export async function cancelSubscription() {
  return apiRequest('/payments/cancel', {
    method: 'POST',
  });
}

export async function getPaymentHistory() {
  return apiRequest('/payments/history');
}

export async function ensureCustomer(customerData) {
  return apiRequest('/payments/customer', {
    method: 'POST',
    body: JSON.stringify(customerData),
  });
}

export async function getCurrentSubscription() {
  const result = await tryIf(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data } = await supabase
      .from('profiles')
      .select('subscription_status, subscription_plan')
      .eq('id', user.id)
      .single();

    return data;
  }, { retries: 1, baseDelay: 500 });
  return result.ok ? result.data : null;
}

export function isSubscribed(subscription) {
  const status = subscription?.subscription_status;
  return status === 'active' || status === 'premium';
}

export function getPlanById(planId) {
  return PLANS[planId] || PLANS.intermediate;
}
