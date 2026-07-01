// src/components/marketplace/ProductSkeleton.tsx
// Skeleton de carregamento do marketplace - NOVAIX FITNESS

import { View, StyleSheet, Animated, StyleProp, ViewStyle } from 'react-native';
import { useEffect, useRef } from 'react';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

interface SkeletonPulseProps {
  style?: StyleProp<ViewStyle>;
}

function SkeletonPulse({ style }: SkeletonPulseProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return <Animated.View style={[styles.pulse, style, { opacity }]} />;
}

export function ProductCardSkeleton() {
  return (
    <View style={styles.card}>
      <SkeletonPulse style={styles.image} />
      <View style={styles.info}>
        <SkeletonPulse style={styles.categoryLine} />
        <SkeletonPulse style={styles.titleLine} />
        <SkeletonPulse style={styles.titleLineShort} />
        <SkeletonPulse style={styles.priceLine} />
      </View>
    </View>
  );
}

interface ProductListSkeletonProps {
  count?: number;
}

export function ProductListSkeleton({ count = 4 }: ProductListSkeletonProps) {
  return (
    <View style={styles.grid}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </View>
  );
}

export function FeaturedSkeleton() {
  return (
    <View style={styles.featuredRow}>
      {Array.from({ length: 3 }).map((_, i) => (
        <View key={i} style={styles.featuredCard}>
          <SkeletonPulse style={styles.featuredIcon} />
          <SkeletonPulse style={styles.featuredTitle} />
          <SkeletonPulse style={styles.featuredPrice} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  pulse: { backgroundColor: COLORS.surfaceElevated, borderRadius: 4 },
  card: { flex: 1, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden', marginBottom: SPACING.md },
  image: { height: 140, borderRadius: 0 },
  info: { padding: SPACING.md, gap: SPACING.xs },
  categoryLine: { width: 60, height: 8, borderRadius: 4 },
  titleLine: { width: '90%', height: 12, borderRadius: 4 },
  titleLineShort: { width: '60%', height: 12, borderRadius: 4 },
  priceLine: { width: 70, height: 14, borderRadius: 4, marginTop: SPACING.xs },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md },
  featuredRow: { flexDirection: 'row', gap: SPACING.md },
  featuredCard: { width: 140, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border, gap: SPACING.sm },
  featuredIcon: { width: 60, height: 60, borderRadius: BORDER_RADIUS.md },
  featuredTitle: { width: '80%', height: 10, borderRadius: 4 },
  featuredPrice: { width: 50, height: 12, borderRadius: 4 },
});
