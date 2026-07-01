// @ts-nocheck
// app/player.tsx
// Tela de Player de Treino com novos componentes - NOVAIX FITNESS

import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../src/constants/colors';
import { SPACING, BORDER_RADIUS, ICON_SIZES } from '../src/constants/spacing';
import { useI18n } from '../src/i18n';
import { 
  WorkoutTimer, ExerciseProgress, RestOverlay, WorkoutControls, 
  RatingModal, TutorialOverlay, XPFloating, ErrorBoundary, ExerciseVideo,
  ProgressRing, AnimatedCounter, GlassCard, GradientButton, Skeleton, WorkoutShare
} from '../src/components';
import useWorkoutPlayer from '../src/hooks/useWorkoutPlayer';
import { useResponsive } from '../src/hooks/useResponsive';
import { layout, typography } from '../src/styles';
import { styles } from '../src/styles/playerStyles';

function LoadingSkeleton() {
  return (
    <View style={[layout.screen, styles.centered]}>
      <Skeleton width={120} height={120} borderRadius={60} />
      <View style={{ height: 24 }} />
      <Skeleton width={200} height={24} borderRadius={6} />
      <View style={{ height: 8 }} />
      <Skeleton width={150} height={16} borderRadius={4} />
    </View>
  );
}

export default function PlayerScreen() {
  const { t } = useI18n();
  const router = useRouter();
  const { isSmall, horizontalPadding } = useResponsive();
  const {
    workout, loading, showRating, voiceEnabled, showXP, xpAmount,
    tutorialVisible, tutorialSteps, handleComplete, handleSkip,
    timer, handleRatingSubmit, handleFinish, toggleVoiceCoach, dismissRating, setShowXP,
    showCompletion, setShowCompletion,
  } = useWorkoutPlayer();

  if (loading) return <LoadingSkeleton />;

  // Tela de selecao (idle)
  if (timer.phase === 'idle') {
    return (
      <View style={layout.screen}>
        <TutorialOverlay visible={tutorialVisible} steps={tutorialSteps} onComplete={handleComplete} onSkip={handleSkip} />
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={[typography.h2, { fontSize: isSmall ? 22 : 28 }]}>{workout?.name || t('player.defaultName')}</Text>
            <TouchableOpacity onPress={toggleVoiceCoach} style={styles.voiceToggle}>
              <Ionicons name={voiceEnabled ? 'volume-high' : 'volume-mute'} size={20} color={voiceEnabled ? COLORS.primary : COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Resumo do treino com ProgressRing */}
          <GlassCard style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <ProgressRing progress={0} size={64} strokeWidth={6} label="0%" />
              <View style={styles.summaryInfo}>
                <Text style={typography.h3}>{workout?.exercises?.length || 0}</Text>
                <Text style={typography.caption}>Exercicios</Text>
                <View style={styles.summaryDivider} />
                <Text style={typography.h3}>{workout?.duration || 30}</Text>
                <Text style={typography.caption}>Minutos</Text>
              </View>
            </View>
          </GlassCard>

          {/* Lista de exercicios */}
          <View style={styles.exerciseList}>
            <Text style={typography.label}>{t('player.exercisesCount', { count: workout?.exercises?.length || 0 })}</Text>
            {(workout?.exercises || []).map((ex, i) => (
              <View key={i} style={styles.exerciseItem}>
                <View style={styles.exerciseNumber}>
                  <Text style={styles.exerciseNum}>{i + 1}</Text>
                </View>
                <View style={styles.exerciseInfo}>
                  <Text style={typography.h5}>{ex.name}</Text>
                  <Text style={typography.caption}>{ex.sets || 4}x{ex.reps || 10} · {t('player.restTime', { seconds: ex.rest || 60 })}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
              </View>
            ))}
          </View>
          <View style={styles.bottomSpacer} />
        </ScrollView>
        <View style={layout.footer}>
          <GradientButton
            title={t('player.startWorkoutButton')}
            icon="play"
            onPress={() => timer.startWorkout()}
            size={isSmall ? 'sm' : 'md'}
          />
        </View>
      </View>
    );
  }

  // Tela do treino ativo
  return (
    <ErrorBoundary screenName="Player">
    <View style={layout.screen}>
      <XPFloating amount={xpAmount} visible={showXP} onComplete={() => setShowXP(false)} />
      {timer.phase === 'resting' && (
        <RestOverlay timeRemaining={timer.timeRemaining} nextExercise={timer.currentExercise} onSkip={timer.skipRest} nextSet={timer.currentSet} nextIndex={timer.currentExerciseIndex} totalExercises={timer.totalExercises} />
      )}
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <ExerciseProgress exercises={workout.exercises} currentIndex={timer.currentExerciseIndex} currentSet={timer.currentSet} totalSets={timer.totalSets} />
        
        {timer.currentExercise && (
          <View style={styles.videoSection}>
            <ExerciseVideo
              exerciseName={timer.currentExercise.name}
              videoId={timer.currentExercise.video_id}
              thumbnailUrl={timer.currentExercise.thumbnail_url}
            />
          </View>
        )}

        <View style={styles.timerSection}>
          <WorkoutTimer 
            timeRemaining={timer.timeRemaining} 
            totalTime={timer.totalTime} 
            phase={timer.phase} 
            exerciseName={timer.currentExercise?.name} 
            setInfo={t('player.setInfo', { current: timer.currentSet, total: timer.totalSets })} 
            currentSet={timer.currentSet} 
            totalSets={timer.totalSets} 
            logs={timer.logs} 
          />
        </View>

        {/* Stats do treino ativo */}
        <View style={styles.activeStats}>
          <View style={styles.activeStatItem}>
            <Ionicons name="time" size={ICON_SIZES.xs} color={COLORS.primary} />
            <AnimatedCounter value={Math.floor(timer.elapsed / 60)} style={styles.activeStatValue} />
            <Text style={styles.activeStatLabel}>min</Text>
          </View>
          <View style={styles.activeStatDivider} />
          <View style={styles.activeStatItem}>
            <Ionicons name="flame" size={ICON_SIZES.xs} color={COLORS.secondary} />
            <AnimatedCounter value={timer.totalXP} style={styles.activeStatValue} />
            <Text style={styles.activeStatLabel}>XP</Text>
          </View>
          <View style={styles.activeStatDivider} />
          <View style={styles.activeStatItem}>
            <Ionicons name="barbell" size={ICON_SIZES.xs} color={COLORS.success} />
            <AnimatedCounter value={timer.logs.length} style={styles.activeStatValue} />
            <Text style={styles.activeStatLabel}>{t('player.setsDone', { count: '' }).replace(' ', '')}</Text>
          </View>
        </View>

        <WorkoutControls 
          phase={timer.phase} 
          onPause={timer.pauseWorkout} 
          onResume={timer.resumeWorkout} 
          onSkip={timer.phase === 'resting' ? timer.skipRest : timer.skipExercise} 
          onStop={handleFinish} 
          onMarkComplete={timer.markSetComplete} 
        />
      </ScrollView>
      <RatingModal visible={showRating} onClose={dismissRating} onSubmit={handleRatingSubmit} />

      {/* Celebration Modal Overlay */}
      {showCompletion && (
        <Modal visible={showCompletion} animationType="slide" transparent>
          <WorkoutShare
            workout={workout}
            xp={xpAmount}
            duration={Math.floor(timer.elapsed / 60) || workout?.duration || 30}
            exercises={timer.logs.length || workout?.exercises?.length || 5}
            onClose={() => {
              setShowCompletion(false);
              timer.stopWorkout();
              router.back();
            }}
          />
        </Modal>
      )}
    </View>
    </ErrorBoundary>
  );
}
