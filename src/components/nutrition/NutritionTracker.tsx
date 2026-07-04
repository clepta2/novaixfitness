// src/components/nutrition/NutritionTracker.js
// Tracker diário de calorias e macros - NOVAIX FITNESS

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { getDailySummary, calculateNutritionGoals } from '../../services/mealAnalyzer';

function MacroBar({ label, current, goal, color, icon, delay = 0 }) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const progress = goal > 0 ? Math.min(100, (current / goal) * 100) : 0;
  const remaining = Math.max(0, goal - current);

  useEffect(() => {
    Animated.spring(animatedValue, { toValue: progress, tension: 30, friction: 8, delay, useNativeDriver: false }).start();
  }, [progress]);

  const barWidth = animatedValue.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });

  return (
    <View style={styles.macroRow}>
      <View style={styles.macroHeader}>
        <Ionicons name={icon} size={16} color={color} />
        <Text style={styles.macroLabel}>{label}</Text>
        <Text style={styles.macroValue}>{Math.round(current)}/{goal}g</Text>
      </View>
      <View style={styles.barBg}>
        <Animated.View style={[styles.barFill, { width: barWidth, backgroundColor: color }]} />
      </View>
      <Text style={[styles.macroRemaining, remaining === 0 && styles.macroComplete]}>
        {remaining === 0 ? '✓ Meta atingida' : `Faltam ${remaining}g`}
      </Text>
    </View>
  );
}

export default function NutritionTracker({ userId, weight = 70, goal = 'manter' }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const calorieAnim = useRef(new Animated.Value(0)).current;

  const goals = useMemo(() => calculateNutritionGoals(weight, goal), [weight, goal]);

  useEffect(() => {
    loadSummary();
  }, [userId]);

  const loadSummary = async () => {
    setLoading(true);
    try {
      const data = await getDailySummary(userId);
      setSummary(data);
      const calProgress = data && goals.calories > 0 ? Math.min(100, (data.calories / goals.calories) * 100) : 0;
      Animated.spring(calorieAnim, { toValue: calProgress, tension: 30, friction: 8, useNativeDriver: false }).start();
    } catch (err) {
      if (__DEV__) console.error('Erro ao carregar resumo:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <View style={styles.loading}><Text style={styles.loadingText}>Carregando...</Text></View>;
  }

  const data = summary || { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, meals: 0 };

  const calorieBarWidth = calorieAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>RESUMO DIÁRIO</Text>
        <Text style={styles.mealCount}>{data.meals} refeições</Text>
      </View>

      <View style={styles.calorieCard}>
        <View style={styles.calorieCircle}>
          <Text style={styles.calorieValue}>{Math.round(data.calories)}</Text>
          <Text style={styles.calorieLabel}>kcal</Text>
        </View>
        <View style={styles.calorieInfo}>
          <Text style={styles.calorieGoal}>Meta: {goals.calories} kcal</Text>
          <View style={styles.calorieBarBg}>
            <Animated.View style={[styles.calorieBarFill, { width: calorieBarWidth }]} />
          </View>
          <Text style={styles.calorieRemaining}>
            {Math.max(0, goals.calories - Math.round(data.calories))} kcal restantes
          </Text>
        </View>
      </View>

      <View style={styles.macrosGrid}>
        <MacroBar label="Proteína" current={data.protein} goal={goals.protein} color={COLORS.success} icon="flash" delay={0} />
        <MacroBar label="Carboidratos" current={data.carbs} goal={goals.carbs} color={COLORS.primary} icon="leaf" delay={100} />
        <MacroBar label="Gordura" current={data.fat} goal={goals.fat} color={COLORS.secondary} icon="water" delay={200} />
        <MacroBar label="Fibra" current={data.fiber} goal={goals.fiber} color={COLORS.info} icon="fitness" delay={300} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  loading: { padding: SPACING.xxl, alignItems: 'center' },
  loadingText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textMuted, letterSpacing: 1 },
  mealCount: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted },
  calorieCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, marginBottom: SPACING.lg },
  calorieCircle: { width: 80, height: 80, borderRadius: 40, borderWidth: 4, borderColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.lg },
  calorieValue: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 20, color: COLORS.primary },
  calorieLabel: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted },
  calorieInfo: { flex: 1 },
  calorieGoal: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textTitle, marginBottom: SPACING.xs },
  calorieBarBg: { height: 8, backgroundColor: COLORS.surfaceOverlay, borderRadius: 4, marginBottom: SPACING.xs, overflow: 'hidden' },
  calorieBarFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 4 },
  calorieRemaining: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted },
  macrosGrid: { gap: SPACING.md },
  macroRow: { gap: SPACING.xs },
  macroHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  macroLabel: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textDescription, flex: 1 },
  macroValue: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textTitle },
  barBg: { height: 6, backgroundColor: COLORS.surfaceOverlay, borderRadius: 3, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 3 },
  macroRemaining: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted },
  macroComplete: { color: COLORS.success },
});
