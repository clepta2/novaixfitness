// src/components/ui/AnimatedRefresh.tsx
// Refresh control animado - NOVAIX FITNESS

import React, { useState, useEffect } from 'react';
import { RefreshControl, Animated, StyleSheet } from 'react-native';
import { useColors } from '../../context/ThemeContext';

interface AnimatedRefreshProps {
  refreshing: boolean;
  onRefresh: () => void;
  tintColor?: string;
  refreshColors?: string[];
}

export default function AnimatedRefresh({ refreshing, onRefresh, tintColor, refreshColors }: AnimatedRefreshProps) {
  const colors = useColors();
  const [spinValue] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (refreshing) {
      const spin = Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      );
      spin.start();
      return () => spin.stop();
    } else {
      spinValue.setValue(0);
    }
  }, [refreshing, spinValue]);

  return (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={tintColor || colors.primary}
      colors={refreshColors || [colors.primary]}
      progressViewOffset={0}
    />
  );
}
