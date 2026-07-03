// src/styles/workoutDetailStyles.js
// Estilos para a tela de detalhes de treinos - NOVAIX FITNESS

import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { SPACING, BORDER_RADIUS } from '../constants/spacing';

export function useWorkoutDetailStyles() {
  return useMemo(() => StyleSheet.create({
    headerRight: { flexDirection: 'row', gap: SPACING.sm },
    titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
    badges: { flexDirection: 'row', gap: SPACING.xs },
    startBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.primary, paddingVertical: SPACING.lg, borderRadius: BORDER_RADIUS.md },
    startText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.background, letterSpacing: 1 },
    exercisesSection: { paddingHorizontal: SPACING.lg, marginBottom: SPACING.md },
    exercisesHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
    exercisesTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textMuted, letterSpacing: 1 },
    exercisesSubtitle: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted },
    loadingContainer: { alignItems: 'center', justifyContent: 'center' },
    skeletonHeader: { width: 200, height: 24, backgroundColor: COLORS.surfaceOverlay, borderRadius: 4, marginBottom: SPACING.md },
    skeletonLine: { height: 16, backgroundColor: COLORS.surfaceOverlay, borderRadius: 4, marginBottom: SPACING.sm },
    skeletonGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginTop: SPACING.lg },
    skeletonCard: { width: '48%', height: 80, backgroundColor: COLORS.surfaceOverlay, borderRadius: BORDER_RADIUS.md },
    scroll: { padding: SPACING.lg },
    statsContainer: { marginHorizontal: SPACING.lg, marginBottom: SPACING.xl },
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
    progressCard: { marginHorizontal: SPACING.lg, marginBottom: SPACING.xl },
    progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
    progressTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textMuted, letterSpacing: 1 },
    progressStats: { flexDirection: 'row', justifyContent: 'space-around' },
    progressStat: { alignItems: 'center' },
    progressStatValue: { fontFamily: 'Montserrat_700Bold', fontSize: 18, color: COLORS.textTitle },
    progressStatLabel: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted, marginTop: 2 },
    footer: {
      paddingHorizontal: SPACING.xl,
      paddingVertical: SPACING.md,
      backgroundColor: COLORS.background,
      borderTopWidth: 1,
      borderTopColor: COLORS.border,
      position: 'absolute',
      bottom: 85,
      left: 0,
      right: 0,
      zIndex: 90,
    },
  }), [COLORS.background, COLORS.primary, COLORS.surface, COLORS.border, COLORS.surfaceOverlay, COLORS.textMuted]);
}

// Backward-compatible static export
export const styles = StyleSheet.create({
  headerRight: { flexDirection: 'row', gap: SPACING.sm },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  badges: { flexDirection: 'row', gap: SPACING.xs },
  startBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.primary, paddingVertical: SPACING.lg, borderRadius: BORDER_RADIUS.md },
  startText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.background, letterSpacing: 1 },
  exercisesSection: { paddingHorizontal: SPACING.lg, marginBottom: SPACING.md },
  exercisesHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  exercisesTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textMuted, letterSpacing: 1 },
  exercisesSubtitle: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted },
  loadingContainer: { alignItems: 'center', justifyContent: 'center' },
  skeletonHeader: { width: 200, height: 24, backgroundColor: COLORS.surfaceOverlay, borderRadius: 4, marginBottom: SPACING.md },
  skeletonLine: { height: 16, backgroundColor: COLORS.surfaceOverlay, borderRadius: 4, marginBottom: SPACING.sm },
  skeletonGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginTop: SPACING.lg },
    skeletonCard: { width: '48%', height: 80, backgroundColor: COLORS.surfaceOverlay, borderRadius: BORDER_RADIUS.md },
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
    scroll: { paddingBottom: 180 },
    statsContainer: { paddingHorizontal: SPACING.lg, marginBottom: SPACING.md },
    progressCard: { marginHorizontal: SPACING.lg, marginBottom: SPACING.md },
    progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
    progressTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.textTitle },
    progressStats: { flexDirection: 'row', justifyContent: 'space-around' },
    progressStat: { alignItems: 'center', gap: SPACING.xs },
    progressStatValue: { fontFamily: 'Montserrat_700Bold', fontSize: 18, color: COLORS.primary },
    progressStatLabel: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted },
    footer: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    position: 'absolute',
    bottom: 85,
    left: 0,
    right: 0,
    zIndex: 90,
  },
});
