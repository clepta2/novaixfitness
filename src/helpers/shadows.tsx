// src/helpers/shadows.ts
// Helpers para gerar boxShadow a partir de parametros de sombra - NOVAIX FITNESS

import { Platform, ViewStyle, TextStyle } from 'react-native';

const isAndroid = Platform.OS === 'android';

interface ShadowParams {
  x?: number;
  y?: number;
  blur?: number;
  color?: string;
  opacity?: number;
}

interface TextShadowParams {
  x?: number;
  y?: number;
  blur?: number;
  color?: string;
  opacity?: number;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  };
}

/**
 * Converte parametros de sombra para boxShadow (iOS/Web) ou elevation (Android).
 */
export function shadow({ x = 0, y = 0, blur = 4, color = '#000', opacity = 0.2 }: ShadowParams = {}): Partial<ViewStyle> {
  if (isAndroid) {
    return { elevation: Math.max(Math.round(blur * 0.8), 1) };
  }
  const { r, g, b } = hexToRgb(color);
  return {
    boxShadow: `${x}px ${y}px ${blur}px rgba(${r}, ${g}, ${b}, ${opacity})`,
  };
}

/**
 * Converte parametros de textShadow para a propriedade textShadow.
 */
export function textShadow({ x = 1, y = 1, blur = 3, color = '#000', opacity = 0.6 }: TextShadowParams = {}): Partial<TextStyle> {
  const { r, g, b } = hexToRgb(color);
  return {
    textShadowColor: `rgba(${r}, ${g}, ${b}, ${opacity})`,
    textShadowOffset: { width: x, height: y },
    textShadowRadius: blur,
  } as Partial<TextStyle>;
}
