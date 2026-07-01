// src/components/ui/ProgressRing.tsx
// Anel de progresso circular - NOVAIX FITNESS

import React, { useEffect, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { COLORS } from '../../constants/colors';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
  showLabel?: boolean;
  label?: string;
  labelStyle?: any;
}

export default function ProgressRing({
  progress,
  size = 80,
  strokeWidth = 8,
  color = COLORS.primary,
  bgColor = COLORS.surfaceElevated,
  showLabel = true,
  label,
  labelStyle,
}: ProgressRingProps) {
  const animatedValue = useMemo(() => new Animated.Value(0), []);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: Math.min(progress, 100),
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={bgColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset as any}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      {showLabel && (
        <View style={styles.labelContainer}>
          <Text style={[styles.label, labelStyle]}>
            {label || `${Math.round(progress)}%`}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
    color: COLORS.textTitle,
  },
});
