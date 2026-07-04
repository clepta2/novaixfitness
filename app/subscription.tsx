
// app/subscription.tsx
// Assinatura com animacoes de transicao - NOVAIX FITNESS


import { useMemo, useEffect , useRef} from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../src/constants/spacing';
import { SHADOWS } from '../src/constants/shadows';
import { PLANS } from '../src/services/payment';
import { layout, typography } from '../src/styles';
import { ErrorBoundary, Loading, GradientButton } from '../src/components';
import { INFO_ITEMS } from '../src/data/subscriptionData';
import { useSubscription } from '../src/hooks/useSubscription';
import { useI18n } from '../src/i18n';
import { useResponsive } from '../src/hooks/useResponsive';

export default function SubscriptionScreen() {
  const { t } = useI18n();
  const router = useRouter();
  const { isSmall } = useResponsive();
  const {
    plan, plans, usage, loading, isPremium, isBasic, isFree, cancel,
  } = useSubscription();

  const isSubscribed = !isFree;
  const status = isPremium
    ? { color: COLORS.success, icon: 'star' as const, label: 'Premium' }
    : isBasic
    ? { color: COLORS.primary, icon: 'checkmark-circle' as const, label: 'Basico' }
    : { color: COLORS.textMuted, icon: 'alert-circle-outline' as const, label: 'Gratuito' };

  // Animacoes
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    if (!loading) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, friction: 8, tension: 55, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, friction: 5, useNativeDriver: true }),
      ]).start();
    }
  }, [loading]);

  if (loading) {
    return (
      <View style={[layout.screen, styles.loadingContainer]}>
        <Loading variant="pulse" />
      </View>
    );
  }

  return (
    <ErrorBoundary screenName="Subscription">
      <ScrollView style={layout.screen} contentContainerStyle={layout.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textTitle} />
          </TouchableOpacity>
          <Text style={[typography.h2, { fontSize: isSmall ? 20 : 24 }]}>{t('subscription.title')}</Text>
          <View style={{ width: 24 }} />
        </View>

        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }, { scale: scaleAnim }] }}>
          {/* Status card */}
          <View style={[styles.statusCard, { borderColor: status.color + '40', backgroundColor: status.color + '08' }]}>
            <View style={[styles.statusIcon, { backgroundColor: status.color + '20' }]}>
              <Ionicons name={status.icon} size={32} color={status.color} />
            </View>
            <View style={styles.statusInfo}>
              <Text style={[styles.statusLabel, { color: status.color }]}>{status.label}</Text>
              {plan && (
                <Text style={styles.statusPlan}>{plan.name} - {plan.priceText}{plan.period}</Text>
              )}
              {!isSubscribed && !plan && (
                <Text style={styles.statusHint}>{t('subscription.activatePlan')}</Text>
              )}
            </View>
          </View>

          {/* Plano ativo */}
          {isSubscribed && plan && (
            <View style={styles.planCard}>
              <Text style={styles.planTitle}>{t('subscription.activePlan')}</Text>
              <Text style={styles.planName}>{plan.name}</Text>
              <View style={styles.planFeatures}>
                {plan.features.filter(f => f.included).map((feature, i) => (
                  <View key={i} style={styles.featureRow}>
                    <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                    <Text style={styles.featureText}>{feature.text}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Upgrade button */}
          {!isSubscribed && (
            <GradientButton
              title={t('subscription.subscribeNow')}
              icon="rocket"
              onPress={() => router.push('/paywall')}
              size={isSmall ? 'md' : 'lg'}
            />
          )}

          {/* Info items */}
          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>Por que assinar?</Text>
            {INFO_ITEMS.map((item, i) => (
              <View key={i} style={styles.infoRow}>
                <View style={[styles.infoIcon, { backgroundColor: item.color + '15' }]}>
                  <Ionicons name={item.icon as any} size={18} color={item.color} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>{item.label}</Text>
                  <Text style={styles.infoDesc}>{item.description}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Historico de pagamentos indisponivel */}
        </Animated.View>
      </ScrollView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md },

  // Status
  statusCard: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginHorizontal: SPACING.lg, marginBottom: SPACING.xl, padding: SPACING.lg, borderRadius: BORDER_RADIUS.lg, borderWidth: 1, ...SHADOWS.sm },
  statusIcon: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
  statusInfo: { flex: 1 },
  statusLabel: { fontFamily: 'Montserrat_700Bold', fontSize: 16 },
  statusPlan: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textMuted, marginTop: 2 },
  statusHint: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textMuted, marginTop: 2 },

  // Plan
  planCard: { marginHorizontal: SPACING.lg, marginBottom: SPACING.xl, padding: SPACING.lg, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.sm },
  planTitle: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textMuted, letterSpacing: 1, marginBottom: SPACING.sm },
  planName: { fontFamily: 'Montserrat_700Bold', fontSize: 18, color: COLORS.textTitle, marginBottom: SPACING.md },
  planFeatures: { gap: SPACING.sm },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  featureText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textDescription },

  // Info
  infoSection: { marginHorizontal: SPACING.lg, marginBottom: SPACING.xl },
  infoTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle, marginBottom: SPACING.md },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginBottom: SPACING.md },
  infoIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  infoContent: { flex: 1 },
  infoLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: COLORS.textTitle },
  infoDesc: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted, marginTop: 2 },

  // History
  historySection: { marginHorizontal: SPACING.lg, marginBottom: SPACING.xl },
  historyTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle, marginBottom: SPACING.md },
  historyItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  historyInfo: { flex: 1 },
  historyDate: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted },
  historyAmount: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.textTitle, marginTop: 2 },
  historyStatus: { paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: BORDER_RADIUS.sm },
  historyStatusText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11 },
});
