// src/components/social/TrendingTopics.tsx
// Secao de hashtags em trending

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

type Hashtag = { tag: string; count: number };

interface TrendingTopicsProps {
  hashtags: Hashtag[];
  onSelect?: (tag: string) => void;
}

export default function TrendingTopics({ hashtags, onSelect }: TrendingTopicsProps) {
  if (!hashtags.length) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="trending-up" size={16} color={COLORS.primary} />
        <Text style={styles.title}>Em alta</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {hashtags.map((h) => (
          <TouchableOpacity
            key={h.tag}
            style={styles.pill}
            onPress={() => onSelect?.(h.tag)}
            activeOpacity={0.7}
          >
            <Text style={styles.hash}>#</Text>
            <Text style={styles.tag}>{h.tag}</Text>
            <Text style={styles.count}>{h.count}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  title: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 12,
    color: COLORS.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  scroll: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 2,
  },
  hash: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: COLORS.primary,
  },
  tag: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: COLORS.textTitle,
  },
  count: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: COLORS.textMuted,
    marginLeft: SPACING.xs,
  },
});
