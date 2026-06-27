// src/components/profile/WeightLogger.js
// Registro de Medidas Corporais - NOVAIX FITNESS

import { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { Card } from '../ui/Card';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../context/AuthContext';
import { typography } from '../../styles';

export default function WeightLogger() {
  const { user } = useAuth();
  const [weight, setWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
      console.error('Erro ao buscar histórico de peso:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleSave = async () => {
    const parsedWeight = parseFloat(weight);
    if (isNaN(parsedWeight) || parsedWeight <= 0) return;

    setSaving(true);
    try {
      const parsedFat = parseFloat(bodyFat);
      const { error } = await supabase
        .from('physical_progress')
        .insert({
          user_id: user.id,
          weight: parsedWeight,
          body_fat: isNaN(parsedFat) ? null : parsedFat,
        });

      if (!error) {
        setWeight('');
        setBodyFat('');
        await fetchHistory();
      }
    } catch (err) {
      console.error('Erro ao registrar peso:', err);
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR');
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
      <Text style={typography.label}>EVOLUÇÃO CORPORAL</Text>
      
      <View style={styles.inputRow}>
        <View style={styles.inputContainer}>
          <Text style={typography.caption}>PESO (KG)</Text>
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
          <Text style={typography.caption}>GORDURA (%)</Text>
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
          <Text style={typography.caption}>ÚLTIMOS REGISTROS:</Text>
          {history.map((log) => (
            <View key={log.id} style={styles.historyRow}>
              <Text style={typography.bodySmall}>{formatDate(log.logged_at)}</Text>
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
