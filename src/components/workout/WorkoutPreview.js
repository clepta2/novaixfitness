// src/components/workout/WorkoutPreview.js
// Pré-visualização do treino - NOVAIX FITNESS
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

const MC = { chest: COLORS.success, back: COLORS.info, legs: COLORS.secondary, shoulders: COLORS.attention, arms: COLORS.primary, abs: '#00E676', cardio: COLORS.rose };

export default function WorkoutPreview({ name, category, level, exercises = [], duration }) {
  const totalSets = exercises.reduce((s, e) => s + (e.sets || 4), 0);
  const totalReps = exercises.reduce((s, e) => s + (parseInt(String(e.reps).replace(/[^0-9]/g, '')) || 10) * (e.sets || 4), 0);
  const muscles = [...new Set(exercises.map(e => e.muscleGroup || e.muscle))];
  const stats = [
    { icon: 'barbell', val: exercises.length, lbl: 'Exercícios', c: COLORS.primary },
    { icon: 'repeat', val: totalSets, lbl: 'Séries', c: COLORS.success },
    { icon: 'flash', val: totalReps, lbl: 'Reps', c: COLORS.attention },
    { icon: 'time', val: `~${duration || 30}min`, lbl: 'Estimado', c: COLORS.info },
  ];
  return (
    <View style={s.ct}>
      <Text style={s.sl}>PRÉ-VISUALIZAÇÃO</Text>
      <View style={s.card}>
        <Text style={s.name}>{name || 'Sem nome'}</Text>
        <View style={s.row}>
          {category && <View style={s.badge}><Text style={s.badgeTxt}>{category}</Text></View>}
          {level && <View style={[s.badge, { backgroundColor: COLORS.primary + '20' }]}><Text style={[s.badgeTxt, { color: COLORS.primary }]}>{level}</Text></View>}
        </View>
        <View style={s.sg}>{stats.map((st, i) => (
          <View key={i} style={s.si}><Ionicons name={st.icon} size={16} color={st.c} /><Text style={s.sv}>{st.val}</Text><Text style={s.sl2}>{st.lbl}</Text></View>
        ))}</View>
        {muscles.length > 0 && <View style={s.mr}>{muscles.map((m, i) => (
          <View key={i} style={[s.mb, { backgroundColor: (MC[m] || COLORS.primary) + '20' }]}><Text style={[s.mt, { color: MC[m] || COLORS.primary }]}>{m}</Text></View>
        ))}</View>}
      </View>
      <Text style={s.sl}>EXERCÍCIOS</Text>
      {exercises.map((ex, i) => (
        <View key={i} style={s.ei}>
          <View style={s.en}><Text style={s.ent}>{i + 1}</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={s.en2} numberOfLines={1}>{ex.name}</Text>
            <Text style={s.ed}>{ex.sets || 4}x{ex.reps || '10-12'} • {ex.rest || 60}s{ex.weight ? ` • ${ex.weight}` : ''}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  ct: { flex: 1 }, sl: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.textMuted, letterSpacing: 1, marginBottom: SPACING.sm },
  card: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.md },
  name: { fontFamily: 'Montserrat_700Bold', fontSize: 18, color: COLORS.textTitle, marginBottom: SPACING.xs },
  row: { flexDirection: 'row', gap: SPACING.xs, marginBottom: SPACING.md },
  badge: { backgroundColor: COLORS.primary + '15', paddingHorizontal: SPACING.sm, paddingVertical: 3, borderRadius: BORDER_RADIUS.sm },
  badgeTxt: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.primary },
  sg: { flexDirection: 'row', justifyContent: 'space-between' },
  si: { alignItems: 'center', gap: 4 },
  sv: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 16, color: COLORS.textTitle },
  sl2: { fontFamily: 'Inter_400Regular', fontSize: 9, color: COLORS.textMuted },
  mr: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs, marginTop: SPACING.md },
  mb: { paddingHorizontal: SPACING.sm, paddingVertical: 3, borderRadius: BORDER_RADIUS.sm },
  mt: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10 },
  ei: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.borderLight },
  en: { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.primary + '15', justifyContent: 'center', alignItems: 'center' },
  ent: { fontFamily: 'Montserrat_700Bold', fontSize: 11, color: COLORS.primary },
  en2: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: COLORS.textTitle },
  ed: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
});
