// src/components/common/XPFloating.js
// Animação de XP flutuante - NOVAIX FITNESS

import React, { useEffect, useState } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

export default function XPFloating({ amount, visible, onComplete }) {
  const [opacity] = useState(() => new Animated.Value(0));
  const [translateY] = useState(() => new Animated.Value(20));
  const [scale] = useState(() => new Animated.Value(0.5));

  useEffect(() => {
    if (visible && amount > 0) {
      opacity.setValue(0);
      translateY.setValue(20);
      scale.setValue(0.5);

      Animated.sequence([
        Animated.parallel([
          Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
          Animated.spring(scale, { toValue: 1, tension: 50, friction: 3, useNativeDriver: true }),
          Animated.timing(translateY, { toValue: 0, duration: 200, useNativeDriver: true }),
        ]),
        Animated.delay(800),
        Animated.parallel([
          Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
          Animated.timing(translateY, { toValue: -30, duration: 300, useNativeDriver: true }),
        ]),
      ]).start(() => {
        if (onComplete) onComplete();
      });
    }
  }, [visible, amount]);

  if (!visible || !amount) return null;

  return (
    <Animated.View style={[styles.container, { opacity, transform: [{ translateY }, { scale }] }]}>
      <Ionicons name="flash" size={18} color={COLORS.primary} />
      <Text style={styles.text}>+{amount} XP</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primary + '40',
  },
  text: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
    color: COLORS.primary,
  },
});
