// src/components/nutrition/MealHistory.js
// Histórico de refeições com filtros - NOVAIX FITNESS

import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { getMealLogs } from '../../services/mealAnalyzer';

const MEAL_ICONS = { cafe: 'sunny', almoco: 'restaurant', jantar: 'moon', lanche: 'cafe', outro: 'nutrition' };
const MEAL_COLORS = { cafe: COLORS.attention, almoco: COLORS.primary, jantar: COLORS.info, lanche: COLORS.success, outro: COLORS.textMuted };

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - date) / 86400000);
  if (diff === 0) return 'Hoje';
  if (diff === 1) return 'Ontem';
  if (diff < 7) return `${diff} dias atrás`;
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

function formatTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function MealItem({ meal }) {
  const icon = MEAL_ICONS[meal.meal_type] || MEAL_ICONS.outro;
  const color = MEAL_COLORS[meal.meal_type] || MEAL_COLORS.outro;

  return (
    <View style={styles.mealItem}>
      <View style={[styles.mealIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <View style={styles.mealInfo}>
        <View style={styles.mealHeader}>
          <Text style={styles.mealName}>{meal.description || 'Refeição'}</Text>
          <Text style={styles.mealTime}>{formatTime(meal.logged_at)}</Text>
        </View>
        <Text style={styles.mealDate}>{formatDate(meal.logged_at)}</Text>
        <View style={styles.mealMacros}>
          <Text style={[styles.macro, { color: COLORS.primary }]}>{meal.calories} kcal</Text>
          <Text style={styles.macroDot}>•</Text>
          <Text style={styles.macro}>{meal.protein}g P</Text>
          <Text style={styles.macroDot}>•</Text>
          <Text style={styles.macro}>{meal.carbs}g C</Text>
          <Text style={styles.macroDot}>•</Text>
          <Text style={styles.macro}>{meal.fat}g G</Text>
        </View>
      </View>
    </View>
  );
}

export default function MealHistory({ userId }) {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => { loadMeals(); }, [userId]);

  const loadMeals = async () => {
    setLoading(true);
    try {
      const data = await getMealLogs(userId);
      setMeals(data);
    } catch (err) {
      console.error('Erro ao carregar histórico:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    if (filter === 'all') return meals;
    return meals.filter(m => m.meal_type === filter);
  }, [meals, filter]);

  const filters = [
    { key: 'all', label: 'Todos' },
    { key: 'cafe', label: 'Café' },
    { key: 'almoco', label: 'Almoço' },
    { key: 'lanche', label: 'Lanche' },
    { key: 'jantar', label: 'Jantar' },
  ];

  const totalCalories = useMemo(() => filtered.reduce((sum, m) => sum + (m.calories || 0), 0), [filtered]);

  if (loading) {
    return <View style={styles.loading}><Text style={styles.loadingText}>Carregando...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>HISTÓRICO DE REFEIÇÕES</Text>
        <Text style={styles.total}>{totalCalories} kcal total</Text>
      </View>

      <View style={styles.filterRow}>
        {filters.map(f => (
          <TouchableOpacity key={f.key} style={[styles.filterBtn, filter === f.key && styles.filterActive]} onPress={() => setFilter(f.key)}>
            <Text style={[styles.filterText, filter === f.key && styles.filterTextActive]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="restaurant-outline" size={32} color={COLORS.textMuted} />
          <Text style={styles.emptyText}>Nenhuma refeição registrada</Text>
        </View>
      ) : (
        <FlatList
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={5}
          data={filtered}
          keyExtractor={(item, index) => item.id?.toString() || `meal-${index}`}
          renderItem={({ item }) => <MealItem meal={item} />}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  loading: { padding: SPACING.xxl, alignItems: 'center' },
  loadingText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textMuted, letterSpacing: 1 },
  total: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.primary },
  filterRow: { flexDirection: 'row', gap: SPACING.xs, marginBottom: SPACING.md },
  filterBtn: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.full, borderWidth: 1, borderColor: COLORS.border },
  filterActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textMuted },
  filterTextActive: { color: COLORS.background },
  empty: { padding: SPACING.xxl, alignItems: 'center' },
  emptyText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textMuted, marginTop: SPACING.sm },
  separator: { height: 1, backgroundColor: COLORS.border, marginVertical: SPACING.sm },
  mealItem: { flexDirection: 'row', gap: SPACING.md },
  mealIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  mealInfo: { flex: 1 },
  mealHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  mealName: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: COLORS.textTitle, flex: 1 },
  mealTime: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted },
  mealDate: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  mealMacros: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, marginTop: SPACING.xs },
  macro: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textDescription },
  macroDot: { color: COLORS.textMuted },
});
