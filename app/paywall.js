import { useState, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/constants/colors';
import { SPACING } from '../src/constants/spacing';
import { Button, PlanCard, CouponInput } from '../src/components';
import PixPaymentScreen from '../src/components/paywall/PixPaymentScreen';
import BillingToggle from '../src/components/paywall/BillingToggle';
import VariantBView from '../src/components/paywall/VariantBView';
import { applyCoupon } from '../src/services/coupon';
import { createCheckout, PLANS, getPaymentStatus } from '../src/services/payment';
import { useAuth } from '../src/context/AuthContext';
import { getVariant, trackPaywallView, trackPaywallClick, trackPaywallSkip } from '../src/services/abtest';
import { layout, typography } from '../src/styles';

export default function PaywallScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [selected, setSelected] = useState('intermediate');
  const [billingType, setBillingType] = useState('PIX');
  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pixData, setPixData] = useState(null);
  const [variant, setVariant] = useState('control');

  useEffect(() => {
    async function loadVariant() {
      if (user?.id) {
        const v = await getVariant(user.id, 'paywall');
        setVariant(v);
        trackPaywallView(user.id);
      }
    }
    loadVariant();
  }, [user?.id]);

  const selectedPlan = PLANS[selected];
  const finalPrice = applyCoupon(selectedPlan?.price || 0, coupon);
  const hasDiscount = coupon?.valid && finalPrice < (selectedPlan?.price || 0);

  const handleSubscribe = useCallback(async () => {
    if (!user) {
      Alert.alert('Erro', 'Faça login para assinar.');
      return;
    }

    trackPaywallClick(user.id, selected);
    setLoading(true);
    try {
      const result = await createCheckout(selected, billingType);

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
  }, [selected, billingType, user]);

  const pollPaymentStatus = async (paymentId) => {
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
  };

  const handleCopyPix = () => {
    if (pixData?.payload) {
      try {
        const Clipboard = require('expo-clipboard');
        Clipboard.setStringAsync(pixData.payload);
        Alert.alert('Copiado!', 'Código PIX copiado.');
      } catch {
        Alert.alert('Copiar', 'Selecione e copie o código PIX.');
      }
    }
  };

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

  const handleSkip = () => {
    if (user?.id) trackPaywallSkip(user.id);
    router.replace('/(tabs)/home');
  };

  if (pixData) {
    return (
      <PixPaymentScreen
        pixData={pixData}
        onBack={() => setPixData(null)}
        onCopyPix={handleCopyPix}
        onCheckPayment={handleCheckPayment}
        loading={loading}
      />
    );
  }

  if (variant === 'variant_b') {
    return <VariantBView selected={selected} onSelect={setSelected} onSubscribe={handleSubscribe} loading={loading} />;
  }

  return (
    <View style={layout.screen}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={layout.section}>
          <Text style={typography.h3}>LIBERE TODO O POTENCIAL</Text>
          <Text style={typography.bodyMuted}>Escolha o plano ideal</Text>
          <View style={styles.badge}>
            <Ionicons name="gift-outline" size={16} color={COLORS.background} />
            <Text style={typography.h5}>7 DIAS GRÁTIS</Text>
          </View>
        </View>
        <View style={styles.plans}>
          {Object.values(PLANS).map((plan) => (
            <PlanCard key={plan.id} plan={{ ...plan, priceText: hasDiscount && selected === plan.id ? `R$ ${applyCoupon(plan.price, coupon).toFixed(2).replace('.', ',')}` : plan.priceText }} isSelected={selected === plan.id} onSelect={setSelected} />
          ))}
        </View>
        <BillingToggle billingType={billingType} onToggle={setBillingType} />
        <CouponInput onApply={setCoupon} />
        {hasDiscount && (
          <View style={styles.discountBanner}>
            <Ionicons name="pricetag" size={16} color={COLORS.success} />
            <Text style={[typography.bodySmall, { color: COLORS.success }]}>Cupom {coupon.code} aplicado!</Text>
          </View>
        )}
        <View style={styles.guarantee}>
          <Ionicons name="shield-checkmark-outline" size={20} color={COLORS.success} />
          <Text style={typography.caption}>Garantia de 7 dias. Cancele quando quiser.</Text>
        </View>
      </ScrollView>
      <View style={layout.footer}>
        <Button title={hasDiscount ? `ASSINAR POR R$ ${finalPrice.toFixed(2).replace('.', ',')}` : 'LIBERAR MEU CRONOGRAMA'} onPress={handleSubscribe} loading={loading} icon="lock-open-outline" />
        <TouchableOpacity onPress={handleSkip} style={styles.skip}>
          <Text style={typography.bodyMuted}>Pular por agora</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, padding: SPACING.xl, paddingTop: 60 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: COLORS.primary, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, borderRadius: 999, marginTop: SPACING.xl },
  plans: { gap: SPACING.md },
  discountBanner: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: COLORS.success + '15', borderRadius: 8, padding: SPACING.md, marginBottom: SPACING.xl, borderWidth: 1, borderColor: COLORS.success + '30' },
  guarantee: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, marginTop: SPACING.xxl, marginBottom: SPACING.xl },
  skip: { alignItems: 'center', paddingVertical: SPACING.md },
});
