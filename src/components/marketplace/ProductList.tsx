// src/components/marketplace/ProductList.tsx
// Grid de produtos com skeleton, pull-to-refresh e infinite scroll - NOVAIX FITNESS

import { memo } from 'react';
import { View, FlatList, Text, StyleSheet, ActivityIndicator } from 'react-native';
import ProductCard from './ProductCard';
import { ProductListSkeleton } from './ProductSkeleton';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { typography } from '../../styles';

interface ProductData {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  image_url?: string;
  brand?: string;
  rating?: number;
  review_count?: number;
  marketplace_categories?: { name: string; color?: string };
}

interface ProductListProps {
  products: ProductData[];
  onProductPress: (product: ProductData) => void;
  favorites?: Set<string>;
  onToggleFavorite: (productId: string) => void;
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  onLoadMore: () => void;
  hasMore: boolean;
}

function ProductList({ products, onProductPress, favorites, onToggleFavorite, loading, refreshing, onRefresh, onLoadMore, hasMore }: ProductListProps) {
  if (loading && (!products || products.length === 0)) {
    return <ProductListSkeleton count={4} />;
  }

  if (!products || products.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={typography.bodyMuted}>Nenhum produto encontrado</Text>
      </View>
    );
  }

  return (
    <FlatList
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={5}
      data={products}
      numColumns={2}
      keyExtractor={(item) => item.id}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      refreshing={refreshing}
      onRefresh={onRefresh}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.3}
      ListFooterComponent={hasMore ? <ActivityIndicator size="small" color={COLORS.primary} style={{ marginVertical: SPACING.lg }} /> : null}
      renderItem={({ item }) => (
        <ProductCard
          product={item}
          onPress={() => onProductPress(item)}
          isFavorited={favorites?.has(item.id)}
          onToggleFavorite={() => onToggleFavorite(item.id)}
        />
      )}
    />
  );
}

export default memo(ProductList);

const styles = StyleSheet.create({
  list: { paddingBottom: SPACING.xl },
  row: { gap: SPACING.md },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: SPACING.xxxl },
});
