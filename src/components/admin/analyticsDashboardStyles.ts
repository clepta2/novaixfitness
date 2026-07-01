import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

export const styles = StyleSheet.create({
  container: { flex: 1, padding: SPACING.lg, backgroundColor: COLORS.background },
  periodSelector: { flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.xs, marginTop: SPACING.lg },
  periodBtn: { flex: 1, paddingVertical: SPACING.sm, alignItems: 'center', borderRadius: BORDER_RADIUS.sm },
  periodBtnActive: { backgroundColor: COLORS.primary },
  periodText: { color: COLORS.textMuted, fontSize: 14, fontWeight: '500' },
  periodTextActive: { color: COLORS.background },
  section: { marginTop: SPACING.xl },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginTop: SPACING.md },
  segmentGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginTop: SPACING.md },
  segmentCard: { width: '31%', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, borderLeftWidth: 3 },
  segmentLabel: { fontSize: 12, color: COLORS.textMuted },
  segmentValue: { fontSize: 18, fontWeight: '700', marginTop: SPACING.sm },
});
