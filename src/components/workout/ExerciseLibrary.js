// src/components/workout/ExerciseLibrary.js
// Biblioteca de exercícios completa - NOVAIX FITNESS

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { getNutritionContent } from '../../services/nutritionContent';
import ExerciseFilters, { MUSCLE_GROUPS, DIFFICULTY } from './ExerciseFilters';
import { EXERCISE_FALLBACK } from '../../data/exerciseLibrary';

function ExerciseItem({ exercise, index, onPress }) {
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const diffConfig = DIFFICULTY.find(d => d.key === exercise.difficulty) || DIFFICULTY[0];
  const muscleColor = MUSCLE_GROUPS.find(m => m.key === exercise.muscle)?.color || COLORS.primary;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, tension: 40, friction: 8, delay: index * 30, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, delay: index * 30, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.itemContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity style={styles.item} onPress={() => onPress?.(exercise)} activeOpacity={0.8}>
        <View style={[styles.muscleIcon, { backgroundColor: muscleColor + '15' }]}>
          <Ionicons name="barbell" size={18} color={muscleColor} />
        </View>
        <View style={styles.itemCenter}>
          <Text style={styles.itemName}>{exercise.name}</Text>
          <View style={styles.itemMeta}>
            <Text style={styles.metaText}>{exercise.muscle}</Text>
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.metaText}>{exercise.equipment}</Text>
          </View>
        </View>
        <View style={styles.itemRight}>
          <View style={[styles.diffBadge, { backgroundColor: diffConfig.color + '15' }]}>
            <Text style={[styles.diffText, { color: diffConfig.color }]}>{exercise.difficulty?.slice(0, 3)}</Text>
          </View>
          <Text style={styles.setsText}>{exercise.sets}x{exercise.reps}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function ExerciseLibrary({ onSelect }) {
  const [exercises, setExercises] = useState(EXERCISE_FALLBACK);
  const [search, setSearch] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('all');
  const [selectedEquipment, setSelectedEquipment] = useState('Todos');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  useEffect(() => { loadExercises(); }, []);

  const loadExercises = async () => {
    try {
      const data = await getNutritionContent('foods');
      if (data?.exercises && data.exercises.length > 0) setExercises(data.exercises);
    } catch { }
  };

  const filtered = useMemo(() => {
    let result = exercises;
    if (selectedMuscle !== 'all') result = result.filter(e => e.muscle === selectedMuscle);
    if (selectedEquipment !== 'Todos') result = result.filter(e => e.equipment === selectedEquipment);
    if (selectedDifficulty !== 'all') result = result.filter(e => e.difficulty === selectedDifficulty);
    if (search.trim()) {
      const lower = search.toLowerCase();
      result = result.filter(e => e.name.toLowerCase().includes(lower) || e.muscle.toLowerCase().includes(lower));
    }
    return result;
  }, [exercises, search, selectedMuscle, selectedEquipment, selectedDifficulty]);

  const stats = useMemo(() => ({
    total: filtered.length,
    muscles: [...new Set(filtered.map(e => e.muscle))].length,
    avgCalories: filtered.length > 0 ? Math.round(filtered.reduce((s, e) => s + (e.calories || 0), 0) / filtered.length) : 0,
  }), [filtered]);

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color={COLORS.textMuted} />
          <TextInput style={styles.searchInput} value={search} onChangeText={setSearch} placeholder="Buscar exercício..." placeholderTextColor={COLORS.textMuted} />
          {search.length > 0 && <TouchableOpacity onPress={() => setSearch('')}><Ionicons name="close-circle" size={18} color={COLORS.textMuted} /></TouchableOpacity>}
        </View>
      </View>

      <ExerciseFilters
        selectedMuscle={selectedMuscle} onSelectMuscle={setSelectedMuscle}
        selectedEquipment={selectedEquipment} onSelectEquipment={setSelectedEquipment}
        selectedDifficulty={selectedDifficulty} onSelectDifficulty={setSelectedDifficulty}
        stats={stats}
      />

      <FlatList
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={5}
        data={filtered}
        keyExtractor={(item, i) => `${item.name}-${i}`}
        renderItem={({ item, index }) => <ExerciseItem exercise={item} index={index} onPress={onSelect} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="search-outline" size={32} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>Nenhum exercício encontrado</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  searchRow: { padding: SPACING.lg, paddingBottom: SPACING.sm },
  searchContainer: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, paddingHorizontal: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  searchInput: { flex: 1, height: 44, fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textTitle },
  list: { padding: SPACING.lg, paddingTop: 0 },
  itemContainer: { marginBottom: SPACING.sm },
  item: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  muscleIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md },
  itemCenter: { flex: 1 },
  itemName: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: COLORS.textTitle },
  itemMeta: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, marginTop: 2 },
  metaText: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted },
  metaDot: { color: COLORS.border },
  itemRight: { alignItems: 'flex-end', gap: SPACING.xs },
  diffBadge: { paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: BORDER_RADIUS.sm },
  diffText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 9, letterSpacing: 0.5 },
  setsText: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted },
  empty: { alignItems: 'center', paddingVertical: SPACING.xxxl },
  emptyText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textMuted, marginTop: SPACING.sm },
});
