// src/styles/typography.js
// Tipografia compartilhada - NOVAIX FITNESS

import { StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

export const typography = StyleSheet.create({
  // Titles
  h1: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 32, color: COLORS.textTitle },
  h2: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 28, color: COLORS.textTitle },
  h3: { fontFamily: 'Montserrat_700Bold', fontSize: 24, color: COLORS.textTitle },
  h4: { fontFamily: 'Montserrat_700Bold', fontSize: 20, color: COLORS.textTitle },
  h5: { fontFamily: 'Montserrat_600SemiBold', fontSize: 16, color: COLORS.textTitle },

  // Body
  body: { fontFamily: 'Inter_400Regular', fontSize: 16, color: COLORS.textTitle },
  bodySmall: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textTitle },
  bodyMuted: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textDescription },
  caption: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted },

  // Labels
  label: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textTitle, textTransform: 'uppercase', letterSpacing: 1 },
  labelSmall: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted },

  // Special
  price: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 32, color: COLORS.primary },
  timer: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 64, color: COLORS.primary, letterSpacing: 2 },
  brand: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 48, color: COLORS.primary, letterSpacing: 2 },
});
