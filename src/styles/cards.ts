// src/styles/cards.ts - Estilos de cards, containers e overlays

import { ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native';
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
  },
  label: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: COLORS.textMuted,
  },
} as const;
