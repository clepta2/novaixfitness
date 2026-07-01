// src/services/payment.ts
// Serviço de pagamento - Asaas Integration - NOVAIX FITNESS

import { supabase } from '../config/supabase';
import type { Plan, PlanFeature, SubscriptionStatus } from '../types/payment';

const API_BASE: string | undefined = process.env.EXPO_PUBLIC_API_URL;

interface ApiRequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
}

interface ApiResponse {
  [key: string]: unknown;
  error?: string;
}

interface CustomerData {
  name?: string;
  cpfCnpj?: string;
  email?: string;
  phone?: string;
  [key: string]: unknown;
}

interface CheckoutParams {
  planType: string;
  billingType: string;
}

interface SubscriptionParams {
  planType: string;
  billingType: string;
  creditCardToken?: string;
}

interface ProfileSubscription {
  subscription_status: SubscriptionStatus | null;
  subscription_plan: string | null;
}

async function apiRequest(endpoint: string, options: ApiRequestOptions = {}): Promise<ApiResponse> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    const response = await fetch(`${API_BASE}/api${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    const data: ApiResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erro na requisicao');
    }

    return data;
  } catch (err) {
    if (__DEV__) console.error('Erro na API de pagamento:', err);
    throw err;
  }
}

export const PLANS: Record<string, Plan & { priceText: string; period: string }> = {
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

export async function createCheckout(planType: string, billingType: string, customerData: CustomerData = {}): Promise<ApiResponse> {
  return apiRequest('/payments/checkout', {
    method: 'POST',
    body: JSON.stringify({ planType, billingType, ...customerData }),
  });
}

export async function getPaymentStatus(paymentId: string): Promise<ApiResponse> {
  return apiRequest(`/payments/status/${paymentId}`);
}

export async function createSubscription(planType: string, billingType: string, creditCardToken?: string): Promise<ApiResponse> {
  return apiRequest('/payments/subscribe', {
    method: 'POST',
    body: JSON.stringify({ planType, billingType, creditCardToken }),
  });
}

export async function cancelSubscription(): Promise<ApiResponse> {
  return apiRequest('/payments/cancel', {
    method: 'POST',
  });
}

export async function getPaymentHistory(): Promise<ApiResponse> {
  return apiRequest('/payments/history');
}

export async function ensureCustomer(customerData: CustomerData): Promise<ApiResponse> {
  return apiRequest('/payments/customer', {
    method: 'POST',
    body: JSON.stringify(customerData),
  });
}

export async function getCurrentSubscription(): Promise<ProfileSubscription | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('profiles')
    .select('subscription_status, subscription_plan')
    .eq('id', user.id)
    .single();

  return data;
}

export function isSubscribed(subscription: ProfileSubscription | null | undefined): boolean {
  const status = subscription?.subscription_status;
  return status === 'active' || status === 'premium';
}

export function getPlanById(planId: string): Plan & { priceText: string; period: string } {
  return PLANS[planId] || PLANS.intermediate;
}
