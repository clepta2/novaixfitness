import React, { useRef, useEffect, memo } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

const MUSCLE_COLORS = {
  'Peito': COLORS.success, 'Costas': COLORS.info, 'Pernas': COLORS.secondary,
  'Ombros': COLORS.attention, 'Braços': COLORS.primary, 'Abdômen': COLORS.success,
};

export default memo(function ExerciseSlot({ exercise, index, onRemove, onUpdate }) {
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  useEffect(() => { Animated.spring(scaleAnim, { toValue: 1, tension: 40, friction: 8, useNativeDriver: true }).start(); }, []);
  const muscleColor = MUSCLE_COLORS[exercise.muscle] || COLORS.primary;

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
      <View style={[styles.number, { backgroundColor: muscleColor + '20' }]}>
        <Text style={[styles.numberText, { color: muscleColor }]}>{index + 1}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{exercise.name}</Text>
        <Text style={styles.muscle}>{exercise.muscle} • {exercise.equipment || 'Peso corporal'}</Text>
      </View>
      <View style={styles.inputs}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>SÉRIES</Text>
          <TextInput style={styles.miniInput} value={String(exercise.sets || 4)} onChangeText={(v) => onUpdate(index, { ...exercise, sets: parseInt(v) || 4 })} keyboardType="numeric" />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>REPS</Text>
          <TextInput style={styles.miniInput} value={String(exercise.reps || '10-12')} onChangeText={(v) => onUpdate(index, { ...exercise, reps: v })} />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>DESCANSO</Text>
          <TextInput style={styles.miniInput} value={String(exercise.rest || 60)} onChangeText={(v) => onUpdate(index, { ...exercise, rest: parseInt(v) || 60 })} keyboardType="numeric" />
        </View>
      </View>
      <TouchableOpacity style={styles.removeBtn} onPress={() => onRemove(index)}>
        <Ionicons name="close-circle" size={20} color={COLORS.error} />
      </TouchableOpacity>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border, gap: SPACING.sm },
  number: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  numberText: { fontFamily: 'Montserrat_700Bold', fontSize: 11 },
  info: { flex: 1 },
  name: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textTitle },
  muscle: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted },
  inputs: { flexDirection: 'row', gap: SPACING.xs },
  inputGroup: { alignItems: 'center' },
  inputLabel: { fontFamily: 'Inter_400Regular', fontSize: 8, color: COLORS.textMuted, marginBottom: 2 },
  miniInput: { width: 44, height: 28, backgroundColor: COLORS.background, borderRadius: 4, borderWidth: 1, borderColor: COLORS.border, textAlign: 'center', color: COLORS.textTitle, fontFamily: 'Montserrat_600SemiBold', fontSize: 11 },
  removeBtn: { padding: SPACING.xs },
});
