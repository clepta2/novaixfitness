// src/components/workout/SetsTracker.js
// Rastreamento de Séries e Cargas - NOVAIX FITNESS

import { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { Card } from '../index';
import { supabase } from '../../config/supabase';
import { typography } from '../../styles';

export default function SetsTracker({ userWorkoutId, workout }) {
  const [selectedEx, setSelectedEx] = useState(null);
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [saving, setSaving] = useState(false);

  const exercises = workout?.exercises || [];

  useEffect(() => {
    if (exercises.length > 0 && !selectedEx) {
      setSelectedEx(exercises[0].name);
    }
  }, [exercises, selectedEx]);

  const fetchLogs = useCallback(async () => {
    if (!userWorkoutId || !selectedEx) return;
    setLoadingLogs(true);
    try {
      const { data, error } = await supabase
        .from('user_exercise_logs')
        .select('*')
        .eq('user_workout_id', userWorkoutId)
        .eq('exercise_name', selectedEx)
        .order('set_number', { ascending: true });

      if (!error && data) {
        setLogs(data);
      }
    } catch (err) {
      console.error('Erro ao buscar séries:', err);
    } finally {
      setLoadingLogs(false);
    }
  }, [userWorkoutId, selectedEx]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleAddSet = async () => {
    const parsedReps = parseInt(reps);
    if (!userWorkoutId || !selectedEx || isNaN(parsedReps) || parsedReps <= 0) return;

    setSaving(true);
    try {
      const nextSetNumber = logs.length + 1;
      const parsedWeight = parseFloat(weight) || 0;

      const { error } = await supabase
        .from('user_exercise_logs')
        .insert({
          user_workout_id: userWorkoutId,
          exercise_name: selectedEx,
          set_number: nextSetNumber,
          reps_done: parsedReps,
          weight_kg: parsedWeight,
        });

      if (!error) {
        setReps('');
        await fetchLogs();
      }
    } catch (err) {
      console.error('Erro ao registrar série:', err);
    } finally {
      setSaving(false);
    }
  };

  if (!workout || exercises.length === 0) return null;

  return (
    <Card variant="surface" style={styles.card}>
      <Text style={typography.label}>REGISTRO DE SÉRIES</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selector}>
        {exercises.map((ex) => (
          <TouchableOpacity
            key={ex.id || ex.name}
            style={[styles.selectorBtn, selectedEx === ex.name && styles.selectorBtnActive]}
            onPress={() => setSelectedEx(ex.name)}
          >
            <Text style={[styles.selectorText, selectedEx === ex.name && styles.selectorTextActive]}>
              {ex.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.inputRow}>
        <View style={styles.inputContainer}>
          <Text style={typography.caption}>CARGA (KG)</Text>
          <TextInput
            style={styles.input}
            value={weight}
            onChangeText={setWeight}
            placeholder="0"
            placeholderTextColor={COLORS.textMuted}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={typography.caption}>REPS</Text>
          <TextInput
            style={styles.input}
            value={reps}
            onChangeText={setReps}
            placeholder="10"
            placeholderTextColor={COLORS.textMuted}
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={handleAddSet} disabled={saving}>
          {saving ? (
            <ActivityIndicator size="small" color={COLORS.background} />
          ) : (
            <Ionicons name="add" size={24} color={COLORS.background} />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.logsList}>
        <Text style={typography.caption}>SÉRIES REALIZADAS:</Text>
        {loadingLogs ? (
          <ActivityIndicator size="small" color={COLORS.primary} style={{ marginTop: SPACING.md }} />
        ) : logs.length > 0 ? (
          logs.map((log) => (
            <View key={log.id} style={styles.logItem}>
              <View style={styles.logBadge}>
                <Text style={styles.logBadgeText}>SÉRIE {log.set_number}</Text>
              </View>
              <Text style={typography.h5}>{log.reps_done} REPS</Text>
              <Text style={typography.bodyMuted}>{log.weight_kg} kg</Text>
            </View>
          ))
        ) : (
          <Text style={[typography.caption, { marginTop: SPACING.sm }]}>Nenhuma série registrada para este exercício.</Text>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { padding: SPACING.lg, marginTop: SPACING.lg, marginBottom: SPACING.md },
  selector: { flexDirection: 'row', marginVertical: SPACING.md },
  selectorBtn: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: 20, backgroundColor: COLORS.background, marginRight: SPACING.xs, borderWidth: 1, borderColor: COLORS.border },
  selectorBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  selectorText: { fontFamily: 'Montserrat_700Bold', fontSize: 11, color: COLORS.textMuted },
  selectorTextActive: { color: COLORS.background },
  inputRow: { flexDirection: 'row', gap: SPACING.md, alignItems: 'flex-end', marginBottom: SPACING.md },
  inputContainer: { flex: 1 },
  input: { height: 40, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: SPACING.md, color: COLORS.textTitle, fontFamily: 'Inter_400Regular', fontSize: 14, marginTop: 4 },
  addBtn: { width: 40, height: 40, borderRadius: BORDER_RADIUS.md, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  logsList: { borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: SPACING.md },
  logItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: SPACING.xs },
  logBadge: { backgroundColor: COLORS.primary + '15', paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: 4 },
  logBadgeText: { fontFamily: 'Montserrat_700Bold', fontSize: 10, color: COLORS.primary },
});
