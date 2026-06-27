import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../src/constants/spacing';
import { Button, PlanCard, CouponInput, PixPaymentScreen, BillingToggle, VariantBView, GuaranteeSection, DiscountBanner } from '../src/components';
import usePaywallPayment from '../src/hooks/usePaywallPayment';
import { applyCoupon } from '../src/services/coupon';
import { PLANS } from '../src/services/payment';
import { useAuth } from '../src/context/AuthContext';
import { layout, typography } from '../src/styles';

export default function PaywallScreen() {
  const { user } = useAuth();
  const [selected, setSelected] = useState('intermediate');
  const [billingType, setBillingType] = useState('PIX');
  const [coupon, setCoupon] = useState(null);

  const {
    loading,
    pixData,
    variant,
    setPixData,
    loadVariant,
    handleSubscribe,
    handleCopyPix,
    handleCheckPayment,
    handleSkip,
  } = usePaywallPayment(user);

  useEffect(() => {
    loadVariant();
  }, [loadVariant]);

  const selectedPlan = PLANS[selected];
  const finalPrice = applyCoupon(selectedPlan?.price || 0, coupon);
  const hasDiscount = coupon?.valid && finalPrice < (selectedPlan?.price || 0);

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
    return <VariantBView selected={selected} onSelect={setSelected} onSubscribe={() => handleSubscribe(selected, billingType)} loading={loading} />;
  }

  return (
    <View style={layout.screen}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.accentLine} />
          <Text style={typography.h3}>LIBERE TODO O POTENCIAL</Text>
          <Text style={typography.bodyMuted}>Escolha o plano ideal para sua evolução</Text>
          <View style={styles.badge}>
            <Ionicons name="gift" size={14} color={COLORS.background} />
            <Text style={styles.badgeText}>7 DIAS GRÁTIS</Text>
          </View>
        </View>

        <View style={styles.plans}>
          {Object.values(PLANS).map((plan) => (
            <PlanCard key={plan.id} plan={{ ...plan, priceText: hasDiscount && selected === plan.id ? `R$ ${applyCoupon(plan.price, coupon).toFixed(2).replace('.', ',')}` : plan.priceText }} isSelected={selected === plan.id} onSelect={setSelected} />
          ))}
        </View>

        <BillingToggle billingType={billingType} onToggle={setBillingType} />
        <CouponInput onApply={setCoupon} />

        {hasDiscount && <DiscountBanner code={coupon.code} />}

        <GuaranteeSection />
      </ScrollView>

      <View style={layout.footer}>
        <Button title={hasDiscount ? `ASSINAR POR R$ ${finalPrice.toFixed(2).replace('.', ',')}` : 'LIBERAR MEU CRONOGRAMA'} onPress={() => handleSubscribe(selected, billingType)} loading={loading} icon="lock-open-outline" />
        <TouchableOpacity onPress={handleSkip} style={styles.skip}>
          <Text style={typography.bodyMuted}>Pular por agora</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    padding: SPACING.xl,
    paddingTop: layout.scroll.paddingTop,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  accentLine: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
    marginBottom: SPACING.lg,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    marginTop: SPACING.xl,
  },
  badgeText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 12,
    color: COLORS.background,
    letterSpacing: 1,
  },
  plans: {
    gap: SPACING.md,
  },
  skip: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
});
