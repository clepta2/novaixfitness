// src/hooks/useInfiniteScroll.ts
// Hook para scroll infinito com paginação - NOVAIX FITNESS

import { useState, useCallback, useRef, useEffect } from 'react';

interface UseInfiniteScrollOptions<T> {
  fetcher: (page: number, limit: number) => Promise<T[]>;
  limit?: number;
  initialPage?: number;
}

interface UseInfiniteScrollResult<T> {
  data: T[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  error: Error | null;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  reset: () => void;
}

/**
 * Hook para scroll infinito com paginação automática
 * Gerencia estado de carregamento e detecção de fim dos dados
 */
export function useInfiniteScroll<T>({
  fetcher,
  limit = 20,
  initialPage = 0,
}: UseInfiniteScrollOptions<T>): UseInfiniteScrollResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const pageRef = useRef(initialPage);
  const isLoadingRef = useRef(false);

  const loadInitial = useCallback(async () => {
    if (isLoadingRef.current) return;
    
    setIsLoading(true);
    setError(null);
    isLoadingRef.current = true;

    try {
      const result = await fetcher(initialPage, limit);
      setData(result);
      setHasMore(result.length >= limit);
      pageRef.current = initialPage + 1;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
      isLoadingRef.current = false;
    }
  }, [fetcher, initialPage, limit]);

  const loadMore = useCallback(async () => {
    if (isLoadingRef.current || !hasMore) return;
    
    setIsLoadingMore(true);
    isLoadingRef.current = true;

    try {
      const result = await fetcher(pageRef.current, limit);
      setData(prev => [...prev, ...result]);
      setHasMore(result.length >= limit);
      pageRef.current += 1;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoadingMore(false);
      isLoadingRef.current = false;
    }
  }, [fetcher, hasMore, limit]);

  const refresh = useCallback(async () => {
    pageRef.current = initialPage;
    await loadInitial();
  }, [initialPage, loadInitial]);

  const reset = useCallback(() => {
    setData([]);
    setIsLoading(false);
    setIsLoadingMore(false);
    setHasMore(true);
    setError(null);
    pageRef.current = initialPage;
  }, [initialPage]);

  // Carregar dados iniciais
  useEffect(() => {
    if (data.length === 0 && !isLoading && !error) {
      loadInitial();
    }
  }, []);

  return {
    data,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    loadMore,
    refresh,
    reset,
  };
}

export default useInfiniteScroll;
