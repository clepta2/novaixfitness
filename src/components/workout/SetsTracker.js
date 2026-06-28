// src/components/workout/SetsTracker.js
// Rastreamento de Séries e Cargas com Timer de Descanso e Suporte Offline - NOVAIX FITNESS

import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { Card } from '../ui/Card';
import { supabase } from '../../config/supabase';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { addPendingAction, cacheExerciseLogs, getCachedExerciseLogs } from '../../services/offline';
import { speakNextExercise, speakRestStart, speakRestHalfway, speakRestEnd, speakHalfway, speakMotivation, isVoiceCoachEnabled, setVoiceCoachEnabled } from '../../services/voiceCoach';
import { typography } from '../../styles';

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
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xs }}>
        <Text style={typography.label}>REGISTRO DE SÉRIES</Text>
        <TouchableOpacity onPress={() => { const v = !voiceEnabled; setVoiceCoachEnabled(v); setVoiceEnabled(v); }} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Ionicons name={voiceEnabled ? 'volume-medium' : 'volume-mute'} size={16} color={COLORS.primary} />
          <Text style={{ fontFamily: 'Montserrat_700Bold', fontSize: 10, color: COLORS.textMuted }}>{voiceEnabled ? 'VOZ ATIVA' : 'MUTADO'}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selector}>
        {exercises.map((ex) => (
          <TouchableOpacity key={ex.id || ex.name} style={[styles.selectorBtn, selectedEx === ex.name && styles.selectorBtnActive]} onPress={() => setSelectedEx(ex.name)}>
            <Text style={[styles.selectorText, selectedEx === ex.name && styles.selectorTextActive]}>{ex.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {countdown !== null && (
        <View style={styles.timerContainer}>
          <Ionicons name="time" size={20} color={COLORS.primary} />
          <Text style={styles.timerText}>DESCANSO: {countdown}s</Text>
          <View style={styles.timerControls}>
            <TouchableOpacity onPress={() => setCountdown(c => c + 15)} style={styles.controlBtn}><Text style={styles.controlText}>+15s</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => setCountdown(c => Math.max(0, c - 15))} style={styles.controlBtn}><Text style={styles.controlText}>-15s</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => setCountdown(null)} style={[styles.controlBtn, styles.skipBtn]}><Text style={styles.skipText}>Pular</Text></TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.inputRow}>
        <View style={styles.inputContainer}>
          <Text style={typography.caption}>CARGA (KG)</Text>
          <TextInput style={styles.input} value={weight} onChangeText={setWeight} placeholder="0" placeholderTextColor={COLORS.textMuted} keyboardType="numeric" />
        </View>
        <View style={styles.inputContainer}>
          <Text style={typography.caption}>REPS</Text>
          <TextInput style={styles.input} value={reps} onChangeText={setReps} placeholder="10" placeholderTextColor={COLORS.textMuted} keyboardType="numeric" />
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={handleAddSet} disabled={saving}>
          {saving ? <ActivityIndicator size="small" color={COLORS.background} /> : <Ionicons name="add" size={24} color={COLORS.background} />}
        </TouchableOpacity>
      </View>

      <View style={styles.logsList}>
        <Text style={typography.caption}>SÉRIES REALIZADAS:</Text>
        {loadingLogs ? (
          <ActivityIndicator size="small" color={COLORS.primary} style={{ marginTop: SPACING.md }} />
        ) : logs.length > 0 ? (
          logs.map((log) => (
            <View key={log.id} style={styles.logItem}>
              <View style={styles.logBadge}><Text style={styles.logBadgeText}>SÉRIE {log.set_number}</Text></View>
              <Text style={typography.h5}>{log.reps_done} REPS</Text>
              <Text style={typography.bodyMuted}>{log.weight_kg} kg</Text>
            </View>
          ))
        ) : (
          <Text style={[typography.caption, { marginTop: SPACING.sm }]}>Nenhuma série registrada.</Text>
        )}
      </View>
    </Card>
  );
});

const styles = StyleSheet.create({
  card: { padding: SPACING.lg, marginTop: SPACING.lg, marginBottom: SPACING.md },
  selector: { flexDirection: 'row', marginVertical: SPACING.md },
  selectorBtn: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: 20, backgroundColor: COLORS.background, marginRight: SPACING.xs, borderWidth: 1, borderColor: COLORS.border },
  selectorBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  selectorText: { fontFamily: 'Montserrat_700Bold', fontSize: 11, color: COLORS.textMuted },
  selectorTextActive: { color: COLORS.background },
  timerContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primary + '10', borderLeftWidth: 3, borderLeftColor: COLORS.primary, padding: SPACING.md, borderRadius: 8, marginBottom: SPACING.md, gap: SPACING.sm },
  timerText: { fontFamily: 'Montserrat_700Bold', fontSize: 13, color: COLORS.primary, flex: 1 },
  timerControls: { flexDirection: 'row', gap: SPACING.xs },
  controlBtn: { paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: 4, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  controlText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textTitle },
  skipBtn: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  skipText: { fontFamily: 'Montserrat_700Bold', fontSize: 11, color: COLORS.background },
  inputRow: { flexDirection: 'row', gap: SPACING.md, alignItems: 'flex-end', marginBottom: SPACING.md },
  inputContainer: { flex: 1 },
  input: { height: 40, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: SPACING.md, color: COLORS.textTitle, fontFamily: 'Inter_400Regular', fontSize: 14, marginTop: 4 },
  addBtn: { width: 40, height: 40, borderRadius: BORDER_RADIUS.md, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  logsList: { borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: SPACING.md },
  logItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: SPACING.xs },
  logBadge: { backgroundColor: COLORS.primary + '15', paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: 4 },
  logBadgeText: { fontFamily: 'Montserrat_700Bold', fontSize: 10, color: COLORS.primary },
});
