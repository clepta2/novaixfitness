import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

const MEAL_ICONS = { cafe: 'sunny', almoco: 'restaurant', jante: 'moon', lanche: 'cafe' };
const MEAL_LABELS = { cafe: 'Café da Manhã', almoco: 'Almoço', jantar: 'Jantar', lanche: 'Lanche' };

function MealItem({ meal }) {
  const time = new Date(meal.logged_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  return (
    <View style={styles.mealItem}>
      <View style={styles.timeCol}>
        <View style={styles.dot} />
        <Text style={styles.time}>{time}</Text>
      </View>
      <View style={styles.mealCard}>
        <Text style={styles.mealName}>{meal.description}</Text>
        <View style={styles.macros}>
          <Text style={styles.macroText}>{Math.round(meal.calories)} kcal</Text>
          <Text style={[styles.macroText, { color: COLORS.success }]}>{Math.round(meal.protein)}P</Text>
          <Text style={[styles.macroText, { color: COLORS.primary }]}>{Math.round(meal.carbs)}C</Text>
          <Text style={[styles.macroText, { color: COLORS.secondary }]}>{Math.round(meal.fat)}G</Text>
        </View>
      </View>
    </View>
  );
}

export default function MealTimeline({ meals = [] }) {
  const grouped = meals.reduce((acc, meal) => {
    const type = meal.meal_type || 'lanche';
    if (!acc[type]) acc[type] = [];
    acc[type].push(meal);
    return acc;
  }, {});

  const types = Object.keys(MEAL_ICONS);

  if (meals.length === 0) {
    return (
      <View style={styles.empty}>
        <Ionicons name="restaurant-outline" size={32} color={COLORS.textMuted} />
        <Text style={styles.emptyText}>Nenhuma refeição registrada hoje</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TIMELINE</Text>
      {types.map(type => {
        const group = grouped[type];
        if (!group || group.length === 0) return null;
        return (
          <View key={type} style={styles.group}>
            <View style={styles.groupHeader}>
              <Ionicons name={MEAL_ICONS[type]} size={16} color={COLORS.primary} />
              <Text style={styles.groupLabel}>{MEAL_LABELS[type]}</Text>
              <Text style={styles.groupCount}>{group.length}</Text>
            </View>
            {group.map((meal, i) => <MealItem key={meal.id || i} meal={meal} />)}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textMuted, letterSpacing: 1, marginBottom: SPACING.lg },
  empty: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.xxl, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border, gap: SPACING.sm },
  emptyText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted },
  group: { marginBottom: SPACING.lg },
  groupHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  groupLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: COLORS.textTitle, flex: 1 },
  groupCount: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted },
  mealItem: { flexDirection: 'row', marginBottom: SPACING.md },
  timeCol: { width: 50, alignItems: 'center', marginRight: SPACING.md },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary, marginBottom: 4 },
  time: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted },
  mealCard: { flex: 1, backgroundColor: COLORS.surfaceElevated, borderRadius: BORDER_RADIUS.sm, padding: SPACING.md },
  mealName: { fontFamily: 'Inter_500Medium', fontSize: 13, color: COLORS.textTitle, marginBottom: SPACING.xs },
  macros: { flexDirection: 'row', gap: SPACING.md },
  macroText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textDescription },
});
