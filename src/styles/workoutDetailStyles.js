// src/styles/workoutDetailStyles.js
// Estilos para a tela de detalhes de treinos - NOVAIX FITNESS

import { StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { SPACING, BORDER_RADIUS } from '../constants/spacing';

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
