// src/components/ui/AnimatedDots.tsx
// Indicadores de pagina animados com interpolacao - NOVAIX FITNESS

import React from 'react';
import { Animated, StyleSheet, Dimensions } from 'react-native';
import { useColors } from '../../context/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface AnimatedDotsProps {
  count: number;
  scrollX: Animated.Value;
}

export default function AnimatedDots({ count, scrollX }: AnimatedDotsProps) {
  const colors = useColors();

  return (
    <Animated.View style={styles.container}>
      {Array.from({ length: count }).map((_, index) => {
        const inputRange = [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH];
        const dotWidth = scrollX.interpolate({ inputRange, outputRange: [8, 24, 8], extrapolate: 'clamp' });
        const dotOpacity = scrollX.interpolate({ inputRange, outputRange: [0.3, 1, 0.3], extrapolate: 'clamp' });
        return <Animated.View key={index} style={[styles.dot, { width: dotWidth, opacity: dotOpacity }]} />;
      })}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, paddingVertical: 20,
  },
  dot: {
    height: 8, borderRadius: 4, backgroundColor: '#B8FF00',
  },
});
