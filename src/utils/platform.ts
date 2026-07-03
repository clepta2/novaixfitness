// src/utils/platform.ts
// Utilitários de plataforma - NOVAIX FITNESS

import { Platform, Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Design base (iPhone 14)
const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

/**
 * Verifica a plataforma
 */
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
export const isWeb = Platform.OS === 'web';

/**
 * Largura e altura da tela
 */
export const screenWidth = SCREEN_WIDTH;
export const screenHeight = SCREEN_HEIGHT;

/**
 * Escala responsiva baseada na largura
 */
export function scale(size: number): number {
  return (SCREEN_WIDTH / BASE_WIDTH) * size;
}

/**
 * Escala responsiva baseada na altura
 */
export function verticalScale(size: number): number {
  return (SCREEN_HEIGHT / BASE_HEIGHT) * size;
}

/**
 * Escala moderada (entre horizontal e vertical)
 */
export function moderateScale(size: number, factor: number = 0.5): number {
  return size + (scale(size) - size) * factor;
}

/**
 * Converte pixels para dp
 */
export function pxToDp(px: number): number {
  return PixelRatio.roundToNearestPixel(px / PixelRatio.get());
}

/**
 * Converte dp para pixels
 */
export function dpToPx(dp: number): number {
  return PixelRatio.roundToNearestPixel(dp * PixelRatio.get());
}

/**
 * Verifica se é dispositivo pequeno
 */
export function isSmallScreen(): boolean {
  return SCREEN_WIDTH < 375;
}

/**
 * Verifica se é dispositivo grande
 */
export function isLargeScreen(): boolean {
  return SCREEN_WIDTH >= 428;
}

/**
 * Verifica se é tablet
 */
export function isTablet(): boolean {
  return SCREEN_WIDTH >= 768;
}

/**
 * Retorna dimensões responsivas
 */
export function getResponsiveDimensions() {
  return {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    isSmall: isSmallScreen(),
    isLarge: isLargeScreen(),
    isTablet: isTablet(),
    scale,
    verticalScale,
    moderateScale,
  };
}

export default {
  isIOS,
  isAndroid,
  isWeb,
  screenWidth,
  screenHeight,
  scale,
  verticalScale,
  moderateScale,
  pxToDp,
  dpToPx,
  isSmallScreen,
  isLargeScreen,
  isTablet,
  getResponsiveDimensions,
};
