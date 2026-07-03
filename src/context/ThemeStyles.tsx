// src/context/ThemeStyles.tsx
// Hook para estilos reativos baseados no tema

import { useMemo } from 'react';
import { ViewStyle, TextStyle } from 'react-native';
import { useColors } from './ThemeContext';
import { SPACING, BORDER_RADIUS } from '../constants/spacing';
import { SHADOWS } from '../constants/shadows';

type ThemedStyles = {
  screen: ViewStyle;
  surface: ViewStyle;
  surfaceElevated: ViewStyle;
  card: ViewStyle;
  cardActive: ViewStyle;
  text: TextStyle;
  textSecondary: TextStyle;
  textMuted: TextStyle;
  border: ViewStyle;
  input: ViewStyle;
  sectionTitle: TextStyle;
  header: TextStyle;
};

// Estilos que dependem do tema
export function useThemedStyles() {
  const colors = useColors();

  return useMemo(() => ({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    } as ViewStyle,

    surface: {
      backgroundColor: colors.surface,
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.lg,
      borderWidth: 1,
      borderColor: colors.border,
    } as ViewStyle,

    surfaceElevated: {
      backgroundColor: colors.surfaceElevated,
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.lg,
      borderWidth: 1,
      borderColor: colors.border,
      ...SHADOWS.sm,
    } as ViewStyle,

    card: {
      backgroundColor: colors.surface,
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.lg,
      borderWidth: 1,
      borderColor: colors.border,
    } as ViewStyle,

    cardActive: {
      backgroundColor: colors.primary + '10',
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.lg,
      borderWidth: 2,
      borderColor: colors.primary,
      ...SHADOWS.sm,
    } as ViewStyle,

    text: {
      fontFamily: 'Montserrat_700Bold',
      fontSize: 18,
      color: colors.textTitle,
    } as TextStyle,

    textSecondary: {
      fontFamily: 'Inter_400Regular',
      fontSize: 14,
      color: colors.textDescription,
    } as TextStyle,

    textMuted: {
      fontFamily: 'Inter_400Regular',
      fontSize: 12,
      color: colors.textMuted,
    } as TextStyle,

    border: {
      borderWidth: 1,
      borderColor: colors.border,
    } as ViewStyle,

    input: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: BORDER_RADIUS.md,
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm,
      color: colors.textTitle,
    } as ViewStyle,

    sectionTitle: {
      fontFamily: 'Montserrat_600SemiBold',
      fontSize: 12,
      color: colors.textMuted,
      letterSpacing: 1,
      marginBottom: SPACING.md,
    } as TextStyle,

    header: {
      fontFamily: 'Montserrat_700Bold',
      fontSize: 22,
      color: colors.textTitle,
      marginBottom: SPACING.sm,
    } as TextStyle,
  }), [colors]);
}
