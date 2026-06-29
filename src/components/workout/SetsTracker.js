import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { Card } from '../ui/Card';
import { supabase } from '../../config/supabase';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { addPendingAction, cacheExerciseLogs, getCachedExerciseLogs } from '../../services/offline';
import { speakNextExercise, speakRestStart, speakRestHalfway, speakRestEnd, speakHalfway, speakMotivation, isVoiceCoachEnabled, setVoiceCoachEnabled } from '../../services/voiceCoach';
import { typography } from '../../styles';
import ExerciseSelector from './ExerciseSelector';
import SetInput from './SetInput';
import RestCountdown from './RestCountdown';
import SetLogList from './SetLogList';

export default memo(function SetsTracker({ userWorkoutId, workout }) {
  const { isConnected } = useNetworkStatus();
  const [selectedEx, setSelectedEx] = useState(null);
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [saving, setSaving] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [voiceEnabled, setVoiceEnabled] = useState(isVoiceCoachEnabled());

  const exercises = useMemo(() => workout?.exercises || [], [workout?.exercises]);

  useEffect(() => {
    if (exercises.length > 0 && !selectedEx) {
      setSelectedEx(exercises[0].name);
    } else if (selectedEx && exercises.length > 0) {
      const ex = exercises.find(e => e.name === selectedEx);
      const idx = exercises.findIndex(e => e.name === selectedEx) + 1;
      speakNextExercise(selectedEx, ex?.reps, ex?.weight, idx, exercises.length);
    }
  }, [exercises, selectedEx]);

  const fetchLogs = useCallback(async () => {
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

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0) {
      setCountdown(null);
      try { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch {}
      speakRestEnd();
      return;
    }
    const exRest = exercises.find(ex => ex.name === selectedEx)?.rest || 60;
    if (countdown === Math.floor(exRest / 2)) speakRestHalfway();
    const id = setInterval(() => setCountdown(c => c - 1), 1000);
    return () => clearInterval(id);
  }, [countdown, exercises, selectedEx]);

  const handleAddSet = async () => {
    const parsedReps = parseInt(reps);
    if (!userWorkoutId || !selectedEx || isNaN(parsedReps) || parsedReps <= 0) return;
    setSaving(true);
    try {
      const nextSetNumber = logs.length + 1;
      const parsedWeight = parseFloat(weight) || 0;
      const newLog = { id: Date.now().toString(), user_workout_id: userWorkoutId, exercise_name: selectedEx, set_number: nextSetNumber, reps_done: parsedReps, weight_kg: parsedWeight };
      const updatedLogs = [...logs, newLog];
      setLogs(updatedLogs);
      await cacheExerciseLogs(userWorkoutId, selectedEx, updatedLogs);
      if (isConnected) {
        await supabase.from('user_exercise_logs').insert({ user_workout_id: userWorkoutId, exercise_name: selectedEx, set_number: nextSetNumber, reps_done: parsedReps, weight_kg: parsedWeight });
      } else {
        await addPendingAction({ type: 'ADD_EXERCISE_LOG', userWorkoutId, exerciseName: selectedEx, setNumber: nextSetNumber, repsDone: parsedReps, weightKg: parsedWeight });
      }
      setReps('');
      const exRest = exercises.find(ex => ex.name === selectedEx)?.rest || 60;
      setCountdown(exRest);
      speakRestStart(exRest);
      const currentIdx = exercises.findIndex(ex => ex.name === selectedEx);
      if (currentIdx === Math.floor(exercises.length / 2) - 1) { speakHalfway(); }
      else if (Math.random() > 0.5) { setTimeout(() => speakMotivation(), 4000); }
      await fetchLogs();
    } catch (err) { console.error('Erro ao registrar série:', err); }
    finally { setSaving(false); }
  };

  if (!workout || exercises.length === 0) return null;

  return (
    <Card variant="surface" style={styles.card}>
      <ExerciseSelector exercises={exercises} selected={selectedEx} onSelect={setSelectedEx} voiceEnabled={voiceEnabled} onToggleVoice={() => { const v = !voiceEnabled; setVoiceCoachEnabled(v); setVoiceEnabled(v); }} />
      {countdown !== null && <RestCountdown countdown={countdown} onAdd={() => setCountdown(c => c + 15)} onSubtract={() => setCountdown(c => Math.max(0, c - 15))} onSkip={() => setCountdown(null)} />}
      <SetInput weight={weight} setWeight={setWeight} reps={reps} setReps={setReps} onAdd={handleAddSet} saving={saving} />
      <SetLogList logs={logs} loading={loadingLogs} />
    </Card>
  );
});

const styles = StyleSheet.create({
  card: { padding: SPACING.lg, marginTop: SPACING.lg, marginBottom: SPACING.md },
});
