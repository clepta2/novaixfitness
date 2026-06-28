// src/constants/shadows.ts
// Sistema de sombras e elevações NOVAIX FITNESS com tipagem estrita

import { Platform, ViewStyle } from 'react-native';
import { COLORS } from './colors';

const isAndroid = Platform.OS === 'android';
const isWeb = Platform.OS === 'web';

export interface ShadowStyle {
  elevation?: number;
  boxShadow?: string;
  shadowColor?: string;
  shadowOffset?: { width: number; height: number };
  shadowOpacity?: number;
  shadowRadius?: number;
}

export interface ShadowsTokens {
  sm: ShadowStyle;
  md: ShadowStyle;
  lg: ShadowStyle;
  glow: ShadowStyle;
}

export const SHADOWS: ShadowsTokens = {
  sm: isAndroid
    ? { elevation: 2 }
    : isWeb
    ? ({ boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)' } as any)
    : {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
  md: isAndroid
    ? { elevation: 4 }
    : isWeb
    ? ({ boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.15)' } as any)
    : {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
  lg: isAndroid
    ? { elevation: 8 }
    : isWeb
    ? ({ boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)' } as any)
    : {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
  glow: isAndroid
    ? { elevation: 12 }
    : isWeb
    ? ({ boxShadow: `0px 0px 12px ${COLORS.primary}66` } as any)
    : {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
      },
};

export function getShadows(isDark: boolean): ShadowsTokens {
  if (isDark) return SHADOWS;
  return {
    sm: isAndroid
      ? { elevation: 1 }
      : isWeb
      ? ({ boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.06)' } as any)
      : { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3 },
    md: isAndroid
      ? { elevation: 3 }
      : isWeb
      ? ({ boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.08)' } as any)
      : { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6 },
    lg: isAndroid
      ? { elevation: 6 }
      : isWeb
      ? ({ boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' } as any)
      : { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12 },
    glow: isAndroid
      ? { elevation: 8 }
      : isWeb
      ? ({ boxShadow: `0px 0px 16px ${COLORS.primary}44` } as any)
      : { shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.25, shadowRadius: 16 },
  };
}
