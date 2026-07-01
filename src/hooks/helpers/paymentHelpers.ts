// src/hooks/helpers/paymentHelpers.ts
// Helpers for payment processing flow

import { Platform, Alert } from 'react-native';
import { createCheckout, getPaymentStatus, PLANS } from '../../services/payment';
import type { Href } from 'expo-router';

interface Coupon {
  valid?: boolean;
  type?: string;
  value?: number;
}

interface PaymentUser {
  id: string;
}

type LoadProfile = (userId: string) => Promise<void>;

type Router = {
  replace: (path: Href) => void;
};

export function getButtonTitle(selected: string, coupon?: Coupon): string {
  const plan = PLANS[selected];
  if (!plan) return 'LIBERAR MEU CRONOGRAMA';
  if (coupon?.valid && coupon.type !== 'days') {
    const { applyCoupon } = require('../../services/coupon');
    const finalPrice = applyCoupon(plan.price, coupon);
    return `LIBERAR MEU CRONOGRAMA - R$ ${finalPrice.toFixed(2).replace('.', ',')}`;
  }
  return `LIBERAR MEU CRONOGRAMA - ${plan.priceText}`;
}

export function startPaymentPolling(
  id: string,
  user: PaymentUser,
  loadProfile: LoadProfile,
  router: Router
): any {
  let attempts = 0;
  const maxAttempts = 60;
  const intervalId = setInterval(async () => {
    attempts++;
    if (attempts >= maxAttempts) {
      clearInterval(intervalId);
      Alert.alert('Tempo esgotado', 'O pagamento não foi confirmado. Verifique sua caixa de entrada ou tente novamente.');
      return;
    }
    try {
      const status = await getPaymentStatus(id);
      if (status?.payment?.status === 'CONFIRMED' || status?.payment?.status === 'RECEIVED') {
        clearInterval(intervalId);
        await loadProfile(user.id);
        Alert.alert('Pagamento Confirmado!', 'Seu plano foi ativado com sucesso.', [
          { text: 'Iniciar Tutorial', onPress: () => router.replace('/(tabs)/home' as Href) },
        ]);
      }
    } catch (e) { if (__DEV__) console.warn('paymentHelpers:', e); }
  }, 5000);
  return intervalId;
}

export async function activateMockPlan(
  selected: string,
  user: PaymentUser,
  loadProfile: LoadProfile,
  router: Router
): Promise<void> {
  const isWeb = Platform.OS === 'web';
  try {
    const { supabase } = require('../../config/supabase');
    const { error } = await supabase
      .from('profiles')
      .update({
        current_step: 'home', subscription_plan: selected,
        subscription_status: 'active', subscribed_at: new Date().toISOString(),
      })
      .eq('id', user.id);
    if (error) throw error;
    await loadProfile(user.id);
    const plan = PLANS[selected];
    if (isWeb) {
      alert(`Plano ${plan?.name || selected} ativado com sucesso!`);
      router.replace('/(tabs)/home' as Href);
    } else {
      Alert.alert('Sucesso!', `Plano ${plan?.name || selected} ativado com sucesso!`, [
        { text: 'Iniciar Treino', onPress: () => router.replace('/(tabs)/home' as Href) },
      ]);
    }
  } catch {
    isWeb ? alert('Não foi possível ativar seu plano.') : Alert.alert('Erro', 'Não foi possível ativar seu plano.');
  }
}
