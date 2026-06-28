// src/components/social/WorkoutStreak.js
// Sequência de treinos com visual impactante - NOVAIX FITNESS

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { supabase } from '../../config/supabase';
import StreakProgress from './StreakProgress';

const STREAK_LEVELS = [
  { min: 0, label: 'Iniciante', icon: 'flame-outline', color: COLORS.textMuted },
  { min: 3, label: 'Dedicado', icon: 'flame', color: COLORS.attention },
  { min: 7, label: 'Consistente', icon: 'flame', color: COLORS.secondary },
  { min: 14, label: 'Atleta', icon: 'flame', color: COLORS.primary },
  { min: 30, label: 'Lenda', icon: 'trophy', color: COLORS.primary },
];

function FlameIcon({ level, size = 24 }) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (level >= 7) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.2, duration: 500, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [level]);

  const config = STREAK_LEVELS.slice().reverse().find(l => level >= l.min) || STREAK_LEVELS[0];

  return (
    <Animated.View style={[styles.flameContainer, { transform: [{ scale: pulseAnim }] }]}>
      <Ionicons name={config.icon} size={size} color={config.color} />
    </Animated.View>
  );
}

export default function WorkoutStreak({ userId }) {
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [weekDots, setWeekDots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadStreak(); }, [userId]);

  const loadStreak = async () => {
    if (!userId) { setLoading(false); return; }
    try {
      const { data } = await supabase
        .from('user_workouts')
        .select('completed_at')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false })
        .limit(90);

      if (!data || data.length === 0) { setLoading(false); return; }

      const uniqueDays = [...new Set(data.map(l => new Date(l.completed_at).toDateString()))];

      let current = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      for (let i = 0; i < 90; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(checkDate.getDate() - i);
        if (uniqueDays.includes(checkDate.toDateString())) {
          current++;
        } else if (i > 0) break;
      }

      setStreak(current);

      let best = 0, curr = 0;
      for (let i = uniqueDays.length - 1; i >= 0; i--) {
        if (i === uniqueDays.length - 1) { curr = 1; }
        else {
          const diff = (new Date(uniqueDays[i + 1]) - new Date(uniqueDays[i])) / 86400000;
          if (diff === 1) curr++;
          else { best = Math.max(best, curr); curr = 1; }
        }
      }
      setBestStreak(Math.max(best, curr));

      const last7 = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        last7.push({
          day: d.toLocaleDateString('pt-BR', { weekday: 'short' }).slice(0, 3),
          active: uniqueDays.includes(d.toDateString()),
          isToday: i === 0,
        });
      }
      setWeekDots(last7);
    } catch { }
    finally { setLoading(false); }
  };

  const config = STREAK_LEVELS.slice().reverse().find(l => streak >= l.min) || STREAK_LEVELS[0];
  const nextLevel = STREAK_LEVELS.find(l => streak < l.min);
  const progress = nextLevel ? (streak / nextLevel.min) * 100 : 100;

  if (loading) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FlameIcon level={streak} size={28} />
        <View style={styles.headerInfo}>
          <Text style={styles.streakNumber}>{streak}</Text>
          <Text style={styles.streakLabel}>dias seguidos</Text>
        </View>
        <View style={[styles.levelBadge, { backgroundColor: config.color + '20' }]}>
          <Text style={[styles.levelText, { color: config.color }]}>{config.label}</Text>
        </View>
      </View>

      <View style={styles.weekRow}>
        {weekDots.map((d, i) => (
          <View key={i} style={styles.dayCol}>
            <Text style={[styles.dayLabel, d.isToday && { color: COLORS.primary, fontFamily: 'Montserrat_600SemiBold' }]}>{d.day}</Text>
            <View style={[styles.dayDot, d.active && styles.dayDotActive, d.isToday && styles.dayDotToday]} />
          </View>
        ))}
      </View>

      {nextLevel && <StreakProgress streak={streak} nextLevel={nextLevel} config={config} />}

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{bestStreak}</Text>
          <Text style={styles.statLabel}>Recorde</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: COLORS.primary }]}>{streak}</Text>
          <Text style={styles.statLabel}>Atual</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{STREAK_LEVELS.length}</Text>
          <Text style={styles.statLabel}>Níveis</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginBottom: SPACING.lg },
  flameContainer: { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.primary + '15', justifyContent: 'center', alignItems: 'center' },
  headerInfo: { flex: 1 },
  streakNumber: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 32, color: COLORS.primary },
  streakLabel: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted },
  levelBadge: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: BORDER_RADIUS.sm },
  levelText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11 },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.lg },
  dayCol: { alignItems: 'center', gap: SPACING.xs },
  dayLabel: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted },
  dayDot: { width: 14, height: 14, borderRadius: 7, backgroundColor: COLORS.surfaceOverlay },
  dayDotActive: { backgroundColor: COLORS.primary },
  dayDotToday: { borderWidth: 2, borderColor: COLORS.primary },
  statsRow: { flexDirection: 'row', backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, padding: SPACING.md },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontFamily: 'Montserrat_700Bold', fontSize: 18, color: COLORS.textTitle },
  statLabel: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted, marginTop: 2 },
  statDivider: { width: 1, height: 30, backgroundColor: COLORS.border },
});
