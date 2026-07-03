// src/components/ui/AnimatedGradient.tsx
// Gradiente animado para fundos - Rebranding 2026

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, ViewStyle } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface AnimatedGradientProps {
  colors: string[];
  animated?: boolean;
  speed?: number;
  style?: ViewStyle;
}

export function AnimatedGradient({
  colors,
  animated = true,
  speed = 0.5,
  style,
}: AnimatedGradientProps) {
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animated) return;

    const duration = 10000 / speed;

    const animation = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(translateX, {
            toValue: SCREEN_WIDTH,
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(translateX, {
            toValue: -SCREEN_WIDTH,
            duration,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(translateY, {
            toValue: SCREEN_HEIGHT / 2,
            duration: duration * 1.5,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: -SCREEN_HEIGHT / 2,
            duration: duration * 1.5,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [animated, speed, translateX, translateY]);

  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={[
          styles.gradientContainer,
          {
            transform: [
              { translateX },
              { translateY },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={colors as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
  gradientContainer: {
    ...StyleSheet.absoluteFill,
    width: SCREEN_WIDTH * 3,
    height: SCREEN_HEIGHT * 2,
    marginLeft: -SCREEN_WIDTH,
    marginTop: -SCREEN_HEIGHT / 2,
  },
  gradient: {
    flex: 1,
  },
});
