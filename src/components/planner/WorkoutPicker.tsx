// src/components/planner/WorkoutPicker.js
// Picker de treinos disponiveis - NOVAIX FITNESS

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { supabase } from '../../config/supabase';

export default function WorkoutPicker({ selectedId, onSelect }) {
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await supabase
          .from('workouts')
          .select('id, title, category, duration_minutes, level')
          .order('title');
        setWorkouts(data || []);
      } catch {}
      setLoading(false);
    }
    load();
  }, []);

  const filtered = workouts.filter(w =>
    !search || w.title?.toLowerCase().includes(search.toLowerCase()) ||
    w.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={16} color={COLORS.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar treino..."
          placeholderTextColor={COLORS.textMuted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <TouchableOpacity
        style={[styles.option, !selectedId && styles.optionActive]}
        onPress={() => onSelect(null)}
      >
        <Ionicons name="bed-outline" size={18} color={!selectedId ? COLORS.primary : COLORS.textMuted} />
        <Text style={[styles.optionText, !selectedId && styles.optionTextActive]}>Dia de descanso</Text>
      </TouchableOpacity>

      <FlatList
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={5}
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.option, selectedId === item.id && styles.optionActive]}
            onPress={() => onSelect(item)}
          >
            <View style={styles.optionIcon}>
              <Ionicons name="barbell" size={16} color={selectedId === item.id ? COLORS.primary : COLORS.textMuted} />
            </View>
            <View style={styles.optionInfo}>
              <Text style={[styles.optionTitle, selectedId === item.id && styles.optionTextActive]} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.optionMeta}>{item.category} · {item.duration_minutes || 30}min</Text>
            </View>
          </TouchableOpacity>
        )}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { maxHeight: 300 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surfaceElevated, borderRadius: BORDER_RADIUS.sm, paddingHorizontal: SPACING.sm, marginBottom: SPACING.sm, gap: SPACING.xs },
  searchInput: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textTitle, paddingVertical: SPACING.sm },
  list: { maxHeight: 200 },
  option: { flexDirection: 'row', alignItems: 'center', padding: SPACING.sm, borderRadius: BORDER_RADIUS.sm, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.xs, gap: SPACING.sm },
  optionActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '10' },
  optionIcon: { width: 32, height: 32, borderRadius: BORDER_RADIUS.sm, backgroundColor: COLORS.surfaceElevated, justifyContent: 'center', alignItems: 'center' },
  optionInfo: { flex: 1 },
  optionTitle: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textTitle },
  optionText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted },
  optionTextActive: { color: COLORS.primary },
  optionMeta: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted, marginTop: 1 },
});
