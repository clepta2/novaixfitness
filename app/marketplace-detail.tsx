
// app/marketplace-detail.js
// Tela de detalhe do produto - NOVAIX FITNESS

import { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/constants/colors';
import { useAuth } from '../src/context/AuthContext';
import { layout, typography } from '../src/styles';
import { ErrorBoundary, FavoriteButton, ProductCard, ImageCarousel, ProductReviews } from '../src/components';
import { shareProduct, shareToWhatsApp } from '../src/components/marketplace';
import { getProductById, getRelatedProducts, toggleFavorite, isFavorited } from '../src/services/marketplace';
import { useMarketplaceDetailStyles } from '../src/styles/marketplaceDetailStyles';

export default function MarketplaceDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const productId = Array.isArray(id) ? id[0] : id;
  const { user } = useAuth();
  const styles = useMarketplaceDetailStyles();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [favorited, setFavorited] = useState(false);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    setLoading(true);
    setProduct(null);
    setRelated([]);
    setFavorited(false);
    async function load() {
      if (!productId) {
        setLoading(false);
        return;
      }
      try {
        const p = await getProductById(productId);
        if (!mountedRef.current) return;
        if (!p) { return; }
        setProduct(p);
        if (p.category_id) {
          const rel = await getRelatedProducts(productId, p.category_id);
          if (mountedRef.current) setRelated(rel);
        }
        if (user?.id) {
          const fav = await isFavorited(user.id, productId);
          if (mountedRef.current) setFavorited(fav);
        }
      } catch (err) {
        if (__DEV__) console.error('Erro ao carregar produto:', err);
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    }
    load();
    return () => { mountedRef.current = false; };
  }, [productId, user?.id]);

  const isTogglingRef = useRef(false);

  const handleToggleFavorite = async () => {
    if (!user?.id || isTogglingRef.current || !productId) return;
    isTogglingRef.current = true;
    setFavorited(prev => !prev);
    try {
      const result = await toggleFavorite(user.id, productId);
      setFavorited(result);
    } catch (err) {
      setFavorited(prev => !prev);
      if (__DEV__) console.error('Erro ao alternar favorito:', err);
    } finally {
      isTogglingRef.current = false;
    }
  };

  const handleBuy = async () => {
    if (product?.affiliate_url) {
      try {
        await Linking.openURL(product.affiliate_url);
      } catch (err) {
        if (__DEV__) console.error('Erro ao abrir link:', err);
      }
    }
  };

  if (loading) return <View style={[layout.screen, styles.centered]}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
  if (!product) return <View style={[layout.screen, styles.centered]}><Text style={typography.bodyMuted}>Produto nao encontrado</Text></View>;

  const hasDiscount = product.original_price && product.original_price > product.price;
  const category = product.marketplace_categories;
  const allImages = [product.image_url, ...(product.images || [])].filter(Boolean);
  const buyLabel = product.stock_type === 'coupon' ? 'RESGATAR CUPOM' : product.stock_type === 'digital' ? 'COMPRAR' : 'VER NA LOJA';

  return (
    <ErrorBoundary screenName="MarketplaceDetail">
    <View style={layout.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageSection}>
          <ImageCarousel images={allImages} height={280} />
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} accessibilityLabel="Voltar" accessibilityRole="button">
            <Ionicons name="arrow-back" size={22} color={COLORS.textTitle} />
          </TouchableOpacity>
          <View style={styles.topActions}>
            <TouchableOpacity style={styles.shareBtn} onPress={() => shareProduct(product)} accessibilityLabel="Compartilhar produto" accessibilityRole="button">
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
            <Text style={styles.price}>R$ {product.price?.toFixed(2) ?? '0,00'}</Text>
            {hasDiscount && <Text style={styles.originalPrice}>R$ {product.original_price?.toFixed(2) ?? '0,00'}</Text>}
          </View>

          {product.rating > 0 && (
            <View style={styles.ratingRow}>
              {[1, 2, 3, 4, 5].map(i => (
                <Ionicons key={i} name={i <= Math.round(product.rating) ? 'star' : 'star-outline'} size={16} color={COLORS.star} />
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
            <TouchableOpacity style={styles.buyBtn} onPress={handleBuy} activeOpacity={0.8} accessibilityLabel={buyLabel} accessibilityRole="button">
              <Ionicons name={product.stock_type === 'coupon' ? 'pricetag' : 'cart'} size={20} color={COLORS.background} />
              <Text style={styles.buyBtnText}>{buyLabel}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.whatsappBtn} onPress={() => shareToWhatsApp(product)} activeOpacity={0.8} accessibilityLabel="Compartilhar no WhatsApp" accessibilityRole="button">
              <Ionicons name="logo-whatsapp" size={20} color={COLORS.whatsapp} />
            </TouchableOpacity>
          </View>

          <ProductReviews productId={productId} />

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
    </ErrorBoundary>
  );
}
