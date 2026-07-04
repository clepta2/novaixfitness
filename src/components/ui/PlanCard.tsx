// src/components/ui/PlanCard.tsx
// Card de plano com animacao e destaque - NOVAIX FITNESS

import React, { useMemo, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { SHADOWS } from '../../constants/shadows';
import PlanFeatureList from './PlanFeatureList';

interface PlanCardProps {
  plan: any;
  isSelected?: boolean;
  onSelect: (id: string) => void;
  isAnnual?: boolean;
}

export default function PlanCard({
  plan,
  isSelected = false,
  onSelect,
  isAnnual = false,
}: PlanCardProps) {
  const name = plan?.name || '';
  const price = isAnnual ? (plan?.annualPrice || plan?.price || 0) : (plan?.price || 0);
  const period = isAnnual ? (plan?.annualPeriod || '/mês') : (plan?.period || '/mês');
  const features: any[] = plan?.features || [];
  const isPopular = plan?.popular || false;
  const badge = isAnnual && plan?.annualSavings ? `-${plan.annualSavings}` : undefined;

  const scaleAnim = useRef(new Animated.Value(isSelected ? 1.02 : 1)).current;
  const borderAnim = useRef(new Animated.Value(isSelected ? 1 : 0)).current;
  const translateYAnim = useRef(new Animated.Value(isSelected ? -8 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: isSelected ? 1.02 : 1, friction: 5, useNativeDriver: true }),
      Animated.spring(translateYAnim, { toValue: isSelected ? -8 : 0, friction: 6, useNativeDriver: true }),
      Animated.timing(borderAnim, { toValue: isSelected ? 1 : 0, duration: 200, useNativeDriver: false }),
    ]).start();
  }, [isSelected]);

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.border, COLORS.primary],
  });

  return (
    <Animated.View style={[
      styles.container,
      isSelected && styles.containerActive,
      { transform: [{ scale: scaleAnim }, { translateY: translateYAnim }], borderColor }
    ]}>
      {isPopular && (
        <View style={styles.popularBadge}>
          <Ionicons name="star" size={12} color={COLORS.background} />
          <Text style={styles.popularText}>MAIS POPULAR</Text>
        </View>
      )}
      {badge && (
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{badge}</Text>
        </View>
      )}

      <TouchableOpacity onPress={() => onSelect(plan?.id)} activeOpacity={0.9} style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{name}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.currency}>R$</Text>
            <Text style={styles.price}>{(price || 0).toFixed(2).replace('.', ',')}</Text>
            <Text style={styles.period}>{period}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <PlanFeatureList features={features} />

        <View style={[styles.selectBtn, isSelected && styles.selectBtnActive]}>
          <Text style={[styles.selectBtnText, isSelected && styles.selectBtnTextActive]}>
            {isSelected ? 'SELECIONADO' : 'SELECIONAR'}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, borderWidth: 2, overflow: 'hidden', ...SHADOWS.md },
  containerActive: { shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 16, elevation: 8 },
  popularBadge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, backgroundColor: COLORS.primary, paddingVertical: SPACING.xs },
  popularText: { fontFamily: 'Montserrat_700Bold', fontSize: 10, color: COLORS.background, letterSpacing: 1 },
  discountBadge: { position: 'absolute', top: 12, right: 12, backgroundColor: COLORS.success, paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: BORDER_RADIUS.sm },
  discountText: { fontFamily: 'Montserrat_700Bold', fontSize: 11, color: COLORS.background },
  content: { padding: SPACING.xl },
  header: { alignItems: 'center', marginBottom: SPACING.md },
  name: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle, marginBottom: SPACING.xs },
  priceRow: { flexDirection: 'row', alignItems: 'baseline' },
  currency: { fontFamily: 'Inter_400Regular', fontSize: 16, color: COLORS.textMuted },
  price: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 36, color: COLORS.primary },
  period: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: SPACING.md },
  selectBtn: { backgroundColor: COLORS.surfaceElevated, borderRadius: BORDER_RADIUS.md, paddingVertical: SPACING.md, alignItems: 'center' },
  selectBtnActive: { backgroundColor: COLORS.primary },
  selectBtnText: { fontFamily: 'Montserrat_700Bold', fontSize: 13, color: COLORS.textTitle, letterSpacing: 0.5 },
  selectBtnTextActive: { color: COLORS.background },
});
