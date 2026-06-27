// src/constants/fonts.ts
// ⚠️ DEPRECATED — Use typography.js/ts como fonte de verdade para estilos de texto.
// Este arquivo existe apenas para retrocompatibilidade de imports existentes.

import { COLORS } from './colors';

export interface FontStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight?: string;
  textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase';
  letterSpacing?: number;
  lineHeight?: number;
  color?: string;
}

export interface FontsTokens {
  h1: FontStyle;
  h2: FontStyle;
  h3: FontStyle;
  body: FontStyle;
  bodyMedium: FontStyle;
  caption: FontStyle;
  timer: FontStyle;
  button: FontStyle;
}

export interface FontSizesTokens {
  xs: number;
  sm: number;
  md: number;
  base: number;
  lg: number;
  xl: number;
  xxl: number;
  xxxl: number;
  huge: number;
  massive: number;
}

export const FONTS: FontsTokens = {
  h1: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 32,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: COLORS.textTitle,
  },
  h2: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 24,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: COLORS.textTitle,
  },
  h3: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textTitle,
  },
  body: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    color: COLORS.textTitle,
  },
  bodyMedium: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textTitle,
  },
  caption: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    fontWeight: '400',
    color: COLORS.textDescription,
  },
  timer: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 48,
    fontWeight: '700',
    color: COLORS.primary,
  },
  button: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
};

export const FONT_SIZES: FontSizesTokens = {
  xs: 10,
  sm: 12,
  md: 14,
  base: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
  massive: 64,
};
