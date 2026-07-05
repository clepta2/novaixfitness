// src/components/nutrition/FoodSwaps.js
// Substituições inteligentes via IA - NOVAIX FITNESS

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { getNutritionContent, refreshNutritionContent } from '../../services/nutritionContent';

const FALLBACK_SWAPS = [
  { from: 'Peito de frango', to: 'Peito de peru', reason: 'Menos gordura, mesma proteína', category: 'Proteínas' },
  { from: 'Carne bovina', to: 'Linguiça de frango', reason: 'Menos calorias', category: 'Proteínas' },
  { from: 'Ovo inteiro', to: 'Clara de ovo', reason: 'Zero gordura, mais proteína', category: 'Proteínas' },
  { from: 'Arroz branco', to: 'Arroz integral', reason: 'Mais fibra, menor IG', category: 'Carboidratos' },
  { from: 'Pão branco', to: 'Pão integral', reason: 'Mais fibra, saciedade', category: 'Carboidratos' },
  { from: 'Batata inglesa', to: 'Batata doce', reason: 'Mais vitaminas', category: 'Carboidratos' },
  { from: 'Manteiga', to: 'Azeite', reason: 'Gordura boa, anti-inflamatório', category: 'Gorduras' },
  { from: 'Requeijão', to: 'Cottage', reason: 'Menos gordura, mais proteína', category: 'Gorduras' },
  { from: 'Chocolate', to: 'Chocolate 70%+', reason: 'Menos açúcar', category: 'Lanches' },
  { from: 'Salgadinho', to: 'Castanhas', reason: 'Gorduras boas, saciedade', category: 'Lanches' },
  { from: 'Suco artificial', to: 'Água com limão', reason: 'Zero açúcar', category: 'Lanches' },
];

const ICON_MAP = { Proteínas: 'flash', Carboidratos: 'leaf', Gorduras: 'water', Lanches: 'cafe' };
const COLOR_MAP = { Proteínas: COLORS.success, Carboidratos: COLORS.primary, Gorduras: COLORS.secondary, Lanches: COLORS.attention };

function SwapCard({ swap }: any) {
  return (
    <View style={styles.swapCard}>
      <View style={styles.swapFrom}>
        <Ionicons name="close-circle" size={16} color={COLORS.error} />
        <Text style={styles.fromText}>{swap.from}</Text>
      </View>
      <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
      <View style={styles.swapTo}>
        <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
        <Text style={styles.toText}>{swap.to}</Text>
      </View>
      <Text style={styles.reason}>{swap.reason}</Text>
    </View>
  );
}

export default function FoodSwaps() {
  const [swaps, setSwaps] = useState(FALLBACK_SWAPS);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  useEffect(() => { loadSwaps(); }, []);

  const loadSwaps = async () => {
    setLoading(true);
    try {
      const data = await getNutritionContent('swaps');
      if (data?.swaps && data.swaps.length > 0) setSwaps(data.swaps);
    } catch { }
    finally { setLoading(false); }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const data = await refreshNutritionContent('swaps');
      if (data?.swaps && data.swaps.length > 0) setSwaps(data.swaps);
    } catch { }
    finally { setLoading(false); }
  };

  const categories = [...new Set(swaps.map(s => s.category))];

  const grouped: any = {};
  swaps.forEach((s: any) => {
    if (!grouped[s.category]) grouped[s.category] = [];
    grouped[s.category].push(s);
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="swap-horizontal" size={18} color={COLORS.primary} />
        <Text style={styles.title}>SUBSTITUIÇÕES INTELIGENTES</Text>
        <TouchableOpacity onPress={handleRefresh} style={styles.refreshBtn}>
          <Ionicons name={loading ? 'sync' : 'refresh'} size={14} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.categoryRow}>
        {categories.map(cat => (
          <TouchableOpacity key={cat} style={[styles.categoryBtn, selectedCategory === cat && { backgroundColor: COLOR_MAP[cat] || COLORS.primary }]} onPress={() => setSelectedCategory(selectedCategory === cat ? null : cat)}>
            <Ionicons name={ICON_MAP[cat] || 'help-circle'} size={14} color={selectedCategory === cat ? COLORS.background : COLORS.textMuted} />
            <Text style={[styles.categoryText, selectedCategory === cat && styles.categoryTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scroll}>
        {Object.entries(grouped).filter(([cat]) => !selectedCategory || cat === selectedCategory).map(([cat, catSwaps]) => (
          <View key={cat} style={styles.categorySection}>
            <View style={[styles.categoryHeader, { borderLeftColor: COLOR_MAP[cat] || COLORS.primary }]}>
              <Text style={[styles.categoryTitle, { color: COLOR_MAP[cat] || COLORS.primary }]}>{cat}</Text>
            </View>
            {(catSwaps as any[]).map((swap, i) => <SwapCard key={i} swap={swap} />)}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textMuted, letterSpacing: 1, flex: 1 },
  refreshBtn: { padding: SPACING.xs },
  categoryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs, marginBottom: SPACING.md },
  categoryBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.full, borderWidth: 1, borderColor: COLORS.border },
  categoryText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.textMuted },
  categoryTextActive: { color: COLORS.background },
  scroll: { maxHeight: 350 },
  categorySection: { marginBottom: SPACING.md },
  categoryHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, borderLeftWidth: 3, paddingLeft: SPACING.sm, marginBottom: SPACING.sm },
  categoryTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 12, letterSpacing: 1 },
  swapCard: { backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.sm, padding: SPACING.sm, marginBottom: SPACING.xs },
  swapFrom: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, marginBottom: SPACING.xs },
  fromText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted, textDecorationLine: 'line-through' },
  swapTo: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, marginBottom: SPACING.xs },
  toText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textTitle },
  reason: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted, fontStyle: 'italic' },
});
