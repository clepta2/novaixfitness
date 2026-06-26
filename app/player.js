// app/player.js
// Tela de Treinos Diarios - NOVAIX FITNESS

import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { YoutubeIframe } from 'react-native-youtube-iframe';
import * as KeepAwake from 'expo-keep-awake';
import { COLORS } from '../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../src/constants/spacing';
import WorkoutTimer from '../src/components/workout/WorkoutTimer';
import ExerciseProgress from '../src/components/workout/ExerciseProgress';
import RestOverlay from '../src/components/workout/RestOverlay';
import WorkoutControls from '../src/components/workout/WorkoutControls';
import { saveCompleteWorkout } from '../src/services/workoutSaver';
import { loadSounds, unloadSounds } from '../src/services/audioService';
import { dailyWorkouts, activeWorkout } from '../src/data/dailyWorkouts';
import { layout, typography } from '../src/styles';

import { useLocalSearchParams } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';
import { supabase } from '../src/config/supabase';

import useWorkoutTimer from '../src/hooks/useWorkoutTimer';

const { width } = Dimensions.get('window');

const DEMO_WORKOUT = {
  id: 'demo',
  name: 'Treino Full Body',
  duration: 45,
  videoId: 'dQw4w9WgXcQ',
  exercises: [
    { name: 'Supino Reto', sets: 4, reps: 10, rest: 60 },
    { name: 'Agachamento', sets: 4, reps: 12, rest: 60 },
    { name: 'Remada Curvada', sets: 4, reps: 10, rest: 60 },
    { name: 'Desenvolvimento', sets: 3, reps: 12, rest: 45 },
    { name: 'Burpee', sets: 3, reps: 15, rest: 30 },
  ],
};

export default function PlayerScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuth();
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [showComplete, setShowComplete] = useState(false);

  const timer = useWorkoutTimer(selectedWorkout);

  useEffect(() => {
    KeepAwake.activateKeepAwakeAsync();
    loadSounds();
    return () => {
      KeepAwake.deactivateKeepAwakeAsync();
      unloadSounds();
    };
  }, []);

  useEffect(() => {
    if (timer.phase === 'completed' && !showComplete) {
      setShowComplete(true);
      handleWorkoutComplete();
    }
  }, [timer.phase]);

  useEffect(() => {
    if (!params.id) return;
    supabase.from('workouts').select('*, exercises(*)').eq('id', params.id).single()
      .then(({ data }) => {
        if (data) {
          setSelectedWorkout({
            id: data.id,
            name: data.title || data.name,
            duration: data.duration_minutes || data.duration || 30,
            videoId: data.video_id || 'dQw4w9WgXcQ',
            exercises: data.exercises || DEMO_WORKOUT.exercises,
          });
        }
      })
      .catch(() => setSelectedWorkout(DEMO_WORKOUT));
  }, [params.id]);

  const startWorkout = (workout) => {
    setSelectedWorkout(workout);
    setShowComplete(false);
    timer.startWorkout();
  };

  const handleWorkoutComplete = async () => {
    const result = await saveCompleteWorkout(
      user?.id,
      selectedWorkout,
      timer.logs,
      timer.elapsed
    );

    let msg = 'Treino concluido!';
    if (result?.xpGained > 0) msg += ` +${result.xpGained} XP`;
    if (result?.newAchievements?.length > 0) {
      msg += `\n\nConquista: ${result.newAchievements[0].name}`;
    }

    Alert.alert('Parabens!', msg, [
      { text: 'OK', onPress: () => { setSelectedWorkout(null); setShowComplete(false); timer.stopWorkout(); } },
    ]);
  };

  const handleFinish = () => {
    Alert.alert('Finalizar', 'Salvar progresso e sair?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Finalizar', style: 'destructive', onPress: handleWorkoutComplete },
    ]);
  };

  if (selectedWorkout && timer.phase !== 'idle') {
    return (
      <View style={layout.screen}>
        {timer.phase === 'resting' && (
          <RestOverlay
            timeRemaining={timer.timeRemaining}
            nextExercise={timer.currentExercise}
            onSkip={timer.skipRest}
          />
        )}

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <ExerciseProgress
            exercises={selectedWorkout.exercises}
            currentIndex={timer.currentExerciseIndex}
            currentSet={timer.currentSet}
            totalSets={timer.totalSets}
          />

          <View style={styles.timerSection}>
            <WorkoutTimer
              timeRemaining={timer.timeRemaining}
              totalTime={timer.totalTime}
              phase={timer.phase}
              exerciseName={timer.currentExercise?.name}
              setInfo={`Serie ${timer.currentSet} de ${timer.totalSets}`}
            />
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="time" size={16} color={COLORS.primary} />
              <Text style={styles.infoText}>{Math.floor(timer.elapsed / 60)}:{(timer.elapsed % 60).toString().padStart(2, '0')}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="flame" size={16} color={COLORS.primary} />
              <Text style={styles.infoText}>~{timer.totalXP} XP</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="barbell" size={16} color={COLORS.primary} />
              <Text style={styles.infoText}>{timer.logs.length} series</Text>
            </View>
          </View>

          <WorkoutControls
            phase={timer.phase}
            onPause={timer.pauseWorkout}
            onResume={timer.resumeWorkout}
            onSkip={timer.phase === 'resting' ? timer.skipRest : timer.skipExercise}
            onStop={handleFinish}
            onMarkComplete={timer.markSetComplete}
          />
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={layout.screen}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={layout.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textTitle} />
          </TouchableOpacity>
          <Text style={typography.h2}>Treinos</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.videoContainer}>
          <YoutubeIframe
            height={220}
            width={width - 40}
            videoId={selectedWorkout?.videoId || 'dQw4w9WgXcQ'}
            play={false}
            allowsInlineMediaPlayback
            modestbranding
            rel={false}
            controls={1}
          />
        </View>

        <TouchableOpacity style={styles.startBtn} onPress={() => startWorkout(selectedWorkout || DEMO_WORKOUT)}>
          <Ionicons name="play" size={24} color={COLORS.background} />
          <Text style={styles.startText}>INICIAR TREINO</Text>
        </TouchableOpacity>

        <View style={styles.workoutInfo}>
          <Text style={typography.h3}>{selectedWorkout?.name || DEMO_WORKOUT.name}</Text>
          <Text style={typography.bodyMuted}>{(selectedWorkout?.exercises || DEMO_WORKOUT.exercises).length} exercicios</Text>
        </View>

        <View style={styles.exerciseList}>
          <Text style={typography.label}>EXERCICIOS</Text>
          {(selectedWorkout?.exercises || DEMO_WORKOUT.exercises).map((ex, i) => (
            <View key={i} style={styles.exerciseItem}>
              <View style={styles.exerciseNumber}>
                <Text style={styles.exerciseNum}>{i + 1}</Text>
              </View>
              <View style={styles.exerciseInfo}>
                <Text style={typography.h5}>{ex.name}</Text>
                <Text style={typography.caption}>{ex.sets || 4} series x {ex.reps || 10} reps • {ex.rest || 60}s descanso</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, padding: SPACING.xl, paddingTop: 60 },
  videoContainer: { borderRadius: BORDER_RADIUS.lg, overflow: 'hidden', marginBottom: SPACING.xl, backgroundColor: '#000' },
  startBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.lg, paddingVertical: SPACING.lg, marginBottom: SPACING.xl },
  startText: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.background, letterSpacing: 1 },
  workoutInfo: { marginBottom: SPACING.xl },
  exerciseList: { gap: SPACING.sm },
  exerciseItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  exerciseNumber: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.primary + '15', justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md },
  exerciseNum: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.primary },
  exerciseInfo: { flex: 1 },
  timerSection: { alignItems: 'center', marginVertical: SPACING.xl },
  infoRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: SPACING.xl, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  infoText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: COLORS.textTitle },
});
