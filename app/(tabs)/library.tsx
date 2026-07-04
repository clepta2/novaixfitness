// app/(tabs)/library.tsx
// Biblioteca de Treinos com melhorias visuais - NOVAIX FITNESS


import { useMemo, useEffect, useCallback , useRef} from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../../src/constants/spacing';
import { useI18n } from '../../src/i18n';
import { WorkoutCard, FilterModal, TutorialOverlay, ErrorBoundary, SearchBar, EmptyState } from '../../src/components';
import { useLibraryData } from '../../src/hooks';
import { useTutorial } from '../../src/hooks/useTutorial';
import { useNetworkStatus } from '../../src/hooks/useNetworkStatus';
import { useResponsive } from '../../src/hooks/useResponsive';
import { layout, typography } from '../../src/styles';

interface WorkoutItem {
  id: string;
  name?: string;
  title?: string;
  level?: string;
  duration?: number;
  duration_minutes?: number;
  category?: string;
  locked?: boolean;
  [key: string]: unknown;
}

export default function LibraryScreen() {
  const { t } = useI18n();
  const { isSmall } = useResponsive();
  const {
    router, selectedCategory, setSelectedCategory, searchQuery, setSearchQuery,
    favorites, toggleFavorite, filterByMyLevel, setFilterByMyLevel,
    showFilters, setShowFilters, cachedIds,
    filteredWorkouts, activeFiltersCount,
    activePills, removePill, clearAll, userPhysicalLevel, dbWorkouts
  } = useLibraryData();
  const { isOffline } = useNetworkStatus();

  const { visible: tutorialVisible, steps: tutorialSteps, handleComplete, handleSkip } = useTutorial('library', true);

  // Animacoes
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 8, tension: 55, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleWorkoutPress = useCallback((w: WorkoutItem) => {
    if (w.locked) {
      Alert.alert(t('library.premiumTitle'), t('library.premiumMessage'), [
        { text: t('library.later'), style: 'cancel' },
        { text: t('library.seePlans'), onPress: () => router.push('/paywall') }
      ]);
      return;
    }
    router.push({ pathname: '/workout-detail', params: { id: w.id } });
  }, [router, t]);

  return (
    <ErrorBoundary screenName="Library">
      <ScrollView style={layout.screen} contentContainerStyle={layout.scroll} showsVerticalScrollIndicator={false}>
        <TutorialOverlay visible={tutorialVisible} steps={tutorialSteps} onComplete={handleComplete} onSkip={handleSkip} onRestart={handleSkip} />

        {/* Header */}
        <Animated.View style={[layout.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={{ flex: 1 }}>
            <Text style={[typography.h2, { fontSize: isSmall ? 22 : 28 }]}>{t('library.title')}</Text>
            <Text style={typography.bodyMuted}>
              {userPhysicalLevel ? t('library.focus', { level: userPhysicalLevel }) : t('library.exploreAll')}
            </Text>
            {isOffline && (
              <View style={styles.offlineBadge}>
                <Ionicons name="cloud-offline" size={12} color={COLORS.attention} />
                <Text style={styles.offlineText}>{t('library.offlineMode')}</Text>
              </View>
            )}
          </View>
          {userPhysicalLevel && (
            <TouchableOpacity
              style={[styles.filterBtn, filterByMyLevel && styles.filterBtnActive]}
              onPress={() => setFilterByMyLevel(!filterByMyLevel)}
            >
              <Ionicons name={filterByMyLevel ? "filter" : "filter-outline"} size={20} color={filterByMyLevel ? COLORS.background : COLORS.textMuted} />
            </TouchableOpacity>
          )}
        </Animated.View>

        {/* Search */}
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <SearchBar
            placeholder={t('library.search')}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmit={() => {}}
          />
        </Animated.View>

        {/* Active filters */}
        {activeFiltersCount > 0 && (
          <View style={styles.activeFilters}>
            <View style={styles.pillsRow}>
              {activePills.map((pill, i) => (
                <TouchableOpacity key={i} style={styles.pill} onPress={() => removePill(pill.label)}>
                  <Text style={styles.pillText}>{pill.label}</Text>
                  <Ionicons name="close-circle" size={14} color={COLORS.primary} />
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity onPress={clearAll} style={styles.clearAllBtn}>
              <Text style={styles.clearAllText}>Limpar tudo</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Categories */}
        <View style={styles.categoryGrid}>
          {['MUSCULACAO', 'CALISTENIA', 'CARDIO', 'FLEXIBILIDADE'].map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryCard, selectedCategory === cat && styles.categoryCardActive]}
              onPress={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
            >
              <Text style={[styles.categoryLabel, selectedCategory === cat && styles.categoryLabelActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Workout list */}
        {filteredWorkouts.length === 0 ? (
          <EmptyState
            icon="barbell-outline"
            title={t('library.noWorkouts')}
            description={t('library.noWorkoutsMessage')}
            actionLabel={undefined}
            onAction={undefined}
            iconColor={COLORS.textMuted}
          />
        ) : (
          <View style={styles.workoutList}>
            {filteredWorkouts.map((workout: WorkoutItem, index: number) => (
              <View key={workout.id} style={[styles.workoutItem, { opacity: Math.min(1, 0.5 + index * 0.1) }]}>
                <WorkoutCard
                  workout={workout as any}
                  onPress={() => handleWorkoutPress(workout)}
                  onFavorite={() => toggleFavorite(workout.id as string)}
                  isFavorite={favorites.includes(workout.id as string)}
                  isOfflineCached={cachedIds?.has?.(workout.id as string)}
                />
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      <FilterModal visible={showFilters} onClose={() => setShowFilters(false)} level="all" setLevel={() => {}} duration="all" setDuration={() => {}} access="all" setAccess={() => {}} equipment="all" setEquipment={() => {}} category={selectedCategory || 'all'} setCategory={(v) => setSelectedCategory(v)} muscle="all" setMuscle={() => {}} resultsCount={filteredWorkouts.length} onClearAll={() => {}} />
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  // Offline badge
  offlineBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  offlineText: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.attention },

  // Filter button
  filterBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  filterBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },

  // Active filters
  activeFilters: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  pillsRow: { flexDirection: 'row', flex: 1, flexWrap: 'wrap', gap: SPACING.xs },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.primary + '15', paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs, borderRadius: BORDER_RADIUS.full, borderWidth: 1, borderColor: COLORS.primary + '30' },
  pillText: { fontFamily: 'Inter_500Medium', fontSize: 11, color: COLORS.primary },
  clearAllBtn: { paddingHorizontal: SPACING.sm },
  clearAllText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.error },

  // Category grid
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.xl },
  categoryCard: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.full, borderWidth: 1, borderColor: COLORS.border },
  categoryCardActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  categoryLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textMuted },
  categoryLabelActive: { color: COLORS.background },

  // Workout list
  workoutList: { gap: SPACING.md },
  workoutItem: { marginBottom: SPACING.sm },
});
