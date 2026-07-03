// src/styles/nutritionStyles.ts
// Estilos da tela de nutricao - NOVAIX FITNESS

import { StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { SPACING, BORDER_RADIUS } from '../constants/spacing';

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingTop: SPACING.xxxl, paddingBottom: SPACING.lg },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle, letterSpacing: 2 },
  content: { padding: SPACING.lg, gap: SPACING.lg, paddingBottom: SPACING.huge },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: SPACING.md, paddingHorizontal: SPACING.xl },
  loadingText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted },
  retryBtn: { backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.md, paddingHorizontal: SPACING.xl, paddingVertical: SPACING.md, marginTop: SPACING.sm },
  retryText: { fontFamily: 'Montserrat_700Bold', fontSize: 13, color: COLORS.background, letterSpacing: 1 },
  logBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg },
  logBtnText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.background, letterSpacing: 1 },
  linksSection: { gap: SPACING.md },
});
