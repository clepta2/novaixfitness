// src/hooks/useMarketplaceData.ts
// Hook de dados do marketplace - NOVAIX FITNESS

import { useState, useEffect, useCallback } from 'react';
import { tryIf } from '../utils/tryIf';
import { getProducts, getFeaturedProducts, getFavoriteIds, toggleFavorite } from '../services/marketplace';
import { useDebounce } from './useDebounce';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RECENT_KEY = '@novaix:marketplace_recent';
const PAGE_SIZE = 20;

export function useMarketplaceData(userId: string | undefined) {
  const [products, setProducts] = useState<any[]>([]);
  const [featured, setFeatured] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [favorites, setFavorites] = useState<any>(new Set());
  const [recentSearches, setRecentSearches] = useState<any[]>([]);
  const debouncedSearch = useDebounce(search, 300);

  const loadProducts = useCallback(async (reset = false) => {
    const newOffset = reset ? 0 : offset;
    if (!reset) setLoading(true);
    const result = await tryIf(async () => {
      const params: any = { limit: PAGE_SIZE, offset: newOffset };
      if (debouncedSearch) params.search = debouncedSearch;
      if (selectedCategory) params.category = selectedCategory;
      return await getProducts(params);
    }, { retries: 1, baseDelay: 500 });
    if (result.ok) {
      setProducts(prev => reset ? (result.data || []) : [...prev, ...(result.data || [])]);
      setHasMore((result.data || []).length >= PAGE_SIZE);
      setOffset(reset ? (result.data || []).length : newOffset + (result.data || []).length);
    } else {
      if (__DEV__) console.error('Erro ao carregar produtos:', result.error);
    }
    setLoading(false);
  }, [debouncedSearch, selectedCategory, offset]);

  const loadFeatured = useCallback(async () => {
    const result = await tryIf(() => getFeaturedProducts(6), { retries: 1, baseDelay: 500 });
    if (result.ok) setFeatured(result.data || []);
  }, []);

  const loadFavorites = useCallback(async () => {
    if (!userId) return;
    try {
      const ids = await getFavoriteIds(userId);
      setFavorites(ids);
    } catch (err) {
      if (__DEV__) console.error('Erro ao carregar favoritos:', err);
    }
  }, [userId]);

  const loadRecentSearches = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(RECENT_KEY);
      if (stored) setRecentSearches(JSON.parse(stored));
    } catch (e) { if (__DEV__) console.warn('Marketplace:', e); }
  }, []);

  useEffect(() => { loadProducts(true); }, [debouncedSearch, selectedCategory]);
  useEffect(() => { loadFeatured(); }, [loadFeatured]);
  useEffect(() => { loadFavorites(); }, [loadFavorites]);
  useEffect(() => { loadRecentSearches(); }, [loadRecentSearches]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProducts(true);
    await loadFeatured();
    setRefreshing(false);
  };

  const handleSearch = async (text: string) => {
    setSearch(text);
    if (text) {
      const updated = [text, ...recentSearches.filter((s: string) => s !== text)].slice(0, 10);
      setRecentSearches(updated);
      await AsyncStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    }
  };

  const handleToggleFavorite = async (productId: string) => {
    if (!userId) return;
    const result = await tryIf(() => toggleFavorite(userId, productId), { retries: 1, baseDelay: 500 });
    if (result.ok) {
      setFavorites(prev => {
        const next = new Set(prev);
        if (next.has(productId)) next.delete(productId);
        else next.add(productId);
        return next;
      });
    }
  };

  return {
    products, featured, loading, refreshing, hasMore, search, selectedCategory,
    favorites, onRefresh, handleSearch, handleToggleFavorite, setSelectedCategory,
  };
}
