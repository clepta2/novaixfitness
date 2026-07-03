// src/styles/preferenciasStyles.ts
// Estilos da tela de preferencias do onboarding - NOVAIX FITNESS

import { StyleSheet, Platform } from 'react-native';
import { COLORS } from '../constants/colors';
import { SPACING, BORDER_RADIUS } from '../constants/spacing';

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flexGrow: 1, padding: SPACING.xl, paddingTop: Platform.OS === 'ios' ? 54 : 40, paddingBottom: SPACING.xxl },
  header: { marginBottom: SPACING.xxl },
  daysRow: { flexDirection: 'row', gap: SPACING.sm },
  dayCard: { flex: 1, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 2, borderColor: COLORS.border, paddingVertical: SPACING.lg, alignItems: 'center', gap: 4 },
  dayCardActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '10' },
  dayNum: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 20, color: COLORS.textMuted },
  dayNumActive: { color: COLORS.primary },
  daySub: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted },
  locRow: { flexDirection: 'row', gap: SPACING.sm },
  locCard: { flex: 1, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, borderWidth: 2, borderColor: COLORS.border, padding: SPACING.md, alignItems: 'center', gap: SPACING.sm },
  locIcon: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  locLabel: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textTitle },
  gymGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  gymCard: { width: '30%', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 2, borderColor: COLORS.border, padding: SPACING.md, alignItems: 'center', gap: SPACING.xs },
  gymCardActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '10' },
  gymLabel: { fontFamily: 'Inter_500Medium', fontSize: 11, color: COLORS.textMuted, textAlign: 'center' },
  levelRow: { flexDirection: 'row', gap: SPACING.sm },
  levelCard: { flex: 1, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, borderWidth: 2, borderColor: COLORS.border, padding: SPACING.lg, alignItems: 'center', gap: SPACING.sm, position: 'relative' },
  levelIcon: { width: 56, height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  levelLabel: { fontFamily: 'Montserrat_700Bold', fontSize: 13, color: COLORS.textTitle },
  checkBadge: { position: 'absolute', top: SPACING.sm, right: SPACING.sm, width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
});
