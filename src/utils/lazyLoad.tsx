// src/utils/lazyLoad.ts
// Utilitarios de lazy loading - NOVAIX FITNESS

import React, { Suspense, lazy, ComponentType, useState, useCallback } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

// Lazy load de componentes com fallback
export function createLazyComponent<P>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  fallback?: React.ReactNode
) {
  const LazyComponent = lazy(importFn);

  function LazyWrapper(props: P) {
    return (
      <Suspense
        fallback={fallback || (
          <View style={styles.fallback}>
            <ActivityIndicator size="small" color={COLORS.primary} />
          </View>
        )}
      >
        <LazyComponent {...(props as any)} />
      </Suspense>
    );
  }

  LazyWrapper.displayName = 'LazyComponent';
  return LazyWrapper;
}

// Lazy load de tela com preload
const preloadCache = new Map<string, boolean>();

export function preloadScreen(name: string, importFn: () => Promise<any>) {
  if (preloadCache.has(name)) return;
  preloadCache.set(name, true);
  importFn().catch(() => {
    preloadCache.delete(name);
  });
}

// Prefetch de imagens
export async function prefetchImages(urls: string[]): Promise<void> {
  try {
    const { Image } = require('expo-image');
    await Promise.allSettled(
      urls.filter(Boolean).map(url => Image.prefetch(url))
    );
  } catch {}
}

// Hook para lazy loading de dados
export function useLazyLoad<T>(
  loadFn: () => Promise<T>,
  deps: any[]
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await loadFn();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar');
    } finally {
      setLoading(false);
    }
  }, deps);

  return { data, loading, error, load };
}

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 100,
  },
});
