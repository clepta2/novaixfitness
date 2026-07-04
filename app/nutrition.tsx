
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../src/constants/spacing';
import { useAuth } from '../src/context/AuthContext';
import { useI18n } from '../src/i18n';
import { getMealLogs, getDailySummary, calculateNutritionGoals } from '../src/services/ai/mealAnalyzer';
import { ErrorBoundary, WaterTracker, BottomTabBar, DailySummaryCard, MealTimeline, MealLogModal, NutritionTips, MacroChart } from '../src/components';
import { useResponsive } from '../src/hooks/useResponsive';

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
  const { t } = useI18n();
  const router = useRouter();
  const [summary, setSummary] = useState(null);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const weight = profile?.physical_data?.weight;
  const goal = profile?.goal || 'manter';
  const weightMissing = !weight;
  const goals = calculateNutritionGoals(weight || 70, goal);

  const loadData = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    try {
      const [s, m] = await Promise.all([getDailySummary(user.id), getMealLogs(user.id)]);
      setSummary(s);
      setMeals(m);
    } catch (err) {
      if (__DEV__) console.error('Erro ao carregar nutrição:', err);
      setError(t('nutrition.loadError'));
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => { loadData(); }, [loadData]);

  return (
    <ErrorBoundary screenName="Nutrition">
      <View style={styles.screen}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} accessibilityLabel={t('common.back')} accessibilityRole="button">
            <Ionicons name="arrow-back" size={22} color={COLORS.textTitle} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('nutrition.title').toUpperCase()}</Text>
          <View style={styles.backBtn} />
        </View>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>{t('nutrition.loading')}</Text>
          </View>
        ) : error ? (
          <View style={styles.center}>
            <Ionicons name="alert-circle-outline" size={48} color={COLORS.error} />
            <Text style={styles.loadingText}>{error}</Text>
            <TouchableOpacity onPress={loadData} style={styles.retryBtn} accessibilityLabel={t('common.retry')}>
              <Text style={styles.retryText}>{t('common.retry').toUpperCase()}</Text>
            </TouchableOpacity>
          </View>
        ) : (

        <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 110 }]} showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} tintColor={COLORS.primary} />}>
          {weightMissing && (
            <View style={styles.warningCard}>
              <Ionicons name="warning" size={20} color={COLORS.attention} />
              <Text style={styles.warningText}>{t('nutrition.weightWarning')}</Text>
            </View>
          )}
          <DailySummaryCard summary={summary} goals={goals} />

          <TouchableOpacity style={styles.logBtn} onPress={() => setModalVisible(true)} accessibilityLabel={t('nutrition.logMeal')} accessibilityRole="button">
            <Ionicons name="add-circle" size={22} color={COLORS.background} />
            <Text style={styles.logBtnText}>{t('nutrition.logMeal').toUpperCase()}</Text>
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
            <LinkCard icon="cart" label={t('nutrition.shoppingList')} onPress={() => router.push('/shopping')} />
            <LinkCard icon="calendar" label={t('nutrition.weeklySummary')} onPress={() => router.push('/weekly-progress')} />
          </View>
        </ScrollView>
        )}

        <MealLogModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          userId={user?.id}
          profileContext={{ weight, goal }}
          onSaved={loadData}
        />
        <BottomTabBar activeTab="perfil" />
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
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: SPACING.md, paddingHorizontal: SPACING.xl },
  loadingText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted },
  retryBtn: { backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.md, paddingHorizontal: SPACING.xl, paddingVertical: SPACING.md, marginTop: SPACING.sm },
  retryText: { fontFamily: 'Montserrat_700Bold', fontSize: 13, color: COLORS.background, letterSpacing: 1 },
  logBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg },
  logBtnText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.background, letterSpacing: 1 },
  linksSection: { gap: SPACING.md },
  linkCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border, gap: SPACING.md },
  linkLabel: { fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textTitle, flex: 1 },
  warningCard: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: COLORS.attention + '15', borderRadius: BORDER_RADIUS.md, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.attention + '40' },
  warningText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.attention, flex: 1 },
});
