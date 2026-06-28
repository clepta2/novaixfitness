// src/components/blog/ArticleDetail.js
// Visualização detalhada do artigo - NOVAIX FITNESS

import React, { memo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

const CATEGORY_COLORS = {
  nutricao: COLORS.primary,
  treino: COLORS.secondary,
  saude: COLORS.success,
  mindset: COLORS.info,
};

function ArticleDetail({ article }) {
  const catColor = CATEGORY_COLORS[article.category] || COLORS.primary;

  const renderContent = (text) => {
    return text.split('\n\n').map((paragraph, i) => {
      const isBold = paragraph.startsWith('**');
      const cleanText = paragraph.replace(/\*\*/g, '');
      return (
        <Text key={i} style={[styles.paragraph, isBold && styles.paragraphBold]}>
          {cleanText}
        </Text>
      );
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={[styles.categoryBadge, { backgroundColor: catColor + '20' }]}>
        <Ionicons name="pricetag" size={12} color={catColor} />
        <Text style={[styles.categoryText, { color: catColor }]}>{article.category.toUpperCase()}</Text>
      </View>

      <Text style={styles.title}>{article.title}</Text>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons name="person-circle" size={16} color={COLORS.textMuted} />
          <Text style={styles.metaText}>{article.author}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="time" size={16} color={COLORS.textMuted} />
          <Text style={styles.metaText}>{article.readTime}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="calendar" size={16} color={COLORS.textMuted} />
          <Text style={styles.metaText}>{article.date}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.body}>{renderContent(article.content)}</View>

      {article.tags && article.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {article.tags.map((tag, i) => (
            <View key={i} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

export default memo(ArticleDetail);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.xl, paddingBottom: SPACING.massive },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    marginBottom: SPACING.md,
  },
  categoryText: { fontFamily: 'Montserrat_700Bold', fontSize: 10, letterSpacing: 1 },
  title: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 24,
    lineHeight: 32,
    color: COLORS.textTitle,
    marginBottom: SPACING.md,
  },
  metaRow: { flexDirection: 'row', gap: SPACING.lg, marginBottom: SPACING.lg },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted },
  divider: { height: 1, backgroundColor: COLORS.border, marginBottom: SPACING.xl },
  body: { gap: SPACING.md },
  paragraph: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    lineHeight: 24,
    color: COLORS.textDescription,
  },
  paragraphBold: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
    color: COLORS.textTitle,
    marginTop: SPACING.sm,
  },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginTop: SPACING.xxl },
  tag: {
    backgroundColor: COLORS.surfaceOverlay,
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  tagText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.primary,
  },
});
