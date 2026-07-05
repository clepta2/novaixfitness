// src/components/nutrition/NutritionStreak.js
// Sequência de dias atingindo metas - NOVAIX FITNESS

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { supabase } from '../../config/supabase';
import NutritionProgress from './NutritionProgress';

const STREAK_BADGES = [
  { days: 3, label: 'Iniciante', icon: 'flame', color: COLORS.attention },
  { days: 7, label: 'Consistente', icon: 'flame', color: COLORS.secondary },
  { days: 14, label: 'Dedicado', icon: 'flame', color: COLORS.primary },
  { days: 30, label: 'Mestre', icon: 'trophy', color: COLORS.success },
  { days: 60, label: 'Lenda', icon: 'star', color: COLORS.primary },
];

export default function NutritionStreak({ userId }) {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [weekDots, setWeekDots] = useState<any[]>([]);

  useEffect(() => { loadStreak(); }, [userId]);

  const loadStreak = async () => {
    if (!userId) return;
    try {
      const logs = await supabase.from('meal_logs')
        .select('logged_at')
        .eq('user_id', userId)
        .order('logged_at', { ascending: false })
        .limit(60);

      if (!logs.data || logs.data.length === 0) return;

      const uniqueDays = [...new Set(logs.data.map(l => new Date(l.logged_at).toDateString()))];

      let streak = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      for (let i = 0; i < 60; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(checkDate.getDate() - i);
        if (uniqueDays.includes(checkDate.toDateString())) {
          streak++;
        } else if (i > 0) {
          break;
        }
      }

      setCurrentStreak(streak);

      let best = 0;
      let current = 0;
      for (let i = uniqueDays.length - 1; i >= 0; i--) {
        if (i === uniqueDays.length - 1) {
          current = 1;
        } else {
          const curr = new Date(uniqueDays[i]);
          const prev = new Date(uniqueDays[i + 1]);
          const diff = (prev.getTime() - curr.getTime()) / 86400000;
          if (diff === 1) {
            current++;
          } else {
            best = Math.max(best, current);
            current = 1;
          }
        }
      }
      best = Math.max(best, current);
      setBestStreak(best);

      const last7 = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        last7.push({
          day: d.toLocaleDateString('pt-BR', { weekday: 'short' }),
          active: uniqueDays.includes(d.toDateString()),
          isToday: i === 0,
        });
      }
      setWeekDots(last7);
    } catch (err) {
      if (__DEV__) console.error('Erro ao carregar streak:', err);
    }
  };

  const currentBadge = STREAK_BADGES.slice().reverse().find(b => currentStreak >= b.days);
  const nextBadge = STREAK_BADGES.find(b => currentStreak < b.days);
  const progressToNext = nextBadge ? (currentStreak / nextBadge.days) * 100 : 100;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="flame" size={18} color={COLORS.primary} />
        <Text style={styles.title}>SEQUÊNCIA</Text>
      </View>

      <View style={styles.streakCard}>
        <View style={styles.streakMain}>
          {currentBadge && (
            <View style={[styles.badgeIcon, { backgroundColor: currentBadge.color + '20' }]}>
              <Ionicons name={currentBadge.icon as any} size={28} color={currentBadge.color} />
            </View>
          )}
          <View style={styles.streakInfo}>
            <Text style={styles.streakNumber}>{currentStreak}</Text>
            <Text style={styles.streakLabel}>dias seguidos</Text>
            {currentBadge && (
              <View style={[styles.badgeTag, { backgroundColor: currentBadge.color + '20' }]}>
                <Text style={[styles.badgeText, { color: currentBadge.color }]}>{currentBadge.label}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{bestStreak}</Text>
            <Text style={styles.statLabel}>Recorde</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: COLORS.primary }]}>{currentStreak}</Text>
            <Text style={styles.statLabel}>Atual</Text>
          </View>
        </View>
      </View>

      <View style={styles.weekRow}>
        {weekDots.map((d, i) => (
          <View key={i} style={styles.dayCol}>
            <Text style={[styles.dayLabel, d.isToday && styles.dayLabelToday]}>{d.day}</Text>
            <View style={[styles.dayDot, d.active && styles.dayDotActive, d.isToday && styles.dayDotToday]} />
          </View>
        ))}
      </View>

      {nextBadge && <NutritionProgress streak={currentStreak} nextBadge={nextBadge} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textMuted, letterSpacing: 1 },
  streakCard: { backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, marginBottom: SPACING.md },
  streakMain: { flexDirection: 'row', alignItems: 'center', gap: SPACING.lg, marginBottom: SPACING.md },
  badgeIcon: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
  streakInfo: { flex: 1 },
  streakNumber: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 36, color: COLORS.primary },
  streakLabel: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted },
  badgeTag: { alignSelf: 'flex-start', paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: BORDER_RADIUS.sm, marginTop: SPACING.xs },
  badgeText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10 },
  statsRow: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: SPACING.md },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontFamily: 'Montserrat_700Bold', fontSize: 18, color: COLORS.textTitle },
  statLabel: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted, marginTop: 2 },
  statDivider: { width: 1, height: 30, backgroundColor: COLORS.border },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.md },
  dayCol: { alignItems: 'center', gap: SPACING.xs },
  dayLabel: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted },
  dayLabelToday: { fontFamily: 'Montserrat_600SemiBold', color: COLORS.primary },
  dayDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.surfaceOverlay },
  dayDotActive: { backgroundColor: COLORS.primary },
  dayDotToday: { borderWidth: 2, borderColor: COLORS.primary },
});
