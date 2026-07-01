import { StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { SPACING, BORDER_RADIUS } from '../constants/spacing';

export const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  headerActions: { flexDirection: 'row', gap: SPACING.sm },
  headerBtn: { padding: SPACING.sm },
  badge: { backgroundColor: COLORS.primary, borderRadius: 10, paddingHorizontal: SPACING.sm, paddingVertical: 2 },
  badgeText: { fontFamily: 'Montserrat_700Bold', fontSize: 11, color: COLORS.background },
  tabs: { flexDirection: 'row', backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.xs, paddingVertical: SPACING.md },
  tabActive: { borderBottomWidth: 2, borderBottomColor: COLORS.primary },
  tabText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textMuted },
  tabTextActive: { color: COLORS.primary },
  list: { padding: SPACING.md, paddingBottom: 110 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: SPACING.md },
  configContent: { padding: SPACING.xl, paddingBottom: 110 },
  configSection: { marginBottom: SPACING.xl },
  configItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, marginBottom: SPACING.xs, borderWidth: 1, borderColor: COLORS.border },
  configLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, flex: 1 },
  configIcon: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  configInfo: { flex: 1 },
  timeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  timeChip: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.sm, borderWidth: 1, borderColor: COLORS.border },
  timeChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  timeChipText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textMuted },
  timeChipTextActive: { color: COLORS.background },
});
