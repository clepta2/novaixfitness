// src/components/analytics/WeightCounter.tsx
// Contador animado para peso (kg)

import { useState, useEffect, useRef } from 'react';
import { Text, Animated, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

interface WeightCounterProps {
  value: number;
}

export default function WeightCounter({ value }: WeightCounterProps) {
  const [display, setDisplay] = useState(0);
  const animRef = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animRef, {
      toValue: value, duration: 1000, useNativeDriver: false,
    }).start();

    const listener = animRef.addListener(({ value: v }) => setDisplay(Math.round(v * 10) / 10));
    return () => animRef.removeListener(listener);
  }, [value]);

  return (
    <Text style={styles.counterValue}>
      {display}<Text style={styles.counterSuffix}> kg</Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  counterValue: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 22, color: COLORS.primary },
  counterSuffix: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted },
});
