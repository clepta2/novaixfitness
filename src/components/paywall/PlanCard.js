// src/components/paywall/PlanCard.js
// Card de plano - NOVAIX FITNESS

import { useState, useEffect, memo } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

export default memo(function PlanCard({ plan, isSelected, onSelect }) {
  const [scaleAnim] = useState(() => new Animated.Value(1));

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isSelected ? 1.02 : 1,
      useNativeDriver: true,
      tension: 60,
      friction: 8,
    }).start();
  }, [isSelected]);

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, isSelected && styles.glowWrap]}>
      <TouchableOpacity
        style={[styles.card, plan.popular && styles.popular, isSelected && styles.cardSelected]}
        onPress={() => onSelect?.(plan.id)}
        activeOpacity={0.88}
      >
        {plan.popular && (
          <View style={styles.popularBadge}>
            <Ionicons name="star" size={10} color={COLORS.background} />
            <Text style={styles.popularText}>MAIS POPULAR</Text>
          </View>
        )}

        <View style={styles.header}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{plan.name}</Text>
            {isSelected && (
              <View style={styles.selectedBadge}>
                <Ionicons name="checkmark" size={12} color={COLORS.background} />
              </View>
            )}
          </View>
          <View style={styles.priceRow}>
            <Text style={[styles.price, isSelected && styles.priceSelected]}>{plan.priceText || plan.price}</Text>
            <Text style={styles.period}>{plan.period}</Text>
          </View>
          {plan.description && <Text style={styles.planDesc}>{plan.description}</Text>}
        </View>

        <View style={styles.divider} />

        <View style={styles.features}>
          {plan.features.map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <View style={[styles.featureIcon, f.included && styles.featureIconActive]}>
                <Ionicons name={f.included ? 'checkmark' : 'close'} size={11} color={f.included ? COLORS.primary : COLORS.textMuted} />
              </View>
              <Text style={[styles.featureText, !f.included && styles.featureDisabled]}>{f.text}</Text>
            </View>
          ))}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  glowWrap: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    borderWidth: 2,
    borderColor: COLORS.border,
    position: 'relative',
  },
  cardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '06',
  },
  popular: {
    backgroundColor: COLORS.surfaceElevated,
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    alignSelf: 'center',
    left: '30%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
  },
  popularText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 10,
    color: COLORS.background,
    letterSpacing: 1,
  },
  header: { marginBottom: SPACING.md },
  nameRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.xs },
  name: { fontFamily: 'Montserrat_700Bold', fontSize: 17, color: COLORS.textTitle },
  selectedBadge: { width: 22, height: 22, borderRadius: 11, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: SPACING.xs, marginBottom: 2 },
  price: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 32, color: COLORS.primary },
  priceSelected: { color: COLORS.primary },
  period: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textMuted },
  planDesc: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: SPACING.md },
  features: { gap: SPACING.sm },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  featureIcon: { width: 20, height: 20, borderRadius: 10, backgroundColor: COLORS.surfaceOverlay, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  featureIconActive: { backgroundColor: COLORS.primary + '22' },
  featureText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textTitle, flex: 1, lineHeight: 18 },
  featureDisabled: { color: COLORS.textMuted, textDecorationLine: 'line-through' },
});
