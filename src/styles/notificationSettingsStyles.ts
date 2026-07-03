import { StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { SPACING, BORDER_RADIUS } from '../constants/spacing';
import { typography } from './index';

export const styles = StyleSheet.create({
  scroll: { flexGrow: 1, padding: SPACING.xl, paddingTop: 40 },
  section: { marginBottom: SPACING.xl },
  optionItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  optionLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, flex: 1 },
  optionIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primary + '15', justifyContent: 'center', alignItems: 'center' },
  optionInfo: { flex: 1 },
  timeOptions: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.md },
  timeOption: { flex: 1, paddingVertical: SPACING.md, backgroundColor: COLORS.surface, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  timeOptionActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  timeTextActive: typography.chipActive,
  clearBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.error + '10', borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.error + '30' },
});
