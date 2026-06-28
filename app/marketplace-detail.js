// app/marketplace-detail.js
// Tela de detalhe do produto - NOVAIX FITNESS

import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../src/constants/spacing';
import { useAuth } from '../src/context/AuthContext';
import { layout, typography } from '../src/styles';
import { FavoriteButton, ProductCard } from '../src/components/marketplace';
import ImageCarousel from '../src/components/marketplace/ImageCarousel';
import ProductReviews from '../src/components/marketplace/ProductReviews';
import { shareProduct, shareToWhatsApp } from '../src/components/marketplace/ShareProduct';
import { getProductById, getRelatedProducts, toggleFavorite, isFavorited } from '../src/services/marketplace';

export default function MarketplaceDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [favorited, setFavorited] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!id) return;
      try {
        const p = await getProductById(id);
        setProduct(p);
        if (p.category_id) {
          const rel = await getRelatedProducts(id, p.category_id);
          setRelated(rel);
        }
        if (user?.id) setFavorited(await isFavorited(user.id, id));
      } catch (err) {
        if (__DEV__) console.error('Erro ao carregar produto:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, user?.id]);

  const handleToggleFavorite = async () => {
    if (!user?.id) return;
    setFavorited(await toggleFavorite(user.id, id));
  };

  const handleBuy = () => {
    if (product?.affiliate_url) Linking.openURL(product.affiliate_url);
  };

  if (loading) return <View style={[layout.screen, styles.centered]}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
  if (!product) return <View style={[layout.screen, styles.centered]}><Text style={typography.bodyMuted}>Produto nao encontrado</Text></View>;

  const hasDiscount = product.original_price && product.original_price > product.price;
  const category = product.marketplace_categories;
  const allImages = [product.image_url, ...(product.images || [])].filter(Boolean);
  const buyLabel = product.stock_type === 'coupon' ? 'RESGATAR CUPOM' : product.stock_type === 'digital' ? 'COMPRAR' : 'VER NA LOJA';

  return (
    <View style={layout.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageSection}>
          <ImageCarousel images={allImages} height={280} />
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={COLORS.textTitle} />
          </TouchableOpacity>
          <View style={styles.topActions}>
            <TouchableOpacity style={styles.shareBtn} onPress={() => shareProduct(product)}>
              <Ionicons name="share-outline" size={20} color={COLORS.textTitle} />
            </TouchableOpacity>
            <FavoriteButton isFavorited={favorited} onPress={handleToggleFavorite} size={22} />
          </View>
          {hasDiscount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{Math.round((1 - product.price / product.original_price) * 100)}%</Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          {category && <Text style={[styles.categoryTag, { color: category.color }]}>{category.name}</Text>}
          <Text style={styles.productName}>{product.name}</Text>
          {product.brand && <Text style={styles.brand}>{product.brand}</Text>}

          <View style={styles.priceSection}>
            <Text style={styles.price}>R$ {product.price?.toFixed(2)}</Text>
            {hasDiscount && <Text style={styles.originalPrice}>R$ {product.original_price?.toFixed(2)}</Text>}
          </View>

          {product.rating > 0 && (
            <View style={styles.ratingRow}>
              {[1, 2, 3, 4, 5].map(i => (
                <Ionicons key={i} name={i <= Math.round(product.rating) ? 'star' : 'star-outline'} size={16} color="#F59E0B" />
              ))}
              <Text style={styles.ratingText}>{product.rating?.toFixed(1)} ({product.review_count} avaliacoes)</Text>
            </View>
          )}

          {product.description && (
            <View style={styles.descSection}>
              <Text style={typography.label}>DESCRICAO</Text>
              <Text style={styles.description}>{product.description}</Text>
            </View>
          )}

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.buyBtn} onPress={handleBuy} activeOpacity={0.8}>
              <Ionicons name={product.stock_type === 'coupon' ? 'pricetag' : 'cart'} size={20} color={COLORS.background} />
              <Text style={styles.buyBtnText}>{buyLabel}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.whatsappBtn} onPress={() => shareToWhatsApp(product)} activeOpacity={0.8}>
              <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
            </TouchableOpacity>
          </View>

          <ProductReviews productId={id} />

          {related.length > 0 && (
            <View style={styles.relatedSection}>
              <Text style={typography.label}>PRODUTOS RELACIONADOS</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.relatedScroll}>
                {related.map(p => (
                  <View key={p.id} style={styles.relatedCard}>
                    <ProductCard
                      product={p}
                      onPress={() => router.push({ pathname: '/marketplace-detail', params: { id: p.id } })}
                      isFavorited={false}
                      onToggleFavorite={() => {}}
                    />
                  </View>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: { justifyContent: 'center', alignItems: 'center' },
  imageSection: { height: 280, backgroundColor: COLORS.surfaceElevated, position: 'relative' },
  backBtn: { position: 'absolute', top: 48, left: SPACING.xl, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  topActions: { position: 'absolute', top: 48, right: SPACING.xl, flexDirection: 'row', gap: SPACING.sm },
  shareBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  discountBadge: { position: 'absolute', bottom: SPACING.md, left: SPACING.xl, backgroundColor: COLORS.error, paddingHorizontal: SPACING.md, paddingVertical: 4, borderRadius: BORDER_RADIUS.sm },
  discountText: { fontFamily: 'Montserrat_700Bold', fontSize: 13, color: '#FFF' },
  content: { padding: SPACING.xl },
  categoryTag: { fontFamily: 'Inter_500Medium', fontSize: 11, letterSpacing: 0.5, marginBottom: SPACING.xs },
  productName: { fontFamily: 'Montserrat_700Bold', fontSize: 20, color: COLORS.textTitle, marginBottom: 4 },
  brand: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textMuted, marginBottom: SPACING.md },
  priceSection: { flexDirection: 'row', alignItems: 'baseline', gap: SPACING.sm, marginBottom: SPACING.md },
  price: { fontFamily: 'Montserrat_700Bold', fontSize: 24, color: COLORS.primary },
  originalPrice: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, textDecorationLine: 'line-through' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: SPACING.xl },
  ratingText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted, marginLeft: 4 },
  descSection: { marginBottom: SPACING.xl },
  description: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textDescription, lineHeight: 22, marginTop: SPACING.sm },
  actionRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.lg },
  buyBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.md, height: 52 },
  buyBtnText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.background, letterSpacing: 1 },
  whatsappBtn: { width: 52, height: 52, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: '#25D366' + '40', justifyContent: 'center', alignItems: 'center' },
  relatedSection: { marginTop: SPACING.lg },
  relatedScroll: { marginTop: SPACING.md },
  relatedCard: { width: 160, marginRight: SPACING.md },
});
