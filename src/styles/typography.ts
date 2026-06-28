// src/styles/typography.ts
// Tipografia — FONTE ÚNICA DE VERDADE — NOVAIX FITNESS com tipagem estrita e tema dinâmico
// NÃO duplicar definições em fonts.ts

import { TextStyle } from 'react-native';
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

export const typography: TypographyStyles = {
  // ── Titles (Montserrat — Title Case, sem uppercase forçado) ──
  get h1(): TextStyle { return { fontFamily: 'Montserrat_800ExtraBold', fontSize: scale(32), lineHeight: scale(40), color: COLORS.textTitle }; },
  get h2(): TextStyle { return { fontFamily: 'Montserrat_800ExtraBold', fontSize: scale(28), lineHeight: scale(36), color: COLORS.textTitle }; },
  get h3(): TextStyle { return { fontFamily: 'Montserrat_700Bold', fontSize: scale(24), lineHeight: scale(32), color: COLORS.textTitle }; },
  get h4(): TextStyle { return { fontFamily: 'Montserrat_700Bold', fontSize: scale(20), lineHeight: scale(28), color: COLORS.textTitle }; },
  get h5(): TextStyle { return { fontFamily: 'Montserrat_600SemiBold', fontSize: scale(16), lineHeight: scale(22), color: COLORS.textTitle }; },

  // ── Body (Inter) ──
  get body(): TextStyle { return { fontFamily: 'Inter_400Regular', fontSize: scale(16), lineHeight: scale(26), color: COLORS.textTitle }; },
  get bodySmall(): TextStyle { return { fontFamily: 'Inter_400Regular', fontSize: scale(14), lineHeight: scale(22), color: COLORS.textTitle }; },
  get bodyMuted(): TextStyle { return { fontFamily: 'Inter_400Regular', fontSize: scale(14), lineHeight: scale(22), color: COLORS.textDescription }; },
  get bodySemiBold(): TextStyle { return { fontFamily: 'Inter_600SemiBold', fontSize: scale(16), lineHeight: scale(26), color: COLORS.textTitle }; },
  get bodyBold(): TextStyle { return { fontFamily: 'Inter_700Bold', fontSize: scale(16), lineHeight: scale(26), color: COLORS.textTitle }; },
  get caption(): TextStyle { return { fontFamily: 'Inter_400Regular', fontSize: scale(12), lineHeight: scale(18), color: COLORS.textMuted }; },

  // ── Labels (Montserrat — UPPERCASE para seções e badges) ──
  get label(): TextStyle { return { fontFamily: 'Montserrat_600SemiBold', fontSize: scale(12), lineHeight: scale(16), color: COLORS.textTitle, textTransform: 'uppercase', letterSpacing: 1 }; },
  get labelSmall(): TextStyle { return { fontFamily: 'Inter_400Regular', fontSize: scale(10), lineHeight: scale(14), color: COLORS.textMuted }; },
  get labelMuted(): TextStyle { return { fontFamily: 'Montserrat_600SemiBold', fontSize: scale(12), lineHeight: scale(16), color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 1 }; },

  // ── Special (Montserrat) ──
  get price(): TextStyle { return { fontFamily: 'Montserrat_800ExtraBold', fontSize: scale(32), lineHeight: scale(40), color: COLORS.primary }; },
  get timer(): TextStyle { return { fontFamily: 'Montserrat_800ExtraBold', fontSize: scale(64), lineHeight: scale(72), color: COLORS.primary, letterSpacing: 2 }; },
  get brand(): TextStyle { return { fontFamily: 'Montserrat_800ExtraBold', fontSize: scale(48), lineHeight: scale(56), color: COLORS.primary, letterSpacing: 2 }; },
  get stat(): TextStyle { return { fontFamily: 'Montserrat_700Bold', fontSize: scale(24), lineHeight: scale(32), color: COLORS.primary }; },
  get number(): TextStyle { return { fontFamily: 'Inter_700Bold', fontSize: scale(20), lineHeight: scale(28), color: COLORS.textTitle }; },

  // ── Buttons (Montserrat — UPPERCASE) ──
  get button(): TextStyle { return { fontFamily: 'Montserrat_700Bold', fontSize: scale(14), lineHeight: scale(20), textTransform: 'uppercase', letterSpacing: 1 }; },
  get buttonSmall(): TextStyle { return { fontFamily: 'Montserrat_700Bold', fontSize: scale(12), lineHeight: scale(16), textTransform: 'uppercase', letterSpacing: 0.5 }; },

  // ── Common overrides ──
  get chipActive(): TextStyle { return { fontFamily: 'Montserrat_600SemiBold', fontSize: scale(13), color: COLORS.background }; },
  get subtitle(): TextStyle { return { fontFamily: 'Inter_400Regular', fontSize: scale(14), lineHeight: scale(20), color: COLORS.textDescription }; },
  get statValue(): TextStyle { return { fontFamily: 'Montserrat_700Bold', fontSize: scale(18), color: COLORS.primary }; },
  get statLabel(): TextStyle { return { fontFamily: 'Inter_400Regular', fontSize: scale(11), color: COLORS.textMuted, marginTop: 2 }; },
  get cardTitle(): TextStyle { return { fontFamily: 'Montserrat_600SemiBold', fontSize: scale(15), color: COLORS.textTitle }; },
  get cardDate(): TextStyle { return { fontFamily: 'Inter_400Regular', fontSize: scale(12), color: COLORS.textMuted, marginTop: 2 }; },
  get cardMeta(): TextStyle { return { fontFamily: 'Inter_400Regular', fontSize: scale(11), color: COLORS.textMuted, marginTop: 2 }; },
  get cardStatText(): TextStyle { return { fontFamily: 'Inter_400Regular', fontSize: scale(12), color: COLORS.textDescription }; },
  get sectionTag(): TextStyle { return { fontFamily: 'Montserrat_700Bold', fontSize: scale(12), color: COLORS.primary, textAlign: 'center', letterSpacing: 3, textTransform: 'uppercase' }; },
  get sectionTitleLanding(): TextStyle { return { fontFamily: 'Montserrat_800ExtraBold', fontSize: scale(26), color: COLORS.textTitle, textAlign: 'center', letterSpacing: 0.5 }; },
  get inputField(): TextStyle { return { fontFamily: 'Inter_400Regular', fontSize: scale(14), color: COLORS.textTitle }; },
  get monospace(): TextStyle { return { fontFamily: 'monospace', fontSize: scale(11), color: COLORS.textMuted }; },
};
