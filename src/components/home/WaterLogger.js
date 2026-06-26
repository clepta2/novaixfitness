// src/components/home/WaterLogger.js
// Widget de Hidratação - NOVAIX FITNESS

import { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { Card, ProgressBar } from '../index';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../context/AuthContext';
import { typography } from '../../styles';

const DAILY_TARGET = 2500; // Meta diária padrão em ml

export default function WaterLogger() {
  const { user } = useAuth();
  const [consumed, setConsumed] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchTodayWater = useCallback(async () => {
    if (!user?.id) { setLoading(false); return; }
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from('water_logs')
        .select('amount_ml')
        .eq('user_id', user.id)
        .gte('logged_at', today.toISOString());

      if (!error && data) {
        const total = data.reduce((sum, item) => sum + item.amount_ml, 0);
        setConsumed(total);
      }
    } catch (err) {
      console.error('Erro ao buscar consumo de água:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchTodayWater();
  }, [fetchTodayWater]);

  const addWater = async (amount) => {
    if (!user?.id) return;
    try {
      const { error } = await supabase
        .from('water_logs')
        .insert({ user_id: user.id, amount_ml: amount });

      if (!error) {
        setConsumed((prev) => prev + amount);
      }
    } catch (err) {
      console.error('Erro ao registrar água:', err);
    }
  };

  const percentage = Math.min(100, Math.round((consumed / DAILY_TARGET) * 100));

  if (loading) {
    return (
      <Card variant="surface" style={styles.card}>
        <ActivityIndicator size="small" color={COLORS.primary} />
      </Card>
    );
  }

  return (
    <Card variant="surface" style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons name="water" size={22} color={COLORS.primary} />
          <Text style={typography.h4}>HIDRATAÇÃO DIÁRIA</Text>
        </View>
        <Text style={typography.h4}>{consumed} / {DAILY_TARGET} ml</Text>
      </View>

      <View style={styles.progressContainer}>
        <ProgressBar value={consumed} max={DAILY_TARGET} label={`${percentage}% DA META`} />
      </View>

      <View style={styles.buttonsRow}>
        <TouchableOpacity style={styles.waterBtn} onPress={() => addWater(250)}>
          <Ionicons name="water-outline" size={16} color={COLORS.background} />
          <Text style={styles.btnText}>+250 ml</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.waterBtn} onPress={() => addWater(500)}>
          <Ionicons name="water" size={16} color={COLORS.background} />
          <Text style={styles.btnText}>+500 ml</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { padding: SPACING.lg, marginBottom: SPACING.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  titleContainer: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  progressContainer: { marginBottom: SPACING.md },
  buttonsRow: { flexDirection: 'row', gap: SPACING.md },
  waterBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.xs, backgroundColor: COLORS.primary, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.md },
  btnText: { fontFamily: 'Montserrat_700Bold', fontSize: 13, color: COLORS.background },
});
