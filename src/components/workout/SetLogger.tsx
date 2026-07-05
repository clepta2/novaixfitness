// src/components/workout/SetLogger.js
// Logger de séries com tempo de execução

import { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { useI18n } from '../../i18n';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

export default function SetLogger({ exerciseId, onLogSet, previousData }) {
  const { t } = useI18n();
  const [sets, setSets] = useState<any[]>([]);
  const [weight, setWeight] = useState(previousData?.weight?.toString() || '');
  const [reps, setReps] = useState(previousData?.reps?.toString() || '12');
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  const startTimer = () => {
    setElapsed(0);
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setElapsed(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
  };

  const handleAddSet = () => {
    const setData = {
      setNumber: sets.length + 1,
      weight: parseFloat(weight) || 0,
      reps: parseInt(reps) || 0,
      duration: elapsed,
    };

    setSets(prev => [...prev, setData]);
    onLogSet?.(setData);
    stopTimer();
    setElapsed(0);
  };

  const handleRemoveSet = (index) => {
    setSets(prev => prev.filter((_, i) => i !== index));
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('workout.sets')}</Text>

      {sets.length > 0 && (
        <View style={styles.setsHeader}>
          <Text style={styles.setHeader}>#</Text>
          <Text style={styles.setHeader}>{t('progress.weight')}</Text>
          <Text style={styles.setHeader}>{t('workout.reps')}</Text>
          <Text style={styles.setHeader}>{t('workout.timer')}</Text>
          <Text style={styles.setHeader}></Text>
        </View>
      )}

      {sets.map((set, index) => (
        <View key={index} style={styles.setRow}>
          <Text style={styles.setText}>{set.setNumber}</Text>
          <Text style={styles.setText}>{set.weight}kg</Text>
          <Text style={styles.setText}>{set.reps}</Text>
          <Text style={styles.setText}>{formatTime(set.duration)}</Text>
          <TouchableOpacity onPress={() => handleRemoveSet(index)}>
            <Ionicons name="close-circle" size={18} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      ))}

      <View style={styles.inputRow}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>{t('progress.weight')} (kg)</Text>
          <TextInput
            style={styles.input}
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={COLORS.textMuted}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>{t('workout.reps')}</Text>
          <TextInput
            style={styles.input}
            value={reps}
            onChangeText={setReps}
            keyboardType="numeric"
            placeholder="12"
            placeholderTextColor={COLORS.textMuted}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>{t('workout.timer')}</Text>
          <TouchableOpacity style={styles.timerBtn} onPress={isRunning ? stopTimer : startTimer}>
            <Ionicons name={isRunning ? 'pause' : 'play'} size={16} color={isRunning ? COLORS.error : COLORS.primary} />
            <Text style={[styles.timerText, isRunning && { color: COLORS.error }]}>{formatTime(elapsed)}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.addBtn} onPress={handleAddSet}>
        <Ionicons name="add-circle" size={20} color={COLORS.background} />
        <Text style={styles.addBtnText}>{t('common.add')} {t('workout.sets')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  title: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textMuted, letterSpacing: 1, marginBottom: SPACING.md },
  setsHeader: { flexDirection: 'row', paddingBottom: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.border, marginBottom: SPACING.sm },
  setHeader: { width: 50, fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.textMuted, textAlign: 'center' },
  setRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  setText: { width: 50, fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textTitle, textAlign: 'center' },
  inputRow: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.md },
  inputGroup: { flex: 1 },
  inputLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 9, color: COLORS.textMuted, letterSpacing: 0.5, marginBottom: 4 },
  input: { backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.sm, padding: SPACING.sm, color: COLORS.textTitle, fontFamily: 'Inter_500Medium', fontSize: 16, textAlign: 'center', borderWidth: 1, borderColor: COLORS.border },
  timerBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.sm, padding: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  timerText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: COLORS.primary, fontVariant: ['tabular-nums'] },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.xs, backgroundColor: COLORS.primary, padding: SPACING.md, borderRadius: BORDER_RADIUS.full, marginTop: SPACING.md },
  addBtnText: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.background },
});
