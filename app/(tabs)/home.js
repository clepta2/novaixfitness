// app/(tabs)/home.js
// Tela Principal - Home - NOVAIX FITNESS

import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../src/constants/colors';
import { SPACING } from '../../src/constants/spacing';
import { DailyWorkoutCard, WaterLogger, GamificationBar, WeeklyProgress } from '../../src/components';
import { useAuth } from '../../src/context/AuthContext';
import { supabase } from '../../src/config/supabase';
import { getGamificationData } from '../../src/services/gamification';
import { layout, typography } from '../../src/styles';

const fallbackDaily = { name: 'QUEIMA SUPERIORES', type: 'HIIT/CALISTENIA', videoId: 'dQw4w9WgXcQ', timer: '00:30:15' };

export default function HomeScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [dailyWorkout, setDailyWorkout] = useState(fallbackDaily);
  const [workouts, setWorkouts] = useState([]);
  const [stats, setStats] = useState({ streak: 0, completed: 0, hours: 0 });
  const [gamification, setGamification] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const [workoutsRes, userWorkoutsRes] = await Promise.all([
        supabase.from('workouts').select('*').order('created_at', { ascending: false }).limit(5),
        user?.id ? supabase.from('user_workouts').select('*').eq('user_id', user.id) : { data: [] },
      ]);

      const wData = workoutsRes.data || [];
      const uwData = userWorkoutsRes.data || [];

      setWorkouts(wData.length > 0 ? wData : [
        { id: '1', name: 'Inferiores Força', category: 'Musculação', duration: 45 },
        { id: '2', name: 'Cardio HIIT', category: 'Cardio', duration: 30 },
        { id: '3', name: 'Peito e Tríceps', category: 'Musculação', duration: 50 },
      ]);

      if (wData.length > 0) {
        const dw = wData[0];
        setDailyWorkout({ 
          id: dw.id,
          name: dw.title || dw.name, 
          type: dw.category || 'Treino', 
          videoId: dw.video_id || 'dQw4w9WgXcQ', 
          timer: `00:${(dw.duration_minutes || dw.duration || 30).toString().padStart(2, '0')}:00` 
        });
      }

      const completed = uwData.filter(w => w.completed).length;
      const totalMin = uwData.reduce((s, w) => s + (w.duration || 0), 0);
      setStats({ streak: calculateStreak(uwData), completed, hours: Math.round(totalMin / 60) });

      const gamData = await getGamificationData(user?.id);
      setGamification(gamData);
    } catch (err) {
      console.error('Erro ao carregar home:', err);
    }
  }, [user?.id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Atleta';

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);

  return (
    <View style={layout.screen}>
      <ScrollView contentContainerStyle={layout.scroll} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />} showsVerticalScrollIndicator={false}>
        <View style={layout.header}>
          <View>
            <Text style={typography.bodyMuted}>BEM-VINDO,</Text>
            <Text style={typography.h2}>{userName.toUpperCase()}!</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: SPACING.sm }}>
            <TouchableOpacity onPress={() => router.push('/chat-coach')} style={layout.headerBtn}>
              <Ionicons name="chatbubbles-outline" size={20} color={COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={signOut} style={layout.headerBtn}>
              <Ionicons name="log-out-outline" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={typography.label}>SEU PLANO DE HOJE:</Text>
        <DailyWorkoutCard
          workout={dailyWorkout}
          onStart={() => router.push({ pathname: '/player', params: { id: dailyWorkout.id } })}
        />

        {gamification && (
          <GamificationBar xp={gamification.totalXP} />
        )}

        <WeeklyProgress />

        <WaterLogger />

        <Text style={typography.label}>TREINOS POPULARES</Text>
        {workouts.slice(0, 3).map((w) => (
          <TouchableOpacity key={w.id} style={styles.workoutItem} onPress={() => router.push({ pathname: '/workout-detail', params: { id: w.id } })}>
            <View style={styles.workoutIcon}><Ionicons name="barbell" size={20} color={COLORS.primary} /></View>
            <View style={styles.workoutInfo}>
              <Text style={typography.h5}>{w.title || w.name}</Text>
              <Text style={typography.caption}>{w.category || 'Treino'} • {w.duration_minutes || w.duration || 45} min</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        ))}

        <Text style={typography.label}>SEU DESEMPENHO</Text>
        <TouchableOpacity style={styles.statsRow} onPress={() => router.push('/analytics')}>
          <View style={styles.statItem}><Ionicons name="flame" size={24} color={COLORS.primary} /><Text style={typography.price}>{stats.streak}</Text><Text style={typography.labelSmall}>STREAK</Text></View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}><Ionicons name="barbell" size={24} color={COLORS.primary} /><Text style={typography.price}>{stats.completed}</Text><Text style={typography.labelSmall}>TREINOS</Text></View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}><Ionicons name="time" size={24} color={COLORS.primary} /><Text style={typography.price}>{stats.hours}h</Text><Text style={typography.labelSmall}>TOTAL</Text></View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}><Ionicons name="bar-chart" size={24} color={COLORS.primary} /><Text style={typography.price}>→</Text><Text style={typography.labelSmall}>VER MAIS</Text></View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.weeklyBtn} onPress={() => router.push('/weekly-progress')}>
          <Ionicons name="calendar-outline" size={20} color={COLORS.primary} />
          <Text style={typography.h5}>Ver progresso semanal</Text>
          <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

function calculateStreak(workouts) {
  const dates = [...new Set(workouts.filter(w => w.completed && w.completed_at).map(w => new Date(w.completed_at).toDateString()))].sort((a, b) => new Date(b) - new Date(a));
  if (!dates.length) return 0;
  let streak = 1;
  for (let i = 1; i < dates.length; i++) {
    if ((new Date(dates[i - 1]) - new Date(dates[i])) / 86400000 === 1) streak++;
    else break;
  }
  return streak;
}

const styles = StyleSheet.create({
  workoutItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: 12, padding: SPACING.lg, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  workoutIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: COLORS.primary + '20', justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md },
  workoutInfo: { flex: 1 },
  statsRow: { flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: 12, padding: SPACING.xl, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  statItem: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, height: 40, backgroundColor: COLORS.border },
  weeklyBtn: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: COLORS.surface, borderRadius: 12, padding: SPACING.lg, marginTop: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
});
