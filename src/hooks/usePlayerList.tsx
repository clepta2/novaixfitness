// Hook de lógica da lista de treinos - NOVAIX FITNESS

import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { dailyWorkouts as fallbackWorkouts, activeWorkout as fallbackActive } from '../data/dailyWorkouts';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';
import { getUserPlan } from '../services/planGenerator';
import { shouldAdaptPlan, analyzeUserPerformance, adaptWorkoutPlan, saveAdaptation, getAdaptationReason } from '../services/planAdaptation';

const userLevelMap: Record<string, string> = { beginner: 'Iniciante', intermediate: 'Intermediario', advanced: 'Avancado' };

interface PlayerWorkout {
  id: string;
  time: string;
  name: string;
  focus: string;
  sets: number;
  reps: string;
  intensity: string;
  duration: number;
  videoId: string | null;
  completed: boolean;
  locked: boolean;
  exercises?: unknown[];
}

interface PlayerProfile {
  subscription_status?: string;
  onboarding?: { level?: string };
  [key: string]: unknown;
}

interface UsePlayerListReturn {
  workouts: PlayerWorkout[];
  active: PlayerWorkout | null;
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  startWorkout: (w: PlayerWorkout) => void;
}

function mapPlanToWorkouts(plan: { title?: string; category?: string; focus?: string; duration_minutes?: number; video_id?: string; exercises?: string }[]): PlayerWorkout[] {
  return plan.map((w, i) => {
    let exercises: unknown[] = [];
    try {
      exercises = w.exercises ? JSON.parse(w.exercises) : [];
    } catch {
      exercises = [];
    }
    const firstEx = (exercises as any[])[0] || {};
    return {
      id: w.title || `plan_${i}`, time: `${8 + i * 2}:00`, name: w.title || 'Treino',
      focus: w.category || 'Treino', sets: firstEx.sets || 4, reps: firstEx.reps || '10-12',
      intensity: w.focus || 'Int.', duration: w.duration_minutes || 30,
      videoId: w.video_id || null, completed: false, locked: false, exercises,
    };
  });
}

function mapDbWorkouts(dbWorkouts: { id: string; title?: string; category?: string; duration_minutes?: number; video_id?: string; level?: string; is_premium?: boolean }[], completedIds: Set<string>, isSubscribed: boolean): PlayerWorkout[] {
  return dbWorkouts.map((w, i) => ({
    id: w.id, time: `${8 + i * 2}:00`, name: w.title || w.category || 'Treino',
    focus: w.category || 'Treino', sets: 4, reps: '10-12',
    intensity: w.level || 'Int.', duration: w.duration_minutes || 30,
    videoId: w.video_id || null, completed: completedIds.has(w.id),
    locked: (w.is_premium || false) && !isSubscribed,
  }));
}

async function adaptIfNeeded(userId: string, userPlan: { title?: string; category?: string; focus?: string; duration_minutes?: number; video_id?: string; exercises?: string }[]): Promise<{ title?: string; category?: string; focus?: string; duration_minutes?: number; video_id?: string; exercises?: string }[]> {
  if (!userId || !userPlan?.length) return userPlan;
  if (!(await shouldAdaptPlan(userId))) return userPlan;
  const performance = await analyzeUserPerformance(userId);
  if (!performance) return userPlan;
  const fullPlan = { week: userPlan.map(w => {
    let exercises: unknown[] = [];
    try {
      exercises = w.exercises ? JSON.parse(w.exercises) : [];
    } catch {
      exercises = [];
    }
    return { ...w, exercises };
  }) };
  const adapted = await adaptWorkoutPlan(userId, fullPlan, performance);
  await saveAdaptation(userId, fullPlan, adapted, getAdaptationReason(performance));
  return await getUserPlan(userId);
}

export default function usePlayerList(): UsePlayerListReturn {
  const router = useRouter();
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<PlayerWorkout[]>(fallbackWorkouts as any);
  const [active, setActive] = useState<PlayerWorkout | null>(fallbackActive as any);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [profile, setProfile] = useState<PlayerProfile | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    async function loadProfileData() {
      try {
        const { data } = await supabase.from('profiles').select('subscription_status, onboarding').eq('id', user.id).single();
        if (data) setProfile(data as PlayerProfile);
      } catch (err) {
        if (__DEV__) console.error('Erro ao carregar perfil:', err);
      }
    }
    loadProfileData();
  }, [user?.id]);

  const isSubscribed: boolean = profile?.subscription_status === 'premium' || profile?.subscription_status === 'active';
  const userPhysicalLevel: string | undefined = userLevelMap[profile?.onboarding?.level || ''];

  const fetchDailyWorkouts = useCallback(async (): Promise<void> => {
    if (!user?.id) return;
    try {
      let userPlan = await getUserPlan(user.id);
      if (userPlan?.length > 0) userPlan = await adaptIfNeeded(user.id, userPlan);

      if (userPlan && userPlan.length > 0) {
        const mapped = mapPlanToWorkouts(userPlan);
        setWorkouts(mapped);
        if (mapped.length > 0) setActive(mapped[0]);
      } else {
        const { data: uw } = user?.id
          ? await supabase.from('user_workouts').select('workout_id, completed')
              .eq('user_id', user.id).gte('created_at', new Date().toISOString().slice(0, 10))
          : { data: [] };
        const completedIds = new Set<string>((uw || []).filter((w: { completed: boolean }) => w.completed).map((w: { workout_id: string }) => w.workout_id));
        const { data: dbw } = await supabase.from('workouts')
          .select('id, title, category, duration_minutes, video_id, level, is_premium')
          .order('created_at', { ascending: false }).limit(10);
        if (dbw && dbw.length > 0) {
          let sorted = [...dbw];
          if (userPhysicalLevel) sorted.sort((a, b) => (a.level === userPhysicalLevel ? -1 : b.level === userPhysicalLevel ? 1 : 0));
          const mapped = mapDbWorkouts(sorted.slice(0, 5), completedIds, isSubscribed);
          setWorkouts(mapped);
          const next = mapped.find(w => !w.completed);
          if (next) setActive(next);
        }
      }
    } catch (err) { if (__DEV__) console.warn('Dados fallback carregados'); }
    finally { setLoading(false); setRefreshing(false); }
  }, [user?.id, isSubscribed, userPhysicalLevel]);

  useEffect(() => { if (user && !profile) return; fetchDailyWorkouts(); }, [profile, user, fetchDailyWorkouts]);
  const onRefresh = useCallback((): void => { setRefreshing(true); fetchDailyWorkouts(); }, [fetchDailyWorkouts]);
  const startWorkout = useCallback((w: PlayerWorkout): void => {
    if (w.locked) { Alert.alert('Conteudo Premium', 'Exclusivo para assinantes.', [{ text: 'Ver Planos', onPress: () => router.push('/paywall') }, { text: 'Cancelar', style: 'cancel' }]); return; }
    router.push({ pathname: '/player', params: { id: w.id } });
  }, [router]);

  return { workouts, active, loading, refreshing, onRefresh, startWorkout };
}
