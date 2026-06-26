// app/paywall.js
// Tela de Paywall com A/B Testing - NOVAIX FITNESS

import { useState, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../src/constants/spacing';
import { Button, PlanCard, CouponInput } from '../src/components';
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
      <View style={layout.screen}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <TouchableOpacity onPress={() => setPixData(null)} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textTitle} />
            <Text style={typography.h5}>Voltar</Text>
          </TouchableOpacity>
          <View style={layout.section}>
            <Text style={typography.h3}>PAGUE COM PIX</Text>
            <Text style={typography.bodyMuted}>Copie o código e pague no app do banco</Text>
          </View>
          <View style={styles.pixPayload}>
            <Text style={typography.label}>CÓDIGO PIX</Text>
            <TouchableOpacity style={styles.pixCode} onPress={handleCopyPix}>
              <Text style={[typography.bodySmall, styles.pixText]} numberOfLines={3}>{pixData.payload}</Text>
              <Ionicons name="copy" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.copyBtn} onPress={handleCopyPix}>
            <Ionicons name="copy-outline" size={20} color={COLORS.background} />
            <Text style={typography.button}>COPIAR CÓDIGO PIX</Text>
          </TouchableOpacity>
          <View style={styles.timerBox}>
            <Ionicons name="time-outline" size={20} color={COLORS.attention} />
            <Text style={[typography.bodySmall, { color: COLORS.attention }]}>Expira em 30 minutos</Text>
          </View>
          <View style={{ height: 20 }} />
          <Button title="JÁ PAGUEI" onPress={handleCheckPayment} loading={loading} icon="checkmark-circle-outline" />
        </ScrollView>
      </View>
    );
  }

  if (variant === 'variant_b') {
    return <PaywallVariantB selected={selected} setSelected={setSelected} />;
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
        <View style={styles.billingToggle}>
          <Text style={typography.label}>FORMA DE PAGAMENTO</Text>
          <View style={styles.billingOptions}>
            <TouchableOpacity style={[styles.billingOption, billingType === 'PIX' && styles.billingActive]} onPress={() => setBillingType('PIX')}>
              <Ionicons name="wallet" size={20} color={billingType === 'PIX' ? COLORS.background : COLORS.textMuted} />
              <Text style={[typography.bodySmall, billingType === 'PIX' && styles.billingTextActive]}>PIX</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.billingOption, billingType === 'CREDIT_CARD' && styles.billingActive]} onPress={() => setBillingType('CREDIT_CARD')}>
              <Ionicons name="card" size={20} color={billingType === 'CREDIT_CARD' ? COLORS.background : COLORS.textMuted} />
              <Text style={[typography.bodySmall, billingType === 'CREDIT_CARD' && styles.billingTextActive]}>Cartão</Text>
            </TouchableOpacity>
          </View>
        </View>
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

function PaywallVariantB({ selected, setSelected }) {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSelect = (planId) => {
    setSelected(planId);
    if (user?.id) trackPaywallClick(user.id, planId);
  };

  const handleSkip = () => {
    if (user?.id) trackPaywallSkip(user.id);
    router.replace('/(tabs)/home');
  };

  return (
    <View style={layout.screen}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={variantBStyles.hero}>
          <Ionicons name="flash" size={48} color={COLORS.primary} />
          <Text style={typography.h2}>EVOLUA RAPIDO</Text>
          <Text style={typography.bodyMuted}>Acesso ilimitado a todos os treinos e Coach IA</Text>
        </View>

        <View style={variantBStyles.urgentBadge}>
          <Ionicons name="time" size={16} color={COLORS.background} />
          <Text style={typography.button}>OFERTA POR TEMPO LIMITADO</Text>
        </View>

        <View style={variantBStyles.plans}>
          {Object.values(PLANS).map((plan) => (
            <TouchableOpacity key={plan.id} style={[variantBStyles.planCard, selected === plan.id && variantBStyles.planActive]} onPress={() => handleSelect(plan.id)}>
              {plan.popular && <View style={variantBStyles.popularTag}><Text style={variantBStyles.popularText}>RECOMENDADO</Text></View>}
              <Text style={typography.h4}>{plan.name}</Text>
              <Text style={variantBStyles.price}>{plan.priceText}<Text style={typography.bodySmall}>/mes</Text></Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={variantBStyles.benefits}>
          {['Treinos ilimitados', 'Coach IA personalizado', 'Cronometro inteligente', 'Comunidade ativa', 'Suporte prioritario'].map((b, i) => (
            <View key={i} style={variantBStyles.benefitRow}>
              <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
              <Text style={typography.body}>{b}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={layout.footer}>
        <Button title="COMEÇAR AGORA - 7 DIAS GRATIS" onPress={handleSubscribe} loading={loading} icon="rocket" />
        <TouchableOpacity onPress={handleSkip} style={styles.skip}>
          <Text style={typography.bodyMuted}>Continuar no plano gratuito</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, padding: SPACING.xl, paddingTop: 60 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: COLORS.primary, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, borderRadius: 999, marginTop: SPACING.xl },
  plans: { gap: SPACING.md },
  billingToggle: { marginTop: SPACING.xl },
  billingOptions: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.md },
  billingOption: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, paddingVertical: SPACING.md, backgroundColor: COLORS.surface, borderRadius: 8, borderWidth: 1, borderColor: COLORS.border },
  billingActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  billingTextActive: { color: COLORS.background, fontFamily: 'Montserrat_600SemiBold' },
  discountBanner: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: COLORS.success + '15', borderRadius: 8, padding: SPACING.md, marginBottom: SPACING.xl, borderWidth: 1, borderColor: COLORS.success + '30' },
  guarantee: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, marginTop: SPACING.xxl, marginBottom: SPACING.xl },
  skip: { alignItems: 'center', paddingVertical: SPACING.md },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.xl },
  pixPayload: { marginBottom: SPACING.xl },
  pixCode: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.surface, borderRadius: 8, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border, marginTop: SPACING.sm },
  pixText: { flex: 1, marginRight: SPACING.sm, fontFamily: 'monospace' },
  copyBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.primary, borderRadius: 8, paddingVertical: SPACING.md, marginBottom: SPACING.xl },
  timerBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.attention + '15', borderRadius: 8, padding: SPACING.md },
});

const variantBStyles = StyleSheet.create({
  hero: { alignItems: 'center', paddingVertical: SPACING.xxl, gap: SPACING.md },
  urgentBadge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.error, padding: SPACING.md, borderRadius: 8, marginBottom: SPACING.xl },
  plans: { gap: SPACING.md, marginBottom: SPACING.xl },
  planCard: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.xl, borderWidth: 2, borderColor: COLORS.border },
  planActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '08' },
  popularTag: { position: 'absolute', top: -10, right: SPACING.lg, backgroundColor: COLORS.primary, paddingHorizontal: SPACING.md, paddingVertical: 4, borderRadius: 999 },
  popularText: { fontFamily: 'Montserrat_700Bold', fontSize: 10, color: COLORS.background, letterSpacing: 1 },
  price: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 28, color: COLORS.primary, marginTop: SPACING.sm },
  benefits: { gap: SPACING.md },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
});
