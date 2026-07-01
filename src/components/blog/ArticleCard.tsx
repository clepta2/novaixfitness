import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  readTime: string;
}

interface ArticleCardProps {
  article: Article;
  onPress?: (article: Article) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  nutricao: COLORS.primary,
  treino: COLORS.secondary,
  saude: COLORS.success,
  mindset: COLORS.info,
};

function ArticleCard({ article, onPress }: ArticleCardProps): React.JSX.Element {
  const catColor = CATEGORY_COLORS[article.category] || COLORS.primary;

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress?.(article)} activeOpacity={0.8} accessibilityLabel={article.title} accessibilityRole="button" accessibilityHint="Abre o artigo para leitura">
      <View style={[styles.categoryBadge, { backgroundColor: catColor + '20' }]}>
        <Ionicons name="pricetag" size={10} color={catColor} />
        <Text style={[styles.categoryText, { color: catColor }]}>{article.category.toUpperCase()}</Text>
      </View>

      <Text style={styles.title} numberOfLines={2}>{article.title}</Text>
      <Text style={styles.excerpt} numberOfLines={2}>{article.excerpt}</Text>

      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <Ionicons name="person-circle" size={14} color={COLORS.textMuted} />
          <Text style={styles.footerText}>{article.author}</Text>
        </View>
        <View style={styles.footerRight}>
          <Ionicons name="time" size={14} color={COLORS.textMuted} />
          <Text style={styles.footerText}>{article.readTime}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default memo(ArticleCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    marginBottom: SPACING.sm,
  },
  categoryText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 9,
    letterSpacing: 1,
  },
  title: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
    lineHeight: 22,
    color: COLORS.textTitle,
    marginBottom: SPACING.xs,
  },
  excerpt: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.textDescription,
    marginBottom: SPACING.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: COLORS.textMuted,
  },
});
