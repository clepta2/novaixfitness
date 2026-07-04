// src/styles/playerStyles.js
// Estilos para a tela do Player de Treinos - NOVAIX FITNESS

import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { SPACING, BORDER_RADIUS } from '../constants/spacing';
import { layout } from './layout';
import { typography } from './typography';

export function usePlayerStyles() {
  return useMemo(() => StyleSheet.create({
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingDot: { width: 40, height: 40, borderRadius: BORDER_RADIUS.xl, backgroundColor: COLORS.primary },
    scroll: { flexGrow: 1, padding: SPACING.xl, paddingTop: layout.scroll.paddingTop },
    startBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.lg, paddingVertical: SPACING.lg },
    startText: typography.button,
    exerciseList: { gap: SPACING.sm },
    exerciseItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
    exerciseNumber: { width: 32, height: 32, borderRadius: BORDER_RADIUS.full, backgroundColor: COLORS.primary + '15', justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md },
    exerciseNum: typography.stat,
    exerciseInfo: { flex: 1 },
    timerSection: { alignItems: 'center', marginVertical: SPACING.xl },
    infoRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: SPACING.xl, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
    infoItem: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
    infoText: typography.h5,
    bottomSpacer: { height: 100 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    videoSection: { paddingHorizontal: SPACING.lg, marginBottom: SPACING.sm },
    activeStats: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', padding: SPACING.lg },
    activeStatItem: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
    activeStatValue: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle },
    activeStatLabel: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted },
    activeStatDivider: { width: 1, height: 24, backgroundColor: COLORS.border },
    voiceToggle: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
    summaryCard: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.lg },
    summaryRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.lg },
    summaryInfo: { flex: 1, gap: 4 },
    summaryDivider: { height: 1, backgroundColor: COLORS.border, marginVertical: 2 },
  }), [COLORS.background, COLORS.primary, COLORS.surface, COLORS.border, COLORS.textTitle]);
}

// Backward-compatible static export
export const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingDot: { width: 40, height: 40, borderRadius: BORDER_RADIUS.xl, backgroundColor: COLORS.primary },
  scroll: { flexGrow: 1, padding: SPACING.xl, paddingTop: layout.scroll.paddingTop },
  startBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.lg, paddingVertical: SPACING.lg },
  startText: typography.button,
  exerciseList: { gap: SPACING.sm },
  exerciseItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  exerciseNumber: { width: 32, height: 32, borderRadius: BORDER_RADIUS.full, backgroundColor: COLORS.primary + '15', justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md },
  exerciseNum: typography.stat,
  exerciseInfo: { flex: 1 },
  timerSection: { alignItems: 'center', marginVertical: SPACING.xl },
  infoRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: SPACING.xl, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  infoText: typography.h5,
  bottomSpacer: { height: 100 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  videoSection: { paddingHorizontal: SPACING.lg, marginBottom: SPACING.sm },
  activeStats: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', padding: SPACING.lg },
  activeStatItem: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  activeStatValue: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle },
  activeStatLabel: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted },
  activeStatDivider: { width: 1, height: 24, backgroundColor: COLORS.border },
  voiceToggle: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  summaryCard: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.lg },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.lg },
  summaryInfo: { flex: 1, gap: 4 },
  summaryDivider: { height: 1, backgroundColor: COLORS.border, marginVertical: 2 },
});
