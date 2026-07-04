// src/utils/performance.js
// Performance utilities - re-exportacao

import React, { memo, lazy, Suspense } from 'react';
import { View, ActivityIndicator, Image, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

export function createLazyComponent<T extends React.ComponentType<any>>(importFn: () => Promise<{ default: T }>) {
  const LazyComponent = lazy(importFn);
  return function LazyWrapper(props: React.ComponentProps<T>) {
    return (<Suspense fallback={<View style={styles.loading}><ActivityIndicator size="small" color={COLORS.primary} /></View>}>
      <LazyComponent {...props} />
    </Suspense>);
  };
}

export function deepMemo<P>(Component: React.ComponentType<P>, areEqual?: (prev: P, next: P) => boolean) {
  return memo(Component, areEqual || ((prev: any, next: any) => {
    if (prev === next) return true;
    if (!prev || !next) return false;
    const keys1 = Object.keys(prev);
    const keys2 = Object.keys(next);
    if (keys1.length !== keys2.length) return false;
    for (const key of keys1) {
      const v1 = prev[key], v2 = next[key];
      if (typeof v1 === 'function' || typeof v2 === 'function') continue;
      if (v1 === v2) continue;
      if (typeof v1 !== typeof v2) return false;
      if (typeof v1 === 'object' && JSON.stringify(v1) !== JSON.stringify(v2)) return false;
      else if (typeof v1 !== 'object') return false;
    }
    return true;
  }));
}

export function CachedImage({ uri, style, placeholder, ...props }: { uri: string; style?: any; placeholder?: any; [key: string]: any }) {
  return <Image source={{ uri }} style={style} resizeMode="cover" {...props} />;
}

export const OPTIMIZED_FLATLIST_CONFIG = {
  initialNumToRender: 10, maxToRenderPerBatch: 10, windowSize: 5, removeClippedSubviews: true,
  keyExtractor: (item: any) => item.id?.toString() || Math.random().toString(),
};

export function getOptimizedProps(getItemHeight?: (data: any, index: number) => number) {
  return { ...OPTIMIZED_FLATLIST_CONFIG, getItemLayout: getItemHeight ? (data: any, index: number) => ({
    length: getItemHeight(data, index), offset: getItemHeight(data, index) * index, index,
  }) : undefined };
}

export function throttle<T extends (...args: any[]) => void>(fn: T, delay: number) {
  let lastCall = 0, timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) { lastCall = now; fn(...args); }
    else { clearTimeout(timeoutId); timeoutId = setTimeout(() => { lastCall = Date.now(); fn(...args); }, delay - (now - lastCall)); }
  };
}

export function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => { clearTimeout(timeoutId); timeoutId = setTimeout(() => fn(...args), delay); };
}

export async function prefetchImages(urls: string[]) {
  try {
    return Promise.allSettled(urls.filter(Boolean).map(url => Image.prefetch(url)));
  } catch (err) {
    if (__DEV__) console.warn('Prefetch images error:', err);
    return [];
  }
}

const metrics: Record<string, { start: number; end?: number; duration?: number }> = {};
export function startMetric(name: string) { metrics[name] = { start: performance.now() }; }
export function endMetric(name: string) { if (metrics[name]) { metrics[name].end = performance.now(); metrics[name].duration = metrics[name].end - metrics[name].start; } return metrics[name]?.duration || 0; }
export function getMetrics() { return { ...metrics }; }

export function useRenderCount(componentName: string) {
  const renderCount = React.useRef(0);
  renderCount.current++;
  if (__DEV__ && renderCount.current > 10) console.warn(`${componentName} renderizou ${renderCount.current} vezes`);
  return renderCount.current;
}

const preloadCache = new Map();
export async function preloadScreen(screenName: string, importFn: () => Promise<any>) {
  if (preloadCache.has(screenName)) return;
  try { await importFn(); preloadCache.set(screenName, true); } catch {}
}

const styles = StyleSheet.create({ loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background } });
