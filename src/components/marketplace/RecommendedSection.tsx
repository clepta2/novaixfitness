import { memo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

interface RecommendedProduct {
  id: string;
  name: string;
  price: number;
  image_url?: string;
}

interface RecommendedSectionProps {
  products: RecommendedProduct[];
  onPress: (product: RecommendedProduct) => void;
  favorites?: Set<string>;
  onToggleFavorite: (productId: string) => void;
}

function RecommendedSection({ products, onPress, favorites, onToggleFavorite }: RecommendedSectionProps) {
  if (!products || products.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="sparkles" size={16} color={COLORS.primary} />
        <Text style={styles.title}>RECOMENDADOS PRA VOCÊ</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
        {products.map(p => (
          <TouchableOpacity key={p.id} style={styles.card} onPress={() => onPress(p)} activeOpacity={0.8}>
            <View style={styles.imageWrap}>
              {p.image_url ? (
                <Image source={{ uri: p.image_url }} style={styles.image} resizeMode="cover" />
              ) : (
                <View style={styles.placeholder}>
                  <Ionicons name="image-outline" size={24} color={COLORS.textMuted} />
                </View>
              )}
            </View>
            <View style={styles.info}>
              <Text style={styles.name} numberOfLines={2}>{p.name}</Text>
              <Text style={styles.price}>R$ {p.price?.toFixed(2)}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

export default memo(RecommendedSection);

const styles = StyleSheet.create({
  container: { marginTop: SPACING.lg },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, marginBottom: SPACING.md, paddingHorizontal: SPACING.xl },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textTitle, letterSpacing: 1 },
  scroll: { paddingLeft: SPACING.xl },
  card: { width: 160, marginRight: SPACING.md, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden' },
  imageWrap: { height: 100, backgroundColor: COLORS.surfaceElevated },
  image: { width: '100%', height: '100%' },
  placeholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  info: { padding: SPACING.sm },
  name: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textTitle, marginBottom: 4 },
  price: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.primary },
});
