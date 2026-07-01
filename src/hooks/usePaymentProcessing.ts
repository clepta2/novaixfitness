import { useState, useRef, useEffect } from 'react';
import { Platform, Alert } from 'react-native';
import { createCheckout, getPaymentStatus, PLANS } from '../services/payment';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'expo-router';

export default function usePaymentProcessing() {
  const { user, loadProfile, signOut } = useAuth();
  const router = useRouter();
  const [selected, setSelected] = useState('intermediate');
  const [coupon, setCoupon] = useState<{ valid: boolean; type: string } | null>(null);
  const [processing, setProcessing] = useState(false);
  const [processStep, setProcessStep] = useState('');
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isWeb = Platform.OS === 'web';

  useEffect(() => {
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, []);

  const handleLogout = async () => {
    try {
      setProcessing(true);
      await signOut();
      router.replace('/');
    } catch {
      Alert.alert('Erro', 'Não foi possível desconectar.');
    } finally {
      setProcessing(false);
    }
  };

  const handleSkip = async () => {
    try {
      setProcessing(true);
      setProcessStep('Acessando versão gratuita...');
      const { error } = await supabase
        .from('profiles')
        .update({ current_step: 'home' })
        .eq('id', user.id);
      if (error) throw error;
      await loadProfile(user.id);
      router.replace('/(tabs)/home');
    } catch (e) {
      Alert.alert('Erro', e instanceof Error ? e.message : 'Não foi possível prosseguir.');
    } finally {
      setProcessing(false);
    }
  };

  const getButtonTitle = () => {
    const plan = PLANS[selected];
    if (!plan) return 'LIBERAR MEU CRONOGRAMA';
    if (coupon?.valid && coupon.type !== 'days') {
      const { applyCoupon } = require('../services/coupon');
      const finalPrice = applyCoupon(plan.price, coupon);
      return `LIBERAR MEU CRONOGRAMA - R$ ${finalPrice.toFixed(2).replace('.', ',')}`;
    }
    return `LIBERAR MEU CRONOGRAMA - ${plan.priceText}`;
  };

  const startPolling = (id: string) => {
    let attempts = 0;
    const maxAttempts = 60;
    pollRef.current = setInterval(async () => {
      attempts++;
      if (attempts >= maxAttempts) {
        clearInterval(pollRef.current!);
        setProcessing(false);
        Alert.alert('Tempo esgotado', 'O pagamento não foi confirmado. Verifique sua caixa de entrada ou tente novamente.');
        return;
      }
      try {
        const status = await getPaymentStatus(id);
        if (status?.payment?.status === 'CONFIRMED' || status?.payment?.status === 'RECEIVED') {
          clearInterval(pollRef.current!);
          await loadProfile(user.id);
          setProcessing(false);
          Alert.alert('Pagamento Confirmado!', 'Seu plano foi ativado com sucesso.', [
            { text: 'Iniciar Tutorial', onPress: () => router.replace('/(tabs)/home') }
          ]);
        }
      } catch {}
    }, 5000);
  };

  const activateMockPlan = async () => {
    try {
      const plan = PLANS[selected];
      const { error } = await supabase
        .from('profiles')
        .update({
          current_step: 'home',
          subscription_plan: selected,
          subscription_status: 'active',
          subscribed_at: new Date().toISOString(),
        })
        .eq('id', user.id);
      if (error) throw error;
      await loadProfile(user.id);
      setProcessing(false);
      if (isWeb) {
        alert(`Plano ${plan?.name || selected} ativado com sucesso!`);
        router.replace('/(tabs)/home');
      } else {
        Alert.alert(
          'Sucesso! 🎉',
          `Plano ${plan?.name || selected} ativado com sucesso!`,
          [{ text: 'Iniciar Treino', onPress: () => router.replace('/(tabs)/home') }]
        );
      }
    } catch {
      setProcessing(false);
      isWeb ? alert('Não foi possível ativar seu plano.') : Alert.alert('Erro', 'Não foi possível ativar seu plano.');
    }
  };

  const handleSubscribe = async () => {
    setProcessing(true);
    setProcessStep('Criando cobrança...');
    try {
      let result;
      try {
        result = await createCheckout(selected, 'PIX');
      } catch (apiError) {
        if (__DEV__ || isWeb) {
          result = { paymentId: 'mock_' + Date.now(), invoiceUrl: null, isMock: true };
        } else {
          throw apiError;
        }
      }
      setPaymentId(result.paymentId);
      if (result.isMock) {
        setProcessStep('Simulando confirmação de pagamento (Modo Dev)...');
        setTimeout(activateMockPlan, 1500);
        return;
      }
      setProcessStep('Abrindo página de pagamento...');
      if (result.invoiceUrl) {
        const { Linking } = require('react-native');
        await Linking.openURL(result.invoiceUrl);
      }
      setProcessStep('Aguardando confirmação do pagamento...');
      startPolling(result.paymentId);
    } catch (e) {
      setProcessing(false);
      isWeb
        ? alert(e instanceof Error ? e.message : 'Não foi possível criar a cobrança. Tente novamente.')
        : Alert.alert('Erro', e instanceof Error ? e.message : 'Não foi possível criar a cobrança. Tente novamente.');
    }
  };

  const cancelProcessing = () => {
    if (pollRef.current) clearInterval(pollRef.current);
    setProcessing(false);
  };

  return {
    selected, setSelected, coupon, setCoupon,
    processing, processStep, paymentId, isWeb,
    handleLogout, handleSkip, getButtonTitle, handleSubscribe, cancelProcessing,
  };
}
