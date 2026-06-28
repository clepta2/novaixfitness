// src/components/home/WaterLogger.js
// Widget de Hidratação animado - NOVAIX FITNESS

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../context/AuthContext';

const DAILY_TARGET = 2500;

function WaterGlass({ filled }) {
  return (
    <View style={[styles.glass, filled && styles.glassFilled]}>
      <Ionicons name={filled ? 'water' : 'water-outline'} size={14} color={filled ? COLORS.info : COLORS.textMuted} />
    </View>
  );
}

export default function WaterLogger() {
  const { user } = useAuth();
  const [consumed, setConsumed] = useState(0);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, []);

  useEffect(() => {
    Animated.spring(progressAnim, { toValue: Math.min(100, (consumed / DAILY_TARGET) * 100), tension: 30, friction: 8, useNativeDriver: false }).start();
  }, [consumed]);

  const fetchTodayWater = useCallback(async () => {
    if (!user?.id) { setLoading(false); return; }
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { data } = await supabase.from('water_logs').select('amount_ml').eq('user_id', user.id).gte('logged_at', today.toISOString());
      if (data) {
        const total = data.reduce((sum, item) => sum + item.amount_ml, 0);
        setConsumed(total);
      }
    } catch (err) { console.error('Erro:', err); }
    finally { setLoading(false); }
  }, [user?.id]);

  useEffect(() => { fetchTodayWater(); }, [fetchTodayWater]);

  const addWater = async (amount) => {
    if (!user?.id) return;
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
    const { error } = await supabase.from('water_logs').insert({ user_id: user.id, amount_ml: amount });
    if (!error) setConsumed(prev => prev + amount);
  };

  const percentage = Math.min(100, Math.round((consumed / DAILY_TARGET) * 100));
  const glassesCount = Math.min(10, Math.ceil(consumed / 250));

  const progressWidth = progressAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="water" size={20} color={COLORS.info} />
          <Text style={styles.title}>HIDRATAÇÃO</Text>
        </View>
        <Text style={styles.amount}>{consumed}ml</Text>
      </View>

      <View style={styles.glassesRow}>
        {Array.from({ length: 10 }).map((_, i) => (
          <WaterGlass key={i} filled={i < glassesCount} />
        ))}
      </View>

      <View style={styles.progressRow}>
        <View style={styles.progressBar}>
          <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
        </View>
        <Text style={styles.progressText}>{percentage}%</Text>
      </View>

      <Text style={styles.targetText}>Meta: {DAILY_TARGET}ml • Faltam {Math.max(0, DAILY_TARGET - consumed)}ml</Text>

      <View style={styles.buttonsRow}>
        <TouchableOpacity style={styles.waterBtn} onPress={() => addWater(250)}>
          <Ionicons name="add" size={18} color={COLORS.background} />
          <Text style={styles.btnText}>250ml</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.waterBtn, styles.waterBtnLarge]} onPress={() => addWater(500)}>
          <Ionicons name="add" size={18} color={COLORS.background} />
          <Text style={styles.btnText}>500ml</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textMuted, letterSpacing: 1 },
  amount: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 18, color: COLORS.info },
  glassesRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.md },
  glass: { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.surfaceOverlay, justifyContent: 'center', alignItems: 'center' },
  glassFilled: { backgroundColor: COLORS.info + '30' },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.xs },
  progressBar: { flex: 1, height: 8, backgroundColor: COLORS.surfaceOverlay, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: COLORS.info, borderRadius: 4 },
  progressText: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.info, width: 36, textAlign: 'right' },
  targetText: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted, marginBottom: SPACING.md },
  buttonsRow: { flexDirection: 'row', gap: SPACING.sm },
  waterBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.xs, backgroundColor: COLORS.info, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.md },
  waterBtnLarge: { flex: 1.5 },
  btnText: { fontFamily: 'Montserrat_700Bold', fontSize: 13, color: COLORS.background },
});
