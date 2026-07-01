// src/hooks/useResponsive.ts
// Hook de responsividade - NOVAIX FITNESS

import { useWindowDimensions, Platform } from 'react-native';

export function useResponsive() {
  const { width, height } = useWindowDimensions();

  return {
    width,
    height,
    isSmall: width < 380,
    isMedium: width >= 380 && width < 768,
    isLarge: width >= 768,
    isPortrait: height > width,

    // Espacamento responsivo
    horizontalPadding: width < 380 ? 16 : 20,
    sectionGap: width < 380 ? 12 : 16,

    // Dimensoes de cards
    cardWidth: (width - 40) / 2 - 8,
    categoryCardWidth: (width - 48) / 2,

    // FAB responsivo
    fabBottom: Math.min(height * 0.12, 100),
    fabRight: width < 380 ? 12 : 20,
    fabSize: width < 380 ? 48 : 56,

    // Icones responsivos
    iconSize: width < 380 ? 18 : 22,
    headerIconSize: width < 380 ? 20 : 24,

    // Fontes responsivas
    titleSize: width < 380 ? 20 : 24,
    bodySize: width < 380 ? 13 : 14,
  };
}
