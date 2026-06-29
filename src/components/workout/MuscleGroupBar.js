import React, { useEffect, useMemo, memo } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';

export default memo(function MuscleGroupBar({ name, count, max, color }) {
  const animatedValue = useMemo(() => new Animated.Value(0), []);
  const width = max > 0 ? (count / max) * 100 : 0;

  useEffect(() => {
    Animated.spring(animatedValue, { toValue: width, tension: 30, friction: 8, useNativeDriver: false }).start();
  }, [width]);

  const barWidth = animatedValue.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });

  return (
    <View style={styles.row}>
      <Text style={styles.name}>{name}</Text>
      <View style={styles.bar}>
        <Animated.View style={[styles.fill, { width: barWidth, backgroundColor: color }]} />
      </View>
      <Text style={styles.count}>{count}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm },
  name: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textDescription, width: 70 },
  bar: { flex: 1, height: 6, backgroundColor: COLORS.surfaceOverlay, borderRadius: 3, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 3 },
  count: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.textTitle, width: 20, textAlign: 'right' },
});
