// src/styles/dadosFisicosStyles.js
// Estilos da tela dados-fisicos - NOVAIX FITNESS

import { Platform, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { SPACING, BORDER_RADIUS } from '../constants/spacing';

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flexGrow: 1, padding: SPACING.xl, paddingTop: Platform.OS === 'ios' ? 54 : 40 },
  footerWrap: { borderTopWidth: 1, borderTopColor: COLORS.border },
  header: { alignItems: 'center', marginBottom: SPACING.xl },
  progressWrap: { width: '100%', marginTop: SPACING.lg },
  sectionLabel: {
    fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textMuted,
    textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: SPACING.sm,
  },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  dateInput: {
    flex: 1, height: 56, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md,
    borderWidth: 1.5, borderColor: COLORS.border, paddingHorizontal: SPACING.lg,
    color: COLORS.textTitle, fontSize: 15, fontFamily: 'Inter_500Medium',
  },
  calendarBtn: {
    width: 56, height: 56, borderRadius: BORDER_RADIUS.md, backgroundColor: COLORS.surface,
    borderWidth: 1.5, borderColor: COLORS.border, justifyContent: 'center', alignItems: 'center',
  },
  helperText: { fontSize: 12, fontFamily: 'Inter_500Medium', marginTop: SPACING.xs },
  locationRow: { flexDirection: 'row', gap: SPACING.md, marginTop: SPACING.sm },
  stateBtn: { width: 80 },
  stateBtnLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textTitle, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: SPACING.sm },
  stateBtnBox: {
    height: 56, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md,
    borderWidth: 1.5, borderColor: COLORS.border, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: SPACING.md,
  },
  stateBtnText: { color: COLORS.textTitle, fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  gpsBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: SPACING.sm },
  gpsBtnText: { color: COLORS.primary, fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  dropdown: {
    backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 1,
    borderColor: COLORS.border, marginTop: -SPACING.sm, marginBottom: SPACING.sm, overflow: 'hidden',
  },
  dropdownItem: { padding: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  dropdownText: { color: COLORS.textTitle, fontFamily: 'Inter_400Regular', fontSize: 14 },
});
