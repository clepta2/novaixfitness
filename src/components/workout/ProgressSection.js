// src/components/workout/ProgressSection.js
// Seção de progresso dos treinos - NOVAIX FITNESS

import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

function ProgressSection({ completed, total, label = 'PROGRESSO DO TREINO' }) {
  const percentage = total > 0 ? (completed / total) * 100 : 0;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(progressAnim, { toValue: percentage, tension: 30, friction: 8, useNativeDriver: false }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  }, [percentage]);

  const barWidth = progressAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="stats-chart" size={16} color={COLORS.primary} />
          <Text style={styles.label}>{label}</Text>
        </View>
        <Text style={styles.count}>{completed}/{total}</Text>
      </View>

      <View style={styles.progressRow}>
        <View style={styles.progressBar}>
          <Animated.View style={[styles.progressFill, { width: barWidth }]} />
        </View>
        <Text style={styles.percentage}>{Math.round(percentage)}%</Text>
      </View>

      <View style={styles.dots}>
        {Array.from({ length: total }).map((_, i) => (
          <View key={i} style={[styles.dot, i < completed && styles.dotCompleted, i === completed - 1 && styles.dotCurrent]} />
        ))}
      </View>
    </Animated.View>
  );
}

export default ProgressSection;

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.lg, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  label: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textMuted, letterSpacing: 1 },
  count: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.primary },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  progressBar: { flex: 1, height: 8, backgroundColor: COLORS.surfaceOverlay, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 4 },
  percentage: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textTitle, width: 36, textAlign: 'right' },
  dots: { flexDirection: 'row', gap: SPACING.xs },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.surfaceOverlay },
  dotCompleted: { backgroundColor: COLORS.primary },
  dotCurrent: { backgroundColor: COLORS.success, width: 14, height: 14, borderRadius: 7, marginTop: -2 },
});
