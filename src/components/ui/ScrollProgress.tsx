// src/components/ui/ScrollProgress.tsx
// Barra de progresso de scroll - Tendencia 2025-2026

import React from 'react';
import { View, StyleSheet, Animated, ViewStyle } from 'react-native';
import { BORDER_RADIUS } from '../../constants/spacing';
import { useColors } from '../../context/ThemeContext';

interface ScrollProgressProps {
  progress: Animated.AnimatedInterpolation<number>;
  color?: string;
  height?: number;
  style?: ViewStyle;
}

export default function ScrollProgress({ progress, color, height = 3, style }: ScrollProgressProps) {
  const colors = useColors();
  const width = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <View style={[styles.container, { height }, style]}>
      <Animated.View
        style={[styles.progress, { width, backgroundColor: color || colors.primary, height }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%', backgroundColor: '#121820', overflow: 'hidden',
  },
  progress: {
    height: '100%', borderRadius: BORDER_RADIUS.full,
  },
});
