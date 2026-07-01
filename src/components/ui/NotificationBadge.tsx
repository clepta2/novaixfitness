// src/components/ui/NotificationBadge.tsx
// Badge de notificacao animado - NOVAIX FITNESS

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../../constants/colors';

interface NotificationBadgeProps {
  count: number;
  size?: 'sm' | 'md' | 'lg';
  showZero?: boolean;
  maxCount?: number;
}

export default function NotificationBadge({
  count,
  size = 'md',
  showZero = false,
  maxCount = 99,
}: NotificationBadgeProps) {
  const scaleAnim = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    if (count > 0 || showZero) {
      Animated.sequence([
        Animated.spring(scaleAnim, { toValue: 1.2, friction: 3, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, friction: 5, useNativeDriver: true }),
      ]).start();
    } else {
      scaleAnim.setValue(0);
    }
  }, [count]);

  if (count === 0 && !showZero) return null;

  const sizeConfig = {
    sm: { container: 16, fontSize: 9 },
    md: { container: 20, fontSize: 10 },
    lg: { container: 24, fontSize: 12 },
  }[size];

  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();

  return (
    <Animated.View style={[styles.container, {
      width: sizeConfig.container,
      height: sizeConfig.container,
      borderRadius: sizeConfig.container / 2,
      transform: [{ scale: scaleAnim }],
    }]}>
      <Text style={[styles.text, { fontSize: sizeConfig.fontSize }]}>{displayCount}</Text>
    </Animated.View>
  );
}

// Badge de ponto (sem numero)
export function DotBadge({ color = COLORS.error }: { color?: string }) {
  return <View style={[styles.dot, { backgroundColor: color }]} />;
}

// Badge posicional (para icones)
export function PositionalBadge({
  count,
  top = -4,
  right = -4,
}: {
  count: number;
  top?: number;
  right?: number;
}) {
  if (count === 0) return null;
  return (
    <View style={[styles.positional, { top, right }]}>
      <Text style={styles.positionalText}>{count > 99 ? '99+' : count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'Montserrat_700Bold',
    color: COLORS.background,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  positional: {
    position: 'absolute',
    backgroundColor: COLORS.error,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  positionalText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 9,
    color: COLORS.background,
  },
});
