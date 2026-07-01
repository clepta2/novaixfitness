import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

export const styles = StyleSheet.create({
  chartContainer: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.md },
  barsContainer: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', height: '100%' },
  barWrapper: { alignItems: 'center', flex: 1 },
  bar: { width: 20, borderRadius: BORDER_RADIUS.sm },
  barValue: { fontSize: 10, color: COLORS.textTitle, marginTop: SPACING.xs },
  barLabel: { fontSize: 10, color: COLORS.textMuted, marginTop: 2 },
  lineContainer: { flex: 1, position: 'relative' },
  linePoint: { position: 'absolute', width: 8, height: 8, borderRadius: 4, marginLeft: -4 },
  donutContainer: { justifyContent: 'center', alignItems: 'center' },
  donutCenter: { position: 'absolute', borderRadius: 999, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center' },
  donutTotal: { fontSize: 16, fontWeight: '700', color: COLORS.textTitle },
  ringContainer: { justifyContent: 'center', alignItems: 'center' },
  ringBackground: { position: 'absolute' },
  ringCenter: { borderRadius: 999, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center' },
  ringValue: { fontSize: 14, fontWeight: '700', color: COLORS.textTitle },
  sparklineContainer: { position: 'relative' },
  sparklinePoint: { position: 'absolute', width: 4, height: 4, borderRadius: 2, marginLeft: -2, marginTop: -2 },
});
