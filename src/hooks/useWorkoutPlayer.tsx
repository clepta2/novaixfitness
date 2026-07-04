// Hook de lógica do player de treino - NOVAIX FITNESS

import { useState, useEffect, useCallback, useRef } from 'react';
import { Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as KeepAwake from 'expo-keep-awake';
import { saveCompleteWorkout } from '../services/workoutSaver';
import { shareWorkout } from '../services/share';
import { awardXP } from '../services/gamification';
import { loadSounds, unloadSounds } from '../services/audioService';
import { isVoiceCoachEnabled, setVoiceCoachEnabled } from '../services/voiceCoach';
import { queueWorkoutCompletion } from '../services/offlineManager';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';
import useNetworkStatus from './useNetworkStatus';
import useWorkoutTimer from './useWorkoutTimer';
import { useTutorial } from './useTutorial';
import { DEMO_WORKOUT } from '../data/workouts';
import { Workout } from '../types';

interface RatingData {
  rating: number;
  comment: string;
}

interface GamResult {
  xpGained?: number;
  newAchievements?: { name: string }[];
}

interface UseWorkoutPlayerReturn {
  workout: Workout | null;
  loading: boolean;
  showRating: boolean;
  voiceEnabled: boolean;
  showXP: boolean;
  xpAmount: number;
  tutorialVisible: boolean;
  tutorialSteps: unknown[];
  handleComplete: () => void;
  handleSkip: () => void;
  timer: ReturnType<typeof useWorkoutTimer>;
  handleWorkoutComplete: () => Promise<void>;
  handleRatingSubmit: (data: RatingData) => Promise<void>;
  handleFinish: () => void;
  toggleVoiceCoach: () => void;
  dismissRating: () => void;
  setShowXP: (val: boolean) => void;
  showCompletion: boolean;
  setShowCompletion: (val: boolean) => void;
}

export default function useWorkoutPlayer(): UseWorkoutPlayerReturn {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const { user } = useAuth();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showRating, setShowRating] = useState<boolean>(false);
  const [showCompletion, setShowCompletion] = useState<boolean>(false);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(isVoiceCoachEnabled());
  const [showXP, setShowXP] = useState<boolean>(false);
  const [xpAmount, setXpAmount] = useState<number>(0);
  const { visible: tutorialVisible, steps: tutorialSteps, handleComplete, handleSkip } = useTutorial('player', true);
  const { isOnline } = useNetworkStatus();
  const timer = useWorkoutTimer(workout);
  const gamRef = useRef<GamResult | null>(null);

  useEffect(() => {
    KeepAwake.activateKeepAwakeAsync();
    loadSounds();
    return () => { KeepAwake.deactivateKeepAwake(); unloadSounds(); };
  }, []);

  useEffect(() => {
    if (!params.id) { setWorkout(DEMO_WORKOUT as Workout); setLoading(false); return; }
    
    async function fetchWorkout() {
      try {
        const { data } = await supabase.from('workouts').select('*, exercises(*)').eq('id', params.id).single();
        setWorkout(data ? {
          id: data.id, name: data.title || data.name,
          duration: data.duration_minutes || data.duration || 30,
          videoId: data.video_id || 'dQw4w9WgXcQ',
          exercises: data.exercises || DEMO_WORKOUT.exercises,
        } as Workout : DEMO_WORKOUT as Workout);
      } catch {
        setWorkout(DEMO_WORKOUT as Workout);
      } finally {
        setLoading(false);
      }
    }
    
    fetchWorkout();
  }, [params.id]);

  const handleWorkoutComplete = useCallback(async (): Promise<void> => {
    const mappedLogs = timer.logs.map(log => ({
      exercise_name: log.exerciseName || '',
      sets_done: log.set,
      reps_done: (log.reps as number) || 0,
      weight_kg: (log.weight as number) || 0,
    }));

    if (!isOnline && user?.id && workout?.id) {
      await queueWorkoutCompletion(user.id, workout.id, mappedLogs, timer.elapsed);
      Alert.alert('Salvo offline', 'Treino será sincronizado quando você estiver online.');
      timer.stopWorkout();
      router.back();
      return;
    }

    try {
      gamRef.current = await saveCompleteWorkout(user?.id, workout, mappedLogs, timer.elapsed);
      if (gamRef.current?.xpGained && gamRef.current.xpGained > 0) {
        setXpAmount(gamRef.current.xpGained);
        setShowXP(true);
      }
      setShowRating(true);
    } catch (err) {
      if (__DEV__) console.error('Erro ao salvar treino:', err);
      Alert.alert('Erro', 'Não foi possível salvar o treino. Tente novamente.');
      timer.stopWorkout();
      router.back();
    }
  }, [isOnline, user, workout, timer, router]);

  const handleRatingSubmit = useCallback(async ({ rating, comment }: RatingData): Promise<void> => {
    if (user?.id && workout?.id) {
      try {
        await supabase.from('user_workouts').upsert(
          { user_id: user.id, workout_id: workout.id, rating, notes: comment },
          { onConflict: 'user_id,workout_id' }
        );
      } catch {}
    }
    if (user?.id) await awardXP(user.id, 'WORKOUT_RATED');
    setShowRating(false);
    setShowCompletion(true);
  }, [user, workout]);

  useEffect(() => {
    if (timer.phase === 'completed') handleWorkoutComplete();
  }, [timer.phase, handleWorkoutComplete]);

  const handleFinish = useCallback((): void => {
    Alert.alert('Finalizar', 'Salvar progresso e sair?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Finalizar', style: 'destructive', onPress: handleWorkoutComplete },
    ]);
  }, [handleWorkoutComplete]);

  const toggleVoiceCoach = useCallback((): void => {
    const v = !voiceEnabled;
    setVoiceEnabled(v);
    setVoiceCoachEnabled(v);
  }, [voiceEnabled]);

  const dismissRating = useCallback((): void => {
    setShowRating(false);
    timer.stopWorkout();
    router.back();
  }, [timer, router]);

  return {
    workout, loading, showRating, voiceEnabled, showXP, xpAmount,
    tutorialVisible, tutorialSteps, handleComplete, handleSkip,
    timer, handleWorkoutComplete, handleRatingSubmit, handleFinish,
    toggleVoiceCoach, dismissRating, setShowXP,
    showCompletion, setShowCompletion,
  };
}
