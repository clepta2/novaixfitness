// src/constants/spacing.ts
// Sistema de espaçamentos NOVAIX FITNESS com tipagem estrita

import { scale } from '../utils/responsive';
export { SHADOWS } from './shadows';

export interface SpacingTokens {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  xxxl: number;
  huge: number;
  massive: number;
}

export interface BorderRadiusTokens {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  full: number;
}

export interface IconSizeTokens {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}
export const SPACING: SpacingTokens = {
  xs: scale(4),
  sm: scale(8),
  md: scale(12),
  lg: scale(16),
  xl: scale(20),
  xxl: scale(24),
  xxxl: scale(32),
  huge: scale(40),
  massive: scale(48),
};

export const BORDER_RADIUS: BorderRadiusTokens = {
  sm: scale(8),
  md: scale(12),
  lg: scale(16),
  xl: scale(20),
  full: 9999,
};

export const ICON_SIZES: IconSizeTokens = {
  xs: scale(14),
  sm: scale(18),
  md: scale(22),
  lg: scale(28),
  xl: scale(36),
  xxl: scale(48),
};

