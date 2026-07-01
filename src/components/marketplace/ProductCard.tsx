// src/components/marketplace/ProductCard.tsx
// Card de produto do marketplace - NOVAIX FITNESS

import { memo } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import FavoriteButton from './FavoriteButton';

interface ProductCategory {
  name: string;
  color?: string;
}

interface ProductData {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  image_url?: string;
  brand?: string;
  rating?: number;
  review_count?: number;
  marketplace_categories?: ProductCategory;
}

interface ProductCardProps {
  product: ProductData;
  onPress: () => void;
  isFavorited?: boolean;
  onToggleFavorite: () => void;
}

function ProductCard({ product, onPress, isFavorited, onToggleFavorite }: ProductCardProps) {
  const category = product?.marketplace_categories;
  const hasDiscount = product.original_price && product.original_price > product.price;
  const discountPercent = hasDiscount ? Math.round((1 - product.price / product.original_price!) * 100) : 0;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.imageWrap}>
        {product.image_url ? (
          <Image source={{ uri: product.image_url }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="image-outline" size={32} color={COLORS.textMuted} />
          </View>
        )}
        {hasDiscount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{discountPercent}%</Text>
          </View>
        )}
        <FavoriteButton isFavorited={!!isFavorited} onPress={onToggleFavorite} size={16} />
      </View>
      <View style={styles.info}>
        {category && <Text style={[styles.category, { color: category.color }]}>{category.name}</Text>}
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
        {product.brand && <Text style={styles.brand}>{product.brand}</Text>}
        <View style={styles.priceRow}>
          <Text style={styles.price}>R$ {product.price?.toFixed(2)}</Text>
          {hasDiscount && <Text style={styles.originalPrice}>R$ {product.original_price?.toFixed(2)}</Text>}
        </View>
        {product.rating && product.rating > 0 && (
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={12} color={COLORS.amber} />
            <Text style={styles.rating}>{product.rating?.toFixed(1)}</Text>
            <Text style={styles.reviews}>({product.review_count})</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default memo(ProductCard);

const styles = StyleSheet.create({
  card: { flex: 1, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden', marginBottom: SPACING.md },
  imageWrap: { height: 140, backgroundColor: COLORS.surfaceElevated, position: 'relative' },
  image: { width: '100%', height: '100%' },
  placeholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  discountBadge: { position: 'absolute', top: SPACING.sm, left: SPACING.sm, backgroundColor: COLORS.error, paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: BORDER_RADIUS.sm },
  discountText: { fontFamily: 'Montserrat_700Bold', fontSize: 10, color: '#FFF' },
  info: { padding: SPACING.md },
  category: { fontFamily: 'Inter_500Medium', fontSize: 10, letterSpacing: 0.5, marginBottom: 2 },
  name: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: COLORS.textTitle, marginBottom: 2 },
  brand: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted, marginBottom: SPACING.xs },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: SPACING.xs },
  price: { fontFamily: 'Montserrat_700Bold', fontSize: 15, color: COLORS.primary },
  originalPrice: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted, textDecorationLine: 'line-through' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 4 },
  rating: { fontFamily: 'Inter_500Medium', fontSize: 11, color: COLORS.textDescription },
  reviews: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted },
});
