// src/utils/memoize.ts
// Utilitarios de memoizacao - NOVAIX FITNESS

import { useMemo, useCallback, useRef } from 'react';

// Memoizacao profunda para objetos
export function useDeepMemo<T>(factory: () => T, deps: any[]): T {
  const ref = useRef<{ value: T; deps: string }>({ value: null as any, deps: '' });

  const depsKey = JSON.stringify(deps);

  if (ref.current.deps !== depsKey) {
    ref.current = { value: factory(), deps: depsKey };
  }

  return ref.current.value;
}

// Memoizacao para callbacks com dependencias estaveis
export function useStableCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: any[]
): T {
  return useCallback(callback, deps) as T;
}

// Memoizacao para listas filtradas
export function useFilteredList<T>(
  list: T[],
  filterFn: (item: T) => boolean,
  deps: any[]
): T[] {
  return useMemo(() => list.filter(filterFn), [list, ...deps]);
}

// Memoizacao para listas ordenadas
export function useSortedList<T>(
  list: T[],
  sortFn: (a: T, b: T) => number,
  deps: any[]
): T[] {
  return useMemo(() => [...list].sort(sortFn), [list, ...deps]);
}

// Memoizacao para agrupamento
export function useGroupedList<T>(
  list: T[],
  groupFn: (item: T) => string,
  deps: any[]
): Record<string, T[]> {
  return useMemo(() => {
    const groups: Record<string, T[]> = {};
    for (const item of list) {
      const key = groupFn(item);
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    }
    return groups;
  }, [list, ...deps]);
}

// Comparador profundo para React.memo
export function deepCompare(a: any, b: any): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  if (typeof a !== typeof b) return false;

  if (Array.isArray(a)) {
    if (a.length !== b.length) return false;
    return a.every((item, i) => deepCompare(item, b[i]));
  }

  if (typeof a === 'object') {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    return keysA.every(key => deepCompare(a[key], b[key]));
  }

  return false;
}

// Hook para debounce de valores
export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

import { useState, useEffect } from 'react';
