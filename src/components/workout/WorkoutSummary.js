// src/components/workout/WorkoutSummary.js
// Resumo completo do treino concluído - NOVAIX FITNESS

import React, { useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Share, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import WorkoutComparison from './WorkoutComparison';
import WorkoutAchievements from './WorkoutAchievements';
import MuscleGroupBar from './MuscleGroupBar';
import WorkoutRating from './WorkoutRating';
import AnimatedStat from './AnimatedStat';



export default function WorkoutSummary({
  workout, duration, calories, xpEarned, exercisesCompleted, setsCompleted,
  muscleGroups, rating, onRate, onShare, onClose,
  previousWorkout, achievements = [], personalRecords = [],
}) {
  const headerScale = useRef(new Animated.Value(0)).current;
  const headerFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    try { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch {}
    Animated.parallel([
      Animated.spring(headerScale, { toValue: 1, tension: 30, friction: 8, useNativeDriver: true }),
      Animated.timing(headerFade, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleShare = async () => {
    const prText = personalRecords?.length > 0 ? `\n🏆 ${personalRecords.length} record(s)!` : '';
    const message = `💪 Treino concluído no NOVAIX!\n\n🏋️ ${workout?.name || 'Treino'}\n⏱️ ${duration || 0} min\n🔥 ${calories || 0} kcal\n⭐ +${xpEarned || 0} XP\n🎯 ${exercisesCompleted || 0} exercícios${prText}\n\nBaixe o NOVAIX Fitness!`;
    try { await Share.share({ message }); onShare?.(); } catch {}
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.content, { opacity: headerFade, transform: [{ scale: headerScale }] }]}>
          <View style={styles.header}>
            <Ionicons name="checkmark-circle" size={72} color={COLORS.success} />
            <Text style={styles.title}>TREINO CONCLUÍDO!</Text>
            <Text style={styles.subtitle}>{workout?.name || 'Treino'}</Text>
          </View>

          <View style={styles.statsGrid}>
            <AnimatedStat icon="time" value={`${duration || 0}`} label="min" color={COLORS.primary} delay={100} />
            <AnimatedStat icon="flame" value={`${calories || 0}`} label="kcal" color={COLORS.secondary} delay={200} />
            <AnimatedStat icon="star" value={`+${xpEarned || 0}`} label="XP" color={COLORS.primary} delay={300} />
            <AnimatedStat icon="barbell" value={`${exercisesCompleted || 0}`} label="exercícios" color={COLORS.success} delay={400} />
          </View>

          {personalRecords?.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="trophy" size={16} color={COLORS.primary} />
                <Text style={styles.sectionTitle}>RECORDES QUEBRADOS</Text>
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

          <WorkoutAchievements achievements={achievements} />
          <WorkoutComparison current={{ duration, exercises: exercisesCompleted, sets: setsCompleted }} previous={previousWorkout} />

          {muscleGroups?.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="body" size={16} color={COLORS.success} />
                <Text style={styles.sectionTitle}>MÚSCULOS TRABALHADOS</Text>
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
            <Text style={styles.shareText}>COMPARTILHAR</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>VOLTAR AO INÍCIO</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flexGrow: 1 },
  content: { padding: SPACING.xl },
  header: { alignItems: 'center', marginBottom: SPACING.xl },
  title: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 24, color: COLORS.success, letterSpacing: 1, marginTop: SPACING.md },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, marginTop: SPACING.xs },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.xl },
  statCard: { width: '48%', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  statIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.sm },
  statValue: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 24 },
  statLabel: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  section: { marginBottom: SPACING.xl },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  sectionTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 11, color: COLORS.textMuted, letterSpacing: 1 },
  prCard: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.sm, padding: SPACING.md, marginBottom: SPACING.xs, borderWidth: 1, borderColor: COLORS.primary + '30' },
  prIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.primary + '15', justifyContent: 'center', alignItems: 'center' },
  prInfo: { flex: 1 },
  prName: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textTitle },
  prDetail: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted },
  muscleCard: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  shareBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.primary, paddingVertical: SPACING.lg, borderRadius: BORDER_RADIUS.lg, marginTop: SPACING.md },
  shareText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.background, letterSpacing: 1 },
  closeBtn: { alignItems: 'center', paddingVertical: SPACING.md },
  closeText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: COLORS.textMuted },
});
