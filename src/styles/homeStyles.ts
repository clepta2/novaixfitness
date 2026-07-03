// src/styles/homeStyles.js
// Estilos para a tela principal (Home) - NOVAIX FITNESS

import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { SPACING, BORDER_RADIUS } from '../constants/spacing';
import { scale } from '../utils/responsive';

export function useHomeStyles() {
  return useMemo(() => StyleSheet.create({
    gridRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.lg },
    gridItem: { flex: 1 },
    headerActions: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
    streakBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: SPACING.sm, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border, height: 42, justifyContent: 'center' },
    streakText: { fontFamily: 'Montserrat_700Bold', fontSize: scale(12), color: COLORS.primary },
    levelBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: SPACING.sm, borderRadius: BORDER_RADIUS.md, height: 42, justifyContent: 'center' },
    levelText: { fontFamily: 'Montserrat_700Bold', fontSize: scale(11) },
    categoriesRow: {
      flexDirection: 'row',
      gap: SPACING.sm,
      justifyContent: 'space-between',
      marginBottom: SPACING.xl,
    },
    categoryCard: {
      flex: 1,
      borderRadius: BORDER_RADIUS.lg,
      paddingVertical: SPACING.lg,
      paddingHorizontal: SPACING.sm,
      alignItems: 'center',
      justifyContent: 'center',
      gap: SPACING.xs,
      elevation: 6,
      boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.2)',
    },
    categoryIconWrap: {
      width: scale(48),
      height: scale(48),
      borderRadius: 999,
      backgroundColor: 'rgba(0,0,0,0.1)',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: SPACING.xs,
    },
    categoryLabel: {
      fontFamily: 'Montserrat_700Bold',
      fontSize: scale(11),
      letterSpacing: 0.8,
      textAlign: 'center',
    },
    categoryCount: {
      fontFamily: 'Montserrat_600SemiBold',
      fontSize: scale(10),
      letterSpacing: 0.5,
      opacity: 0.8,
    },
    storeCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.surface,
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.lg,
      marginTop: SPACING.sm,
      borderWidth: 1,
      borderColor: COLORS.primary + '30',
      gap: SPACING.md,
    },
    storeIconWrap: {
      width: 48,
      height: 48,
      borderRadius: BORDER_RADIUS.md,
      backgroundColor: COLORS.primary + '15',
      justifyContent: 'center',
      alignItems: 'center',
    },
    storeTitle: {
      fontFamily: 'Montserrat_700Bold',
      fontSize: 13,
      color: COLORS.textTitle,
      letterSpacing: 0.5,
    },
    storeSubtitle: {
      fontFamily: 'Inter_400Regular',
      fontSize: 11,
      color: COLORS.textMuted,
      marginTop: 2,
    },
  }), [COLORS.background, COLORS.primary, COLORS.surface, COLORS.border, COLORS.textTitle, COLORS.textMuted]);
}

// Backward-compatible static export
export const styles = StyleSheet.create({
  gridRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.lg },
  gridItem: { flex: 1 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  streakBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: SPACING.sm, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border, height: 42, justifyContent: 'center' },
  streakText: { fontFamily: 'Montserrat_700Bold', fontSize: scale(12), color: COLORS.primary },
  levelBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: SPACING.sm, borderRadius: BORDER_RADIUS.md, height: 42, justifyContent: 'center' },
  levelText: { fontFamily: 'Montserrat_700Bold', fontSize: scale(11) },
  categoriesRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  categoryCard: {
    flex: 1,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    elevation: 6,
    boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.2)',
  },
  categoryIconWrap: {
    width: scale(48),
    height: scale(48),
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
  },
  categoryLabel: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: scale(11),
    letterSpacing: 0.8,
    textAlign: 'center',
  },
  categoryCount: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: scale(10),
    letterSpacing: 0.5,
    opacity: 0.8,
  },
  storeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginTop: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.primary + '30',
    gap: SPACING.md,
  },
  storeIconWrap: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storeTitle: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 13,
    color: COLORS.textTitle,
    letterSpacing: 0.5,
  },
  storeSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});
