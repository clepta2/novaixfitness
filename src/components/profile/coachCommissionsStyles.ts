import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

export const styles = StyleSheet.create({
  container: { marginTop: SPACING.xl },
  loadingContainer: { padding: SPACING.xl, alignItems: 'center' },
  sectionTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textMuted, marginBottom: SPACING.md, letterSpacing: 0.5 },
  balanceGrid: { flexDirection: 'row', gap: SPACING.md, marginBottom: SPACING.md },
  balanceBox: { flex: 1, backgroundColor: COLORS.surface, borderStyle: 'solid', borderWidth: 1, borderColor: COLORS.border, padding: SPACING.md, borderRadius: BORDER_RADIUS.md },
  boxLabel: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted, marginBottom: 4 },
  boxValue: { fontFamily: 'Montserrat_700Bold', fontSize: 15, color: COLORS.textTitle },
  formCard: { backgroundColor: COLORS.surface, borderStyle: 'solid', borderWidth: 1, borderColor: COLORS.border, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, marginBottom: SPACING.lg },
  formTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 11, color: COLORS.textTitle, marginBottom: SPACING.sm },
  input: { backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.border, borderRadius: BORDER_RADIUS.md, color: COLORS.textTitle, padding: SPACING.sm, fontFamily: 'Inter_400Regular', fontSize: 13, marginBottom: SPACING.sm },
  pixTypeRow: { flexDirection: 'row', gap: SPACING.xs, marginBottom: SPACING.sm },
  pixTypeBtn: { flex: 1, paddingVertical: 6, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.sm, alignItems: 'center', borderStyle: 'solid', borderWidth: 1, borderColor: COLORS.border },
  pixTypeBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  pixTypeBtnText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 9, color: COLORS.textMuted },
  pixTypeBtnTextActive: { color: COLORS.background },
  withdrawBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.xs, backgroundColor: COLORS.primary, padding: SPACING.md, borderRadius: BORDER_RADIUS.md },
  withdrawBtnText: { fontFamily: 'Montserrat_700Bold', fontSize: 11, color: COLORS.background },
  historyTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 10, color: COLORS.textMuted, marginBottom: SPACING.sm },
  emptyText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted, fontStyle: 'italic' },
  historyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.surface, borderStyle: 'solid', borderWidth: 1, borderColor: COLORS.border, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, marginBottom: SPACING.xs },
  historyAmount: { fontFamily: 'Montserrat_700Bold', fontSize: 13, color: COLORS.textTitle },
  historyDate: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted, marginTop: 2 },
  statusBadge: { paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: BORDER_RADIUS.sm },
  statusSuccess: { backgroundColor: 'rgba(76,175,80,0.1)' },
  statusFailed: { backgroundColor: 'rgba(244,67,54,0.1)' },
  statusPending: { backgroundColor: 'rgba(255,152,0,0.1)' },
  statusText: { fontFamily: 'Montserrat_700Bold', fontSize: 8, color: COLORS.textTitle },
});
