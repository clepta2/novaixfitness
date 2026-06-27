// src/components/nutrition/FoodDatabase.js
// Banco de dados de alimentos via IA - NOVAIX FITNESS

import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { getNutritionContent, refreshNutritionContent } from '../../services/nutritionContent';

const FALLBACK_FOODS = [
  { name: 'Arroz branco', portion: '100g', cal: 130, pro: 3, carb: 28, fat: 0.5, cat: 'Carboidratos' },
  { name: 'Feijão carioca', portion: '100g', cal: 90, pro: 6, carb: 16, fat: 0.5, cat: 'Carboidratos' },
  { name: 'Batata doce', portion: '100g', cal: 86, pro: 2, carb: 20, fat: 0.1, cat: 'Carboidratos' },
  { name: 'Pão integral', portion: '1 un', cal: 75, pro: 3, carb: 14, fat: 1, cat: 'Carboidratos' },
  { name: 'Banana', portion: '1 un', cal: 89, pro: 1, carb: 23, fat: 0.3, cat: 'Frutas' },
  { name: 'Peito de frango', portion: '100g', cal: 165, pro: 31, carb: 0, fat: 4, cat: 'Proteínas' },
  { name: 'Ovo', portion: '1 un', cal: 78, pro: 6, carb: 1, fat: 5, cat: 'Proteínas' },
  { name: 'Sardinha', portion: '100g', cal: 120, pro: 22, carb: 0, fat: 3, cat: 'Proteínas' },
  { name: 'Iogurte grego', portion: '100g', cal: 59, pro: 10, carb: 3, fat: 0.7, cat: 'Laticínios' },
  { name: 'Azeite', portion: '1 col', cal: 120, pro: 0, carb: 0, fat: 14, cat: 'Gorduras' },
  { name: 'Brócolis', portion: '100g', cal: 34, pro: 3, carb: 7, fat: 0.4, cat: 'Legumes' },
  { name: 'Whey protein', portion: '30g', cal: 120, pro: 24, carb: 3, fat: 2, cat: 'Proteínas' },
];

const CATEGORIES = ['Todos', 'Carboidratos', 'Proteínas', 'Frutas', 'Laticínios', 'Gorduras', 'Legumes'];

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
        {CATEGORIES.map(cat => (
          <TouchableOpacity key={cat} style={[styles.categoryBtn, selectedCategory === cat && styles.categoryActive]} onPress={() => setSelectedCategory(cat)}>
            <Text style={[styles.categoryText, selectedCategory === cat && styles.categoryTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.resultCount}>{filtered.length} alimentos{loading ? ' (carregando...)' : ''}</Text>

      <FlatList
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
