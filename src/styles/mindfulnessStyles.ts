import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { SPACING, BORDER_RADIUS } from '../constants/spacing';

export function useMindfulnessStyles() {
  return useMemo(() => StyleSheet.create({
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: SPACING.xl, paddingBottom: SPACING.md },
    scroll: { padding: SPACING.xl },
    statsRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.xxl },
    statCard: { flex: 1, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
    statValue: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 24, color: COLORS.primary },
    statLabel: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted, marginTop: 4 },
    sectionTitle: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textMuted, letterSpacing: 1, marginBottom: SPACING.md },
    exerciseCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
    iconCircle: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md },
    exerciseInfo: { flex: 1 },
    exerciseName: { fontFamily: 'Montserrat_700Bold', fontSize: 15, color: COLORS.textTitle, marginBottom: 2 },
    exerciseDescription: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textDescription, marginBottom: 6 },
    exerciseMeta: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
    benefitTag: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.primary, backgroundColor: COLORS.primary + '15', paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: BORDER_RADIUS.sm, overflow: 'hidden' },
    metaText: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted },
    activeCard: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.xl, alignItems: 'center', marginBottom: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
    activeDescription: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textDescription, textAlign: 'center', marginTop: SPACING.sm },
    phaseGuide: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginTop: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
    guideTitle: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textMuted, letterSpacing: 1, marginBottom: SPACING.md },
    phaseRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm },
    phaseDot: { width: 8, height: 8, borderRadius: 4 },
    phaseText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textDescription },
    tipCard: { flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, marginTop: SPACING.xl, borderWidth: 1, borderColor: COLORS.border, gap: SPACING.md },
    tipText: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textDescription, lineHeight: 20 },
  }), [COLORS.background, COLORS.primary, COLORS.surface, COLORS.border, COLORS.textTitle, COLORS.textDescription, COLORS.textMuted]);
}

// Backward-compatible static export
export const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: SPACING.xl, paddingBottom: SPACING.md },
  scroll: { padding: SPACING.xl },
  statsRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.xxl },
  statCard: { flex: 1, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  statValue: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 24, color: COLORS.primary },
  statLabel: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted, marginTop: 4 },
  sectionTitle: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textMuted, letterSpacing: 1, marginBottom: SPACING.md },
  exerciseCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  iconCircle: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md },
  exerciseInfo: { flex: 1 },
  exerciseName: { fontFamily: 'Montserrat_700Bold', fontSize: 15, color: COLORS.textTitle, marginBottom: 2 },
  exerciseDescription: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textDescription, marginBottom: 6 },
  exerciseMeta: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  benefitTag: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.primary, backgroundColor: COLORS.primary + '15', paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: BORDER_RADIUS.sm, overflow: 'hidden' },
  metaText: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted },
  activeCard: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.xl, alignItems: 'center', marginBottom: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  activeDescription: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textDescription, textAlign: 'center', marginTop: SPACING.sm },
  phaseGuide: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginTop: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  guideTitle: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textMuted, letterSpacing: 1, marginBottom: SPACING.md },
  phaseRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm },
  phaseDot: { width: 8, height: 8, borderRadius: 4 },
  phaseText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textDescription },
  tipCard: { flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, marginTop: SPACING.xl, borderWidth: 1, borderColor: COLORS.border, gap: SPACING.md },
  tipText: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textDescription, lineHeight: 20 },
});
