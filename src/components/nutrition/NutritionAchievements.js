// src/components/nutrition/NutritionAchievements.js
// Conquistas de nutrição - NOVAIX FITNESS

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { supabase } from '../../config/supabase';

const ACHIEVEMENTS = [
  { id: 'first_meal', title: 'Primeira Refeição', desc: 'Registre sua primeira refeição', icon: 'restaurant', color: COLORS.primary, requirement: 1 },
  { id: 'week_streak', title: '7 Dias Seguidos', desc: 'Registre refeições por 7 dias', icon: 'flame', color: COLORS.secondary, requirement: 7 },
  { id: 'protein_goal', title: 'Proteína No Alvo', desc: 'Atinja a meta de proteína 5 vezes', icon: 'flash', color: COLORS.success, requirement: 5 },
  { id: 'water_100', title: 'Hidratação Total', desc: 'Beba 2.5L de água por 10 dias', icon: 'water', color: COLORS.info, requirement: 10 },
  { id: 'meal_planner', title: 'Planejador', desc: 'Gere 3 planos alimentares', icon: 'calendar', color: COLORS.primary, requirement: 3 },
  { id: 'recipe_master', title: 'Chef Fitness', desc: 'Gere 5 receitas saudáveis', icon: 'nutrition', color: COLORS.success, requirement: 5 },
];

function AchievementCard({ achievement, unlocked }) {
  return (
    <View style={[styles.card, unlocked && styles.cardUnlocked]}>
      <View style={[styles.iconContainer, { backgroundColor: unlocked ? achievement.color + '20' : COLORS.surfaceOverlay }]}>
        <Ionicons name={achievement.icon} size={24} color={unlocked ? achievement.color : COLORS.textMuted} />
      </View>
      <View style={styles.info}>
        <Text style={[styles.title, unlocked && styles.titleUnlocked]}>{achievement.title}</Text>
        <Text style={styles.desc}>{achievement.desc}</Text>
      </View>
      {unlocked && (
        <View style={styles.badge}>
          <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
        </View>
      )}
    </View>
  );
}

export default function NutritionAchievements({ userId }) {
  const [unlocked, setUnlocked] = useState(() => new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadProgress(); }, [userId]);

  const loadProgress = async () => {
    if (!userId) { setLoading(false); return; }
    try {
      const weekAgo = new Date(Date.now() - 30 * 86400000).toISOString();
      const [meals, water] = await Promise.all([
        supabase.from('meal_logs').select('id, logged_at', { count: 'exact' }).eq('user_id', userId).gte('logged_at', weekAgo),
        supabase.from('water_logs').select('id, logged_at').eq('user_id', userId).gte('logged_at', weekAgo),
      ]);

      const mealDays = new Set((meals.data || []).map(l => new Date(l.logged_at).toDateString())).size;
      const waterDays = new Set((water.data || []).map(l => new Date(l.logged_at).toDateString())).size;
      const mealCount = meals.count || 0;

      const unlockedSet = new Set();
      if (mealCount >= 1) unlockedSet.add('first_meal');
      if (mealDays >= 7) unlockedSet.add('week_streak');
      if (waterDays >= 10) unlockedSet.add('water_100');

      setUnlocked(unlockedSet);
    } catch { }
    finally { setLoading(false); }
  };

  const unlockedCount = unlocked.size;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="trophy" size={18} color={COLORS.primary} />
        <Text style={styles.title}>CONQUISTAS</Text>
        <Text style={styles.count}>{unlockedCount}/{ACHIEVEMENTS.length}</Text>
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${(unlockedCount / ACHIEVEMENTS.length) * 100}%` }]} />
      </View>

      <FlatList
        data={ACHIEVEMENTS}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <AchievementCard achievement={item} unlocked={unlocked.has(item.id)} />}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textMuted, letterSpacing: 1, flex: 1 },
  count: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.primary },
  progressBar: { height: 4, backgroundColor: COLORS.surfaceOverlay, borderRadius: 2, marginBottom: SPACING.lg, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 2 },
  separator: { height: 1, backgroundColor: COLORS.border, marginVertical: SPACING.xs },
  card: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, padding: SPACING.sm, borderRadius: BORDER_RADIUS.sm },
  cardUnlocked: { backgroundColor: COLORS.success + '08' },
  iconContainer: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  info: { flex: 1 },
  title: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: COLORS.textMuted },
  titleUnlocked: { color: COLORS.textTitle },
  desc: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  badge: { padding: SPACING.xs },
});
