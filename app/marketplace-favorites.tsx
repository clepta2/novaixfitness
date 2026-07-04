
// app/marketplace-favorites.js
// Pagina de favoritos do marketplace - NOVAIX FITNESS

import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/constants/colors';
import { SPACING } from '../src/constants/spacing';
import { useAuth } from '../src/context/AuthContext';
import { ErrorBoundary, ProductList } from '../src/components';
import { useMountedRef } from '../src/hooks/useMountedRef';
import { toggleFavorite } from '../src/services/marketplace';
import { supabase } from '../src/config/supabase';
import { layout, typography } from '../src/styles';

export default function MarketplaceFavoritesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const mounted = useMountedRef();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const loadFavorites = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const { data: favs } = await supabase
        .from('marketplace_favorites')
        .select('product_id')
        .eq('user_id', user.id);

      if (!mounted.current) return;
      const ids = (favs || []).map(f => f.product_id);
      setFavorites(new Set(ids));

      if (ids.length > 0) {
        const { data } = await supabase
          .from('marketplace_products')
          .select('*, marketplace_categories(name, slug, icon, color)')
          .in('id', ids)
          .eq('is_active', true);
        if (!mounted.current) return;
        setProducts(data || []);
      } else {
        setProducts([]);
      }
    } catch (err) {
      if (__DEV__) console.error('Erro ao carregar favoritos:', err);
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => { loadFavorites(); }, [loadFavorites]);

  const handleToggleFavorite = async (productId) => {
    if (!user?.id) return;
    try {
      const isNowFav = await toggleFavorite(user.id, productId);
      setFavorites(prev => {
        const next = new Set(prev);
        if (isNowFav) next.add(productId); else next.delete(productId);
        return next;
      });
      if (!isNowFav) setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (err) {
      if (__DEV__) console.error('Erro ao alternar favorito:', err);
    }
  };

  return (
    <ErrorBoundary screenName="MarketplaceFavorites">
      <View style={layout.screen}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={layout.header}>
            <TouchableOpacity accessibilityLabel="Voltar" accessibilityRole="button" onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color={COLORS.textTitle} />
            </TouchableOpacity>
            <Text style={typography.h2}>MEUS FAVORITOS</Text>
            <View style={{ width: 24 }} />
          </View>

          {products.length > 0 && (
            <Text style={styles.count}>{products.length} {products.length === 1 ? 'produto' : 'produtos'} salvos</Text>
          )}

          <ProductList
            products={products}
            loading={loading}
            onProductPress={(p) => router.push({ pathname: '/marketplace-detail', params: { id: p.id } })}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />

          {!loading && products.length === 0 && (
            <View style={styles.empty}>
              <Ionicons name="heart-outline" size={48} color={COLORS.textMuted} />
              <Text style={typography.bodyMuted}>Nenhum favorito ainda</Text>
              <TouchableOpacity accessibilityLabel="Explorar produtos" accessibilityRole="button" onPress={() => router.back()}>
                <Text style={styles.browseText}>Explorar produtos</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  count: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted, marginBottom: SPACING.md },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: SPACING.xxxl, gap: SPACING.md },
  browseText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: COLORS.primary },
});
