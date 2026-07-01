import { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/constants/colors';
import { SPACING } from '../src/constants/spacing';
import { useAuth } from '../src/context/AuthContext';
import { layout } from '../src/styles';
import { ProductList, CategoryFilter, MarketplaceHeader } from '../src/components/marketplace';
import FeaturedProducts from '../src/components/marketplace/FeaturedProducts';
import RecentSearches from '../src/components/marketplace/RecentSearches';
import { MARKETPLACE_CATEGORIES } from '../src/data/marketplaceCategories';
import { getProducts, getFeaturedProducts, getFavoriteIds, toggleFavorite } from '../src/services/marketplace';
import { useDebounce } from '../src/hooks/useDebounce';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BottomTabBar } from '../src/components';

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
    } finally { setLoading(false); }
  }, [debouncedSearch, selectedCategory, offset]);

  const loadFeatured = useCallback(async () => {
    try { setFeatured(await getFeaturedProducts(6)); } catch {}
  }, []);

  const loadFavorites = useCallback(async () => {
    if (!user?.id) return;
    setFavorites(await getFavoriteIds(user.id));
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
      isNowFav ? next.add(productId) : next.delete(productId);
      return next;
    });
  };

  const clearRecentSearches = async () => { setRecentSearches([]); await AsyncStorage.removeItem(RECENT_KEY); };
  const isSearching = debouncedSearch || selectedCategory;

  return (
    <View style={layout.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={layout.header}>
          <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Voltar" accessibilityRole="button">
            <Ionicons name="arrow-back" size={24} color={COLORS.textTitle} />
          </TouchableOpacity>
          <Text style={{ fontFamily: 'Montserrat_800ExtraBold', fontSize: 18, color: COLORS.textTitle, textTransform: 'uppercase', letterSpacing: 1 }}>LOJA</Text>
          <TouchableOpacity onPress={() => router.push('/marketplace-favorites')} accessibilityLabel="Ver favoritos" accessibilityRole="button">
            <Ionicons name="heart-outline" size={24} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        <MarketplaceHeader search={search} onSearchChange={handleSearch} />
        {!isSearching && <RecentSearches searches={recentSearches} onSelect={setSearch} onClear={clearRecentSearches} />}
        <CategoryFilter categories={MARKETPLACE_CATEGORIES} selected={selectedCategory} onSelect={setSelectedCategory} />
        {!isSearching && <FeaturedProducts products={featured} loading={loading} onPress={(p) => router.push({ pathname: '/marketplace-detail', params: { id: p.id } })} />}

        <View style={{ marginTop: SPACING.lg, paddingHorizontal: SPACING.xl }}>
          <Text style={{ fontFamily: 'Montserrat_700Bold', fontSize: 11, color: COLORS.textMuted, letterSpacing: 1 }}>{isSearching ? 'RESULTADOS' : 'TODOS OS PRODUTOS'}</Text>
          <ProductList
            products={products} loading={loading} refreshing={refreshing} onRefresh={handleRefresh}
            onLoadMore={() => { if (!loading && hasMore) loadProducts(false); }}
            hasMore={hasMore} onProductPress={(p) => router.push({ pathname: '/marketplace-detail', params: { id: p.id } })}
            favorites={favorites} onToggleFavorite={handleToggleFavorite}
          />
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
      <BottomTabBar activeTab="library" />
    </View>
  );
}
