// src/components/social/FeedSkeleton.js
// Skeletons para o feed - NOVAIX FITNESS

import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

export function PostSkeleton() {
  return (
    <View style={styles.skeletonCard}>
      <View style={styles.skeletonHeader}>
        <View style={styles.skeletonAvatar} />
        <View style={styles.skeletonLines}>
          <View style={styles.skeletonLine} />
          <View style={[styles.skeletonLine, { width: 80 }]} />
        </View>
      </View>
      <View style={styles.skeletonLine} />
      <View style={[styles.skeletonLine, { width: '70%' }]} />
      <View style={styles.skeletonImage} />
    </View>
  );
}

export function FeedEmptyState({ hasFilter }) {
  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIcon}>
        <Ionicons name="people-outline" size={48} color={COLORS.textMuted} />
      </View>
      <Text style={styles.emptyTitle}>{hasFilter ? 'Nenhum post encontrado' : 'Nenhum post ainda'}</Text>
      <Text style={styles.emptyText}>
        {hasFilter
          ? 'Tente mudar o filtro ou volte mais tarde.'
          : 'Seja o primeiro a compartilhar algo com a comunidade!'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  skeletonCard: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  skeletonHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md },
  skeletonAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surfaceOverlay },
  skeletonLines: { flex: 1, marginLeft: SPACING.md, gap: SPACING.xs },
  skeletonLine: { height: 12, backgroundColor: COLORS.surfaceOverlay, borderRadius: 4, width: '100%' },
  skeletonImage: { width: '100%', height: 150, backgroundColor: COLORS.surfaceOverlay, borderRadius: BORDER_RADIUS.md, marginTop: SPACING.md },
  emptyContainer: { alignItems: 'center', paddingVertical: SPACING.xxxl },
  emptyIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.surfaceOverlay, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.xl },
  emptyTitle: { fontFamily: 'Montserrat_600SemiBold', fontSize: 16, color: COLORS.textTitle, marginBottom: SPACING.sm },
  emptyText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, textAlign: 'center', paddingHorizontal: SPACING.xxl },
});
