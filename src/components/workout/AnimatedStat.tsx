import React, { useRef, useEffect } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

interface AnimatedStatProps {
  icon: string;
  value: string | number;
  label: string;
  color: string;
  delay?: number;
}

export default function AnimatedStat({ icon, value, label, color, delay = 0 }: AnimatedStatProps): React.ReactElement {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, tension: 30, friction: 8, delay, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
      <View style={[styles.icon, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon as any} size={20} color={color} />
      </View>
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: { width: '48%', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  icon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.sm },
  value: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 24 },
  label: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
});
