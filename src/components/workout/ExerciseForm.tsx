// src/components/workout/ExerciseForm.tsx
// Formulário de exercício - NOVAIX FITNESS

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import type { ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

const MUSCLES = ['Peito', 'Costas', 'Pernas', 'Ombros', 'Braços', 'Abdômen'];

interface ChipSelectorProps {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}

function ChipSelector({ options, selected, onSelect }: ChipSelectorProps): React.ReactElement {
  return (
    <View style={styles.chipRow}>
      {options.map(opt => (
        <TouchableOpacity key={opt} style={[styles.chip, selected === opt && styles.chipActive]} onPress={() => onSelect(opt)}>
          <Text style={[styles.chipText, selected === opt && styles.chipTextActive]}>{opt}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

interface ExerciseFormData {
  name?: string;
  muscle?: string;
  sets?: number;
  reps?: string;
  rest?: number;
  weight?: number | null;
}

interface ExerciseFormProps {
  exercise?: ExerciseFormData | null;
  onSave?: (data: { name: string; muscle: string; sets: number; reps: string; rest: number; weight: number | null }) => void;
  onCancel?: () => void;
}

export default function ExerciseForm({ exercise, onSave, onCancel }: ExerciseFormProps): React.ReactElement {
  const [name, setName] = useState(exercise?.name || '');
  const [muscle, setMuscle] = useState(exercise?.muscle || '');
  const [sets, setSets] = useState(String(exercise?.sets || 4));
  const [reps, setReps] = useState(exercise?.reps || '10-12');
  const [rest, setRest] = useState(String(exercise?.rest || 60));
  const [weight, setWeight] = useState(exercise?.weight ? String(exercise.weight) : '');

  const handleSave = (): void => {
    if (!name.trim()) return;
    onSave?.({
      name: name.trim(), muscle: muscle || 'Geral',
      sets: parseInt(sets) || 4, reps: reps || '10-12',
      rest: parseInt(rest) || 60, weight: weight ? parseFloat(weight) : null,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{exercise ? 'EDITAR' : 'NOVO'} EXERCÍCIO</Text>
        <TouchableOpacity onPress={onCancel}><Ionicons name="close" size={20} color={COLORS.textMuted} /></TouchableOpacity>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>NOME *</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Ex: Supino Reto" placeholderTextColor={COLORS.textMuted} />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>MÚSCULO ALVO</Text>
        <ChipSelector options={MUSCLES} selected={muscle} onSelect={setMuscle} />
      </View>

      <View style={styles.row}>
        <View style={styles.field}>
          <Text style={styles.label}>SÉRIES</Text>
          <TextInput style={styles.input} value={sets} onChangeText={setSets} keyboardType="numeric" />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>REPS</Text>
          <TextInput style={styles.input} value={reps} onChangeText={setReps} placeholder="10-12" placeholderTextColor={COLORS.textMuted} />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.field}>
          <Text style={styles.label}>DESCANSO (S)</Text>
          <TextInput style={styles.input} value={rest} onChangeText={setRest} keyboardType="numeric" />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>CARGA (KG)</Text>
          <TextInput style={styles.input} value={weight} onChangeText={setWeight} keyboardType="numeric" placeholder="Opcional" placeholderTextColor={COLORS.textMuted} />
        </View>
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Ionicons name="checkmark-circle" size={18} color={COLORS.background} />
        <Text style={styles.saveText}>{exercise ? 'ATUALIZAR' : 'ADICIONAR'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 2, borderColor: COLORS.primary },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.primary, letterSpacing: 1 },
  field: { marginBottom: SPACING.md },
  label: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.textMuted, letterSpacing: 0.5, marginBottom: SPACING.xs },
  input: { height: 44, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: SPACING.md, color: COLORS.textTitle, fontFamily: 'Inter_400Regular', fontSize: 14 },
  row: { flexDirection: 'row', gap: SPACING.md },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs },
  chip: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.full, borderWidth: 1, borderColor: COLORS.border },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textMuted },
  chipTextActive: { color: COLORS.background },
  saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.primary, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.md, marginTop: SPACING.md },
  saveText: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.background, letterSpacing: 0.5 },
});
