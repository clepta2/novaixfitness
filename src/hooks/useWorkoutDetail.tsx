// Hook de lógica para Detalhe do Treino - NOVAIX FITNESS

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import { shareWorkout } from '../services/share';
import { cacheWorkoutDetail, getCachedWorkoutDetail, isWorkoutCached } from '../services/offline';
import { queueFavoriteAction } from '../services/offlineManager';
import useNetworkStatus from './useNetworkStatus';
import { fallbackWorkout } from '../data/workouts';
import { Workout, Exercise, Profile } from '../types';

interface Router {
  push: (url: { pathname: string; params?: Record<string, string> }) => void;
  back: () => void;
  [key: string]: unknown;
}

interface UseWorkoutDetailReturn {
  workout: Workout | null;
  profile: Profile | null;
  loading: boolean;
  expanded: number | null;
  setExpanded: (val: number | null) => void;
  showVideo: boolean;
  setShowVideo: (val: boolean) => void;
  isFavorite: boolean;
  showOptions: boolean;
  setShowOptions: (val: boolean) => void;
  showRating: boolean;
  setShowRating: (val: boolean) => void;
  isOffline: boolean;
  isOnline: boolean;
  exercises: Exercise[];
  totalSets: number;
  toggleFavorite: () => Promise<void>;
  handleOption: (opt: string) => Promise<void>;
  handleStart: (router: Router) => Promise<void>;
  handleRating: (data: { rating: number; comment: string }) => Promise<void>;
}

export function useWorkoutDetail(id: string): UseWorkoutDetailReturn {
  const { user } = useAuth();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [showVideo, setShowVideo] = useState<boolean>(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [showRating, setShowRating] = useState<boolean>(false);
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const { isOnline } = useNetworkStatus();

  useEffect(() => {
    if (!id) return;
    async function loadWorkoutDetail() {
      try {
        const { data, error } = await supabase.from('workouts').select('*').eq('id', id).maybeSingle();
        const w = error || !data ? null : (data as Workout);
        if (w) {
          setWorkout(w);
          await cacheWorkoutDetail(w);
        } else {
          const cached = await getCachedWorkoutDetail(id);
          if (cached) setWorkout(cached as Workout);
        }
      } catch {
        const cached = await getCachedWorkoutDetail(id);
        if (cached) setWorkout(cached as Workout);
      } finally {
        setLoading(false);
      }
    }
    loadWorkoutDetail();
    isWorkoutCached(id).then(setIsOffline).catch(() => setIsOffline(false));
  }, [id]);

  useEffect(() => {
    if (!user?.id) return;
    async function loadUserData() {
      try {
        const { data } = await supabase.from('profiles').select('subscription_status').eq('id', user.id!).maybeSingle();
        if (data) setProfile(data as Profile);
      } catch {}
      
      if (id) {
        try {
          const { data } = await supabase.from('favorites').select('id').eq('user_id', user.id!).eq('workout_id', id).maybeSingle();
          setIsFavorite(!!data);
        } catch {}
      }
    }
    loadUserData();
  }, [user?.id, id]);

  const toggleFavorite = useCallback(async (): Promise<void> => {
    if (!user?.id || !id) return;
    try {
      if (isOnline) {
        if (isFavorite) await supabase.from('favorites').delete().eq('user_id', user.id).eq('workout_id', id);
        else await supabase.from('favorites').insert({ user_id: user.id, workout_id: id });
      } else {
        await queueFavoriteAction(user.id, id, !isFavorite ? 'add' : 'remove');
      }
      setIsFavorite(!isFavorite);
    } catch { Alert.alert('Erro', 'Falha ao atualizar favorito'); }
  }, [user?.id, id, isFavorite, isOnline]);

  const handleOption = useCallback(async (opt: string): Promise<void> => {
    setShowOptions(false);
    if (opt === 'share') shareWorkout(workout);
    if (opt === 'rate') return setShowRating(true);
    if (opt === 'save') {
      await cacheWorkoutDetail(workout);
      setIsOffline(true);
      Alert.alert('Salvo', 'Treino disponível offline');
    }
  }, [workout]);

  const handleStart = useCallback(async (router: Router): Promise<void> => {
    if (!user?.id || !id) return;
    const isSubscribed = profile?.subscription_status === 'premium' || profile?.subscription_status === 'active';
    const isLocked = ((workout as any)?.is_premium || false) && !isSubscribed;
    if (isLocked) {
      Alert.alert('Conteúdo Premium 🔒', 'Este treino é exclusivo para assinantes Premium.',
        [{ text: 'Mais tarde', style: 'cancel' }, { text: 'Ver Planos', onPress: () => router.push({ pathname: '/paywall' }) }]);
      return;
    }
    try {
      const { data } = await supabase.from('user_workouts').insert({
        user_id: user.id, workout_id: id, completed: false,
        duration: workout?.duration_minutes || workout?.duration || 0,
      }).select('id').maybeSingle();
      router.push({ pathname: '/player', params: { id, user_workout_id: data?.id } });
    } catch { router.push({ pathname: '/player', params: { id } }); }
  }, [user?.id, id, workout, profile]);

  const handleRating = useCallback(async ({ rating, comment }: { rating: number; comment: string }): Promise<void> => {
    if (!user?.id || !id) return;
    try {
      await supabase.from('user_workouts').upsert(
        { user_id: user.id, workout_id: id, rating, notes: comment },
        { onConflict: 'user_id,workout_id' }
      );
      Alert.alert('Obrigado!', 'Avaliação registrada.');
    } catch { Alert.alert('Erro', 'Falha ao salvar.'); }
  }, [user?.id, id]);

  const exercises: Exercise[] = workout?.exercises || [];
  const totalSets: number = useMemo(() => exercises.reduce((sum, ex) => sum + (ex.sets || 0), 0), [exercises]);

  return {
    workout, profile, loading, expanded, setExpanded,
    showVideo, setShowVideo, isFavorite, showOptions, setShowOptions,
    showRating, setShowRating, isOffline, isOnline, exercises, totalSets,
    toggleFavorite, handleOption, handleStart, handleRating,
  };
}
