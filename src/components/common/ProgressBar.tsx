// src/components/common/ProgressBar.js
// Barra de progresso animada - NOVAIX FITNESS

import React, { useRef, useEffect, memo } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

interface ProgressBarProps {
  value?: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  color?: string;
  height?: number;
}

export default memo(function ProgressBar({ value = 0, max = 100, label, showPercentage = true, color = COLORS.primary, height = 8 }: ProgressBarProps) {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const percentage = max > 0 ? Math.min(100, (value / max) * 100) : 0;

  useEffect(() => {
    Animated.timing(progressAnim, { toValue: percentage, duration: 800, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
  }, [percentage]);

  const barWidth = progressAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });

  return (
    <View style={styles.container} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: Math.round(percentage) }}>
      {(label || showPercentage) && (
        <View style={styles.header}>
          {label && <Text style={styles.label}>{label}</Text>}
          {showPercentage && <Text style={styles.percentage}>{Math.round(percentage)}%</Text>}
        </View>
      )}
      <View style={[styles.track, { height }]}>
        <Animated.View style={[styles.fill, { width: barWidth, backgroundColor: color, height }]} />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.sm },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.xs },
  label: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textMuted, letterSpacing: 0.5 },
  percentage: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.primary },
  track: { backgroundColor: COLORS.surfaceOverlay, borderRadius: 4, overflow: 'hidden' },
  fill: { borderRadius: 4 },
});
