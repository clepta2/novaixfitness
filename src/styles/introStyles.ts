// src/styles/introStyles.ts
// Estilos da tela de intro - NOVAIX FITNESS

import { StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { SPACING, BORDER_RADIUS } from '../constants/spacing';
import { SHADOWS } from '../constants/shadows';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  skipBtn: { position: 'absolute', right: SPACING.xl, zIndex: 10, paddingVertical: SPACING.sm, paddingHorizontal: SPACING.md },
  skipText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textMuted },
  bottomSection: { paddingHorizontal: SPACING.xl, paddingBottom: SPACING.xxl },
  ctaBtn: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, paddingVertical: SPACING.lg, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  ctaBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary, ...SHADOWS.md },
  ctaBtnText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.textTitle, letterSpacing: 1 },
});
