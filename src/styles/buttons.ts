// src/styles/buttons.ts - Estilos de botoes, inputs e badges

import { ViewStyle, TextStyle } from 'react-native';
import { COLORS } from '../constants/colors';
import { SPACING, BORDER_RADIUS } from '../constants/spacing';

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
