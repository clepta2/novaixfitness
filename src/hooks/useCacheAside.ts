// src/hooks/useCacheAside.ts
// Hook para cache-aside pattern com TTL configurável

import { useState, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

interface UseCacheAsideOptions {
  ttl?: number; // Time to live em milissegundos (padrão: 5 minutos)
  storageKey?: string; // Chave para persistência (opcional)
}

interface UseCacheAsideReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  get: (key: string, fetcher: () => Promise<T>) => Promise<T>;
  invalidate: (key?: string) => void;
  clear: () => void;
}

export function useCacheAside<T>(
  options: UseCacheAsideOptions = {}
): UseCacheAsideReturn<T> {
  const { ttl = 5 * 60 * 1000, storageKey } = options;
  const cacheRef = useRef<Map<string, CacheEntry<T>>>(new Map());
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getFromCache = useCallback((key: string): T | null => {
    const entry = cacheRef.current.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > ttl;
    if (isExpired) {
      cacheRef.current.delete(key);
      return null;
    }

    return entry.data;
  }, [ttl]);

  const setInCache = useCallback((key: string, value: T) => {
    cacheRef.current.set(key, {
      data: value,
      timestamp: Date.now(),
    });
  }, []);

  const get = useCallback(async (key: string, fetcher: () => Promise<T>): Promise<T> => {
    // Tentar do cache primeiro
    const cached = getFromCache(key);
    if (cached !== null) {
      setData(cached);
      return cached;
    }

    // Buscar do storage persistente (se configurado)
    if (storageKey) {
      try {
        const stored = await AsyncStorage.getItem(`${storageKey}:${key}`);
        if (stored) {
          const parsed: CacheEntry<T> = JSON.parse(stored);
          const isExpired = Date.now() - parsed.timestamp > ttl;
          if (!isExpired) {
            setInCache(key, parsed.data);
            setData(parsed.data);
            return parsed.data;
          }
        }
      } catch {
        // Ignorar erros de storage
      }
    }

    // Buscar do fetcher
    setLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      setInCache(key, result);

      // Salvar no storage persistente
      if (storageKey) {
        try {
          await AsyncStorage.setItem(
            `${storageKey}:${key}`,
            JSON.stringify({ data: result, timestamp: Date.now() })
          );
        } catch {
          // Ignorar erros de storage
        }
      }

      setData(result);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao buscar dados';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getFromCache, setInCache, storageKey, ttl]);

  const invalidate = useCallback((key?: string) => {
    if (key) {
      cacheRef.current.delete(key);
      if (storageKey) {
        AsyncStorage.removeItem(`${storageKey}:${key}`).catch(() => {});
      }
    } else {
      cacheRef.current.clear();
    }
  }, [storageKey]);

  const clear = useCallback(() => {
    cacheRef.current.clear();
    setData(null);
    setError(null);
  }, []);

  return { data, loading, error, get, invalidate, clear };
}

/**
 * Hook simplificado para cache de dados estáticos
 */
export function useStaticCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 30 * 60 * 1000 // 30 minutos para dados estáticos
) {
  const cache = useCacheAside<T>({ ttl });

  const load = useCallback(async () => {
    return cache.get(key, fetcher);
  }, [cache, key, fetcher]);

  return { ...cache, load };
}