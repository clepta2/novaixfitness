// src/components/nutrition/WeeklySummary.js
// Resumo semanal de nutrição - NOVAIX FITNESS

import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { getMealLogs } from '../../services/mealAnalyzerService';

function StatBar({ label, value, avg, max, color, unit = '' }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  const avgPct = max > 0 ? Math.min(100, (avg / max) * 100) : 0;

  return (
    <View style={styles.statRow}>
      <View style={styles.statHeader}>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statValue}>{Math.round(value)}{unit}</Text>
      </View>
      <View style={styles.barBg}>
        <View style={[styles.barAvg, { width: `${avgPct}%` }]} />
        <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.statAvg}>Média: {Math.round(avg)}{unit}/dia</Text>
    </View>
  );
}

export default function WeeklySummary({ userId }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadWeek(); }, [userId]);

  const loadWeek = async () => {
    if (!userId) { setLoading(false); return; }
    try {
      const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
      const logs = await getMealLogs(userId);
      const weekLogs = logs.filter(l => new Date(l.logged_at) >= new Date(weekAgo));
      setData(weekLogs);
    } catch { }
    finally { setLoading(false); }
  };

  const stats = useMemo(() => {
    if (data.length === 0) return null;
    const days = 7;
    const totals = data.reduce((acc, log) => ({
      calories: acc.calories + (log.calories || 0),
      protein: acc.protein + (log.protein || 0),
      carbs: acc.carbs + (log.carbs || 0),
      fat: acc.fat + (log.fat || 0),
      meals: acc.meals + 1,
    }), { calories: 0, protein: 0, carbs: 0, fat: 0, meals: 0 });

    return {
      totalMeals: totals.meals,
      avgCalories: totals.calories / days,
      avgProtein: totals.protein / days,
      avgCarbs: totals.carbs / days,
      avgFat: totals.fat / days,
      totalCalories: totals.calories,
    };
  }, [data]);

  if (loading) {
    return <View style={styles.loading}><Text style={styles.loadingText}>Carregando...</Text></View>;
  }

  if (!stats) {
    return (
      <View style={styles.empty}>
        <Ionicons name="calendar-outline" size={32} color={COLORS.textMuted} />
        <Text style={styles.emptyText}>Registre refeições por 7 dias para ver o resumo</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="bar-chart" size={18} color={COLORS.primary} />
        <Text style={styles.title}>RESUMO SEMANAL</Text>
      </View>

      <View style={styles.totalRow}>
        <View style={styles.totalItem}>
          <Text style={styles.totalValue}>{stats.totalMeals}</Text>
          <Text style={styles.totalLabel}>Refeições</Text>
        </View>
        <View style={styles.totalDivider} />
        <View style={styles.totalItem}>
          <Text style={[styles.totalValue, { color: COLORS.primary }]}>{Math.round(stats.totalCalories)}</Text>
          <Text style={styles.totalLabel}>kcal totais</Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <StatBar label="Calorias" value={stats.avgCalories} avg={stats.avgCalories} max={2500} color={COLORS.primary} unit=" kcal" />
        <StatBar label="Proteína" value={stats.avgProtein} avg={stats.avgProtein} max={200} color={COLORS.success} unit="g" />
        <StatBar label="Carboidratos" value={stats.avgCarbs} avg={stats.avgCarbs} max={300} color={COLORS.attention} unit="g" />
        <StatBar label="Gordura" value={stats.avgFat} avg={stats.avgFat} max={100} color={COLORS.secondary} unit="g" />
      </View>

      <View style={styles.insightCard}>
        <Ionicons name="bulb" size={16} color={COLORS.attention} />
        <Text style={styles.insightText}>
          {stats.avgProtein < 100 ? 'Considere aumentar a proteína para melhor recuperação muscular.' :
           stats.avgCalories > 2200 ? 'Calorias acima da média. Verifique se está no objetivo.' :
           'Boa consistência! Continue registrando suas refeições.'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  loading: { padding: SPACING.xxl, alignItems: 'center' },
  loadingText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted },
  empty: { padding: SPACING.xxl, alignItems: 'center' },
  emptyText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textMuted, marginTop: SPACING.sm, textAlign: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.lg },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textMuted, letterSpacing: 1 },
  totalRow: { flexDirection: 'row', backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, marginBottom: SPACING.lg, alignItems: 'center' },
  totalItem: { flex: 1, alignItems: 'center' },
  totalValue: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 24, color: COLORS.textTitle },
  totalLabel: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  totalDivider: { width: 1, height: 40, backgroundColor: COLORS.border },
  statsGrid: { gap: SPACING.md, marginBottom: SPACING.lg },
  statRow: { gap: SPACING.xs },
  statHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  statLabel: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textDescription },
  statValue: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textTitle },
  barBg: { height: 8, backgroundColor: COLORS.surfaceOverlay, borderRadius: 4, overflow: 'hidden', position: 'relative' },
  barAvg: { position: 'absolute', height: '100%', backgroundColor: COLORS.textMuted + '40', borderRadius: 4 },
  barFill: { position: 'absolute', height: '100%', borderRadius: 4 },
  statAvg: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted },
  insightCard: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: COLORS.attention + '10', padding: SPACING.md, borderRadius: BORDER_RADIUS.sm },
  insightText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textDescription, flex: 1 },
});
