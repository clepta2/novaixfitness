// src/styles/display.ts - Estilos de listas, divisores, avatar, gradientes, progresso

import { ViewStyle, TextStyle } from 'react-native';
import { COLORS } from '../constants/colors';
import { SPACING, BORDER_RADIUS } from '../constants/spacing';

// ─── Divider Styles ─────────────────────────────────────────
export const dividerStyles = {
  horizontal: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginVertical: SPACING.lg,
  } as ViewStyle,
  line: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  } as ViewStyle,
  text: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: COLORS.textMuted,
    marginHorizontal: SPACING.md,
  } as TextStyle,
} as const;

// ─── Avatar Sizes ───────────────────────────────────────────
export const avatarSizes = {
  xs: 28,
  sm: 36,
  md: 44,
  lg: 56,
  xl: 72,
  xxl: 96,
} as const;

// ─── Gradient Presets ───────────────────────────────────────
export const gradientPresets = {
  primary: [COLORS.primary, COLORS.primaryDark],
  accent: [COLORS.secondary, COLORS.secondaryLight],
  dark: [COLORS.surface, COLORS.background],
  premium: [COLORS.primary, COLORS.success],
  sunset: ['#FF6B35', '#FF8F65', '#FFB088'],
  ocean: ['#3B82F6', '#06B6D4', '#00E676'],
  royal: ['#6366F1', '#8B5CF6', '#A855F7'],
} as const;

// ─── List Styles ────────────────────────────────────────────
export const listStyles = {
  item: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  } as ViewStyle,
  itemPressed: {
    backgroundColor: COLORS.surfaceElevated,
  } as ViewStyle,
  itemLast: {
    borderBottomWidth: 0,
  } as ViewStyle,
  sectionHeader: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 11,
    color: COLORS.textMuted,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.sm,
  } as TextStyle,
} as const;

// ─── Progress Bar Styles ────────────────────────────────────
export const progressBarStyles = {
  track: {
    height: 6,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: 3,
    overflow: 'hidden' as const,
  } as ViewStyle,
  trackThick: {
    height: 10,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: 5,
    overflow: 'hidden' as const,
  } as ViewStyle,
  fill: {
    height: '100%' as any,
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  } as ViewStyle,
  fillSuccess: {
    backgroundColor: COLORS.success,
  } as ViewStyle,
  fillError: {
    backgroundColor: COLORS.error,
  } as ViewStyle,
  fillGradient: {
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  } as ViewStyle,
} as const;

// ─── Skeleton Loading ───────────────────────────────────────
export const skeletonStyles = {
  line: {
    height: 14,
    backgroundColor: COLORS.surfaceOverlay || COLORS.surface,
    borderRadius: BORDER_RADIUS.sm,
  } as ViewStyle,
  circle: {
    borderRadius: 999,
    backgroundColor: COLORS.surfaceOverlay || COLORS.surface,
  } as ViewStyle,
  card: {
    backgroundColor: COLORS.surfaceOverlay || COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
  } as ViewStyle,
} as const;
