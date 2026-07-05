// src/components/nutrition/ProgressPhotos.tsx
// Registro de medidas corporais - NOVAIX FITNESS

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { supabase } from '../../config/supabase';
import { useAbortController } from '../../hooks/useAbortController';
import { sanitizeInput } from '../../utils/validation';

const MEASUREMENTS = [
  { key: 'weight', label: 'Peso', unit: 'kg', icon: 'scale', color: COLORS.primary },
  { key: 'bodyFat', label: 'Gordura Corporal', unit: '%', icon: 'water', color: COLORS.secondary },
  { key: 'chest', label: 'Peito', unit: 'cm', icon: 'body', color: COLORS.success },
  { key: 'waist', label: 'Cintura', unit: 'cm', icon: 'resize', color: COLORS.attention },
  { key: 'hip', label: 'Quadril', unit: 'cm', icon: 'body', color: COLORS.info },
  { key: 'arm', label: 'Braço', unit: 'cm', icon: 'barbell', color: COLORS.primary },
];

function MeasurementInput({ measurement, value, onChange }: {
  measurement?: any;
  value?: string;
  onChange?: (text: string) => void;
}) {
  const handleChange = (text: string) => {
    // Sanitizar entrada: apenas números e ponto/vírgula
    const sanitized = text.replace(/[^0-9.,]/g, '').replace(',', '.');
    onChange?.(sanitized);
  };

  return (
    <View style={styles.inputRow}>
      <View style={[styles.inputIcon, { backgroundColor: measurement.color + '20' }]}>
        <Ionicons name={measurement.icon} size={18} color={measurement.color} />
      </View>
      <Text style={styles.inputLabel}>{measurement.label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={handleChange}
          keyboardType="numeric"
          placeholder="--"
          placeholderTextColor={COLORS.textMuted}
          maxLength={6}
        />
        <Text style={styles.inputUnit}>{measurement.unit}</Text>
      </View>
    </View>
  );
}

interface ProgressPhotosProps {
  userId?: string;
}

export default function ProgressPhotos({ userId }: ProgressPhotosProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [lastEntry, setLastEntry] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { signal } = useAbortController();

  const loadData = useCallback(async () => {
    if (!userId) { setLoading(false); return; }
    try {
      const { data } = await supabase.from('body_measurements')
        .select('*')
        .eq('user_id', userId)
        .order('recorded_at', { ascending: false })
        .limit(1)
        .single();
      if (data) {
        setLastEntry(data);
        setValues({
          weight: data.weight?.toString() || '',
          bodyFat: data.body_fat?.toString() || '',
          chest: data.chest?.toString() || '',
          waist: data.waist?.toString() || '',
          hip: data.hip?.toString() || '',
          arm: data.arm?.toString() || '',
        });
      }
    } catch (err) {
      if (__DEV__) console.error('Erro ao carregar medidas:', err);
    } finally {
      setLoading(false);
    }
  }, [userId, signal]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSave = async () => {
    const hasAny = Object.values(values).some(v => v && (v as string).trim());
    if (!hasAny) {
      Alert.alert('Aviso', 'Preencha pelo menos uma medida.');
      return;
    }

    try {
      await supabase.from('body_measurements').insert({
        user_id: userId,
        weight: parseFloat(values.weight) || null,
        body_fat: parseFloat(values.bodyFat) || null,
        chest: parseFloat(values.chest) || null,
        waist: parseFloat(values.waist) || null,
        hip: parseFloat(values.hip) || null,
        arm: parseFloat(values.arm) || null,
        recorded_at: new Date().toISOString(),
      } as any);
      Alert.alert('Sucesso', 'Medidas salvas!');
      loadData();
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível salvar.');
    }
  };

  const handleChange = (key: any, value: any) => {
    // Validar e sanitizar
    const sanitized = sanitizeInput(value);
    setValues(prev => ({ ...prev, [key]: sanitized }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="fitness" size={18} color={COLORS.primary} />
        <Text style={styles.title}>MEDIDAS CORPORAIS</Text>
      </View>

      {lastEntry && (
        <View style={styles.lastEntry}>
          <Text style={styles.lastLabel}>Última medição: {new Date(lastEntry.recorded_at).toLocaleDateString('pt-BR')}</Text>
        </View>
      )}

      <View style={styles.inputsGrid}>
        {MEASUREMENTS.map(m => (
          <MeasurementInput
            key={m.key}
            measurement={m}
            value={values[m.key] || ''}
            onChange={(v: string) => handleChange(m.key, v)}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Ionicons name="checkmark-circle" size={18} color={COLORS.background} />
        <Text style={styles.saveText}>SALVAR MEDIDAS</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textMuted, letterSpacing: 1 },
  lastEntry: { backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.sm, padding: SPACING.sm, marginBottom: SPACING.md },
  lastLabel: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted },
  inputsGrid: { gap: SPACING.sm, marginBottom: SPACING.lg },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  inputIcon: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  inputLabel: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textDescription, width: 80 },
  inputContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.sm, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: SPACING.sm },
  input: { flex: 1, height: 36, fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: COLORS.textTitle },
  inputUnit: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted },
  saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.primary, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.md },
  saveText: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.background, letterSpacing: 1 },
});
