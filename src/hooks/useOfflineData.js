// src/hooks/useOfflineData.js
// Hook para dados offline-first - NOVAIX FITNESS

import { useState, useEffect, useCallback } from 'react';
import useNetworkStatus from './useNetworkStatus';

export default function useOfflineData(fetchFn, cacheKey, options = {}) {
  const { fallbackToCache = true, cacheFn = null } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFromCache, setIsFromCache] = useState(false);
  const [error, setError] = useState(null);
  const { isOnline, isOffline } = useNetworkStatus();

  const loadData = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);

    try {
      if (isOnline || forceRefresh) {
        const freshData = await fetchFn();
        setData(freshData);
        setIsFromCache(false);

        if (cacheFn && freshData) {
          await cacheFn(freshData);
        }
      } else if (fallbackToCache && cacheFn) {
        const cachedData = await cacheFn();
        if (cachedData) {
          setData(cachedData);
          setIsFromCache(true);
        } else {
          setError('Dados não disponíveis offline');
        }
      }
    } catch (err) {
      if (fallbackToCache && cacheFn) {
        try {
          const cachedData = await cacheFn();
          if (cachedData) {
            setData(cachedData);
            setIsFromCache(true);
          }
        } catch {
          setError(err.message);
        }
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [isOnline, fetchFn, cacheFn, fallbackToCache]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const refresh = useCallback(() => loadData(true), [loadData]);

  return { data, loading, isFromCache, error, refresh, isOffline };
}
