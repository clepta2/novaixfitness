// src/styles/dashboardStyles.js
// Estilos para a tela de Dashboard - NOVAIX FITNESS

import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { SPACING, BORDER_RADIUS } from '../constants/spacing';
import { layout } from './layout';
import { typography } from './typography';

export function useDashboardStyles() {
  return useMemo(() => StyleSheet.create({
    scroll: { flexGrow: 1, padding: SPACING.xl, paddingTop: layout.scroll.paddingTop },
    chartCard: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
    chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
    chart: { marginTop: SPACING.sm, borderRadius: BORDER_RADIUS.md },
    bmiCard: { flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
    bmiLeft: { flex: 1 },
    bmiTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 11, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 1.2 },
    bmiValue: typography.price,
    bmiRight: { alignItems: 'flex-end', gap: SPACING.xs },
    quickAccess: { marginBottom: SPACING.md },
    quickGrid: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.md },
    quickItem: { flex: 1, alignItems: 'center', gap: SPACING.xs, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
    quickIcon: { width: 48, height: 48, borderRadius: BORDER_RADIUS.xl + 4, justifyContent: 'center', alignItems: 'center' },
    bottomSpacer: { height: 40 },
  }), [COLORS.background, COLORS.primary, COLORS.surface, COLORS.border]);
}

// Backward-compatible static export
export const styles = StyleSheet.create({
  scroll: { flexGrow: 1, padding: SPACING.xl, paddingTop: layout.scroll.paddingTop },
  chartCard: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  chart: { marginTop: SPACING.sm, borderRadius: BORDER_RADIUS.md },
  bmiCard: { flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  bmiLeft: { flex: 1 },
  bmiTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 11, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 1.2 },
  bmiValue: typography.price,
  bmiRight: { alignItems: 'flex-end', gap: SPACING.xs },
  quickAccess: { marginBottom: SPACING.md },
  quickGrid: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.md },
  quickItem: { flex: 1, alignItems: 'center', gap: SPACING.xs, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  quickIcon: { width: 48, height: 48, borderRadius: BORDER_RADIUS.xl + 4, justifyContent: 'center', alignItems: 'center' },
  bottomSpacer: { height: 40 },
});
