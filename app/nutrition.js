import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../src/constants/spacing';
import { useAuth } from '../src/context/AuthContext';
import { getMealLogs, getDailySummary, calculateNutritionGoals } from '../src/services/mealAnalyzer';
import { ErrorBoundary, WaterTracker } from '../src/components';
import DailySummaryCard from '../src/components/nutrition/DailySummaryCard';
import MealTimeline from '../src/components/nutrition/MealTimeline';
import MealLogModal from '../src/components/nutrition/MealLogModal';
import NutritionTips from '../src/components/nutrition/NutritionTips';
import MacroChart from '../src/components/nutrition/MacroChart';

function LinkCard({ icon, label, onPress }) {
  return (
    <TouchableOpacity style={styles.linkCard} onPress={onPress} accessibilityLabel={label} activeOpacity={0.7}>
      <Ionicons name={icon} size={20} color={COLORS.primary} />
      <Text style={styles.linkLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
    </TouchableOpacity>
  );
}

export default function NutritionScreen() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [summary, setSummary] = useState(null);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const weight = profile?.weight || 70;
  const goal = profile?.goal || 'manter';
  const goals = calculateNutritionGoals(weight, goal);

  const loadData = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const [s, m] = await Promise.all([getDailySummary(user.id), getMealLogs(user.id)]);
      setSummary(s);
      setMeals(m);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => { loadData(); }, [loadData]);

  return (
    <ErrorBoundary screenName="Nutrition">
      <View style={styles.screen}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} accessibilityLabel="Voltar">
            <Ionicons name="arrow-back" size={22} color={COLORS.textTitle} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>NUTRIÇÃO</Text>
          <View style={styles.backBtn} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} tintColor={COLORS.primary} />}>
          <DailySummaryCard summary={summary} goals={goals} />

          <TouchableOpacity style={styles.logBtn} onPress={() => setModalVisible(true)} accessibilityLabel="Registrar refeição">
            <Ionicons name="add-circle" size={22} color={COLORS.background} />
            <Text style={styles.logBtnText}>REGISTRAR REFEIÇÃO</Text>
          </TouchableOpacity>

          <MealTimeline meals={meals} />

          <MacroChart
            protein={summary?.protein || 0}
            carbs={summary?.carbs || 0}
            fat={summary?.fat || 0}
            proteinGoal={goals.protein}
            carbsGoal={goals.carbs}
            fatGoal={goals.fat}
          />

          <WaterTracker userId={user?.id} />

          <NutritionTips />

          <View style={styles.linksSection}>
            <LinkCard icon="cart" label="Lista de Compras" onPress={() => router.push('/shopping')} />
            <LinkCard icon="calendar" label="Resumo Semanal" onPress={() => router.push('/weekly-progress')} />
          </View>
        </ScrollView>

        <MealLogModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          userId={user?.id}
          profileContext={{ weight, goal }}
          onSaved={loadData}
        />
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingTop: SPACING.xxxl, paddingBottom: SPACING.lg },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle, letterSpacing: 2 },
  content: { padding: SPACING.lg, gap: SPACING.lg, paddingBottom: SPACING.huge },
  logBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg },
  logBtnText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.background, letterSpacing: 1 },
  linksSection: { gap: SPACING.md },
  linkCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border, gap: SPACING.md },
  linkLabel: { fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textTitle, flex: 1 },
});
