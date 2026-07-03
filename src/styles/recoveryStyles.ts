import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { SPACING, BORDER_RADIUS } from '../constants/spacing';

export function useRecoveryStyles() {
  return useMemo(() => StyleSheet.create({
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: SPACING.xl, paddingBottom: SPACING.md },
    scroll: { padding: SPACING.xl },
    section: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.lg },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm },
    sectionTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textMuted, letterSpacing: 1 },
    sectionDesc: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textMuted, marginBottom: SPACING.md },
    waterGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.sm },
    waterGlass: { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
    waterGlassActive: { backgroundColor: COLORS.info + '15', borderColor: COLORS.info },
    waterCount: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: COLORS.textTitle, textAlign: 'center' },
    input: { height: 48, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: SPACING.md, color: COLORS.textTitle, fontFamily: 'Inter_400Regular', fontSize: 16, marginBottom: SPACING.md },
    qualityRow: { flexDirection: 'row', gap: SPACING.sm },
    qualityBtn: { flex: 1, alignItems: 'center', padding: SPACING.md, borderRadius: BORDER_RADIUS.md, backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.border },
    qualityLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 11, color: COLORS.textMuted, marginTop: 4 },
    tipText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textDescription, lineHeight: 20 },
    saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.md, padding: SPACING.md },
    saveBtnDone: { backgroundColor: COLORS.success },
    saveBtnText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.background, letterSpacing: 0.5 },
  }), [COLORS.background, COLORS.primary, COLORS.surface, COLORS.border, COLORS.info, COLORS.success, COLORS.textTitle, COLORS.textDescription, COLORS.textMuted]);
}

// Backward-compatible static export
export const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: SPACING.xl, paddingBottom: SPACING.md },
  scroll: { padding: SPACING.xl },
  section: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.lg },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm },
  sectionTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textMuted, letterSpacing: 1 },
  sectionDesc: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textMuted, marginBottom: SPACING.md },
  waterGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.sm },
  waterGlass: { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  waterGlassActive: { backgroundColor: COLORS.info + '15', borderColor: COLORS.info },
  waterCount: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: COLORS.textTitle, textAlign: 'center' },
  input: { height: 48, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: SPACING.md, color: COLORS.textTitle, fontFamily: 'Inter_400Regular', fontSize: 16, marginBottom: SPACING.md },
  qualityRow: { flexDirection: 'row', gap: SPACING.sm },
  qualityBtn: { flex: 1, alignItems: 'center', padding: SPACING.md, borderRadius: BORDER_RADIUS.md, backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.border },
  qualityLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 11, color: COLORS.textMuted, marginTop: 4 },
  tipText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textDescription, lineHeight: 20 },
  saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.md, padding: SPACING.md },
  saveBtnDone: { backgroundColor: COLORS.success },
  saveBtnText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.background, letterSpacing: 0.5 },
});
