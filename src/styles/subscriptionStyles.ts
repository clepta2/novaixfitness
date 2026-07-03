// src/styles/subscriptionStyles.js
// Estilos da tela de assinatura - NOVAIX FITNESS

import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { SPACING, BORDER_RADIUS } from '../constants/spacing';

export function useSubscriptionStyles() {
  return useMemo(() => StyleSheet.create({
    statusCard: { flexDirection: 'row', alignItems: 'center', gap: SPACING.lg, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.xl, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.xl },
    statusInfo: { flex: 1 },
    planCard: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.xl, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.xl },
    planFeatures: { gap: SPACING.sm, marginTop: SPACING.md },
    featureRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
    upgradeBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.md, backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.lg, padding: SPACING.xl, marginBottom: SPACING.xl },
    actions: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.xl },
    actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
    cancelBtn: { borderColor: COLORS.error + '30' },
    paymentItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
    paymentIcon: { marginRight: SPACING.md },
    paymentInfo: { flex: 1 },
    infoItem: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.md, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  }), [COLORS.background, COLORS.primary, COLORS.surface, COLORS.border, COLORS.error]);
}

// Backward-compatible static export
export const styles = StyleSheet.create({
  statusCard: { flexDirection: 'row', alignItems: 'center', gap: SPACING.lg, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.xl, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.xl },
  statusInfo: { flex: 1 },
  planCard: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.xl, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.xl },
  planFeatures: { gap: SPACING.sm, marginTop: SPACING.md },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  upgradeBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.md, backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.lg, padding: SPACING.xl, marginBottom: SPACING.xl },
  actions: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.xl },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  cancelBtn: { borderColor: COLORS.error + '30' },
  paymentItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  paymentIcon: { marginRight: SPACING.md },
  paymentInfo: { flex: 1 },
  infoItem: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.md, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
});
