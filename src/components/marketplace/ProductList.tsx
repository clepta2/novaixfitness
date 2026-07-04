// src/components/marketplace/ProductList.js
// Grid de produtos com skeleton, pull-to-refresh e infinite scroll - NOVAIX FITNESS

import React, { memo } from 'react';
import { View, FlatList, Text, StyleSheet, ActivityIndicator } from 'react-native';
import ProductCard from './ProductCard';
import { ProductListSkeleton } from './ProductSkeleton';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { typography } from '../../styles';

type Props = {
  products: any[];
  onProductPress: (product: any) => void;
  favorites?: Set<string>;
  onToggleFavorite?: (id: string) => void;
  loading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
};

export default memo(function ProductList({ products, onProductPress, favorites, onToggleFavorite, loading, refreshing, onRefresh, onLoadMore, hasMore }: Props) {
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
});

const styles = StyleSheet.create({
  list: { paddingBottom: SPACING.xl },
  row: { gap: SPACING.md },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: SPACING.xxxl },
});
