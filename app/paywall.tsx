// app/paywall.tsx
// Paywall com melhorias visuais e animacoes - NOVAIX FITNESS

import { useState, useMemo, useEffect , useRef} from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform, Switch, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../src/constants/spacing';
import { SHADOWS } from '../src/constants/shadows';
import { Button, PlanCard, CouponInput, GuaranteeSection, ErrorBoundary, ProcessingModal, GradientButton } from '../src/components';
import { PLANS } from '../src/services/payment';
import usePaymentProcessing from '../src/hooks/usePaymentProcessing';
import { useResponsive } from '../src/hooks/useResponsive';

export default function PaywallScreen() {
  const { isSmall, horizontalPadding } = useResponsive();
  const {
    selected, setSelected, coupon, setCoupon, processing, processStep, paymentId, isWeb,
    handleLogout, handleSkip, getButtonTitle, handleSubscribe, cancelProcessing,
  } = usePaymentProcessing();
  const [isAnnual, setIsAnnual] = useState(false);

  // Animacoes de entrada e pulso
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const heroScale = useRef(new Animated.Value(0.9)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 8, tension: 55, useNativeDriver: true }),
      Animated.spring(heroScale, { toValue: 1, friction: 5, tension: 40, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.04, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1.0, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <ErrorBoundary screenName="Paywall">
      <View style={styles.screen}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Nav pills */}
          <View style={styles.navRow}>
            <TouchableOpacity onPress={handleLogout} style={styles.navPill}>
              <Ionicons name="log-out-outline" size={16} color={COLORS.textMuted} />
              <Text style={styles.navPillText}>Sair</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSkip} style={styles.navPill}>
              <Text style={styles.navPillText}>Pular</Text>
              <Ionicons name="arrow-forward-outline" size={16} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Hero com animacao */}
          <Animated.View style={[styles.hero, { opacity: fadeAnim, transform: [{ scale: heroScale }] }]}>
            <View style={styles.heroBadge}>
              <Ionicons name="gift" size={12} color={COLORS.background} />
              <Text style={styles.heroBadgeText}>7 DIAS GRATIS</Text>
            </View>
            <Text style={[styles.heroTitle, { fontSize: isSmall ? 24 : 28 }]}>LIBERE TODO SEU POTENCIAL</Text>
            <Text style={styles.heroSubtitle}>Escolha o plano ideal para sua evolucao</Text>

            {/* Social proof */}
            <View style={styles.socialProof}>
              <View style={styles.socialItem}>
                <Text style={styles.socialNum}>12K+</Text>
                <Text style={styles.socialLabel}>Alunos ativos</Text>
              </View>
              <View style={styles.socialDivider} />
              <View style={styles.socialItem}>
                <View style={styles.starsRow}>
                  {[1,2,3,4,5].map(i => <Ionicons key={i} name="star" size={12} color={COLORS.primary} />)}
                </View>
                <Text style={styles.socialLabel}>4.9 / 5.0</Text>
              </View>
              <View style={styles.socialDivider} />
              <View style={styles.socialItem}>
                <Text style={styles.socialNum}>98%</Text>
                <Text style={styles.socialLabel}>Satisfacao</Text>
              </View>
            </View>
          </Animated.View>

          {/* Billing toggle */}
          <View style={styles.billingToggle}>
            <Text style={[styles.billingLabel, !isAnnual && styles.billingLabelActive]}>Mensal</Text>
            <Switch
              value={isAnnual}
              onValueChange={setIsAnnual}
              trackColor={{ false: COLORS.border, true: COLORS.primary + '60' }}
              thumbColor={isAnnual ? COLORS.primary : COLORS.textMuted}
            />
            <Text style={[styles.billingLabel, isAnnual && styles.billingLabelActive]}>Anual</Text>
            {isAnnual && (
              <View style={styles.annualBadge}>
                <Text style={styles.annualBadgeText}>-20%</Text>
              </View>
            )}
          </View>

          {/* Planos */}
          <View style={styles.plans}>
            {Object.values(PLANS).map((plan) => (
              <PlanCard key={plan.id} plan={plan} isSelected={selected === plan.id} onSelect={setSelected} />
            ))}
          </View>

          <CouponInput onApply={setCoupon} />
          <GuaranteeSection />
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <Animated.View style={{ transform: [{ scale: pulseAnim }], shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 }}>
            <GradientButton
              title={getButtonTitle()}
              onPress={handleSubscribe}
              icon="flash"
              size={isSmall ? 'md' : 'lg'}
              disabled={processing}
            />
          </Animated.View>
          <Text style={styles.footerHint}>Cancele quando quiser - Sem fidelidade</Text>
        </View>

        <ProcessingModal visible={processing} step={processStep} paymentId={paymentId} onCancel={cancelProcessing} isWeb={isWeb} />
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flexGrow: 1, padding: SPACING.xl, paddingTop: Platform.OS === 'ios' ? 54 : 40, paddingBottom: SPACING.xxl },

  // Nav
  navRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xl },
  navPill: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, backgroundColor: COLORS.surface, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.full, borderWidth: 1, borderColor: COLORS.border, minHeight: 36 },
  navPillText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: COLORS.textMuted },

  // Hero
  hero: { alignItems: 'center', marginBottom: SPACING.xxl },
  heroBadge: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, backgroundColor: COLORS.primary, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.full, marginBottom: SPACING.lg, ...SHADOWS.sm },
  heroBadgeText: { fontFamily: 'Montserrat_700Bold', fontSize: 11, color: COLORS.background, letterSpacing: 1.5 },
  heroTitle: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 28, color: COLORS.textTitle, textAlign: 'center', lineHeight: 36, marginBottom: SPACING.sm },
  heroSubtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, textAlign: 'center', marginBottom: SPACING.xl },

  // Social proof
  socialProof: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg, borderWidth: 1, borderColor: COLORS.border,
    paddingVertical: SPACING.md, paddingHorizontal: SPACING.lg, gap: SPACING.lg,
    width: '100%', justifyContent: 'space-around', ...SHADOWS.sm,
  },
  socialItem: { alignItems: 'center', flex: 1 },
  socialNum: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 18, color: COLORS.primary },
  socialLabel: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted, marginTop: 2, textAlign: 'center' },
  starsRow: { flexDirection: 'row', gap: 2, marginBottom: 2 },
  socialDivider: { width: 1, height: 32, backgroundColor: COLORS.border },

  // Billing
  billingToggle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.md, marginBottom: SPACING.xl, paddingVertical: SPACING.md, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, borderWidth: 1, borderColor: COLORS.border },
  billingLabel: { fontFamily: 'Inter_500Medium', fontSize: 13, color: COLORS.textMuted },
  billingLabelActive: { color: COLORS.primary, fontFamily: 'Montserrat_700Bold' },
  annualBadge: { backgroundColor: COLORS.success, paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: BORDER_RADIUS.full },
  annualBadgeText: { fontFamily: 'Montserrat_700Bold', fontSize: 10, color: COLORS.background },

  // Plans
  plans: { gap: SPACING.md, marginBottom: SPACING.xl },

  // Footer
  footer: { padding: SPACING.xl, paddingBottom: Platform.OS === 'ios' ? 40 : SPACING.xl, borderTopWidth: 1, borderTopColor: COLORS.border, gap: SPACING.sm },
  footerHint: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted, textAlign: 'center' },
});
