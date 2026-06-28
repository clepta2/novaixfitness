// src/components/marketplace/ProductList.js
// Grid de produtos - NOVAIX FITNESS

import { View, FlatList, Text, StyleSheet } from 'react-native';
import ProductCard from './ProductCard';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { typography } from '../../styles';

export default function ProductList({ products, onProductPress, favorites, onToggleFavorite, loading }) {
  if (loading) {
    return (
      <View style={styles.loadingGrid}>
        {[1, 2, 3, 4].map(i => <View key={i} style={styles.skeletonCard} />)}
      </View>
    );
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
      data={products}
      numColumns={2}
      keyExtractor={(item) => item.id}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
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

const styles = StyleSheet.create({
  list: { paddingBottom: SPACING.xl },
  row: { gap: SPACING.md },
  loadingGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md },
  skeletonCard: { flex: 1, height: 240, backgroundColor: COLORS.surface, borderRadius: 12, minWidth: '45%' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: SPACING.xxxl },
});
