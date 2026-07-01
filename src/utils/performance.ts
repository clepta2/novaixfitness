// src/utils/performance.ts
// Utilitarios de performance e otimizacao - NOVAIX FITNESS

import React, { memo, useCallback, useMemo, useRef, useEffect } from 'react';
import { InteractionManager } from 'react-native';

// ─── Memoizacao Profunda ───────────────────────────────────
export function deepMemo<T extends React.ComponentType<any>>(
  Component: T,
  compareFn?: (prevProps: any, nextProps: any) => boolean
): React.MemoExoticComponent<T> {
  return memo(Component, compareProps);
}

function compareProps(prevProps: any, nextProps: any): boolean {
  if (prevProps === nextProps) return true;
  if (!prevProps || !nextProps) return false;

  const keys1 = Object.keys(prevProps);
  const keys2 = Object.keys(nextProps);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    const val1 = prevProps[key];
    const val2 = nextProps[key];

    if (typeof val1 === 'function' || typeof val2 === 'function') continue;
    if (val1 === val2) continue;
    if (typeof val1 !== typeof val2) return false;
    if (typeof val1 === 'object') {
      if (JSON.stringify(val1) !== JSON.stringify(val2)) return false;
    } else {
      return false;
    }
  }

  return true;
}

// ─── Cache de Dados ────────────────────────────────────────
const dataCache = new Map<string, { data: any; timestamp: number }>();

export function getCachedData<T>(key: string, ttl: number = 5 * 60 * 1000): T | null {
  const cached = dataCache.get(key);
  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.data as T;
  }
  return null;
}

export function setCachedData(key: string, data: any): void {
  dataCache.set(key, { data, timestamp: Date.now() });
}

export function clearCache(key?: string): void {
  if (key) {
    dataCache.delete(key);
  } else {
    dataCache.clear();
  }
}

// ─── Lazy Loading ──────────────────────────────────────────
export function runAfterInteractions(fn: () => void): void {
  InteractionManager.runAfterInteractions(fn);
}

// ─── Throttle ──────────────────────────────────────────────
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn(...args);
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        fn(...args);
      }, delay - (now - lastCall));
    }
  };
}

// ─── Debounce ──────────────────────────────────────────────
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

// ─── Batch Updates ─────────────────────────────────────────
export function batchUpdates(updates: (() => void)[]): void {
  updates.forEach(update => update());
}

// ─── Prefetch de Imagens ───────────────────────────────────
const prefetchedImages = new Set<string>();

export async function prefetchImages(urls: string[]): Promise<void> {
  try {
    const { Image } = require('expo-image');
    await Promise.allSettled(
      urls
        .filter(url => url && !prefetchedImages.has(url))
        .map(url => {
          prefetchedImages.add(url);
          return Image.prefetch(url);
        })
    );
  } catch {}
}

// ─── Preload de Telas ──────────────────────────────────────
const preloadedScreens = new Set<string>();

export function preloadScreen(name: string, importFn: () => Promise<any>): void {
  if (preloadedScreens.has(name)) return;
  preloadedScreens.add(name);
  importFn().catch(() => preloadedScreens.delete(name));
}

// ─── Hook: useStableCallback ───────────────────────────────
export function useStableCallback<T extends (...args: any[]) => any>(
  callback: T
): T {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  return useCallback((...args: any[]) => {
    return callbackRef.current(...args);
  }, []) as T;
}

// ─── Hook: useLatest ──────────────────────────────────────
export function useLatest<T>(value: T): { readonly current: T } {
  const ref = useRef(value);
  ref.current = value;
  return ref;
}
