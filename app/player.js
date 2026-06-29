// app/player.js
// Tela de Player de Treino - NOVAIX FITNESS

import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as KeepAwake from 'expo-keep-awake';
import { COLORS } from '../src/constants/colors';
import { ICON_SIZES } from '../src/constants/spacing';
import { WorkoutTimer, ExerciseProgress, RestOverlay, WorkoutControls, RatingModal, TutorialOverlay, XPFloating, ErrorBoundary } from '../src/components';
import { saveCompleteWorkout } from '../src/services/workoutSaver';
import { shareWorkout } from '../src/services/share';
import { awardActionXP } from '../src/services/gamification';
import { loadSounds, unloadSounds } from '../src/services/audioService';
import { isVoiceCoachEnabled, setVoiceCoachEnabled } from '../src/services/voiceCoach';
import { useAuth } from '../src/context/AuthContext';
import { supabase } from '../src/config/supabase';
import { queueWorkoutCompletion } from '../src/services/offlineManager';
import useNetworkStatus from '../src/hooks/useNetworkStatus';
import useWorkoutTimer from '../src/hooks/useWorkoutTimer';
import { useTutorial } from '../src/hooks/useTutorial';
import { layout, typography } from '../src/styles';
import { DEMO_WORKOUT } from '../src/data/workouts';
import { styles } from '../src/styles/playerStyles';

export default function PlayerScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuth();
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRating, setShowRating] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(isVoiceCoachEnabled());
  const [showXP, setShowXP] = useState(false);
  const [xpAmount, setXpAmount] = useState(0);
  const { visible: tutorialVisible, steps: tutorialSteps, handleComplete, handleSkip } = useTutorial('player', true);
  const { isOnline } = useNetworkStatus();
  const timer = useWorkoutTimer(workout);

  useEffect(() => {
    KeepAwake.activateKeepAwakeAsync();
    loadSounds();
    return () => { KeepAwake.deactivateKeepAwakeAsync(); unloadSounds(); };
  }, []);

  useEffect(() => {
    if (!params.id) { setWorkout(DEMO_WORKOUT); setLoading(false); return; }
    supabase.from('workouts').select('*, exercises(*)').eq('id', params.id).single()
      .then(({ data }) => {
        setWorkout(data ? {
          id: data.id, name: data.title || data.name,
          duration: data.duration_minutes || data.duration || 30,
          videoId: data.video_id || 'dQw4w9WgXcQ',
          exercises: data.exercises || DEMO_WORKOUT.exercises,
        } : DEMO_WORKOUT);
      })
      .catch(() => setWorkout(DEMO_WORKOUT))
      .finally(() => setLoading(false));
  }, [params.id]);

  const gamRef = { current: null };
  const handleWorkoutComplete = async () => {
    if (!isOnline && user?.id && workout?.id) {
      await queueWorkoutCompletion(user.id, workout.id, timer.logs, timer.elapsed);
      Alert.alert('Salvo offline', 'Treino sera sincronizado quando voce estiver online.');
      timer.stopWorkout();
      router.back();
      return;
    }
    gamRef.current = await saveCompleteWorkout(user?.id, workout, timer.logs, timer.elapsed);
    if (gamRef.current?.xpGained > 0) { setXpAmount(gamRef.current.xpGained); setShowXP(true); }
    setShowRating(true);
  };

  const handleRatingSubmit = async ({ rating, comment }) => {
    if (user?.id && workout?.id) await supabase.from('user_workouts').upsert({ user_id: user.id, workout_id: workout.id, rating, notes: comment }, { onConflict: 'user_id,workout_id' }).catch(() => {});
    if (user?.id) await awardActionXP(user.id, 'WORKOUT_RATED');
    setShowRating(false);
    const done = () => { timer.stopWorkout(); router.back(); };
    const g = gamRef.current;
    Alert.alert('Obrigado!', `Avaliação registrada.${g?.xpGained > 0 ? `\n+${g.xpGained} XP` : ''}${g?.newAchievements?.length > 0 ? `\nConquista: ${g.newAchievements[0].name}` : ''}`, [
      { text: 'Compartilhar', onPress: () => { shareWorkout(workout); done(); } },
      { text: 'OK', onPress: done },
    ]);
  };

  useEffect(() => { if (timer.phase === 'completed') handleWorkoutComplete(); }, [timer.phase]);

  const handleFinish = () => {
    Alert.alert('Finalizar', 'Salvar progresso e sair?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Finalizar', style: 'destructive', onPress: handleWorkoutComplete },
    ]);
  };

  const toggleVoiceCoach = useCallback(() => {
    const v = !voiceEnabled;
    setVoiceEnabled(v);
    setVoiceCoachEnabled(v);
  }, [voiceEnabled]);

  if (loading) return <View style={[layout.screen, styles.centered]}><View style={styles.loadingDot} /></View>;

  if (timer.phase === 'idle') {
    return (
      <View style={layout.screen}>
        <TutorialOverlay visible={tutorialVisible} steps={tutorialSteps} onComplete={handleComplete} onSkip={handleSkip} />
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={typography.h2}>{workout?.name || 'Treino'}</Text>
            <TouchableOpacity onPress={toggleVoiceCoach} style={styles.voiceToggle} accessibilityLabel={voiceEnabled ? 'Desativar coach de voz' : 'Ativar coach de voz'} accessibilityRole="button">
              <Ionicons name={voiceEnabled ? 'volume-high' : 'volume-mute'} size={20} color={voiceEnabled ? COLORS.primary : COLORS.textMuted} />
            </TouchableOpacity>
          </View>
          <View style={styles.exerciseList}>
            <Text style={typography.label}>EXERCICIOS ({workout?.exercises?.length || 0})</Text>
            {(workout?.exercises || []).map((ex, i) => (
              <View key={i} style={styles.exerciseItem}>
                <View style={styles.exerciseNumber}><Text style={styles.exerciseNum}>{i + 1}</Text></View>
                <View style={styles.exerciseInfo}>
                  <Text style={typography.h5}>{ex.name}</Text>
                  <Text style={typography.caption}>{ex.sets || 4}x{ex.reps || 10} · {ex.rest || 60}s descanso</Text>
                </View>
              </View>
            ))}
          </View>
          <View style={styles.bottomSpacer} />
        </ScrollView>
        <View style={layout.footer}>
          <TouchableOpacity style={styles.startBtn} onPress={() => timer.startWorkout()} activeOpacity={0.8} accessibilityLabel="Iniciar treino" accessibilityRole="button">
            <Ionicons name="play" size={ICON_SIZES.sm} color={COLORS.background} />
            <Text style={styles.startText}>INICIAR TREINO</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ErrorBoundary screenName="Player">
    <View style={layout.screen}>
      <XPFloating amount={xpAmount} visible={showXP} onComplete={() => setShowXP(false)} />
      {timer.phase === 'resting' && (
        <RestOverlay timeRemaining={timer.timeRemaining} nextExercise={timer.currentExercise} onSkip={timer.skipRest} nextSet={timer.currentSet} nextIndex={timer.currentExerciseIndex} totalExercises={timer.totalExercises} />
      )}
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <ExerciseProgress exercises={workout.exercises} currentIndex={timer.currentExerciseIndex} currentSet={timer.currentSet} totalSets={timer.totalSets} />
        <View style={styles.timerSection}>
          <WorkoutTimer timeRemaining={timer.timeRemaining} totalTime={timer.totalTime} phase={timer.phase} exerciseName={timer.currentExercise?.name} setInfo={`Serie ${timer.currentSet} de ${timer.totalSets}`} currentSet={timer.currentSet} totalSets={timer.totalSets} logs={timer.logs} />
        </View>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons name="time" size={ICON_SIZES.xs} color={COLORS.primary} />
            <Text style={styles.infoText}>{Math.floor(timer.elapsed / 60)}:{(timer.elapsed % 60).toString().padStart(2, '0')}</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="flame" size={ICON_SIZES.xs} color={COLORS.secondary} />
            <Text style={styles.infoText}>~{timer.totalXP} XP</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="barbell" size={ICON_SIZES.xs} color={COLORS.success} />
            <Text style={styles.infoText}>{timer.logs.length} series</Text>
          </View>
        </View>
        <WorkoutControls phase={timer.phase} onPause={timer.pauseWorkout} onResume={timer.resumeWorkout} onSkip={timer.phase === 'resting' ? timer.skipRest : timer.skipExercise} onStop={handleFinish} onMarkComplete={timer.markSetComplete} />
      </ScrollView>
      <RatingModal visible={showRating} onClose={() => { setShowRating(false); timer.stopWorkout(); router.back(); }} onSubmit={handleRatingSubmit} />
    </View>
    </ErrorBoundary>
  );
}
