// src/components/workout/ExerciseSearch.js
// Busca e seleção de exercícios - NOVAIX FITNESS
import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { EXERCISE_CATALOG } from '../../data/exerciseCatalog';

const MUSCLES = [{ key: 'all', l: 'Todos' }, { key: 'chest', l: 'Peito' }, { key: 'back', l: 'Costas' }, { key: 'legs', l: 'Pernas' }, { key: 'shoulders', l: 'Ombros' }, { key: 'arms', l: 'Braços' }, { key: 'abs', l: 'Abdômen' }, { key: 'cardio', l: 'Cardio' }];
const EQUIP = [{ key: 'all', l: 'Todos' }, { key: 'none', l: 'Corporal' }, { key: 'barbell', l: 'Barra' }, { key: 'dumbbells', l: 'Halteres' }, { key: 'machine', l: 'Máquina' }, { key: 'cable', l: 'Cabo' }];
const MC = { chest: COLORS.success, back: COLORS.info, legs: COLORS.secondary, shoulders: COLORS.attention, arms: COLORS.primary, abs: '#00E676', cardio: COLORS.rose };

function flatten(muscleFilter) {
  const list = [];
  (muscleFilter === 'all' ? Object.keys(EXERCISE_CATALOG) : [muscleFilter]).forEach(g => {
    const lv = EXERCISE_CATALOG[g] || {};
    ['beginner', 'intermediate', 'advanced'].forEach(l => (lv[l] || []).forEach(ex => list.push({ ...ex, muscleGroup: g, level: l })));
  });
  return list;
}

const Chips = ({ data, active, onSelect }) => (
  <FlatList horizontal data={data} keyExtractor={i => i.key} showsHorizontalScrollIndicator={false} style={{ marginBottom: SPACING.xs, maxHeight: 36 }}
    renderItem={({ item }) => <TouchableOpacity style={[st.chip, active === item.key && st.chipA]} onPress={() => onSelect(item.key)}><Text style={[st.chipT, active === item.key && st.chipTA]}>{item.l}</Text></TouchableOpacity>} />
);

export default function ExerciseSearch({ onSelect, selectedIds = [] }) {
  const [search, setSearch] = useState('');
  const [muscle, setMuscle] = useState('all');
  const [equip, setEquip] = useState('all');
  const exercises = useMemo(() => {
    let list = flatten(muscle);
    if (equip !== 'all') list = list.filter(e => e.equipment === equip);
    if (search) { const q = search.toLowerCase(); list = list.filter(e => e.name.toLowerCase().includes(q)); }
    return list;
  }, [muscle, equip, search]);

  return (
    <View style={st.ct}>
      <View style={st.sr}><Ionicons name="search" size={16} color={COLORS.textMuted} />
        <TextInput style={st.si} value={search} onChangeText={setSearch} placeholder="Buscar exercício..." placeholderTextColor={COLORS.textMuted} />
      </View>
      <Chips data={MUSCLES} active={muscle} onSelect={setMuscle} />
      <Chips data={EQUIP} active={equip} onSelect={setEquip} />
      <FlatList data={exercises} keyExtractor={(item, i) => `${item.name}-${i}`} style={{ flex: 1 }} showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={{ textAlign: 'center', fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, marginTop: SPACING.xxl }}>Nenhum exercício encontrado</Text>}
        renderItem={({ item }) => {
          const sel = selectedIds.includes(item.name);
          return (
            <TouchableOpacity style={[st.card, sel && st.cardS]} onPress={() => onSelect(item)} disabled={sel} accessibilityLabel={`${item.name}`} accessibilityRole="button">
              <View style={[st.ci, { backgroundColor: (MC[item.muscleGroup] || COLORS.primary) + '20' }]}><Ionicons name="barbell" size={16} color={MC[item.muscleGroup] || COLORS.primary} /></View>
              <View style={{ flex: 1 }}><Text style={[st.cn, sel && { color: COLORS.primary }]} numberOfLines={1}>{item.name}</Text><Text style={st.cm}>{item.muscleGroup} • {item.equipment === 'none' ? 'Corporal' : item.equipment}</Text></View>
              <Ionicons name={sel ? 'checkmark-circle' : 'add-circle-outline'} size={22} color={sel ? COLORS.primary : COLORS.textMuted} />
            </TouchableOpacity>
          );
        }} />
    </View>
  );
}

const st = StyleSheet.create({
  ct: { flex: 1 }, sr: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: SPACING.md, height: 44, marginBottom: SPACING.sm },
  si: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textTitle },
  chip: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.full, borderWidth: 1, borderColor: COLORS.border, marginRight: SPACING.xs, height: 30 },
  chipA: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipT: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.textMuted }, chipTA: { color: COLORS.background },
  card: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, padding: SPACING.md, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, marginBottom: SPACING.xs, borderWidth: 1, borderColor: COLORS.border },
  cardS: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '08' },
  ci: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  cn: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: COLORS.textTitle },
  cm: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
});
