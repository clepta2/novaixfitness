// src/components/profile/WeightLogger.tsx
// Registro de Medidas Corporais - NOVAIX FITNESS

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { Card } from '../ui/Card';
import { supabase } from '../../config/supabase';
import { formatDateBR } from '../../helpers/dates';
import { useAuth } from '../../context/AuthContext';
import { useAbortController } from '../../hooks/useAbortController';
import { typography } from '../../styles';
import { SECTION_TITLES, LABELS } from '../../data/profileTexts';
import { sanitizeInput, validateWeight } from '../../utils/validation';

export default function WeightLogger() {
  const { user } = useAuth();
  const [weight, setWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { signal } = useAbortController();

  const fetchHistory = useCallback(async () => {
    if (!user?.id) { setLoading(false); return; }
    try {
      const { data, error } = await supabase
        .from('physical_progress')
        .select('id, weight, body_fat, logged_at')
        .eq('user_id', user.id)
        .order('logged_at', { ascending: false })
        .limit(3);

      if (!error && data) {
        setHistory(data);
      }
    } catch (err) {
      if (__DEV__) console.error('Erro ao buscar histórico de peso:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id, signal]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleWeightChange = (text: string) => {
    const sanitized = text.replace(/[^0-9.,]/g, '').replace(',', '.');
    setWeight(sanitized);
    setError('');
  };

  const handleBodyFatChange = (text: string) => {
    const sanitized = text.replace(/[^0-9.,]/g, '').replace(',', '.');
    setBodyFat(sanitized);
  };

  const handleSave = async () => {
    const validation = validateWeight(weight);
    if (!validation.valid) {
      setError(validation.error || 'Peso inválido');
      return;
    }

    const parsedWeight = parseFloat(weight);
    setSaving(true);
    try {
      const parsedFat = bodyFat ? parseFloat(bodyFat) : null;
      const { error } = await supabase
        .from('physical_progress')
        .insert({
          user_id: user.id,
          weight: parsedWeight,
          body_fat: parsedFat && !isNaN(parsedFat) ? parsedFat : null,
        });

      if (!error) {
        setWeight('');
        setBodyFat('');
        setError('');
        await fetchHistory();
      }
    } catch (err) {
      if (__DEV__) console.error('Erro ao registrar peso:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card variant="surface" style={styles.card}>
        <ActivityIndicator size="small" color={COLORS.primary} />
      </Card>
    );
  }

  return (
    <Card variant="surface" style={styles.card}>
      <Text style={typography.label}>{SECTION_TITLES.bodyEvolution}</Text>
      
      <View style={styles.inputRow}>
        <View style={styles.inputContainer}>
          <Text style={typography.caption}>{LABELS.weight}</Text>
          <TextInput
            style={styles.input}
            value={weight}
            onChangeText={setWeight}
            placeholder="75.0"
            placeholderTextColor={COLORS.textMuted}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={typography.caption}>{LABELS.bodyFat}</Text>
          <TextInput
            style={styles.input}
            value={bodyFat}
            onChangeText={setBodyFat}
            placeholder="14"
            placeholderTextColor={COLORS.textMuted}
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
          {saving ? (
            <ActivityIndicator size="small" color={COLORS.background} />
          ) : (
            <Ionicons name="checkmark" size={20} color={COLORS.background} />
          )}
        </TouchableOpacity>
      </View>

      {history.length > 0 && (
        <View style={styles.historyContainer}>
          <Text style={typography.caption}>{LABELS.lastRecords}</Text>
          {history.map((log) => (
            <View key={log.id} style={styles.historyRow}>
              <Text style={typography.bodySmall}>{formatDateBR(log.logged_at)}</Text>
              <Text style={typography.h5}>{log.weight} kg</Text>
              <Text style={typography.bodySmall}>
                {log.body_fat ? `${log.body_fat}% BF` : '--'}
              </Text>
            </View>
          ))}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { padding: SPACING.lg, marginBottom: SPACING.md },
  inputRow: { flexDirection: 'row', gap: SPACING.md, alignItems: 'flex-end', marginTop: SPACING.sm },
  inputContainer: { flex: 1 },
  input: { height: 40, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: SPACING.md, color: COLORS.textTitle, fontFamily: 'Inter_400Regular', fontSize: 14, marginTop: 4 },
  saveBtn: { width: 40, height: 40, borderRadius: BORDER_RADIUS.md, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  historyContainer: { marginTop: SPACING.lg, borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: SPACING.md },
  historyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: SPACING.xs },
});
