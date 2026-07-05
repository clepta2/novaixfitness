import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { supabase } from '../../config/supabase';
import React, { useState, useEffect, useRef } from 'react';
import { SECTION_TITLES, MUSCLES } from '../../data/profileTexts';

interface Props { userId?: string }

export default function MuscleMiniRadar({ userId }: Props) {
  const [data, setData] = useState<any>(null);
  const animatedValues = useRef(MUSCLES.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    if (!userId) return;
    async function load() {
      try {
        const thirtyAgo = new Date(Date.now() - 30 * 86400000).toISOString();
        const sixtyAgo = new Date(Date.now() - 60 * 86400000).toISOString();

        const [currentWorkouts, prevWorkouts] = await Promise.all([
          supabase.from('user_workouts').select('workouts(category)').eq('user_id', userId).gte('completed_at', thirtyAgo),
          supabase.from('user_workouts').select('workouts(category)').eq('user_id', userId).gte('completed_at', sixtyAgo).lt('completed_at', thirtyAgo),
        ]);

        const processWorkouts = (workouts: any[]) => {
          const counts: Record<string, number> = {};
          (workouts || []).forEach(w => {
            const cat = (w.workouts?.category || '').toLowerCase();
            if (cat.includes('peito') || cat.includes('chest')) counts.chest = (counts.chest || 0) + 1;
            if (cat.includes('costa') || cat.includes('back')) counts.back = (counts.back || 0) + 1;
            if (cat.includes('perna') || cat.includes('leg')) counts.legs = (counts.legs || 0) + 1;
            if (cat.includes('ombro') || cat.includes('shoulder')) counts.shoulders = (counts.shoulders || 0) + 1;
            if (cat.includes('braço') || cat.includes('arm') || cat.includes('biceps')) counts.arms = (counts.arms || 0) + 1;
            if (cat.includes('abdom') || cat.includes('core')) counts.core = (counts.core || 0) + 1;
          });
          return counts;
        };

        const currentCounts = processWorkouts(currentWorkouts.data);
        const prevCounts = processWorkouts(prevWorkouts.data);
        const max = Math.max(...Object.values(currentCounts), 1);

        const balanced = MUSCLES.map(m => {
          const current = currentCounts[m.key] || 0;
          const prev = prevCounts[m.key] || 0;
          const value = Math.round((current / max) * 100);
          const trend = current > prev ? 'up' : current < prev ? 'down' : 'stable';
          const change = current - prev;
          return { ...m, value, trend, change };
        });

        setData(balanced);

        balanced.forEach((m, i) => {
          Animated.spring(animatedValues[i], { toValue: m.value / 100, tension: 40, friction: 8, delay: i * 50, useNativeDriver: false }).start();
        });
      } catch {}
    }
    load();
  }, [userId]);

  if (!data) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="pulse" size={16} color={COLORS.primary} />
        <Text style={styles.title}>{SECTION_TITLES.muscleBalance}</Text>
        <View style={styles.legend}>
          <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: COLORS.success }]} /><Text style={styles.legendText}>↑</Text></View>
          <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: COLORS.attention }]} /><Text style={styles.legendText}>↓</Text></View>
        </View>
      </View>
      <View style={styles.bars}>
        {data.map((m, i) => (
          <View key={m.key} style={styles.row}>
            <Text style={styles.label}>{m.label}</Text>
            <View style={styles.barTrack}>
              <Animated.View style={[styles.barFill, { width: animatedValues[i].interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }), backgroundColor: m.value > 70 ? COLORS.success : m.value > 30 ? COLORS.primary : COLORS.attention }]} />
            </View>
            <Text style={styles.value}>{m.value}%</Text>
            {m.trend === 'up' && <Ionicons name="trending-up" size={12} color={COLORS.success} />}
            {m.trend === 'down' && <Ionicons name="trending-down" size={12} color={COLORS.attention} />}
            {m.change !== 0 && <Text style={[styles.change, { color: m.trend === 'up' ? COLORS.success : COLORS.attention }]}>{m.change > 0 ? '+' : ''}{m.change}</Text>}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  header: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: SPACING.md },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 11, color: COLORS.textMuted, letterSpacing: 1, flex: 1 },
  legend: { flexDirection: 'row', gap: SPACING.sm },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  legendDot: { width: 6, height: 6, borderRadius: 3 },
  legendText: { fontSize: 10, color: COLORS.textMuted },
  bars: { gap: SPACING.xs },
  row: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  label: { fontFamily: 'Inter_600SemiBold', fontSize: 11, color: COLORS.textDescription, width: 60 },
  barTrack: { flex: 1, height: 6, backgroundColor: COLORS.background, borderRadius: 3, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 3 },
  value: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.textMuted, width: 30, textAlign: 'right' },
  change: { fontFamily: 'Montserrat_600SemiBold', fontSize: 9, width: 24, textAlign: 'right' },
});
