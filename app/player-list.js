// app/player-list.js
// Lista de Treinos Diarios - NOVAIX FITNESS

import { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, RefreshControl, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../src/constants/colors';

import { WorkoutListView, ErrorBoundary } from '../src/components';
import { dailyWorkouts as fallbackWorkouts, activeWorkout as fallbackActive } from '../src/data/dailyWorkouts';
import { useAuth } from '../src/context/AuthContext';
import { supabase } from '../src/config/supabase';
import { getUserPlan } from '../src/services/planGenerator';
import { shouldAdaptPlan, analyzeUserPerformance, adaptWorkoutPlan, saveAdaptation, getAdaptationReason } from '../src/services/planAdaptation';
import { layout } from '../src/styles';

const userLevelMap = {
  beginner: 'Iniciante',
  intermediate: 'Intermediário',
  advanced: 'Avançado'
};

export default function PlayerListScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState(fallbackWorkouts);
  const [active, setActive] = useState(fallbackActive);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function loadProfile() {
      if (!user?.id) return;
      try {
        const { data } = await supabase
          .from('profiles')
          .select('subscription_status, onboarding')
          .eq('id', user.id)
          .single();
        if (data) setProfile(data);
      } catch (err) {
        if (__DEV__) console.error('Erro ao carregar perfil na lista de treinos:', err);
      }
    }
    loadProfile();
  }, [user?.id]);

  const isSubscribed = profile?.subscription_status === 'premium' || profile?.subscription_status === 'active';
  const userPhysicalLevel = userLevelMap[profile?.onboarding?.level];

  const fetchDailyWorkouts = useCallback(async () => {
    try {
      let userPlan = user?.id ? await getUserPlan(user.id) : null;

      if (user?.id && userPlan && userPlan.length > 0) {
        const needsAdapt = await shouldAdaptPlan(user.id);
        if (needsAdapt) {
          const performance = await analyzeUserPerformance(user.id);
          if (performance) {
            const fullPlan = { week: userPlan.map(w => ({ ...w, exercises: w.exercises ? JSON.parse(w.exercises) : [] })) };
            const adapted = await adaptWorkoutPlan(user.id, fullPlan, performance);
            const reason = getAdaptationReason(performance);
            await saveAdaptation(user.id, fullPlan, adapted, reason);
            userPlan = await getUserPlan(user.id);
          }
        }
      }

      if (userPlan && userPlan.length > 0) {
        const mapped = userPlan.map((w, i) => {
          const exercises = w.exercises ? JSON.parse(w.exercises) : [];
          const firstEx = exercises[0] || {};
          return {
            id: w.id || `plan_${i}`,
            time: `${8 + i * 2}:00`,
            name: w.title || 'Treino',
            focus: w.category || 'Treino',
            sets: firstEx.sets || 4,
            reps: firstEx.reps || '10-12',
            intensity: w.focus || 'Int.',
            duration: w.duration_minutes || 30,
            videoId: w.video_id || null,
            completed: false,
            locked: false,
            exercises,
          };
        });
        setWorkouts(mapped);
        if (mapped.length > 0) setActive(mapped[0]);
      } else {
        const { data: userWorkouts } = user?.id
          ? await supabase.from('user_workouts').select('workout_id, completed, completed_at').eq('user_id', user.id).gte('created_at', new Date().toISOString().slice(0, 10))
          : { data: [] };
        const completedIds = new Set((userWorkouts || []).filter(w => w.completed).map(w => w.workout_id));
        const { data: dbWorkouts } = await supabase.from('workouts').select('id, title, category, duration_minutes, video_id, level, is_premium').order('created_at', { ascending: false }).limit(10);
        if (dbWorkouts && dbWorkouts.length > 0) {
          let sorted = [...dbWorkouts];
          if (userPhysicalLevel) sorted.sort((a, b) => (a.level === userPhysicalLevel ? -1 : b.level === userPhysicalLevel ? 1 : 0));
          const mapped = sorted.slice(0, 5).map((w, i) => ({
            id: w.id, time: `${8 + i * 2}:00`, name: w.title || w.category || 'Treino', focus: w.category || 'Treino',
            sets: 4, reps: '10-12', intensity: w.level || 'Int.', duration: w.duration_minutes || 30, videoId: w.video_id || null,
            completed: completedIds.has(w.id), locked: (w.is_premium || false) && !isSubscribed,
          }));
          setWorkouts(mapped);
          const next = mapped.find(w => !w.completed);
          if (next) setActive(next);
        }
      }
    } catch (err) {
      if (__DEV__) console.warn('Dados fallback carregados');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id, isSubscribed, userPhysicalLevel]);

  useEffect(() => {
    if (user && !profile) return;
    fetchDailyWorkouts();
  }, [profile, user, fetchDailyWorkouts]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDailyWorkouts();
  }, [fetchDailyWorkouts]);

  const startWorkout = (workout) => {
    if (workout.locked) {
      Alert.alert(
        'Conteúdo Premium 🔒',
        'Este treino é exclusivo para assinantes Premium. Libere agora seu acesso a todos os treinos e programas!',
        [
          { text: 'Mais tarde', style: 'cancel' },
          { text: 'Ver Planos', onPress: () => router.push('/paywall') }
        ]
      );
      return;
    }
    router.push({ pathname: '/player', params: { id: workout.id } });
  };

  if (loading) {
    return (
      <View style={[layout.screen, styles.centered]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ErrorBoundary screenName="PlayerList">
    <View style={layout.screen}>
      <ScrollView
        contentContainerStyle={layout.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
        showsVerticalScrollIndicator={false}
      >
        <WorkoutListView
          dailyWorkouts={workouts}
          activeWorkout={active}
          startWorkout={startWorkout}
        />
      </ScrollView>
    </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
