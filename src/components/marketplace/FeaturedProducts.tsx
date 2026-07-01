import { memo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { typography } from '../../styles';

interface FeaturedProduct {
  id: string;
  name: string;
  price: number;
  marketplace_categories?: { color?: string; icon?: string };
}

interface FeaturedProductsProps {
  products: FeaturedProduct[];
  loading: boolean;
  onPress: (product: FeaturedProduct) => void;
}

function FeaturedProducts({ products, loading, onPress }: FeaturedProductsProps) {
  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={typography.label}>DESTAQUES</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
          {[1, 2, 3].map(i => (
            <View key={i} style={styles.skeletonCard}>
              <View style={styles.skeletonBg} />
              <View style={styles.skeletonLine} />
              <View style={styles.skeletonLineSmall} />
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={typography.label}>DESTAQUES</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
        {products.map(p => (
          <TouchableOpacity key={p.id} style={styles.card} onPress={() => onPress(p)} activeOpacity={0.8}>
            <View style={[styles.iconBg, { backgroundColor: (p.marketplace_categories?.color || COLORS.primary) + '20' }]}>
              <Ionicons name={(p.marketplace_categories?.icon || 'cube') as any} size={32} color={p.marketplace_categories?.color || COLORS.primary} />
            </View>
            <Text style={styles.name} numberOfLines={2}>{p.name}</Text>
            <Text style={styles.price}>R$ {p.price?.toFixed(2)}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

export default memo(FeaturedProducts);

const styles = StyleSheet.create({
  container: { marginTop: SPACING.lg },
  scroll: { marginTop: SPACING.md },
  card: { width: 140, marginRight: SPACING.md, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  iconBg: { width: 60, height: 60, borderRadius: BORDER_RADIUS.md, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.sm },
  name: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textTitle, marginBottom: 4 },
  price: { fontFamily: 'Montserrat_700Bold', fontSize: 13, color: COLORS.primary },
  skeletonCard: { width: 140, marginRight: SPACING.md, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md },
  skeletonBg: { width: 60, height: 60, borderRadius: BORDER_RADIUS.md, backgroundColor: COLORS.border, marginBottom: SPACING.sm },
  skeletonLine: { height: 12, width: '80%', backgroundColor: COLORS.border, borderRadius: 6, marginBottom: 4 },
  skeletonLineSmall: { height: 10, width: '50%', backgroundColor: COLORS.border, borderRadius: 5 },
});
