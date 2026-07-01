// src/config/bundleAnalyzer.js
// Configuracao de analise de bundle - NOVAIX FITNESS

import { Platform } from 'react-native';

export const BUNDLE_CONFIG = {
  enableHermes: true,
  enableSourceMaps: __DEV__,
  enableMinification: !__DEV__,
  enableConsoleLogsInProduction: false,
  enableBundleAnalysis: __DEV__,
};

export const IMAGE_OPTIMIZATION = {
  quality: Platform.OS === 'ios' ? 0.8 : 0.75,
  maxWidth: 1920,
  maxHeight: 1080,
  format: 'webp',
  cacheControl: 'public, max-age=31536000',
};

export const FONT_OPTIMIZATION = {
  preloadFonts: [
    'Montserrat_400Regular',
    'Montserrat_600SemiBold',
    'Montserrat_700Bold',
    'Inter_400Regular',
    'Inter_500Medium',
    'Inter_600SemiBold',
  ],
  fallbackFonts: {
    ios: ['System'],
    android: ['Roboto'],
    web: ['Arial', 'sans-serif'],
  },
};

export const CACHE_CONFIG = {
  apiCache: {
    ttl: 5 * 60 * 1000,
    maxSize: 100,
  },
  imageCache: {
    ttl: 7 * 24 * 60 * 60 * 1000,
    maxSize: 50 * 1024 * 1024,
  },
  offlineCache: {
    ttl: 24 * 60 * 60 * 1000,
    maxSize: 100 * 1024 * 1024,
  },
};

export const PERFORMANCE_METRICS = {
  enableTracking: !__DEV__,
  sampleRate: 0.1,
  reportInterval: 60 * 1000,
};

export function getBundleStats() {
  return {
    platform: Platform.OS,
    isDev: __DEV__,
    hermesEnabled: (global as any).HermesInternal != null,
    memoryUsage: Platform.OS === 'ios' ? 'N/A' : 'N/A',
  };
}

export function measureRenderTime(componentName: string, renderFn: () => void): void {
  if (!__DEV__) return;

  const start = performance.now();
  renderFn();
  const end = performance.now();

  if (end - start > 16) {
    console.warn(`[Performance] ${componentName} render took ${(end - start).toFixed(2)}ms`);
  }
}

export function trackBundleSize(): void {
  if (__DEV__) {
    const stats = getBundleStats();
    console.info('[Bundle Stats]', stats);
  }
}
