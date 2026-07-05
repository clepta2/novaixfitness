// SetsTracker.tsx
import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { View, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { SPACING } from '../../constants/spacing';
import { Card } from '../ui/Card';
import { supabase } from '../../config/supabase';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { addPendingAction, cacheExerciseLogs, getCachedExerciseLogs } from '../../services/offline';
import { speakNextExercise, speakRestStart, speakRestHalfway, speakRestEnd, speakHalfway, speakMotivation, isVoiceCoachEnabled, setVoiceCoachEnabled } from '../../services/voiceCoach';
import ExerciseSelector from './ExerciseSelector';
import SetInput from './SetInput';
import RestCountdown from './RestCountdown';
import SetLogList from './SetLogList';

interface Exercise {
  name: string;
  reps?: number | string;
  weight?: number | string;
  rest?: number;
  sets?: number;
  muscle?: string;
  [key: string]: unknown;
}

interface Workout {
  exercises?: Exercise[];
  [key: string]: unknown;
}

interface ExerciseLog {
  id: string;
  user_workout_id: string;
  exercise_name: string;
  set_number: number;
  reps_done: number;
  weight_kg: number;
}

interface SetsTrackerProps {
  userWorkoutId: string;
  workout: Workout;
}

export default memo(function SetsTracker({ userWorkoutId, workout }: SetsTrackerProps): React.ReactElement | null {
  const { isConnected } = useNetworkStatus();
  const [selectedEx, setSelectedEx] = useState<string | null>(null);
  const [weight, setWeight] = useState<string>('');
  const [reps, setReps] = useState<string>('');
  const [logs, setLogs] = useState<ExerciseLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(isVoiceCoachEnabled());

  const exercises: Exercise[] = useMemo(() => workout?.exercises || [], [workout?.exercises]);

  useEffect((): void => {
    if (exercises.length > 0 && !selectedEx) {
      setSelectedEx(exercises[0].name);
    } else if (selectedEx && exercises.length > 0) {
      const ex = exercises.find((e: Exercise) => e.name === selectedEx);
      const idx = exercises.findIndex((e: Exercise) => e.name === selectedEx) + 1;
      speakNextExercise(selectedEx, ex?.reps, ex?.weight, idx, exercises.length);
    }
  }, [exercises, selectedEx]);

  const fetchLogs = useCallback(async (): Promise<void> => {
    if (!userWorkoutId || !selectedEx) return;
    setLoadingLogs(true);
    try {
      const cached = await getCachedExerciseLogs(userWorkoutId, selectedEx);
      if (cached?.length > 0) setLogs(cached);
      if (isConnected) {
        const { data, error } = await supabase.from('user_exercise_logs').select('*').eq('user_workout_id', userWorkoutId).eq('exercise_name', selectedEx).order('set_number', { ascending: true });
        if (!error && data) { setLogs(data); await cacheExerciseLogs(userWorkoutId, selectedEx, data); }
      }
    } catch (err) { console.error('Erro ao buscar séries:', err); }
    finally { setLoadingLogs(false); }
  }, [userWorkoutId, selectedEx, isConnected]);

  useEffect((): void => { fetchLogs(); }, [fetchLogs]);

  useEffect((): (() => void) | undefined => {
    if (countdown === null) return;
    if (countdown <= 0) {
      setCountdown(null);
      try { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch {}
      speakRestEnd();
      return;
    }
    const exRest = exercises.find((ex: Exercise) => ex.name === selectedEx)?.rest || 60;
    if (countdown === Math.floor(exRest / 2)) speakRestHalfway();
    const id = setInterval((): void => setCountdown((c: number | null) => c !== null ? c - 1 : null), 1000);
    return (): void => clearInterval(id);
  }, [countdown, exercises, selectedEx]);

  const handleAddSet = async (): Promise<void> => {
    const parsedReps = parseInt(reps);
    if (!userWorkoutId || !selectedEx || isNaN(parsedReps) || parsedReps <= 0) return;
    setSaving(true);
    try {
      const nextSetNumber = logs.length + 1;
      const parsedWeight = parseFloat(weight) || 0;
      const newLog: ExerciseLog = { id: Date.now().toString(), user_workout_id: userWorkoutId, exercise_name: selectedEx, set_number: nextSetNumber, reps_done: parsedReps, weight_kg: parsedWeight };
      const updatedLogs = [...logs, newLog];
      setLogs(updatedLogs);
      await cacheExerciseLogs(userWorkoutId, selectedEx, updatedLogs);
      if (isConnected) {
        await supabase.from('user_exercise_logs').insert({ user_workout_id: userWorkoutId, exercise_name: selectedEx, set_number: nextSetNumber, reps_done: parsedReps, weight_kg: parsedWeight });
      } else {
        await addPendingAction({ type: 'ADD_EXERCISE_LOG', userWorkoutId, exerciseName: selectedEx, setNumber: nextSetNumber, repsDone: parsedReps, weightKg: parsedWeight });
      }
      setReps('');
      const exRest = exercises.find((ex: Exercise) => ex.name === selectedEx)?.rest || 60;
      setCountdown(exRest);
      speakRestStart(exRest);
      const currentIdx = exercises.findIndex((ex: Exercise) => ex.name === selectedEx);
      if (currentIdx === Math.floor(exercises.length / 2) - 1) { speakHalfway(); }
      else if (Math.random() > 0.5) { setTimeout((): void => speakMotivation(), 4000); }
      await fetchLogs();
    } catch (err) { console.error('Erro ao registrar série:', err); }
    finally { setSaving(false); }
  };

  if (!workout || exercises.length === 0) return null;

  return (
    <Card variant="surface" style={styles.card}>
      <ExerciseSelector exercises={exercises} selected={selectedEx as string} onSelect={setSelectedEx} voiceEnabled={voiceEnabled} onToggleVoice={(): void => { const v = !voiceEnabled; setVoiceCoachEnabled(v); setVoiceEnabled(v); }} />
      {countdown !== null && <RestCountdown countdown={countdown} onAdd={(): void => setCountdown((c: number | null) => c !== null ? c + 15 : null)} onSubtract={(): void => setCountdown((c: number | null) => c !== null ? Math.max(0, c - 15) : null)} onSkip={(): void => setCountdown(null)} />}
      <SetInput weight={weight} setWeight={setWeight} reps={reps} setReps={setReps} onAdd={handleAddSet} saving={saving} />
      <SetLogList logs={logs} loading={loadingLogs} />
    </Card>
  );
});

const styles = StyleSheet.create({
  card: { padding: SPACING.lg, marginTop: SPACING.lg, marginBottom: SPACING.md },
});
