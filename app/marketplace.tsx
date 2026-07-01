
// app/marketplace.tsx
// Marketplace com cards animados - NOVAIX FITNESS

import { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../src/constants/spacing';
import { useAuth } from '../src/context/AuthContext';
import { layout, typography } from '../src/styles';
import { ProductList, FeaturedProducts, SearchBar, Loading, EmptyState, BottomTabBar, ErrorBoundary } from '../src/components';
import { MARKETPLACE_CATEGORIES } from '../src/data/marketplaceCategories';
import { getProducts, getFeaturedProducts, getFavoriteIds, toggleFavorite } from '../src/services/marketplace';
import { useDebounce } from '../src/hooks/useDebounce';
import { useResponsive } from '../src/hooks/useResponsive';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RECENT_KEY = '@novaix:marketplace_recent';
const PAGE_SIZE = 20;

export default function MarketplaceScreen() {
  const { user } = useAuth();
  const { isSmall } = useResponsive();
  const [products, setProducts] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [offset, setOffset] = useState(0);
  const [_hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [recentSearches, setRecentSearches] = useState([]);
  const debouncedSearch = useDebounce(search, 300);

  // Animacoes
  const fadeAnim = useMemo(() => new Animated.Value(0), []);
  const slideAnim = useMemo(() => new Animated.Value(20), []);

  useEffect(() => {
    if (!loading) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, friction: 8, tension: 55, useNativeDriver: true }),
      ]).start();
    }
  }, [loading]);

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
    try { setFeatured(await getFeaturedProducts(6)); } catch (e) { if (__DEV__) console.warn('MarketplaceScreen:', e); }
  }, []);

  const loadFavorites = useCallback(async () => {
    if (!user?.id) return;
    setFavorites(await getFavoriteIds(user.id));
  }, [user?.id]);

  const loadRecentSearches = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(RECENT_KEY);
      if (stored) setRecentSearches(JSON.parse(stored));
    } catch (e) { if (__DEV__) console.warn('MarketplaceScreen:', e); }
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
    if (text) {
      const updated = [text, ...recentSearches.filter(s => s !== text)].slice(0, 10);
      setRecentSearches(updated);
      await AsyncStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    }
  };

  const handleToggleFavorite = async (productId) => {
    if (!user?.id) return;
    await toggleFavorite(user.id, productId);
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  };

  return (
    <ErrorBoundary screenName="Marketplace">
      <View style={layout.screen}>
        {/* Header */}
        <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={{ flex: 1 }}>
            <Text style={[typography.h2, { fontSize: isSmall ? 20 : 24 }]}>Marketplace</Text>
            <Text style={typography.bodyMuted}>Encontre os melhores produtos</Text>
          </View>
        </Animated.View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <SearchBar
            placeholder="Buscar produtos..."
            value={search}
            onChangeText={handleSearch}
            onClear={() => setSearch('')}
          />
        </View>

        {/* Categories */}
        <View style={styles.categoryRow}>
          <TouchableOpacity
            style={[styles.categoryChip, !selectedCategory && styles.categoryChipActive]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text style={[styles.categoryText, !selectedCategory && styles.categoryTextActive]}>Todos</Text>
          </TouchableOpacity>
          {MARKETPLACE_CATEGORIES.slice(0, 4).map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.categoryChip, selectedCategory === cat.id && styles.categoryChipActive]}
              onPress={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
            >
              <Text style={[styles.categoryText, selectedCategory === cat.id && styles.categoryTextActive]}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content */}
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={COLORS.primary} />}
        >
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            {/* Featured */}
            {featured.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Destaques</Text>
                <FeaturedProducts products={featured} />
              </View>
            )}

            {/* Products */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Produtos</Text>
              {loading ? (
                <Loading variant="dots" />
              ) : products.length === 0 ? (
                <EmptyState icon="bag-outline" title="Nenhum produto" message="Tente outra busca ou categoria." />
              ) : (
                <ProductList
                  products={products}
                  favorites={Array.from(favorites)}
                  onToggleFavorite={handleToggleFavorite}
                  loading={loading}
                />
              )}
            </View>
          </Animated.View>
        </ScrollView>

        <BottomTabBar activeTab="marketplace" />
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg, paddingBottom: SPACING.sm },
  searchContainer: { paddingHorizontal: SPACING.lg, marginBottom: SPACING.md },
  categoryRow: { flexDirection: 'row', gap: SPACING.sm, paddingHorizontal: SPACING.lg, marginBottom: SPACING.md },
  categoryChip: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.full, borderWidth: 1, borderColor: COLORS.border },
  categoryChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  categoryText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textMuted },
  categoryTextActive: { color: COLORS.background },
  content: { padding: SPACING.lg },
  section: { marginBottom: SPACING.xl },
  sectionTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle, marginBottom: SPACING.md },
});
