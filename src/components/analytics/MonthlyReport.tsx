import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { SectionCard } from '../ui/SectionCard';
import SpaceBetween from '../ui/SpaceBetween';
import { useColors } from '../../context/ThemeContext';
import { MOCK_MONTHLY_REPORT, MonthlyReportData } from '../../data/analyticsMock';

function StatCard({ icon, value, label, color }: { icon: string; value: number; label: string; color: string }) {
  const colors = useColors();
  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: colors.background, borderRadius: BORDER_RADIUS.md, padding: SPACING.md }, { width: '48%', borderLeftWidth: 3, borderLeftColor: color, gap: 4 }]}>
      <Ionicons name={icon as any} size={18} color={color} />
      <Text style={{ fontFamily: 'Montserrat_800ExtraBold', fontSize: 22, color }}>{value}</Text>
      <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 10, color: colors.textMuted }}>{label}</Text>
    </View>
  );
}

function MiniBarChart({ data, labels, color }: { data: number[]; labels: string[]; color?: string }) {
  const colors = useColors();
  const max = Math.max(...data, 1);
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: 90, backgroundColor: colors.background, borderRadius: BORDER_RADIUS.md, padding: SPACING.sm }}>
      {data.map((v, i) => {
        const isMax = v === max && v > 0;
        return (
          <View key={i} style={{ alignItems: 'center', flex: 1 }}>
            <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 8, color: isMax ? colors.primary : colors.textMuted, marginBottom: 2 }}>{v}</Text>
            <View style={{ width: 18, height: 55, backgroundColor: colors.surfaceOverlay, borderRadius: 4, overflow: 'hidden', justifyContent: 'flex-end' }}>
              <View style={{ width: '100%', height: `${(v / max) * 100}%`, borderRadius: 4, backgroundColor: isMax ? (color || colors.primary) : colors.textMuted + '40' }} />
            </View>
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 9, color: isMax ? colors.primary : colors.textMuted, marginTop: 3, fontWeight: isMax ? '700' : '400' }}>{labels[i]}</Text>
          </View>
        );
      })}
    </View>
  );
}

function CategoryRow({ name, count, total }: { name: string; count: number; total: number }) {
  const colors = useColors();
  const pct = Math.round((count / total) * 100);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm }}>
      <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.textDescription, width: 80 }}>{name}</Text>
      <View style={{ flex: 1, height: 8, backgroundColor: colors.background, borderRadius: 4, overflow: 'hidden' }}>
        <View style={{ width: `${pct}%`, height: '100%', backgroundColor: colors.primary, borderRadius: 4 }} />
      </View>
      <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: colors.textTitle, width: 20, textAlign: 'right' }}>{count}</Text>
      <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 10, color: colors.textMuted, width: 30, textAlign: 'right' }}>{pct}%</Text>
    </View>
  );
}

export default function MonthlyReport({ data }: { data?: MonthlyReportData }) {
  const colors = useColors();
  const r = data || MOCK_MONTHLY_REPORT;
  const [fade] = useState(() => new Animated.Value(0));
  const totalCat = Object.values(r.workoutsByCategory).reduce((a, b) => a + b, 0);

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, [fade]);

  const share = async () => {
    try {
      await Share.share({
        message: `Relatorio ${r.month} ${r.year} - NOVAIX FITNESS\n${r.totalWorkouts} treinos | ${r.totalMinutes} min | ${r.totalCalories} cal`
      });
    } catch {}
  };

  return (
    <Animated.View style={{ opacity: fade, marginBottom: SPACING.md }}>
      <SectionCard>
        <SpaceBetween style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm }}>
            <Ionicons name="document-text" size={18} color={colors.secondary} />
            <Text style={{ fontFamily: 'Montserrat_700Bold', fontSize: 12, color: colors.textTitle, letterSpacing: 1 }}>RELATORIO MENSAL</Text>
          </View>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: colors.primary + '15', paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: BORDER_RADIUS.sm }} onPress={share}>
            <Ionicons name="share-outline" size={16} color={colors.primary} />
            <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: colors.primary }}>Compartilhar</Text>
          </TouchableOpacity>
        </SpaceBetween>

        <View style={{ alignItems: 'center', marginBottom: SPACING.lg }}>
          <Text style={{ fontFamily: 'Montserrat_800ExtraBold', fontSize: 18, color: colors.primary, letterSpacing: 1 }}>{r.month} {r.year}</Text>
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.lg }}>
          <StatCard icon="barbell" value={r.totalWorkouts} label="Treinos" color={colors.primary} />
          <StatCard icon="time" value={r.totalMinutes} label="Minutos" color={colors.info} />
          <StatCard icon="flame" value={r.totalCalories} label="Calorias" color={colors.secondary} />
          <StatCard icon="trophy" value={r.streakBest} label="Melhor streak" color={colors.gold} />
        </View>

        <View style={{ backgroundColor: colors.background, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, marginBottom: SPACING.md, borderWidth: 1, borderColor: colors.gold + '30' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm }}>
            <Ionicons name="star" size={16} color={colors.gold} />
            <Text style={{ fontFamily: 'Montserrat_700Bold', fontSize: 11, color: colors.gold, letterSpacing: 1 }}>MELHOR TREINO</Text>
          </View>
          <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: colors.textTitle }}>{r.bestWorkout.name}</Text>
          <View style={{ flexDirection: 'row', gap: SPACING.md, marginTop: SPACING.xs }}>
            {[
              { icon: 'time', text: `${r.bestWorkout.duration}min` },
              { icon: 'flame', text: `${r.bestWorkout.calories}cal` },
              { icon: 'calendar', text: r.bestWorkout.date },
            ].map((m, i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Ionicons name={m.icon as any} size={12} color={colors.textMuted} />
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: colors.textMuted }}>{m.text}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: colors.primary + '10', padding: SPACING.md, borderRadius: BORDER_RADIUS.md, marginBottom: SPACING.lg }}>
          <Ionicons name="calendar" size={16} color={colors.primary} />
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.textMuted, flex: 1 }}>Dia mais ativo</Text>
          <Text style={{ fontFamily: 'Montserrat_700Bold', fontSize: 14, color: colors.primary }}>{r.mostActiveDay}</Text>
        </View>

        <Text style={{ fontFamily: 'Montserrat_700Bold', fontSize: 11, color: colors.textMuted, letterSpacing: 1, marginBottom: SPACING.md }}>TREINOS POR CATEGORIA</Text>
        {Object.entries(r.workoutsByCategory).map(([name, count]) => (
          <CategoryRow key={name} name={name} count={count} total={totalCat} />
        ))}

        <View style={{ marginTop: SPACING.md }}>
          <Text style={{ fontFamily: 'Montserrat_700Bold', fontSize: 11, color: colors.textMuted, letterSpacing: 1, marginBottom: SPACING.md }}>MINUTOS POR SEMANA</Text>
          <MiniBarChart data={r.minutesByWeek} labels={r.minutesByWeek.map((_, i) => `S${i + 1}`)} />
        </View>

        <View style={{ marginTop: SPACING.md }}>
          <Text style={{ fontFamily: 'Montserrat_700Bold', fontSize: 11, color: colors.textMuted, letterSpacing: 1, marginBottom: SPACING.md }}>TREINOS POR DIA</Text>
          <MiniBarChart data={['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'].map(d => r.workoutsByDay[d] || 0)} labels={['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom']} />
        </View>

        <View style={{ backgroundColor: colors.background, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, marginTop: SPACING.md, borderWidth: 1, borderColor: colors.border }}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: SPACING.sm }}>
            <Ionicons name="flame" size={16} color={colors.gold} />
            <View>
              <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 10, color: colors.textMuted }}>Melhor streak</Text>
              <Text style={{ fontFamily: 'Montserrat_700Bold', fontSize: 14, color: colors.textTitle }}>{r.streakBest} dias</Text>
            </View>
          </View>
          <View style={{ width: 1, height: 28, backgroundColor: colors.border }} />
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: SPACING.sm }}>
            <Ionicons name="flash" size={16} color={colors.primary} />
            <View>
              <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 10, color: colors.textMuted }}>Streak atual</Text>
              <Text style={{ fontFamily: 'Montserrat_700Bold', fontSize: 14, color: colors.textTitle }}>{r.streakCurrent} dias</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: colors.primary, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.md, marginTop: SPACING.md }} onPress={share}>
          <Ionicons name="share-social" size={16} color={colors.background} />
          <Text style={{ fontFamily: 'Montserrat_700Bold', fontSize: 12, color: colors.background, letterSpacing: 1 }}>COMPARTILHAR RELATORIO</Text>
        </TouchableOpacity>
      </SectionCard>
    </Animated.View>
  );
}
