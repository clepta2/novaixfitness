// src/constants/fonts.js
// Fontes oficiais NOVAIX FITNESS

import { COLORS } from './colors';

export const FONTS = {
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

export const FONT_SIZES = {
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
