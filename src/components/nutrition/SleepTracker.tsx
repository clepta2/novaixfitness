// src/components/nutrition/SleepTracker.js
// Rastreador de qualidade do sono - NOVAIX FITNESS

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { supabase } from '../../config/supabase';

const SLEEP_QUALITY = [
  { level: 1, label: 'Péssimo', icon: 'bed', color: COLORS.error },
  { level: 2, label: 'Ruim', icon: 'bed', color: COLORS.secondary },
  { level: 3, label: 'Regular', icon: 'moon', color: COLORS.attention },
  { level: 4, label: 'Bom', icon: 'moon', color: COLORS.success },
  { level: 5, label: 'Ótimo', icon: 'star', color: COLORS.primary },
];

const SLEEP_DURATION = [
  { hours: 5, label: '<6h' },
  { hours: 6, label: '6-7h' },
  { hours: 7, label: '7-8h' },
  { hours: 8, label: '8-9h' },
  { hours: 9, label: '9h+' },
];

export default function SleepTracker({ userId }) {
  const [quality, setQuality] = useState<any>(null);
  const [duration, setDuration] = useState<any>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => { loadToday(); }, [userId]);

  const loadToday = async () => {
    if (!userId) return;
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { data } = await supabase.from('sleep_logs')
        .select('quality, duration_hours')
        .eq('user_id', userId)
        .gte('logged_at', today.toISOString())
        .single();
      if (data) {
        setQuality(data.quality);
        setDuration(data.duration_hours);
        setSaved(true);
      }
    } catch { }
  };

  const handleSave = async () => {
    if (!userId || !quality || !duration) return;
    try {
      const today = new Date().toISOString().split('T')[0];
      await supabase.from('sleep_logs').upsert({
        user_id: userId,
        quality,
        duration_hours: duration,
        logged_at: today,
      }, { onConflict: 'user_id,logged_at' });
      setSaved(true);
    } catch (err) {
      if (__DEV__) console.error('Erro ao salvar sono:', err);
    }
  };

  const avgQuality = quality ? SLEEP_QUALITY.find(q => q.level === quality) : null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="moon" size={18} color={COLORS.info} />
        <Text style={styles.title}>QUALIDADE DO SONO</Text>
      </View>

      <Text style={styles.sectionLabel}>COMO DORMIU?</Text>
      <View style={styles.qualityRow}>
        {SLEEP_QUALITY.map(q => (
          <TouchableOpacity
            key={q.level}
            style={[styles.qualityBtn, quality === q.level && { backgroundColor: q.color + '30', borderColor: q.color }]}
            onPress={() => { setQuality(q.level); setSaved(false); }}
          >
            <Ionicons name={q.icon as any} size={18} color={quality === q.level ? q.color : COLORS.textMuted} />
            <Text style={[styles.qualityLabel, quality === q.level && { color: q.color }]}>{q.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionLabel}>DURAÇÃO</Text>
      <View style={styles.durationRow}>
        {SLEEP_DURATION.map(d => (
          <TouchableOpacity
            key={d.hours}
            style={[styles.durationBtn, duration === d.hours && styles.durationActive]}
            onPress={() => { setDuration(d.hours); setSaved(false); }}
          >
            <Text style={[styles.durationText, duration === d.hours && styles.durationTextActive]}>{d.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {avgQuality && (
        <View style={styles.summaryCard}>
          <Ionicons name={avgQuality.icon as any} size={20} color={avgQuality.color} />
          <View style={styles.summaryInfo}>
            <Text style={styles.summaryLabel}>Sono: {avgQuality.label}</Text>
            <Text style={styles.summaryDetail}>{duration}h de descanso</Text>
          </View>
        </View>
      )}

      <TouchableOpacity style={[styles.saveBtn, saved && styles.saveBtnSaved]} onPress={handleSave} disabled={!quality || !duration}>
        <Ionicons name={saved ? 'checkmark-circle' : 'save'} size={18} color={COLORS.background} />
        <Text style={styles.saveText}>{saved ? 'Salvo!' : 'Registrar Sono'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textMuted, letterSpacing: 1 },
  sectionLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.textMuted, letterSpacing: 1, marginBottom: SPACING.sm },
  qualityRow: { flexDirection: 'row', gap: SPACING.xs, marginBottom: SPACING.lg },
  qualityBtn: { flex: 1, alignItems: 'center', padding: SPACING.sm, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.sm, borderWidth: 1, borderColor: COLORS.border, gap: SPACING.xs },
  qualityLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 9, color: COLORS.textMuted },
  durationRow: { flexDirection: 'row', gap: SPACING.xs, marginBottom: SPACING.lg },
  durationBtn: { flex: 1, paddingVertical: SPACING.sm, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.sm, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center' },
  durationActive: { backgroundColor: COLORS.info, borderColor: COLORS.info },
  durationText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textMuted },
  durationTextActive: { color: COLORS.background },
  summaryCard: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, marginBottom: SPACING.md },
  summaryInfo: { flex: 1 },
  summaryLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: COLORS.textTitle },
  summaryDetail: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted },
  saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.info, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.md },
  saveBtnSaved: { backgroundColor: COLORS.success },
  saveText: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.background, letterSpacing: 1 },
});
