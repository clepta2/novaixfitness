// src/hooks/useCacheAside.ts
// Hook de cache-aside com TTL configurável - NOVAIX FITNESS

import { useState, useCallback, useRef, useEffect } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

interface UseCacheAsideOptions<T> {
  ttl?: number; // Time to live em ms (padrão: 5 min)
  fetcher: () => Promise<T>;
  key: string;
}

interface UseCacheAsideResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  invalidate: () => void;
}

const cache = new Map<string, CacheEntry<any>>();

/**
 * Hook de cache-aside com TTL configurável
 * Cacheia dados estáticos para evitar requests repetidos
 */
export function useCacheAside<T>({
  ttl = 5 * 60 * 1000, // 5 minutos padrão
  fetcher,
  key,
}: UseCacheAsideOptions<T>): UseCacheAsideResult<T> {
  const [data, setData] = useState<T | null>(() => {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.data;
    }
    return null;
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const fetchData = useCallback(async (force = false): Promise<void> => {
    // Verificar cache
    const cached = cache.get(key);
    if (!force && cached && Date.now() - cached.timestamp < ttl) {
      setData(cached.data);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetcherRef.current();
      cache.set(key, { data: result, timestamp: Date.now() });
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [key, ttl]);

  const refresh = useCallback(async (): Promise<void> => {
    await fetchData(true);
  }, [fetchData]);

  const invalidate = useCallback((): void => {
    cache.delete(key);
    setData(null);
  }, [key]);

  // Buscar dados se não estiver em cache
  useEffect(() => {
    if (!data && !loading) {
      fetchData();
    }
  }, []);

  return { data, loading, error, refresh, invalidate };
}

/**
 * Limpar todo o cache ou por prefixo
 */
export function clearCache(prefix?: string): void {
  if (!prefix) {
    cache.clear();
    return;
  }
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) {
      cache.delete(key);
    }
  }
}

export default useCacheAside;
