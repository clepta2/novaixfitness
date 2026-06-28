// app/marketplace.js
// Tela principal do marketplace - NOVAIX FITNESS

import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../src/constants/spacing';
import { useAuth } from '../src/context/AuthContext';
import { layout, typography } from '../src/styles';
import { ProductList, CategoryFilter, MarketplaceHeader, FeaturedSkeleton } from '../src/components/marketplace';
import { MARKETPLACE_CATEGORIES } from '../src/data/marketplaceCategories';
import { getProducts, getFeaturedProducts, getFavoriteIds, toggleFavorite } from '../src/services/marketplace';
import { useDebounce } from '../src/hooks/useDebounce';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RECENT_KEY = '@novaix:marketplace_recent';
const PAGE_SIZE = 20;

export default function MarketplaceScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [recentSearches, setRecentSearches] = useState([]);
  const debouncedSearch = useDebounce(search, 300);

  const loadProducts = useCallback(async (reset = false) => {
    const newOffset = reset ? 0 : offset;
    if (!reset) setLoading(true);
    try {
      const params = { limit: PAGE_SIZE, offset: newOffset };
      if (debouncedSearch) params.search = debouncedSearch;
      if (selectedCategory) params.category = selectedCategory;
      const data = await getProducts(params);
      setProducts(prev => reset ? data : [...prev, ...data]);
      setHasMore(data.length >= PAGE_SIZE);
      setOffset(reset ? data.length : newOffset + data.length);
    } catch (err) {
      if (__DEV__) console.error('Erro ao carregar produtos:', err);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, selectedCategory, offset]);

  const loadFeatured = useCallback(async () => {
    try {
      const data = await getFeaturedProducts(6);
      setFeatured(data);
    } catch {}
  }, []);

  const loadFavorites = useCallback(async () => {
    if (!user?.id) return;
    const ids = await getFavoriteIds(user.id);
    setFavorites(ids);
  }, [user?.id]);

  const loadRecentSearches = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(RECENT_KEY);
      if (stored) setRecentSearches(JSON.parse(stored));
    } catch {}
  }, []);

  useEffect(() => { loadProducts(true); }, [debouncedSearch, selectedCategory]);
  useEffect(() => { loadFeatured(); }, [loadFeatured]);
  useEffect(() => { loadFavorites(); }, [loadFavorites]);
  useEffect(() => { loadRecentSearches(); }, [loadRecentSearches]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadProducts(true);
    await loadFeatured();
    setRefreshing(false);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) loadProducts(false);
  };

  const handleSearch = async (text) => {
    setSearch(text);
    if (text.trim()) {
      const updated = [text, ...recentSearches.filter(s => s !== text)].slice(0, 5);
      setRecentSearches(updated);
      await AsyncStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    }
  };

  const handleToggleFavorite = async (productId) => {
    if (!user?.id) return;
    const isNowFav = await toggleFavorite(user.id, productId);
    setFavorites(prev => {
      const next = new Set(prev);
      if (isNowFav) next.add(productId); else next.delete(productId);
      return next;
    });
  };

  const clearRecentSearches = async () => {
    setRecentSearches([]);
    await AsyncStorage.removeItem(RECENT_KEY);
  };

  const isSearching = debouncedSearch || selectedCategory;

  return (
    <View style={layout.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={layout.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textTitle} />
          </TouchableOpacity>
          <Text style={typography.h2}>LOJA</Text>
          <TouchableOpacity onPress={() => router.push('/marketplace-favorites')}>
            <Ionicons name="heart-outline" size={24} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        <MarketplaceHeader search={search} onSearchChange={handleSearch} />

        {recentSearches.length > 0 && !isSearching && (
          <View style={styles.recentSection}>
            <View style={styles.recentHeader}>
              <Text style={typography.bodyMuted}>Buscas recentes</Text>
              <TouchableOpacity onPress={clearRecentSearches}>
                <Text style={styles.clearText}>Limpar</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.recentChips}>
              {recentSearches.map((s, i) => (
                <TouchableOpacity key={i} style={styles.recentChip} onPress={() => setSearch(s)}>
                  <Text style={styles.recentChipText}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <CategoryFilter
          categories={MARKETPLACE_CATEGORIES}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />

        {!isSearching && (
          <View style={styles.section}>
            <Text style={typography.label}>DESTAQUES</Text>
            {loading ? <FeaturedSkeleton /> : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.featuredScroll}>
                {featured.map(p => (
                  <TouchableOpacity key={p.id} style={styles.featuredCard} onPress={() => router.push({ pathname: '/marketplace-detail', params: { id: p.id } })} activeOpacity={0.8}>
                    <View style={[styles.featuredBg, { backgroundColor: (p.marketplace_categories?.color || COLORS.primary) + '20' }]}>
                      <Ionicons name={p.marketplace_categories?.icon || 'cube'} size={32} color={p.marketplace_categories?.color || COLORS.primary} />
                    </View>
                    <Text style={styles.featuredName} numberOfLines={2}>{p.name}</Text>
                    <Text style={styles.featuredPrice}>R$ {p.price?.toFixed(2)}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        )}

        <View style={styles.section}>
          <Text style={typography.label}>{isSearching ? 'RESULTADOS' : 'TODOS OS PRODUTOS'}</Text>
          <ProductList
            products={products}
            loading={loading}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
            onProductPress={(p) => router.push({ pathname: '/marketplace-detail', params: { id: p.id } })}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: SPACING.lg },
  recentSection: { paddingHorizontal: SPACING.xl, marginBottom: SPACING.sm },
  recentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xs },
  clearText: { fontFamily: 'Inter_500Medium', fontSize: 11, color: COLORS.primary },
  recentChips: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs },
  recentChip: { paddingHorizontal: SPACING.sm, paddingVertical: 4, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.full, borderWidth: 1, borderColor: COLORS.border },
  recentChipText: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textDescription },
  featuredScroll: { marginTop: SPACING.md },
  featuredCard: { width: 140, marginRight: SPACING.md, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  featuredBg: { width: 60, height: 60, borderRadius: BORDER_RADIUS.md, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.sm },
  featuredName: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textTitle, marginBottom: 4 },
  featuredPrice: { fontFamily: 'Montserrat_700Bold', fontSize: 13, color: COLORS.primary },
});
