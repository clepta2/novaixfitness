import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

function MacroBar({ label, current, goal, color, icon, delay = 0 }) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const progress = goal > 0 ? Math.min(100, (current / goal) * 100) : 0;

  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: progress, tension: 30, friction: 8, delay, useNativeDriver: false,
    }).start();
  }, [progress]);

  const barWidth = animatedValue.interpolate({
    inputRange: [0, 100], outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.macroRow}>
      <View style={styles.macroHeader}>
        <Ionicons name={icon} size={14} color={color} />
        <Text style={styles.macroLabel}>{label}</Text>
        <Text style={styles.macroValue}>{Math.round(current)}/{goal}g</Text>
      </View>
      <View style={styles.barBg}>
        <Animated.View style={[styles.barFill, { width: barWidth, backgroundColor: color }]} />
      </View>
    </View>
  );
}

export default function DailySummaryCard({ summary, goals }) {
  const calAnim = useRef(new Animated.Value(0)).current;
  const data = summary || { calories: 0, protein: 0, carbs: 0, fat: 0, meals: 0 };
  const remaining = Math.max(0, goals.calories - Math.round(data.calories));
  const calProgress = goals.calories > 0 ? Math.min(100, (data.calories / goals.calories) * 100) : 0;

  useEffect(() => {
    Animated.spring(calAnim, {
      toValue: calProgress, tension: 30, friction: 8, useNativeDriver: false,
    }).start();
  }, [calProgress]);

  const calBarWidth = calAnim.interpolate({
    inputRange: [0, 100], outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.card}>
      <View style={styles.calRow}>
        <View style={styles.calCircle}>
          <Text style={styles.calValue}>{Math.round(data.calories)}</Text>
          <Text style={styles.calLabel}>kcal</Text>
        </View>
        <View style={styles.calInfo}>
          <Text style={styles.calGoal}>Meta: {goals.calories} kcal</Text>
          <View style={styles.calBarBg}>
            <Animated.View style={[styles.calBarFill, { width: calBarWidth }]} />
          </View>
          <Text style={styles.calRemaining}>{remaining} kcal restantes</Text>
        </View>
      </View>
      <View style={styles.macros}>
        <MacroBar label="Proteína" current={data.protein} goal={goals.protein} color={COLORS.success} icon="flash" />
        <MacroBar label="Carboidratos" current={data.carbs} goal={goals.carbs} color={COLORS.primary} icon="leaf" delay={100} />
        <MacroBar label="Gordura" current={data.fat} goal={goals.fat} color={COLORS.secondary} icon="water" delay={200} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  calRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, marginBottom: SPACING.lg },
  calCircle: { width: 72, height: 72, borderRadius: 36, borderWidth: 3, borderColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.lg },
  calValue: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 18, color: COLORS.primary },
  calLabel: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted },
  calInfo: { flex: 1 },
  calGoal: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textTitle, marginBottom: SPACING.xs },
  calBarBg: { height: 8, backgroundColor: COLORS.surfaceOverlay, borderRadius: 4, marginBottom: SPACING.xs, overflow: 'hidden' },
  calBarFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 4 },
  calRemaining: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted },
  macros: { gap: SPACING.md },
  macroRow: { gap: SPACING.xs },
  macroHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  macroLabel: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textDescription, flex: 1 },
  macroValue: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textTitle },
  barBg: { height: 6, backgroundColor: COLORS.surfaceOverlay, borderRadius: 3, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 3 },
});
