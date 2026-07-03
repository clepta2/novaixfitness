// src/hooks/useCachedQuery.ts
// Hook para queries com cache automático - NOVAIX FITNESS

import { useState, useCallback, useEffect, useRef } from 'react';
import { cacheManager } from '../services/cache/CacheManager';

interface UseCachedQueryOptions<T> {
  key: string;
  fetcher: () => Promise<T>;
  ttl?: number;
  enabled?: boolean;
  refetchOnMount?: boolean;
  refetchOnWindowFocus?: boolean;
}

interface UseCachedQueryResult<T> {
  data: T | null;
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  invalidate: () => Promise<void>;
  setData: (data: T | null) => void;
}

export function useCachedQuery<T>({
  key,
  fetcher,
  ttl = 5 * 60 * 1000,
  enabled = true,
  refetchOnMount = true,
  refetchOnWindowFocus = false,
}: UseCachedQueryOptions<T>): UseCachedQueryResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const fetchData = useCallback(async (force = false): Promise<void> => {
    if (!enabled) return;

    // Verificar cache se não forçar
    if (!force) {
      const cached = await cacheManager.get<T>(key);
      if (cached !== null) {
        setData(cached);
        return;
      }
    }

    setIsLoading(true);
    setIsFetching(true);
    setError(null);

    try {
      const result = await fetcherRef.current();
      setData(result);
      await cacheManager.set(key, result, ttl);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  }, [key, ttl, enabled]);

  const refetch = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    await fetchData(true);
    setIsLoading(false);
  }, [fetchData]);

  const invalidate = useCallback(async (): Promise<void> => {
    await cacheManager.remove(key);
    setData(null);
  }, [key]);

  // Carregar dados iniciais
  useEffect(() => {
    if (refetchOnMount && enabled) {
      fetchData();
    }
  }, [fetchData, refetchOnMount, enabled]);

  // Observar foco da janela (opcional)
  useEffect(() => {
    if (!refetchOnWindowFocus) return;

    const handleFocus = () => {
      if (enabled) fetchData();
    };

    // No React Native, usar AppState em vez de window focus
    // Por enquanto, manter desabilitado
    return () => {};
  }, [fetchData, refetchOnWindowFocus, enabled]);

  return {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
    invalidate,
    setData,
  };
}

export default useCachedQuery;
