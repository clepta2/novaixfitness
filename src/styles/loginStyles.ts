// src/styles/loginStyles.ts
// Estilos da tela de login - NOVAIX FITNESS

import { StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { SPACING, BORDER_RADIUS } from '../constants/spacing';
import { SHADOWS } from '../constants/shadows';

export const styles = StyleSheet.create({
  gradient: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: SPACING.xl, paddingBottom: 40 },
  brand: { alignItems: 'center', marginBottom: SPACING.massive },
  brandName: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 32, color: COLORS.primary, letterSpacing: 2 },
  brandTagline: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, marginTop: SPACING.xs },
  form: { gap: SPACING.sm },
  error: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.error + '15', padding: SPACING.sm, borderRadius: BORDER_RADIUS.sm, marginBottom: SPACING.sm },
  errorText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.error, flex: 1 },
  forgot: { alignSelf: 'flex-end', paddingVertical: SPACING.xs },
  forgotText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: COLORS.textMuted },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginTop: SPACING.sm },
  bioBtn: { width: 50, height: 50, borderRadius: BORDER_RADIUS.md, backgroundColor: COLORS.surface + 'CC', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.sm },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: SPACING.xxl },
  footerText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted },
  footerLink: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.primary },
});
