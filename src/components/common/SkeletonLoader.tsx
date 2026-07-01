// src/components/common/SkeletonLoader.js
// Loading skeletons padronizados - NOVAIX FITNESS

import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, ActivityIndicator } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

function ShimmerBar({ width, height, borderRadius = 4 }) {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(shimmerAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  const opacity = shimmerAnim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.7] });

  return (
    <Animated.View style={[styles.shimmer, { width, height, borderRadius, opacity }]} />
  );
}

export function SkeletonCard({ showImage = false, showAvatar = false, lines = 3 }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        {showAvatar && <ShimmerBar width={40} height={40} borderRadius={20} />}
        <View style={styles.cardHeaderText}>
          <ShimmerBar width={120} height={14} />
          <ShimmerBar width={80} height={10} />
        </View>
      </View>
      {showImage && <ShimmerBar width="100%" height={150} borderRadius={8} />}
      {Array.from({ length: lines }).map((_, i) => (
        <ShimmerBar key={i} width={i === lines - 1 ? '60%' : '100%'} height={12} />
      ))}
    </View>
  );
}

export function SkeletonList({ count = 5, variant = 'card' }) {
  return (
    <View style={styles.list}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} showAvatar={variant !== 'compact'} lines={variant === 'compact' ? 1 : 2} />
      ))}
    </View>
  );
}

export function SkeletonGrid({ columns = 2, count = 4 }) {
  return (
    <View style={styles.grid}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={[styles.gridItem, { width: `${100 / columns - 2}%` }]}>
          <ShimmerBar width="100%" height={100} borderRadius={8} />
          <ShimmerBar width="70%" height={12} />
          <ShimmerBar width="50%" height={10} />
        </View>
      ))}
    </View>
  );
}

export function SkeletonChart({ height = 160 }) {
  return (
    <View style={styles.chart}>
      <ShimmerBar width={120} height={16} />
      <ShimmerBar width="100%" height={height} borderRadius={8} />
    </View>
  );
}

export function LoadingOverlay({ message = 'Carregando...' }) {
  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.overlayText}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  shimmer: { backgroundColor: COLORS.surfaceOverlay },
  card: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  cardHeader: { flexDirection: 'row', gap: SPACING.md, marginBottom: SPACING.md },
  cardHeaderText: { flex: 1, gap: SPACING.xs },
  list: { gap: SPACING.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  gridItem: { gap: SPACING.xs },
  chart: { gap: SPACING.md },
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  overlayText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, marginTop: SPACING.md },
});
