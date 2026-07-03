import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../src/constants/spacing';
import { Button, PlanCard, CouponInput, GuaranteeSection } from '../src/components';
import { PLANS } from '../src/services/payment';
import { typography } from '../src/styles';
import ProcessingModal from '../src/components/paywall/ProcessingModal';
import usePaymentProcessing from '../src/hooks/usePaymentProcessing';

export default function PaywallScreen() {
  const {
    selected, setSelected, coupon, setCoupon, processing, processStep, paymentId, isWeb,
    handleLogout, handleSkip, getButtonTitle, handleSubscribe, cancelProcessing,
  } = usePaymentProcessing();

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.navRow}>
          <TouchableOpacity onPress={handleLogout} style={styles.navPill} activeOpacity={0.7} accessibilityLabel="Sair" accessibilityRole="button">
            <Ionicons name="log-out-outline" size={16} color={COLORS.textMuted} />
            <Text style={styles.navPillText}>Sair</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSkip} style={styles.navPill} activeOpacity={0.7} accessibilityLabel="Pular pagamento" accessibilityRole="button">
            <Text style={styles.navPillText}>Pular</Text>
            <Ionicons name="arrow-forward-outline" size={16} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>
        <View style={styles.hero}>
          <View style={styles.heroBadge}>
            <Ionicons name="gift" size={12} color={COLORS.background} />
            <Text style={styles.heroBadgeText}>7 DIAS GRATIS</Text>
          </View>
          <Text style={styles.heroTitle}>LIBERE TODO SEU POTENCIAL</Text>
          <Text style={styles.heroSubtitle}>Escolha o plano ideal para sua evolução</Text>
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
              <Text style={styles.socialLabel}>Satisfação</Text>
            </View>
          </View>
        </View>
        <View style={styles.plans}>
          {Object.values(PLANS).map((plan) => (
            <PlanCard key={plan.id} plan={plan} isSelected={selected === plan.id} onSelect={setSelected} />
          ))}
        </View>
        <CouponInput onApply={setCoupon} />
        <GuaranteeSection />
      </ScrollView>
      <View style={styles.footer}>
        <Button title={getButtonTitle()} onPress={handleSubscribe} disabled={processing} icon="flash" iconPosition="left" size="lg" style={{ width: '100%' }} />
        <Text style={styles.footerHint}>Cancele quando quiser - Sem fidelidade</Text>
      </View>
      <ProcessingModal
        visible={processing}
        step={processStep}
        paymentId={paymentId}
        onCancel={cancelProcessing}
        isWeb={isWeb}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flexGrow: 1, padding: SPACING.xl, paddingTop: Platform.OS === 'ios' ? 54 : 40, paddingBottom: SPACING.xxl },
  navRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xl },
  navPill: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, backgroundColor: COLORS.surface, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.full, borderWidth: 1, borderColor: COLORS.border },
  navPillText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: COLORS.textMuted },
  hero: { alignItems: 'center', marginBottom: SPACING.xxl },
  heroBadge: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, backgroundColor: COLORS.primary, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.full, marginBottom: SPACING.lg },
  heroBadgeText: { fontFamily: 'Montserrat_700Bold', fontSize: 11, color: COLORS.background, letterSpacing: 1.5 },
  heroTitle: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 28, color: COLORS.textTitle, textAlign: 'center', lineHeight: 36, marginBottom: SPACING.sm },
  heroSubtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, textAlign: 'center', marginBottom: SPACING.xl },
  socialProof: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, paddingVertical: SPACING.md, paddingHorizontal: SPACING.lg, gap: SPACING.lg, width: '100%', justifyContent: 'space-around' },
  socialItem: { alignItems: 'center', flex: 1 },
  socialNum: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 18, color: COLORS.primary },
  socialLabel: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted, marginTop: 2, textAlign: 'center' },
  starsRow: { flexDirection: 'row', gap: 2, marginBottom: 2 },
  socialDivider: { width: 1, height: 32, backgroundColor: COLORS.border },
  plans: { gap: SPACING.md, marginBottom: SPACING.xl },
  footer: { padding: SPACING.xl, paddingBottom: Platform.OS === 'ios' ? 40 : SPACING.xl, borderTopWidth: 1, borderTopColor: COLORS.border, gap: SPACING.sm },
  footerHint: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted, textAlign: 'center' },
});
