// src/components/nutrition/EnergyTracker.js
// Rastreador de níveis de energia ao longo do dia - NOVAIX FITNESS

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { supabase } from '../../config/supabase';
import { ENERGY_LEVELS, TIME_SLOTS } from '../../data/energyTracker';

function TimeSlotItem({ slot, rating, onRate }) {
  return (
    <View style={styles.slotItem}>
      <View style={styles.slotHeader}>
        <Ionicons name={slot.icon} size={16} color={COLORS.textMuted} />
        <Text style={styles.slotLabel}>{slot.label}</Text>
        <Text style={styles.slotTime}>{slot.time}</Text>
      </View>
      <View style={styles.ratingRow}>
        {ENERGY_LEVELS.map(e => (
          <TouchableOpacity
            key={e.level}
            style={[styles.ratingBtn, rating === e.level && { backgroundColor: e.color + '30', borderColor: e.color }]}
            onPress={() => onRate(slot.id, e.level)}
          >
            <Ionicons name={e.icon as any} size={14} color={rating === e.level ? e.color : COLORS.textMuted} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

export default function EnergyTracker({ userId }) {
  const [ratings, setRatings] = useState({});
  const [saved, setSaved] = useState(false);

  useEffect(() => { loadToday(); }, [userId]);

  const loadToday = async () => {
    if (!userId) return;
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { data } = await supabase.from('energy_logs')
        .select('time_slot, level')
        .eq('user_id', userId)
        .gte('logged_at', today.toISOString());
      if (data) {
        const map = {};
        data.forEach(d => { map[d.time_slot] = d.level; });
        setRatings(map);
      }
    } catch { }
  };

  const handleRate = (slotId, level) => {
    setRatings(prev => ({ ...prev, [slotId]: level }));
    setSaved(false);
  };

  const handleSave = async () => {
    if (!userId) return;
    try {
      for (const [slot, level] of Object.entries(ratings)) {
        await supabase.from('energy_logs').upsert({
          user_id: userId,
          time_slot: slot,
          level,
          logged_at: new Date().toISOString(),
        }, { onConflict: 'user_id,time_slot,logged_at' });
      }
      setSaved(true);
    } catch (err) {
      if (__DEV__) console.error('Erro ao salvar energia:', err);
    }
  };

  const ratedCount = Object.keys(ratings).length;
  const avgEnergy = ratedCount > 0
    ? (Object.values(ratings).reduce((a: number, b: number) => a + b, 0) / ratedCount).toFixed(1)
    : '--';

  const avgColor = Number(avgEnergy) >= 4 ? COLORS.success : Number(avgEnergy) >= 3 ? COLORS.attention : Number(avgEnergy) >= 2 ? COLORS.secondary : COLORS.error;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="flash" size={18} color={COLORS.primary} />
        <Text style={styles.title}>NÍVEL DE ENERGIA</Text>
      </View>

      <View style={styles.summaryRow}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{ratedCount}/{TIME_SLOTS.length}</Text>
          <Text style={styles.summaryLabel}>Registros</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryValue, { color: avgColor }]}>{avgEnergy}</Text>
          <Text style={styles.summaryLabel}>Média</Text>
        </View>
      </View>

      <View style={styles.legendRow}>
        {ENERGY_LEVELS.map(e => (
          <View key={e.level} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: e.color }]} />
            <Text style={styles.legendText}>{e.level}</Text>
          </View>
        ))}
      </View>

      <View style={styles.slotsList}>
        {TIME_SLOTS.map(slot => (
          <TimeSlotItem key={slot.id} slot={slot} rating={ratings[slot.id]} onRate={handleRate} />
        ))}
      </View>

      <TouchableOpacity style={[styles.saveBtn, saved && styles.saveBtnSaved]} onPress={handleSave} disabled={ratedCount === 0}>
        <Ionicons name={saved ? 'checkmark-circle' : 'save'} size={18} color={saved ? COLORS.background : COLORS.background} />
        <Text style={styles.saveText}>{saved ? 'Salvo!' : 'Salvar Registro'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textMuted, letterSpacing: 1 },
  summaryRow: { flexDirection: 'row', backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, marginBottom: SPACING.md, alignItems: 'center' },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryValue: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 20, color: COLORS.textTitle },
  summaryLabel: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted, marginTop: 2 },
  summaryDivider: { width: 1, height: 30, backgroundColor: COLORS.border },
  legendRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.md },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted },
  slotsList: { gap: SPACING.sm, marginBottom: SPACING.md },
  slotItem: { backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.sm, padding: SPACING.sm },
  slotHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, marginBottom: SPACING.xs },
  slotLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textTitle, flex: 1 },
  slotTime: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted },
  ratingRow: { flexDirection: 'row', gap: SPACING.xs },
  ratingBtn: { flex: 1, height: 32, borderRadius: BORDER_RADIUS.sm, borderWidth: 1, borderColor: COLORS.border, justifyContent: 'center', alignItems: 'center' },
  saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.primary, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.md },
  saveBtnSaved: { backgroundColor: COLORS.success },
  saveText: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.background, letterSpacing: 1 },
});
