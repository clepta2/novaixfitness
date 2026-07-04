// src/components/analytics/ComparisonCard.js
// Card de comparação animado - NOVAIX FITNESS

import React, { useRef, useEffect, memo } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

interface ComparisonCardProps {
  comparison?: any;
}

export default memo(function ComparisonCard({ comparison }: ComparisonCardProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, tension: 30, friction: 8, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  if (!comparison) return null;

  const isPositive = comparison.pctChange >= 0;
  const color = isPositive ? COLORS.success : COLORS.error;
  const icon = isPositive ? 'trending-up' : 'trending-down';

  return (
    <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ scale: scaleAnim }], borderColor: color + '40' }]}>
      <View style={styles.header}>
        <Ionicons name={icon} size={20} color={color} />
        <View style={styles.headerInfo}>
          <Text style={styles.headerLabel}>Vs. período anterior</Text>
          <Text style={[styles.percentage, { color }]}>{isPositive ? '+' : ''}{comparison.pctChange}%</Text>
        </View>
      </View>

      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Ionicons name="barbell" size={14} color={COLORS.textMuted} />
          <Text style={[styles.detailValue, { color: comparison.workouts >= 0 ? COLORS.success : COLORS.error }]}>
            {comparison.workouts >= 0 ? '+' : ''}{comparison.workouts}
          </Text>
          <Text style={styles.detailLabel}>treinos</Text>
        </View>
        <View style={styles.detailDivider} />
        <View style={styles.detailItem}>
          <Ionicons name="time" size={14} color={COLORS.textMuted} />
          <Text style={[styles.detailValue, { color: comparison.minutes >= 0 ? COLORS.success : COLORS.error }]}>
            {comparison.minutes >= 0 ? '+' : ''}{comparison.minutes}
          </Text>
          <Text style={styles.detailLabel}>minutos</Text>
        </View>
      </View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.lg, borderWidth: 2 },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginBottom: SPACING.md },
  headerInfo: { flex: 1 },
  headerLabel: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted },
  percentage: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 28 },
  detailsRow: { flexDirection: 'row', backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, padding: SPACING.md },
  detailItem: { flex: 1, alignItems: 'center', gap: SPACING.xs },
  detailValue: { fontFamily: 'Montserrat_700Bold', fontSize: 16 },
  detailLabel: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted },
  detailDivider: { width: 1, height: 30, backgroundColor: COLORS.border },
});
