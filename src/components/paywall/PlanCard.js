// src/components/paywall/PlanCard.js
// Card de plano - NOVAIX FITNESS

import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

export default function PlanCard({ plan, isSelected, onSelect }) {
  const [scaleAnim] = useState(() => new Animated.Value(1));
  const [borderAnim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: isSelected ? 1.02 : 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }),
      Animated.timing(borderAnim, {
        toValue: isSelected ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  }, [isSelected]);

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.border, COLORS.primary],
  });

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        style={[styles.card, plan.popular && styles.popular, { borderColor }]}
        onPress={() => onSelect?.(plan.id)}
        activeOpacity={0.9}
      >
        {plan.popular && (
          <View style={styles.popularBadge}>
            <Ionicons name="star" size={10} color={COLORS.background} />
            <Text style={styles.popularText}>MAIS POPULAR</Text>
          </View>
        )}

        <View style={styles.header}>
          <Text style={styles.name}>{plan.name}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>{plan.price}</Text>
            <Text style={styles.period}>{plan.period}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.features}>
          {plan.features.map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <View style={[styles.featureIcon, f.included && styles.featureIconActive]}>
                <Ionicons name={f.included ? 'checkmark' : 'close'} size={12} color={f.included ? COLORS.primary : COLORS.textMuted} />
              </View>
              <Text style={[styles.featureText, !f.included && styles.featureDisabled]}>{f.text}</Text>
            </View>
          ))}
        </View>

        {isSelected && (
          <View style={styles.checkmark}>
            <Ionicons name="checkmark-circle" size={22} color={COLORS.primary} />
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    borderWidth: 2,
    position: 'relative',
  },
  popular: {
    backgroundColor: COLORS.surfaceElevated,
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    right: SPACING.lg,
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
  header: {
    marginBottom: SPACING.md,
  },
  name: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 18,
    color: COLORS.textTitle,
    marginBottom: SPACING.xs,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 36,
    color: COLORS.primary,
  },
  period: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textMuted,
    marginLeft: SPACING.xs,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  features: {
    gap: SPACING.sm,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  featureIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.surfaceOverlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureIconActive: {
    backgroundColor: COLORS.primary + '20',
  },
  featureText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textTitle,
    flex: 1,
  },
  featureDisabled: {
    color: COLORS.textMuted,
    textDecorationLine: 'line-through',
  },
  checkmark: {
    position: 'absolute',
    top: SPACING.xl,
    right: SPACING.xl,
  },
});
