// src/components/workout/ExerciseConfigurator.tsx
// Configuração individual de exercício - NOVAIX FITNESS

import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import type { ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

interface ExerciseConfig {
  sets: number;
  reps: string;
  rest: number;
  weight: string;
  notes: string;
}

interface ExerciseConfiguratorProps {
  exercise?: { name?: string; level?: string; muscleGroup?: string; equipment?: string } | null;
  config?: Partial<ExerciseConfig> | null;
  onChange?: (config: ExerciseConfig) => void;
  onRemove?: () => void;
}

const PRESETS = [
  { id: 'strength', label: 'Força', icon: 'flash', sets: 4, reps: '6-8', rest: 120, color: COLORS.error },
  { id: 'hypertrophy', label: 'Hipertrofia', icon: 'barbell', sets: 4, reps: '8-12', rest: 60, color: COLORS.primary },
  { id: 'endurance', label: 'Resistência', icon: 'heart', sets: 3, reps: '15-20', rest: 30, color: COLORS.success },
];
const LEVEL_COLORS: Record<string, string> = { beginner: COLORS.success, intermediate: COLORS.attention, advanced: COLORS.error };

export default function ExerciseConfigurator({ exercise, config, onChange, onRemove }: ExerciseConfiguratorProps): React.ReactElement {
  const cfg: ExerciseConfig = config || { sets: 4, reps: '10-12', rest: 60, weight: '', notes: '' };
  const update = (k: keyof ExerciseConfig, v: string | number): void => onChange?.({ ...cfg, [k]: v });
  const levelColor = LEVEL_COLORS[exercise?.level || ''] || COLORS.textMuted;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="barbell" size={18} color={COLORS.primary} />
          <Text style={styles.name} numberOfLines={1}>{exercise?.name}</Text>
        </View>
        <TouchableOpacity onPress={onRemove} accessibilityLabel="Remover exercício">
          <Ionicons name="trash-outline" size={18} color={COLORS.error} />
        </TouchableOpacity>
      </View>
      <View style={styles.metaRow}>
        <View style={[styles.levelBadge, { backgroundColor: levelColor + '20' }]}>
          <Text style={[styles.levelText, { color: levelColor }]}>{exercise?.level || 'N/A'}</Text>
        </View>
        <Text style={styles.metaText}>{exercise?.muscleGroup} • {exercise?.equipment === 'none' ? 'Peso corporal' : exercise?.equipment}</Text>
      </View>
      <Text style={styles.sectionLabel}>PRESET RÁPIDO</Text>
      <View style={styles.presetRow}>
        {PRESETS.map(p => (
          <TouchableOpacity key={p.id} style={styles.presetBtn} onPress={() => onChange?.({ ...cfg, sets: p.sets, reps: p.reps, rest: p.rest })}>
            <Ionicons name={p.icon} size={14} color={p.color} />
            <Text style={styles.presetLabel}>{p.label}</Text>
            <Text style={styles.presetDetail}>{p.sets}x{p.reps}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.sectionLabel}>CONFIGURAÇÃO</Text>
      <View style={styles.inputRow}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>SÉRIES</Text>
          <TextInput style={styles.input} value={String(cfg.sets)} onChangeText={v => update('sets', parseInt(v) || 4)} keyboardType="numeric" />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>REPS</Text>
          <TextInput style={styles.input} value={cfg.reps} onChangeText={v => update('reps', v)} />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>DESCANSO (s)</Text>
          <TextInput style={styles.input} value={String(cfg.rest)} onChangeText={v => update('rest', parseInt(v) || 60)} keyboardType="numeric" />
        </View>
      </View>
      <Text style={styles.inputLabel}>CARGA SUGERIDA</Text>
      <TextInput style={styles.inputFull} value={cfg.weight} onChangeText={v => update('weight', v)} placeholder="Ex: 20kg" placeholderTextColor={COLORS.textMuted} />
      <Text style={[styles.inputLabel, { marginTop: SPACING.sm }]}>OBSERVAÇÕES</Text>
      <TextInput style={[styles.inputFull, { height: 60 }]} value={cfg.notes} onChangeText={v => update('notes', v)} placeholder="Dicas, variações..." placeholderTextColor={COLORS.textMuted} multiline />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, flex: 1 },
  name: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle, flex: 1 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  levelBadge: { paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: BORDER_RADIUS.sm },
  levelText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10 },
  metaText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted },
  sectionLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.textMuted, letterSpacing: 1, marginBottom: SPACING.sm, marginTop: SPACING.sm },
  presetRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md },
  presetBtn: { flex: 1, alignItems: 'center', paddingVertical: SPACING.sm, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border },
  presetLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.textTitle, marginTop: 4 },
  presetDetail: { fontFamily: 'Inter_400Regular', fontSize: 9, color: COLORS.textMuted },
  inputRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md },
  inputGroup: { flex: 1 },
  inputLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.textMuted, letterSpacing: 0.5, marginBottom: 4 },
  input: { height: 44, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.sm, borderWidth: 1, borderColor: COLORS.border, textAlign: 'center', color: COLORS.textTitle, fontFamily: 'Montserrat_600SemiBold', fontSize: 14 },
  inputFull: { height: 44, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.sm, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: SPACING.md, color: COLORS.textTitle, fontFamily: 'Inter_400Regular', fontSize: 14, marginBottom: SPACING.xs },
});
