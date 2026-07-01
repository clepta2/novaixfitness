
// app/workout-detail.tsx
// Detalhe do Treino com novos componentes - NOVAIX FITNESS

import { View, Text, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { COLORS } from '../src/constants/colors';
import { useI18n } from '../src/i18n';
import { 
  ExerciseAccordion, VideoPreview, MoreOptionsModal, RatingModal, 
  WorkoutHeaderDetail, ErrorBoundary, BottomTabBar, 
  ProgressRing, AnimatedCounter, GradientButton, GlassCard, Skeleton,
  StatsCard
} from '../src/components';
import { useResponsive } from '../src/hooks/useResponsive';
import { layout } from '../src/styles';
import { styles } from '../src/styles/workoutDetailStyles';
import { useWorkoutDetail } from '../src/hooks/useWorkoutDetail';

function LoadingSkeleton() {
  return (
    <View style={[layout.screen, styles.loadingContainer]}>
      <Skeleton width="100%" height={200} borderRadius={12} />
      <View style={{ height: 16 }} />
      <Skeleton width="80%" height={24} borderRadius={6} />
      <View style={{ height: 8 }} />
      <Skeleton width="60%" height={16} borderRadius={4} />
      <View style={{ height: 24 }} />
      <View style={styles.statsGrid}>
        {[1, 2, 3, 4].map(i => <Skeleton key={i} width="48%" height={80} borderRadius={12} />)}
      </View>
      <View style={{ height: 24 }} />
      <Skeleton width="100%" height={16} borderRadius={4} />
      {[1, 2, 3].map(i => (
        <View key={i} style={{ marginBottom: 12 }}>
          <Skeleton width="100%" height={60} borderRadius={12} />
        </View>
      ))}
    </View>
  );
}

export default function WorkoutDetailScreen() {
  const { t } = useI18n();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { isSmall } = useResponsive();

  const {
    workout, loading, expanded, setExpanded, showVideo, setShowVideo,
    isFavorite, showOptions, setShowOptions, showRating, setShowRating,
    isOffline, exercises, totalSets,
    toggleFavorite, handleOption, handleStart, handleRating,
  } = useWorkoutDetail(id as string);

  const getMuscleSplit = (category: string) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('peito') || cat.includes('chest') || cat.includes('empurrar')) {
      return [
        { name: 'Peitoral Maior 🏋️', pct: 70, color: COLORS.primary },
        { name: 'Tríceps 💪', pct: 20, color: COLORS.secondary },
        { name: 'Deltoides (Ombros) 🎯', pct: 10, color: COLORS.info },
      ];
    }
    if (cat.includes('costa') || cat.includes('back') || cat.includes('puxar')) {
      return [
        { name: 'Latíssimo do Dorso 🏋️', pct: 60, color: COLORS.primary },
        { name: 'Bíceps 💪', pct: 25, color: COLORS.secondary },
        { name: 'Trapézio 🎯', pct: 15, color: COLORS.info },
      ];
    }
    if (cat.includes('perna') || cat.includes('leg') || cat.includes('coxa')) {
      return [
        { name: 'Quadríceps 🏋️', pct: 50, color: COLORS.primary },
        { name: 'Posteriores de Coxa 💪', pct: 30, color: COLORS.secondary },
        { name: 'Panturrilhas 🎯', pct: 20, color: COLORS.info },
      ];
    }
    return [
      { name: 'Músculos Primários 🏋️', pct: 60, color: COLORS.primary },
      { name: 'Músculos Secundários 💪', pct: 40, color: COLORS.secondary },
    ];
  };

  if (loading) return <LoadingSkeleton />;

  const calories = Math.round((workout?.duration_minutes || workout?.duration || 45) * 
    (workout?.intensity === 'high' ? 12 : workout?.intensity === 'low' ? 5 : 8));

  return (
    <ErrorBoundary screenName="WorkoutDetail">
    <View style={layout.screen}>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: 180 }]} showsVerticalScrollIndicator={false}>
        <WorkoutHeaderDetail
          workout={workout}
          isFavorite={isFavorite}
          isOffline={isOffline}
          onBack={() => router.back()}
          onFavorite={toggleFavorite}
          onOptions={() => setShowOptions(true)}
        />

        <VideoPreview videoId={workout?.video_id} showVideo={showVideo} onToggle={() => setShowVideo(!showVideo)} />

        {/* Stats com novos componentes */}
        <View style={styles.statsContainer}>
          <View style={styles.statsGrid}>
            <StatsCard icon="time" value={workout?.duration_minutes || workout?.duration || 45} label="Minutos" color={COLORS.primary} suffix="min" />
            <StatsCard icon="flame" value={calories} label="Calorias" color={COLORS.secondary} suffix="cal" />
            <StatsCard icon="barbell" value={exercises.length} label="Exercicios" color={COLORS.success} />
            <StatsCard icon="repeat" value={totalSets} label="Series" color={COLORS.info} />
          </View>
        </View>

        {/* Progresso do treino */}
        <GlassCard style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>{t('player.progress')}</Text>
            <ProgressRing progress={0} size={48} strokeWidth={6} showLabel={false} />
          </View>
          <View style={styles.progressStats}>
            <View style={styles.progressStat}>
              <AnimatedCounter value={exercises.length} style={styles.progressStatValue} />
              <Text style={styles.progressStatLabel}>Exercicios</Text>
            </View>
            <View style={styles.progressStat}>
              <AnimatedCounter value={totalSets} style={styles.progressStatValue} />
              <Text style={styles.progressStatLabel}>Series</Text>
            </View>
            <View style={styles.progressStat}>
              <AnimatedCounter value={calories} style={styles.progressStatValue} suffix="cal" />
              <Text style={styles.progressStatLabel}>Calorias</Text>
            </View>
          </View>
        </GlassCard>

        {/* Músculos Alvo */}
        <View style={styles.musclesSection}>
          <Text style={styles.musclesTitle}>MÚSCULOS ALVO</Text>
          <View style={styles.musclesContainer}>
            {getMuscleSplit(workout?.category || workout?.name || '').map((muscle, idx) => (
              <View key={idx} style={styles.muscleRow}>
                <View style={styles.muscleInfo}>
                  <Text style={styles.muscleName}>{muscle.name}</Text>
                  <Text style={styles.musclePct}>{muscle.pct}%</Text>
                </View>
                <View style={styles.muscleTrack}>
                  <View style={[styles.muscleFill, { width: `${muscle.pct}%`, backgroundColor: muscle.color }]} />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Lista de exercicios */}
        <View style={styles.exercisesSection}>
          <View style={styles.exercisesHeader}>
            <Text style={styles.exercisesTitle}>{t('player.exercisesCount', { count: exercises.length })}</Text>
            <Text style={styles.exercisesSubtitle}>{t('library.totalSetsLabel', { count: totalSets })}</Text>
          </View>

          {exercises.map((ex, i) => (
            <ExerciseAccordion
              key={ex.id || ex.name}
              exercise={ex}
              index={i}
              isOpen={expanded === (ex.id || ex.name)}
              onToggle={() => setExpanded(expanded === (ex.id || ex.name) ? null : (ex.id || ex.name))}
            />
          ))}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={styles.footer}>
        <GradientButton
          title={t('player.startWorkoutButton')}
          icon="play"
          onPress={() => handleStart(router)}
          size={isSmall ? 'sm' : 'md'}
        />
      </View>

      <MoreOptionsModal visible={showOptions} onSelect={handleOption} onClose={() => setShowOptions(false)} />
      <RatingModal visible={showRating} onClose={() => setShowRating(false)} onSubmit={handleRating} />
      <BottomTabBar activeTab="library" />
    </View>
    </ErrorBoundary>
  );
}
