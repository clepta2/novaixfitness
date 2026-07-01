// src/components/common/CircularProgress.js
// Progresso circular animado - NOVAIX FITNESS

import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';

export default function CircularProgress({ value = 0, max = 100, size = 80, strokeWidth = 6, color = COLORS.primary, label, showValue = true }) {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = max > 0 ? Math.min(100, (value / max) * 100) : 0;

  useEffect(() => {
    Animated.timing(progressAnim, { toValue: percentage, duration: 1000, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
  }, [percentage]);

  return (
    <View style={[styles.container, { width: size, height: size }]} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: Math.round(percentage) }}>
      <Svg width={size} height={size}>
        <Circle cx={size / 2} cy={size / 2} r={radius} stroke={COLORS.surfaceOverlay} strokeWidth={strokeWidth} fill="none" />
        <Circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke={color} strokeWidth={strokeWidth} fill="none"
          strokeDasharray={circumference} strokeDashoffset={circumference * (1 - percentage / 100)}
          strokeLinecap="round" transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      {showValue && (
        <View style={styles.valueContainer}>
          <Text style={[styles.value, { color }]}>{Math.round(percentage)}</Text>
          <Text style={styles.unit}>%</Text>
        </View>
      )}
      {label && <Text style={styles.label}>{label}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  valueContainer: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  value: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 18 },
  unit: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted },
  label: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted, marginTop: SPACING.xs },
});
