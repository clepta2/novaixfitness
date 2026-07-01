// src/styles/utils.ts
// Utilitarios de estilo para padroes comuns - NOVAIX FITNESS

import { ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { COLORS } from '../constants/colors';
import { SPACING, BORDER_RADIUS } from '../constants/spacing';
import { SHADOWS } from '../constants/shadows';

// ─── Card Styles ────────────────────────────────────────────
export const cardStyles = {
  default: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  } as ViewStyle,
  elevated: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.md,
  } as ViewStyle,
  outlined: {
    backgroundColor: 'transparent',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  } as ViewStyle,
  primary: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
  } as ViewStyle,
  glass: {
    backgroundColor: COLORS.surface + 'CC',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    overflow: 'hidden',
  } as ViewStyle,
} as const;

// ─── Button Styles ──────────────────────────────────────────
export const buttonStyles = {
  primary: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  } as ViewStyle,
  secondary: {
    backgroundColor: 'transparent',
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    alignItems: 'center' as const,
  } as ViewStyle,
  ghost: {
    backgroundColor: 'transparent',
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  } as ViewStyle,
  danger: {
    backgroundColor: COLORS.error,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    alignItems: 'center' as const,
  } as ViewStyle,
  icon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surface,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    borderWidth: 1,
    borderColor: COLORS.border,
  } as ViewStyle,
  iconSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  } as ViewStyle,
  iconPrimary: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  } as ViewStyle,
} as const;

// ─── Input Styles ───────────────────────────────────────────
export const inputStyles = {
  container: {
    marginBottom: SPACING.md,
  } as ViewStyle,
  wrapper: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    height: 52,
  } as ViewStyle,
  wrapperFocused: {
    borderColor: COLORS.primary,
  } as ViewStyle,
  wrapperError: {
    borderColor: COLORS.error,
  } as ViewStyle,
  input: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: COLORS.textTitle,
    paddingVertical: SPACING.sm,
  } as TextStyle,
  label: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 11,
    color: COLORS.textMuted,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.8,
    marginBottom: SPACING.xs,
  } as TextStyle,
  error: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.error,
    marginTop: SPACING.xs,
  } as TextStyle,
  helper: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  } as TextStyle,
} as const;

// ─── Badge Styles ───────────────────────────────────────────
export const badgeStyles = {
  primary: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    alignSelf: 'flex-start' as const,
  } as ViewStyle,
  secondary: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignSelf: 'flex-start' as const,
  } as ViewStyle,
  success: {
    backgroundColor: COLORS.success + '20',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    alignSelf: 'flex-start' as const,
  } as ViewStyle,
  error: {
    backgroundColor: COLORS.error + '20',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    alignSelf: 'flex-start' as const,
  } as ViewStyle,
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  } as ViewStyle,
  dotOnline: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.success,
    borderWidth: 2,
    borderColor: COLORS.surface,
  } as ViewStyle,
} as const;

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

// ─── Avatar Styles ──────────────────────────────────────────
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

// ─── Container Styles ───────────────────────────────────────
export const containerStyles = {
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  } as ViewStyle,
  centered: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    backgroundColor: COLORS.background,
  } as ViewStyle,
  padded: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.xl,
  } as ViewStyle,
  fullscreen: {
    flex: 1,
    backgroundColor: COLORS.background,
  } as ViewStyle,
} as const;

// ─── Overlay Styles ─────────────────────────────────────────
export const overlayStyles = {
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: COLORS.overlayDark,
  } as ViewStyle,
  modal: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end' as const,
  } as ViewStyle,
  sheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xxxl,
  } as ViewStyle,
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
    alignSelf: 'center' as const,
    marginBottom: SPACING.lg,
  } as ViewStyle,
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

// ─── Stat Card Styles ───────────────────────────────────────
export const statCardStyles = {
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    minWidth: 80,
    alignItems: 'center' as const,
  } as ViewStyle,
  icon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginBottom: SPACING.sm,
  } as ViewStyle,
  value: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 20,
    color: COLORS.textTitle,
    marginBottom: 2,
  } as TextStyle,
  label: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: COLORS.textMuted,
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

// ─── Chip / Tag Styles ──────────────────────────────────────
export const chipStyles = {
  default: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  } as ViewStyle,
  active: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  } as ViewStyle,
  text: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: COLORS.textTitle,
  } as TextStyle,
  textActive: {
    color: COLORS.background,
  } as TextStyle,
} as const;

// ─── Helper: merge styles safely ────────────────────────────
export function mergeStyles<T>(base: T, ...overrides: Partial<T>[]): T {
  return Object.assign({}, base, ...overrides) as T;
}

// Import StyleSheet for skeletonStyles
import { StyleSheet } from 'react-native';
