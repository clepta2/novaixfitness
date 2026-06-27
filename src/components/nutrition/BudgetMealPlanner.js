// src/components/nutrition/BudgetMealPlanner.js
// Planejador de refeições por orçamento - NOVAIX FITNESS

import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

const BUDGET_TIERS = [
  { id: 'low', label: 'Econômico', range: 'R$ 30-50/dia', icon: 'wallet', color: COLORS.success },
  { id: 'medium', label: 'Moderado', range: 'R$ 50-80/dia', icon: 'cash', color: COLORS.primary },
  { id: 'high', label: 'Premium', range: 'R$ 80-120/dia', icon: 'card', color: COLORS.secondary },
];

const MEAL_PLANS = {
  low: {
    title: 'Plano Econômico',
    totalWeekly: 'R$ 250-350',
    meals: [
      { type: 'Café da Manhã', items: ['Ovos (3)', 'Pão integral', 'Banana'], cost: '~R$ 8', calories: 380, protein: 24 },
      { type: 'Almoço', items: ['Arroz', 'Feijão', 'Frango (150g)', 'Salada'], cost: '~R$ 15', calories: 580, protein: 42 },
      { type: 'Lanche', items: ['Iogurte', 'Aveia', 'Mel'], cost: '~R$ 6', calories: 220, protein: 12 },
      { type: 'Jantar', items: ['Macarrão', 'Sardinha', 'Brócolis'], cost: '~R$ 12', calories: 480, protein: 35 },
    ],
    tips: ['Ovos caixa 30', 'Frango congelado', 'Arroz/feijão pacote grande'],
  },
  medium: {
    title: 'Plano Moderado',
    totalWeekly: 'R$ 400-550',
    meals: [
      { type: 'Café da Manhã', items: ['Omelete (3)', 'Pão integral', 'Aveia com frutas'], cost: '~R$ 12', calories: 420, protein: 28 },
      { type: 'Almoço', items: ['Arroz integral', 'Feijão', 'Frango grelhado', 'Legumes'], cost: '~R$ 20', calories: 600, protein: 45 },
      { type: 'Lanche', items: ['Whey', 'Banana', 'Castanhas'], cost: '~R$ 10', calories: 280, protein: 32 },
      { type: 'Jantar', items: ['Peixe', 'Batata doce', 'Salada'], cost: '~R$ 18', calories: 500, protein: 38 },
    ],
    tips: ['Varie proteínas', 'Peixe fresco', 'Temperos naturais'],
  },
  high: {
    title: 'Plano Premium',
    totalWeekly: 'R$ 600-850',
    meals: [
      { type: 'Café da Manhã', items: ['Ovos caipira', 'Pão artesanal', 'Açaí'], cost: '~R$ 18', calories: 480, protein: 30 },
      { type: 'Almoço', items: ['Arroz orgânico', 'Feijão', 'Filé mignon', 'Legumes'], cost: '~R$ 35', calories: 650, protein: 50 },
      { type: 'Lanche', items: ['Whey isolate', 'Frutas', 'Castanhas'], cost: '~R$ 15', calories: 300, protein: 35 },
      { type: 'Jantar', items: ['Salmão', 'Quinoa', 'Aspargos'], cost: '~R$ 28', calories: 520, protein: 42 },
    ],
    tips: ['Orgânico', 'Peixe fresco', 'Suplementos premium'],
  },
};

function MealCard({ meal }) {
  return (
    <View style={styles.mealCard}>
      <View style={styles.mealHeader}>
        <Text style={styles.mealType}>{meal.type}</Text>
        <Text style={styles.mealCost}>{meal.cost}</Text>
      </View>
      <View style={styles.mealItems}>
        {meal.items.map((item, i) => (
          <Text key={i} style={styles.mealItem}>• {item}</Text>
        ))}
      </View>
      <View style={styles.mealMacros}>
        <Text style={styles.macroText}>{meal.calories} kcal</Text>
        <Text style={styles.macroDot}>•</Text>
        <Text style={styles.macroText}>{meal.protein}g proteína</Text>
      </View>
    </View>
  );
}

export default function BudgetMealPlanner() {
  const [selectedTier, setSelectedTier] = useState('medium');
  const plan = MEAL_PLANS[selectedTier];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="wallet" size={18} color={COLORS.primary} />
        <Text style={styles.title}>PLANO POR ORÇAMENTO</Text>
      </View>

      <View style={styles.tierRow}>
        {BUDGET_TIERS.map(tier => (
          <TouchableOpacity
            key={tier.id}
            style={[styles.tierBtn, selectedTier === tier.id && { backgroundColor: tier.color }]}
            onPress={() => setSelectedTier(tier.id)}
          >
            <Ionicons name={tier.icon} size={16} color={selectedTier === tier.id ? COLORS.background : COLORS.textMuted} />
            <Text style={[styles.tierLabel, selectedTier === tier.id && styles.tierLabelActive]}>{tier.label}</Text>
            <Text style={[styles.tierRange, selectedTier === tier.id && styles.tierRangeActive]}>{tier.range}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.planHeader}>
        <Text style={styles.planTitle}>{plan.title}</Text>
        <Text style={styles.planTotal}>Total semanal: {plan.totalWeekly}</Text>
      </View>

      <ScrollView style={styles.scroll}>
        {plan.meals.map((meal, i) => (
          <MealCard key={i} meal={meal} />
        ))}
      </ScrollView>

      <View style={styles.tipsCard}>
        <Ionicons name="bulb" size={16} color={COLORS.attention} />
        <View style={styles.tipsContent}>
          <Text style={styles.tipsTitle}>Dicas de Economia</Text>
          {plan.tips.map((tip, i) => (
            <Text key={i} style={styles.tipItem}>• {tip}</Text>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textMuted, letterSpacing: 1 },
  tierRow: { flexDirection: 'row', gap: SPACING.xs, marginBottom: SPACING.md },
  tierBtn: { flex: 1, alignItems: 'center', padding: SPACING.sm, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border, gap: 2 },
  tierLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textMuted },
  tierLabelActive: { color: COLORS.background },
  tierRange: { fontFamily: 'Inter_400Regular', fontSize: 9, color: COLORS.textMuted },
  tierRangeActive: { color: COLORS.background + 'CC' },
  planHeader: { marginBottom: SPACING.md },
  planTitle: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: COLORS.textTitle },
  planTotal: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.primary },
  scroll: { maxHeight: 300, marginBottom: SPACING.md },
  mealCard: { backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.sm, padding: SPACING.md, marginBottom: SPACING.sm },
  mealHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.xs },
  mealType: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textTitle },
  mealCost: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.primary },
  mealItems: { marginBottom: SPACING.xs },
  mealItem: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textDescription, lineHeight: 18 },
  mealMacros: { flexDirection: 'row', gap: SPACING.xs },
  macroText: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted },
  macroDot: { color: COLORS.textMuted },
  tipsCard: { flexDirection: 'row', gap: SPACING.sm, backgroundColor: COLORS.attention + '10', padding: SPACING.md, borderRadius: BORDER_RADIUS.sm },
  tipsContent: { flex: 1 },
  tipsTitle: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.attention, marginBottom: SPACING.xs },
  tipItem: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textDescription, lineHeight: 18 },
});
