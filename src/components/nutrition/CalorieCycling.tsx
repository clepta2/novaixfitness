// src/components/nutrition/CalorieCycling.js
// Calorie cycling - dias altos e baixos - NOVAIX FITNESS

import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { CYCLING_PLANS, TYPE_COLORS } from '../../data/calorieCycling';

export default function CalorieCycling({ baseCalories = 2000, onApply }) {
  const [selectedPlan, setSelectedPlan] = useState('3plus1');

  const plan = useMemo(() => CYCLING_PLANS.find(p => p.id === selectedPlan), [selectedPlan]);

  const cycle = useMemo(() => {
    if (!plan) return [];
    return plan.days.map((day, i) => ({
      ...day,
      dayNum: i + 1,
      calories: Math.round(baseCalories * day.multiplier),
      protein: Math.round(baseCalories * 0.3 / 4 * day.multiplier),
      carbs: Math.round(baseCalories * 0.45 / 4 * day.multiplier),
      fat: Math.round(baseCalories * 0.25 / 9 * day.multiplier),
    }));
  }, [plan, baseCalories]);

  const weeklyAvg = useMemo(() => {
    if (cycle.length === 0) return 0;
    return Math.round(cycle.reduce((s, d) => s + d.calories, 0) / cycle.length);
  }, [cycle]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="repeat" size={18} color={COLORS.primary} />
        <Text style={styles.title}>CALORIE CYCLING</Text>
      </View>

      <Text style={styles.desc}>Alterne calorias para acelerar o metabolismo e queima de gordura.</Text>

      <View style={styles.planRow}>
        {CYCLING_PLANS.map(p => (
          <TouchableOpacity key={p.id} style={[styles.planBtn, selectedPlan === p.id && styles.planActive]} onPress={() => setSelectedPlan(p.id)}>
            <Text style={[styles.planName, selectedPlan === p.id && styles.planNameActive]}>{p.name}</Text>
            <Text style={[styles.planDesc, selectedPlan === p.id && styles.planDescActive]}>{p.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.cycleGrid}>
        {cycle.map((day, i) => (
          <View key={i} style={[styles.dayCard, { borderLeftColor: TYPE_COLORS[day.type] }]}>
            <View style={styles.dayHeader}>
              <Text style={styles.dayLabel}>{day.label}</Text>
              <Text style={[styles.dayCalories, { color: TYPE_COLORS[day.type] }]}>{day.calories}</Text>
            </View>
            <View style={styles.dayMacros}>
              <Text style={styles.macroText}>{day.protein}P</Text>
              <Text style={styles.macroText}>{day.carbs}C</Text>
              <Text style={styles.macroText}>{day.fat}G</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.summaryRow}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{weeklyAvg}</Text>
          <Text style={styles.summaryLabel}>kcal média/dia</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryValue, { color: COLORS.primary }]}>{cycle.length}</Text>
          <Text style={styles.summaryLabel}>dias no ciclo</Text>
        </View>
      </View>

      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.primary }]} />
          <Text style={styles.legendText}>Alto</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.success }]} />
          <Text style={styles.legendText}>Normal</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.info }]} />
          <Text style={styles.legendText}>Baixo</Text>
        </View>
      </View>

      {onApply && (
        <TouchableOpacity style={styles.applyBtn} onPress={() => onApply(cycle)}>
          <Ionicons name="checkmark-circle" size={18} color={COLORS.background} />
          <Text style={styles.applyText}>APLICAR CICLO</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.xs },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textMuted, letterSpacing: 1 },
  desc: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textDescription, marginBottom: SPACING.md },
  planRow: { flexDirection: 'row', gap: SPACING.xs, marginBottom: SPACING.md },
  planBtn: { flex: 1, alignItems: 'center', padding: SPACING.sm, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border },
  planActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  planName: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.textMuted },
  planNameActive: { color: COLORS.background },
  planDesc: { fontFamily: 'Inter_400Regular', fontSize: 9, color: COLORS.textMuted },
  planDescActive: { color: COLORS.background + 'CC' },
  cycleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs, marginBottom: SPACING.md },
  dayCard: { width: '23%', backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.sm, padding: SPACING.sm, borderLeftWidth: 3 },
  dayHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.xs },
  dayLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 9, color: COLORS.textMuted },
  dayCalories: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 12 },
  dayMacros: { flexDirection: 'row', gap: 4 },
  macroText: { fontFamily: 'Inter_400Regular', fontSize: 8, color: COLORS.textMuted },
  summaryRow: { flexDirection: 'row', backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryValue: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 18, color: COLORS.textTitle },
  summaryLabel: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted, marginTop: 2 },
  legendRow: { flexDirection: 'row', justifyContent: 'center', gap: SPACING.lg, marginBottom: SPACING.md },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted },
  applyBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.primary, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.md },
  applyText: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.background, letterSpacing: 1 },
});
