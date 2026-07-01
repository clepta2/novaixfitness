import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

export const styles = StyleSheet.create({
  container: { flex: 1, padding: SPACING.lg, backgroundColor: COLORS.background },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md, marginTop: SPACING.lg },
  section: { marginTop: SPACING.xl },
  metricsList: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, marginTop: SPACING.md },
  metricRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  metricLabel: { color: COLORS.textDescription },
  metricValue: { color: COLORS.textTitle, fontWeight: '600' },
  warningText: { color: COLORS.attention },
  emptyText: { color: COLORS.textMuted, textAlign: 'center', padding: SPACING.xl },
  errorRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, marginTop: SPACING.sm },
  severityBadge: { paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs, borderRadius: BORDER_RADIUS.sm, marginRight: SPACING.md },
  severityText: { fontSize: 10, fontWeight: '700' },
  errorInfo: { flex: 1 },
  errorMessage: { color: COLORS.textTitle, fontSize: 14 },
  errorTime: { color: COLORS.textMuted, fontSize: 12, marginTop: SPACING.xs },
});
