// src/hooks/usePaywallPayment.js
// Hook para lógica de pagamento do paywall - NOVAIX FITNESS

import { useState, useCallback } from 'react';
import { Alert, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { createCheckout, getPaymentStatus } from '../services/payment';
import { getVariant, trackPaywallView, trackPaywallClick, trackPaywallSkip } from '../services/abtest';
import { canProcessPayment, recordPayment } from '../services/security/paymentProtection';

export default function usePaywallPayment(user) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [pixData, setPixData] = useState(null);
  const [variant, setVariant] = useState('control');

  const loadVariant = useCallback(async () => {
    if (user?.id) {
      const v = await getVariant(user.id, 'paywall');
      setVariant(v);
      trackPaywallView(user.id);
    }
  }, [user?.id]);

  const pollPaymentStatus = useCallback(async (paymentId) => {
    let attempts = 0;
    const check = async () => {
      try {
        const status = await getPaymentStatus(paymentId);
        if (status.payment?.status === 'RECEIVED') {
          Alert.alert('Sucesso!', 'Pagamento confirmado! Bem-vindo ao NOVAIX!');
          router.replace('/(tabs)/home');
          return;
        }
        attempts++;
        if (attempts < 30) setTimeout(check, 5000);
      } catch (err) {
        console.error('Erro ao verificar pagamento:', err);
      }
    };
    check();
  }, [router]);

  const handleSubscribe = useCallback(async (selected, billingType) => {
    if (!user) {
      Alert.alert('Erro', 'Faça login para assinar.');
      return;
    }

    const payCheck = canProcessPayment(user.id);
    if (!payCheck.allowed) {
      Alert.alert('Aguarde', payCheck.reason || 'Aguarde antes de tentar novamente');
      return;
    }

    trackPaywallClick(user.id, selected);
    setLoading(true);
    try {
      const result = await createCheckout(selected, billingType);
      recordPayment(user.id, selected, 0);

      if (billingType === 'PIX' && result.pixQrCode) {
        setPixData({
          payload: result.pixQrCode.payload,
          encodedImage: result.pixQrCode.encodedImage,
          expirationDate: result.pixQrCode.expirationDate,
          paymentId: result.paymentId,
        });
        return;
      }

      if (result.invoiceUrl) {
        await Linking.openURL(result.invoiceUrl);
        pollPaymentStatus(result.paymentId);
        return;
      }

      Alert.alert('Pagamento', 'Redirecionando para o pagamento...');
    } catch (err) {
      console.error('Erro ao criar pagamento:', err);
      Alert.alert('Erro', err.message || 'Não foi possível iniciar o pagamento.');
    } finally {
      setLoading(false);
    }
  }, [user, pollPaymentStatus]);

  const handleCopyPix = useCallback(() => {
    if (pixData?.payload) {
      try {
        const Clipboard = require('expo-clipboard');
        Clipboard.setStringAsync(pixData.payload);
        Alert.alert('Copiado!', 'Código PIX copiado.');
      } catch {
        Alert.alert('Copiar', 'Selecione e copie o código PIX.');
      }
    }
  }, [pixData]);

  const handleCheckPayment = useCallback(async () => {
    if (!pixData?.paymentId) return;
    setLoading(true);
    try {
      const status = await getPaymentStatus(pixData.paymentId);
      if (status.payment?.status === 'RECEIVED') {
        Alert.alert('Sucesso!', 'Pagamento confirmado!', [
          { text: 'OK', onPress: () => router.replace('/(tabs)/home') },
        ]);
      } else {
        Alert.alert('Aguardando', 'Pagamento ainda não confirmado.');
      }
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível verificar.');
    } finally {
      setLoading(false);
    }
  }, [pixData, router]);

  const handleSkip = useCallback(() => {
    if (user?.id) trackPaywallSkip(user.id);
    router.replace('/(tabs)/home');
  }, [user?.id, router]);

  return {
    loading,
    pixData,
    variant,
    setPixData,
    loadVariant,
    handleSubscribe,
    handleCopyPix,
    handleCheckPayment,
    handleSkip,
  };
}
