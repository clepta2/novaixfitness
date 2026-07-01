// src/components/nutrition/FoodDatabase.js
// Banco de dados de alimentos via IA - NOVAIX FITNESS

import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { getNutritionContent, refreshNutritionContent } from '../../services/nutritionContent';
import { FALLBACK_FOODS, FOOD_CATEGORIES } from '../../data/foodDatabase';

function FoodItem({ food }) {
  return (
    <View style={styles.foodItem}>
      <View style={styles.foodHeader}>
        <Text style={styles.foodName}>{food.name}</Text>
        <Text style={styles.foodPortion}>{food.portion}</Text>
      </View>
      <View style={styles.macrosRow}>
        <View style={[styles.macroBadge, { backgroundColor: COLORS.primary + '20' }]}>
          <Text style={[styles.macroText, { color: COLORS.primary }]}>{food.cal} kcal</Text>
        </View>
        <View style={[styles.macroBadge, { backgroundColor: COLORS.success + '20' }]}>
          <Text style={[styles.macroText, { color: COLORS.success }]}>{food.pro}g P</Text>
        </View>
        <View style={[styles.macroBadge, { backgroundColor: COLORS.attention + '20' }]}>
          <Text style={[styles.macroText, { color: COLORS.attention }]}>{food.carb}g C</Text>
        </View>
        <View style={[styles.macroBadge, { backgroundColor: COLORS.secondary + '20' }]}>
          <Text style={[styles.macroText, { color: COLORS.secondary }]}>{food.fat}g G</Text>
        </View>
      </View>
    </View>
  );
}

export default function FoodDatabase() {
  const [foods, setFoods] = useState(FALLBACK_FOODS);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  useEffect(() => { loadFoods(); }, []);

  const loadFoods = async () => {
    setLoading(true);
    try {
      const data = await getNutritionContent('foods');
      if (data?.foods && data.foods.length > 0) {
        setFoods(data.foods);
      }
    } catch { }
    finally { setLoading(false); }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const data = await refreshNutritionContent('foods');
      if (data?.foods && data.foods.length > 0) {
        setFoods(data.foods);
      }
    } catch { }
    finally { setLoading(false); }
  };

  const filtered = useMemo(() => {
    let result = foods;
    if (selectedCategory !== 'Todos') {
      result = result.filter(f => f.cat === selectedCategory);
    }
    if (search.trim()) {
      const lower = search.toLowerCase();
      result = result.filter(f => f.name.toLowerCase().includes(lower));
    }
    return result;
  }, [foods, search, selectedCategory]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="nutrition" size={18} color={COLORS.primary} />
        <Text style={styles.title}>TABELA DE ALIMENTOS</Text>
        <TouchableOpacity onPress={handleRefresh} style={styles.refreshBtn}>
          <Ionicons name={loading ? 'sync' : 'refresh'} size={14} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color={COLORS.textMuted} />
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar alimento..."
          placeholderTextColor={COLORS.textMuted}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.categoryRow}>
        {FOOD_CATEGORIES.map(cat => (
          <TouchableOpacity key={cat} style={[styles.categoryBtn, selectedCategory === cat && styles.categoryActive]} onPress={() => setSelectedCategory(cat)}>
            <Text style={[styles.categoryText, selectedCategory === cat && styles.categoryTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.resultCount}>{filtered.length} alimentos{loading ? ' (carregando...)' : ''}</Text>

      <FlatList
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={5}
        data={filtered}
        keyExtractor={(item, i) => `${item.name}-${i}`}
        renderItem={({ item }) => <FoodItem food={item} />}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textMuted, letterSpacing: 1, flex: 1 },
  refreshBtn: { padding: SPACING.xs },
  searchContainer: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, paddingHorizontal: SPACING.md, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  searchInput: { flex: 1, height: 40, fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textTitle },
  categoryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs, marginBottom: SPACING.md },
  categoryBtn: { paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.full, borderWidth: 1, borderColor: COLORS.border },
  categoryActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  categoryText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.textMuted },
  categoryTextActive: { color: COLORS.background },
  resultCount: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted, marginBottom: SPACING.sm },
  separator: { height: 1, backgroundColor: COLORS.border, marginVertical: SPACING.xs },
  foodItem: { backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.sm, padding: SPACING.md },
  foodHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.xs },
  foodName: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: COLORS.textTitle },
  foodPortion: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted },
  macrosRow: { flexDirection: 'row', gap: SPACING.xs },
  macroBadge: { paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: BORDER_RADIUS.sm },
  macroText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10 },
});
