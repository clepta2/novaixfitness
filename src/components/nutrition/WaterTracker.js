// src/components/nutrition/WaterTracker.js
// Rastreador de hidratação diária - NOVAIX FITNESS

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { supabase } from '../../config/supabase';

const GLASS_SIZE = 250;
const DAILY_GOAL = 2500;

export default function WaterTracker({ userId }) {
  const [intake, setIntake] = useState(0);
  const [loading, setLoading] = useState(true);
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => { loadToday(); }, [userId]);

  const loadToday = async () => {
    if (!userId) { setLoading(false); return; }
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { data } = await supabase.from('water_logs')
        .select('amount')
        .eq('user_id', userId)
        .gte('logged_at', today.toISOString());
      const total = (data || []).reduce((sum, log) => sum + (log.amount || 0), 0);
      setIntake(total);
      animateProgress(total);
    } catch { }
    finally { setLoading(false); }
  };

  const animateProgress = (value) => {
    const pct = Math.min(100, (value / DAILY_GOAL) * 100);
    Animated.spring(animatedValue, { toValue: pct, tension: 30, friction: 8, useNativeDriver: false }).start();
  };

  const addWater = async (amount) => {
    setIntake((prev) => {
      const newIntake = prev + amount;
      animateProgress(newIntake);
      return newIntake;
    });
    if (userId) {
      await supabase.from('water_logs').insert({ user_id: userId, amount, logged_at: new Date().toISOString() });
    }
  };

  const progress = animatedValue.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });
  const percentage = Math.min(100, Math.round((intake / DAILY_GOAL) * 100));
  const remaining = Math.max(0, DAILY_GOAL - intake);
  const glasses = Math.round(intake / GLASS_SIZE);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="water" size={20} color={COLORS.info} />
        <Text style={styles.title}>HIDRATAÇÃO</Text>
        <Text style={styles.percentage}>{percentage}%</Text>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.barBg}>
          <Animated.View style={[styles.barFill, { width: progress }]} />
        </View>
        <View style={styles.statsRow}>
          <Text style={styles.intakeText}>{intake}ml</Text>
          <Text style={styles.goalText}>Meta: {DAILY_GOAL}ml</Text>
        </View>
      </View>

      <View style={styles.glassesRow}>
        {Array.from({ length: 10 }, (_, i) => (
          <View key={i} style={[styles.glass, i < glasses && styles.glassFilled]}>
            <Ionicons name={i < glasses ? 'water' : 'water-outline'} size={16} color={i < glasses ? COLORS.info : COLORS.textMuted} />
          </View>
        ))}
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.addBtn} onPress={() => addWater(250)} accessibilityLabel="Adicionar 250 ml" accessibilityRole="button">
          <Ionicons name="add" size={20} color={COLORS.background} />
          <Text style={styles.addBtnText}>250ml</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addBtnSmall} onPress={() => addWater(500)} accessibilityLabel="Adicionar 500 ml" accessibilityRole="button">
          <Text style={styles.addBtnSmallText}>+500ml</Text>
        </TouchableOpacity>
      </View>

      {remaining > 0 && (
        <Text style={styles.remaining}>Faltam {remaining}ml para bater a meta</Text>
      )}
      {percentage >= 100 && (
        <Text style={styles.complete}>✓ Meta de hidratação atingida!</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textMuted, letterSpacing: 1, flex: 1 },
  percentage: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 16, color: COLORS.info },
  progressSection: { marginBottom: SPACING.md },
  barBg: { height: 12, backgroundColor: COLORS.surfaceOverlay, borderRadius: 6, overflow: 'hidden', marginBottom: SPACING.xs },
  barFill: { height: '100%', backgroundColor: COLORS.info, borderRadius: 6 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  intakeText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: COLORS.textTitle },
  goalText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted },
  glassesRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.md },
  glass: { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.surfaceOverlay, justifyContent: 'center', alignItems: 'center' },
  glassFilled: { backgroundColor: COLORS.info + '30' },
  buttonRow: { flexDirection: 'row', gap: SPACING.sm },
  addBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.xs, backgroundColor: COLORS.info, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.md },
  addBtnText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.background },
  addBtnSmall: { paddingHorizontal: SPACING.lg, justifyContent: 'center', backgroundColor: COLORS.info + '20', borderRadius: BORDER_RADIUS.md },
  addBtnSmallText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.info },
  remaining: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted, textAlign: 'center', marginTop: SPACING.md },
  complete: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.success, textAlign: 'center', marginTop: SPACING.md },
});
