// src/styles/typography.ts
// Tipografia — FONTE ÚNICA DE VERDADE — NOVAIX FITNESS com tipagem estrita
// NÃO duplicar definições em fonts.ts

import { StyleSheet, TextStyle } from 'react-native';
import { scale } from '../utils/responsive';
import { COLORS } from '../constants/colors';

export interface TypographyStyles {
  h1: TextStyle;
  h2: TextStyle;
  h3: TextStyle;
  h4: TextStyle;
  h5: TextStyle;
  body: TextStyle;
  bodySmall: TextStyle;
  bodyMuted: TextStyle;
  bodySemiBold: TextStyle;
  bodyBold: TextStyle;
  caption: TextStyle;
  label: TextStyle;
  labelSmall: TextStyle;
  labelMuted: TextStyle;
  price: TextStyle;
  timer: TextStyle;
  brand: TextStyle;
  stat: TextStyle;
  number: TextStyle;
  button: TextStyle;
  buttonSmall: TextStyle;
  chipActive: TextStyle;
  subtitle: TextStyle;
  statValue: TextStyle;
  statLabel: TextStyle;
  cardTitle: TextStyle;
  cardDate: TextStyle;
  cardMeta: TextStyle;
  cardStatText: TextStyle;
  sectionTag: TextStyle;
  sectionTitleLanding: TextStyle;
  inputField: TextStyle;
  monospace: TextStyle;
}
export const typography = StyleSheet.create<TypographyStyles>({
  // ── Titles (Montserrat — Title Case, sem uppercase forçado) ──
  h1: { fontFamily: 'Montserrat_800ExtraBold', fontSize: scale(32), lineHeight: scale(40), color: COLORS.textTitle },
  h2: { fontFamily: 'Montserrat_800ExtraBold', fontSize: scale(28), lineHeight: scale(36), color: COLORS.textTitle },
  h3: { fontFamily: 'Montserrat_700Bold', fontSize: scale(24), lineHeight: scale(32), color: COLORS.textTitle },
  h4: { fontFamily: 'Montserrat_700Bold', fontSize: scale(20), lineHeight: scale(28), color: COLORS.textTitle },
  h5: { fontFamily: 'Montserrat_600SemiBold', fontSize: scale(16), lineHeight: scale(22), color: COLORS.textTitle },

  // ── Body (Inter) ──
  body: { fontFamily: 'Inter_400Regular', fontSize: scale(16), lineHeight: scale(26), color: COLORS.textTitle },
  bodySmall: { fontFamily: 'Inter_400Regular', fontSize: scale(14), lineHeight: scale(22), color: COLORS.textTitle },
  bodyMuted: { fontFamily: 'Inter_400Regular', fontSize: scale(14), lineHeight: scale(22), color: COLORS.textDescription },
  bodySemiBold: { fontFamily: 'Inter_600SemiBold', fontSize: scale(16), lineHeight: scale(26), color: COLORS.textTitle },
  bodyBold: { fontFamily: 'Inter_700Bold', fontSize: scale(16), lineHeight: scale(26), color: COLORS.textTitle },
  caption: { fontFamily: 'Inter_400Regular', fontSize: scale(12), lineHeight: scale(18), color: COLORS.textMuted },

  // ── Labels (Montserrat — UPPERCASE para seções e badges) ──
  label: { fontFamily: 'Montserrat_600SemiBold', fontSize: scale(12), lineHeight: scale(16), color: COLORS.textTitle, textTransform: 'uppercase', letterSpacing: 1 },
  labelSmall: { fontFamily: 'Inter_400Regular', fontSize: scale(10), lineHeight: scale(14), color: COLORS.textMuted },
  labelMuted: { fontFamily: 'Montserrat_600SemiBold', fontSize: scale(12), lineHeight: scale(16), color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 1 },

  // ── Special (Montserrat) ──
  price: { fontFamily: 'Montserrat_800ExtraBold', fontSize: scale(32), lineHeight: scale(40), color: COLORS.primary },
  timer: { fontFamily: 'Montserrat_800ExtraBold', fontSize: scale(64), lineHeight: scale(72), color: COLORS.primary, letterSpacing: 2 },
  brand: { fontFamily: 'Montserrat_800ExtraBold', fontSize: scale(48), lineHeight: scale(56), color: COLORS.primary, letterSpacing: 2 },
  stat: { fontFamily: 'Montserrat_700Bold', fontSize: scale(24), lineHeight: scale(32), color: COLORS.primary },
  number: { fontFamily: 'Inter_700Bold', fontSize: scale(20), lineHeight: scale(28), color: COLORS.textTitle },

  // ── Buttons (Montserrat — UPPERCASE) ──
  button: { fontFamily: 'Montserrat_700Bold', fontSize: scale(14), lineHeight: scale(20), textTransform: 'uppercase', letterSpacing: 1 },
  buttonSmall: { fontFamily: 'Montserrat_700Bold', fontSize: scale(12), lineHeight: scale(16), textTransform: 'uppercase', letterSpacing: 0.5 },

  // ── Common overrides ──
  chipActive: { fontFamily: 'Montserrat_600SemiBold', fontSize: scale(13), color: COLORS.background },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: scale(14), lineHeight: scale(20), color: COLORS.textDescription },
  statValue: { fontFamily: 'Montserrat_700Bold', fontSize: scale(18), color: COLORS.primary },
  statLabel: { fontFamily: 'Inter_400Regular', fontSize: scale(11), color: COLORS.textMuted, marginTop: 2 },
  cardTitle: { fontFamily: 'Montserrat_600SemiBold', fontSize: scale(15), color: COLORS.textTitle },
  cardDate: { fontFamily: 'Inter_400Regular', fontSize: scale(12), color: COLORS.textMuted, marginTop: 2 },
  cardMeta: { fontFamily: 'Inter_400Regular', fontSize: scale(11), color: COLORS.textMuted, marginTop: 2 },
  cardStatText: { fontFamily: 'Inter_400Regular', fontSize: scale(12), color: COLORS.textDescription },
  sectionTag: { fontFamily: 'Montserrat_700Bold', fontSize: scale(12), color: COLORS.primary, textAlign: 'center', letterSpacing: 3, textTransform: 'uppercase' },
  sectionTitleLanding: { fontFamily: 'Montserrat_800ExtraBold', fontSize: scale(26), color: COLORS.textTitle, textAlign: 'center', letterSpacing: 0.5 },
  inputField: { fontFamily: 'Inter_400Regular', fontSize: scale(14), color: COLORS.textTitle },
  monospace: { fontFamily: 'monospace', fontSize: scale(11), color: COLORS.textMuted },
});
