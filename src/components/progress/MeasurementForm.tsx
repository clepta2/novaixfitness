// src/components/progress/MeasurementForm.tsx
// Formulário de medidas - NOVAIX FITNESS

import React, { useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

const MEASUREMENT_TYPES = [
  { key: 'weight', label: 'Peso', unit: 'kg', icon: 'scale', color: COLORS.primary },
  { key: 'bodyFat', label: 'Gordura', unit: '%', icon: 'water', color: COLORS.secondary },
  { key: 'chest', label: 'Peito', unit: 'cm', icon: 'body', color: COLORS.success },
  { key: 'waist', label: 'Cintura', unit: 'cm', icon: 'resize', color: COLORS.attention },
  { key: 'hip', label: 'Quadril', unit: 'cm', icon: 'body', color: COLORS.info },
  { key: 'arm', label: 'Braço', unit: 'cm', icon: 'barbell', color: COLORS.primary },
];

interface MeasurementType {
  key: string;
  label: string;
  unit: string;
  icon: string;
  color: string;
}

interface MeasurementInputProps {
  measurement: MeasurementType;
  value: string;
  onChange: (value: string) => void;
}

function MeasurementInput({ measurement, value, onChange }: MeasurementInputProps): React.JSX.Element {
  const focusAnim = useRef(new Animated.Value(0)).current;

  return (
    <View style={styles.inputRow}>
      <View style={[styles.inputIcon, { backgroundColor: measurement.color + '15' }]}>
        <Ionicons name={measurement.icon as any} size={16} color={measurement.color} />
      </View>
      <View style={styles.inputInfo}>
        <Text style={styles.inputLabel}>{measurement.label}</Text>
        <Text style={styles.inputUnit}>{measurement.unit}</Text>
      </View>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="--"
        placeholderTextColor={COLORS.textMuted}
        value={value}
        onChangeText={(v: string) => onChange(v)}
      />
    </View>
  );
}

interface MeasurementFormProps {
  form: { [key: string]: string };
  onChangeForm: (form: { [key: string]: string }) => void;
  onSave: () => void;
  saving: boolean;
}

export default function MeasurementForm({ form, onChangeForm, onSave, saving }: MeasurementFormProps): React.JSX.Element {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  }, []);

  const hasData = Object.values(form).some((v: string) => v && v.trim());

  return (
    <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <Ionicons name="create" size={18} color={COLORS.primary} />
        <Text style={styles.title}>NOVA MEDIÇÃO</Text>
      </View>

      <View style={styles.inputsGrid}>
        {MEASUREMENT_TYPES.map((m: MeasurementType) => (
          <MeasurementInput key={m.key} measurement={m} value={form[m.key] || ''} onChange={(v: string) => onChangeForm({ ...form, [m.key]: v })} />
        ))}
      </View>

      <View style={styles.notesSection}>
        <Text style={styles.notesLabel}>NOTAS</Text>
        <TextInput
          style={styles.notesInput}
          placeholder="Observações opcionais..."
          placeholderTextColor={COLORS.textMuted}
          value={form.notes || ''}
          onChangeText={(v: string) => onChangeForm({ ...form, notes: v })}
          multiline
        />
      </View>

      <TouchableOpacity
        style={[styles.saveBtn, !hasData && styles.saveBtnDisabled]}
        onPress={onSave}
        disabled={saving || !hasData}
      >
        {saving ? (
          <Ionicons name="sync" size={18} color={COLORS.background} />
        ) : (
          <Ionicons name="checkmark-circle" size={18} color={COLORS.background} />
        )}
        <Text style={styles.saveText}>{saving ? 'Salvando...' : 'SALVAR MEDIÇÕES'}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.lg },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.textTitle },
  inputsGrid: { gap: SPACING.sm, marginBottom: SPACING.md },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, padding: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  inputIcon: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  inputInfo: { flex: 1 },
  inputLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textTitle },
  inputUnit: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted },
  input: { width: 60, height: 36, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.sm, borderWidth: 1, borderColor: COLORS.border, textAlign: 'center', color: COLORS.textTitle, fontFamily: 'Montserrat_600SemiBold', fontSize: 14 },
  notesSection: { marginBottom: SPACING.md },
  notesLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.textMuted, letterSpacing: 1, marginBottom: SPACING.xs },
  notesInput: { height: 60, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, color: COLORS.textTitle, fontFamily: 'Inter_400Regular', fontSize: 13 },
  saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.primary, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.md },
  saveBtnDisabled: { opacity: 0.5 },
  saveText: { fontFamily: 'Montserrat_700Bold', fontSize: 13, color: COLORS.background, letterSpacing: 0.5 },
});
