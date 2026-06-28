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
import { ProductList, CategoryFilter, MarketplaceHeader } from '../src/components/marketplace';
import { MARKETPLACE_CATEGORIES } from '../src/data/marketplaceCategories';
import { getProducts, getFeaturedProducts, getFavoriteIds, toggleFavorite } from '../src/services/marketplace';
import { useDebounce } from '../src/hooks/useDebounce';

export default function MarketplaceScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const debouncedSearch = useDebounce(search, 300);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { limit: 30 };
      if (debouncedSearch) params.search = debouncedSearch;
      if (selectedCategory) params.category = selectedCategory;
      const data = await getProducts(params);
      setProducts(data);
    } catch (err) {
      if (__DEV__) console.error('Erro ao carregar produtos:', err);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, selectedCategory]);

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

  useEffect(() => { loadProducts(); }, [loadProducts]);
  useEffect(() => { loadFeatured(); }, [loadFeatured]);
  useEffect(() => { loadFavorites(); }, [loadFavorites]);

  const handleToggleFavorite = async (productId) => {
    if (!user?.id) return;
    const isNowFav = await toggleFavorite(user.id, productId);
    setFavorites(prev => {
      const next = new Set(prev);
      if (isNowFav) next.add(productId); else next.delete(productId);
      return next;
    });
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
          <TouchableOpacity onPress={() => router.push('/marketplace?favorites=true')}>
            <Ionicons name="heart-outline" size={24} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        <MarketplaceHeader search={search} onSearchChange={setSearch} />

        <CategoryFilter
          categories={MARKETPLACE_CATEGORIES}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />

        {!isSearching && featured.length > 0 && (
          <View style={styles.section}>
            <Text style={typography.label}>DESTAQUES</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.featuredScroll}>
              {featured.map(p => (
                <TouchableOpacity key={p.id} style={styles.featuredCard} onPress={() => router.push({ pathname: '/marketplace-detail', params: { id: p.id } })} activeOpacity={0.8}>
                  <View style={[styles.featuredBg, { backgroundColor: p.marketplace_categories?.color + '20' }]}>
                    <Ionicons name={p.marketplace_categories?.icon || 'cube'} size={32} color={p.marketplace_categories?.color || COLORS.primary} />
                  </View>
                  <Text style={styles.featuredName} numberOfLines={2}>{p.name}</Text>
                  <Text style={styles.featuredPrice}>R$ {p.price?.toFixed(2)}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.section}>
          <Text style={typography.label}>{isSearching ? 'RESULTADOS' : 'TODOS OS PRODUTOS'}</Text>
          <ProductList
            products={products}
            loading={loading}
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
  featuredScroll: { marginTop: SPACING.md },
  featuredCard: { width: 140, marginRight: SPACING.md, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  featuredBg: { width: 60, height: 60, borderRadius: BORDER_RADIUS.md, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.sm },
  featuredName: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textTitle, marginBottom: 4 },
  featuredPrice: { fontFamily: 'Montserrat_700Bold', fontSize: 13, color: COLORS.primary },
});
