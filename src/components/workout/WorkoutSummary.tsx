// src/components/workout/WorkoutSummary.tsx
// Resumo completo do treino concluído - NOVAIX FITNESS

import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Share, ScrollView } from 'react-native';
import type { TextStyle, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { COMPLETION } from '../../data/workoutTexts';
import WorkoutComparison from './WorkoutComparison';
import WorkoutAchievements from './WorkoutAchievements';
import MuscleGroupBar from './MuscleGroupBar';
import WorkoutRating from './WorkoutRating';
import AnimatedStat from './AnimatedStat';

interface WorkoutData {
  name?: string;
  [key: string]: unknown;
}

interface MuscleGroup {
  name: string;
  count: number;
}

interface PersonalRecord {
  exercise: string;
  previous: string;
  current: string;
}

interface WorkoutSummaryProps {
  workout?: WorkoutData;
  duration?: number;
  calories?: number;
  xpEarned?: number;
  exercisesCompleted?: number;
  setsCompleted?: number;
  muscleGroups?: MuscleGroup[];
  rating?: number;
  onRate?: (rating: number) => void;
  onShare?: () => void;
  onClose?: () => void;
  previousWorkout?: Record<string, unknown>;
  achievements?: Array<{ [key: string]: unknown }>;
  personalRecords?: PersonalRecord[];
}

export default function WorkoutSummary({
  workout, duration, calories, xpEarned, exercisesCompleted, setsCompleted,
  muscleGroups, rating, onRate, onShare, onClose,
  previousWorkout, achievements = [], personalRecords = [],
}: WorkoutSummaryProps): React.ReactElement {
  const headerScale = useRef(new Animated.Value(0)).current;
  const headerFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    try { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch {}
    Animated.parallel([
      Animated.spring(headerScale, { toValue: 1, tension: 30, friction: 8, useNativeDriver: true }),
      Animated.timing(headerFade, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleShare = async (): Promise<void> => {
    const prText = personalRecords?.length > 0 ? `\n🏆 ${personalRecords.length} record(s)!` : '';
    const message = COMPLETION.shareMessage
      .replace('{name}', workout?.name || 'Treino')
      .replace('{duration}', String(duration || 0))
      .replace('{calories}', String(calories || 0))
      .replace('{xp}', String(xpEarned || 0))
      .replace('{exercises}', String(exercisesCompleted || 0))
      .replace('{records}', prText);
    try { await Share.share({ message }); onShare?.(); } catch {}
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.content, { opacity: headerFade, transform: [{ scale: headerScale }] }]}>
          <View style={styles.header}>
            <Ionicons name="checkmark-circle" size={72} color={COLORS.success} />
            <Text style={styles.title}>{COMPLETION.title}</Text>
            <Text style={styles.subtitle}>{workout?.name || 'Treino'}</Text>
          </View>

          <View style={styles.statsGrid}>
            <AnimatedStat icon="time" value={`${duration || 0}`} label="min" color={COLORS.primary} delay={100} />
            <AnimatedStat icon="flame" value={`${calories || 0}`} label="kcal" color={COLORS.secondary} delay={200} />
            <AnimatedStat icon="star" value={`+${xpEarned || 0}`} label="XP" color={COLORS.primary} delay={300} />
            <AnimatedStat icon="barbell" value={`${exercisesCompleted || 0}`} label={COMPLETION.exercisesUnit} color={COLORS.success} delay={400} />
          </View>

          {personalRecords?.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="trophy" size={16} color={COLORS.primary} />
                <Text style={styles.sectionTitle}>{COMPLETION.recordsBroken}</Text>
              </View>
              {personalRecords.map((pr, i) => (
                <View key={i} style={styles.prCard}>
                  <View style={styles.prIcon}><Ionicons name="flash" size={16} color={COLORS.primary} /></View>
                  <View style={styles.prInfo}>
                    <Text style={styles.prName}>{pr.exercise}</Text>
                    <Text style={styles.prDetail}>{pr.previous} → {pr.current}</Text>
                  </View>
                  <Ionicons name="trending-up" size={16} color={COLORS.success} />
                </View>
              ))}
            </View>
          )}

          <WorkoutAchievements achievements={achievements as any} />
          <WorkoutComparison current={{ duration, exercises: exercisesCompleted, sets: setsCompleted }} previous={previousWorkout} />

          {muscleGroups?.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="body" size={16} color={COLORS.success} />
                <Text style={styles.sectionTitle}>{COMPLETION.musclesWorked}</Text>
              </View>
              <View style={styles.muscleCard}>
                {muscleGroups.slice(0, 5).map((muscle, i) => (
                  <MuscleGroupBar key={i} name={muscle.name} count={muscle.count} max={Math.max(...muscleGroups.map(m => m.count))} color={[COLORS.primary, COLORS.success, COLORS.info, COLORS.secondary, COLORS.attention][i % 5]} />
                ))}
              </View>
            </View>
          )}

          <WorkoutRating rating={rating} onRate={onRate} />

          <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
            <Ionicons name="share-social" size={20} color={COLORS.background} />
            <Text style={styles.shareText}>{COMPLETION.shareButton}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>{COMPLETION.backToHome}</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background } as ViewStyle,
  scroll: { flexGrow: 1 } as ViewStyle,
  content: { padding: SPACING.xl } as ViewStyle,
  header: { alignItems: 'center', marginBottom: SPACING.xl } as ViewStyle,
  title: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 24, color: COLORS.success, letterSpacing: 1, marginTop: SPACING.md } as TextStyle,
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, marginTop: SPACING.xs } as TextStyle,
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.xl } as ViewStyle,
  statCard: { width: '48%', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border } as ViewStyle,
  statIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.sm } as ViewStyle,
  statValue: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 24 } as TextStyle,
  statLabel: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted, marginTop: 2 } as TextStyle,
  section: { marginBottom: SPACING.xl } as ViewStyle,
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md } as ViewStyle,
  sectionTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 11, color: COLORS.textMuted, letterSpacing: 1 } as TextStyle,
  prCard: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.sm, padding: SPACING.md, marginBottom: SPACING.xs, borderWidth: 1, borderColor: COLORS.primary + '30' } as ViewStyle,
  prIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.primary + '15', justifyContent: 'center', alignItems: 'center' } as ViewStyle,
  prInfo: { flex: 1 } as ViewStyle,
  prName: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textTitle } as TextStyle,
  prDetail: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted } as TextStyle,
  muscleCard: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border } as ViewStyle,
  shareBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.primary, paddingVertical: SPACING.lg, borderRadius: BORDER_RADIUS.lg, marginTop: SPACING.md } as ViewStyle,
  shareText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.background, letterSpacing: 1 } as TextStyle,
  closeBtn: { alignItems: 'center', paddingVertical: SPACING.md } as ViewStyle,
  closeText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: COLORS.textMuted } as TextStyle,
});
