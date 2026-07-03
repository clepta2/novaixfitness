// src/components/analytics/ConfidenceBar.tsx
// Barra de confiança animada para previsões

import { useState, useEffect } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { COLORS } from '../../constants/colors';

interface ConfidenceBarProps {
  confidence: number;
}

export default function ConfidenceBar({ confidence }: ConfidenceBarProps) {
  const [width] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.spring(width, {
      toValue: confidence, tension: 40, friction: 8, useNativeDriver: false,
    }).start();
  }, [confidence, width]);

  const color = confidence >= 70 ? COLORS.success || '#4CAF50' : confidence >= 40 ? COLORS.attention || '#FFC107' : COLORS.error || '#F44336';
  const label = confidence >= 70 ? 'Alta' : confidence >= 40 ? 'Média' : 'Baixa';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Confiança da previsão</Text>
        <View style={[styles.badge, { backgroundColor: color + '20' }]}>
          <View style={[styles.dot, { backgroundColor: color }]} />
          <Text style={[styles.badgeText, { color }]}>{label} ({Math.round(confidence)}%)</Text>
        </View>
      </View>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, {
          width: width.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }),
          backgroundColor: color,
        }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.lg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  label: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: SPACING.sm, paddingVertical: 3, borderRadius: BORDER_RADIUS.sm,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  badgeText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10 },
  track: { height: 4, backgroundColor: COLORS.border || '#2A3040', borderRadius: 2, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 2 },
});
