// src/components/common/CacheProvider.tsx
// Provider reutilizável para gerenciamento de cache

import React, { createContext, useContext, useCallback, ReactNode } from 'react';
import {   setCache, 
  getCache, 
  removeCache, 
  clearAllCache, 
  getCacheSize,
  CACHE_TTL  } from '../../utils/cache';

interface CacheContextType {
  set: <T>(key: string, data: T, ttl?: number) => Promise<void>;
  get: <T>(key: string) => Promise<T | null>;
  remove: (key: string) => Promise<void>;
  clear: () => Promise<void>;
  getSize: () => Promise<number>;
  cacheByType: <T>(type: string, key: string, data: T) => Promise<void>;
  getByType: <T>(type: string, key: string) => Promise<T | null>;
}

const CacheContext = createContext<CacheContextType | null>(null);

interface CacheProviderProps {
  children: ReactNode;
}

export function CacheProvider({ children }: CacheProviderProps) {
  const set = useCallback(async <T,>(key: string, data: T, ttl?: number) => {
    await setCache(key, data, ttl);
  }, []);

  const get = useCallback(async <T,>(key: string): Promise<T | null> => {
    return getCache<T>(key);
  }, []);

  const remove = useCallback(async (key: string) => {
    await removeCache(key);
  }, []);

  const clear = useCallback(async () => {
    await clearAllCache();
  }, []);

  const getSize = useCallback(async () => {
    return getCacheSize();
  }, []);

  const cacheByType = useCallback(async <T,>(type: string, key: string, data: T) => {
    const ttl = CACHE_TTL[type] || CACHE_TTL.default;
    await setCache(`${type}:${key}`, data, ttl);
  }, []);

  const getByType = useCallback(async <T,>(type: string, key: string): Promise<T | null> => {
    return getCache<T>(`${type}:${key}`);
  }, []);

  return (
    <CacheContext.Provider value={{ set, get, remove, clear, getSize, cacheByType, getByType }}>
      {children}
    </CacheContext.Provider>
  );
}

export function useCache(): CacheContextType {
  const context = useContext(CacheContext);
  if (!context) {
    throw new Error('useCache must be used within a CacheProvider');
  }
  return context;
}
