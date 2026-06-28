// app/blog.js
// Tela Blog/Artigos - NOVAIX FITNESS

import { useState, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../src/constants/spacing';
import { ARTICLES, ARTICLE_CATEGORIES } from '../src/data/articles';
import ArticleCard from '../src/components/blog/ArticleCard';
import ArticleDetail from '../src/components/blog/ArticleDetail';

export default function BlogScreen() {
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [selectedArticle, setSelectedArticle] = useState(null);

  const filteredArticles = useMemo(
    () => selectedCategory === 'todos' ? ARTICLES : ARTICLES.filter((a) => a.category === selectedCategory),
    [selectedCategory],
  );

  const handleArticlePress = useCallback((article) => setSelectedArticle(article), []);
  const handleBack = useCallback(() => setSelectedArticle(null), []);

  if (selectedArticle) {
    return (
      <View style={styles.screen}>
        <View style={styles.detailHeader}>
          <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={COLORS.textTitle} />
          </TouchableOpacity>
          <Text style={styles.detailHeaderTitle}>ARTIGO</Text>
          <View style={{ width: 40 }} />
        </View>
        <ArticleDetail article={selectedArticle} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>BLOG</Text>
          <Text style={styles.headerSubtitle}>Artigos sobre fitness, nutrição e saúde</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
          {ARTICLE_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.categoryPill, isActive && styles.categoryPillActive]}
                onPress={() => setSelectedCategory(cat.id)}
                activeOpacity={0.7}
              >
                <Ionicons name={cat.icon} size={14} color={isActive ? COLORS.background : COLORS.textMuted} />
                <Text style={[styles.categoryPillText, isActive && styles.categoryPillTextActive]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.articlesList}>
          {filteredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} onPress={handleArticlePress} />
          ))}
        </View>

        {filteredArticles.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={48} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>Nenhum artigo encontrado</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: SPACING.xl, paddingBottom: SPACING.massive },
  header: { marginBottom: SPACING.xxl },
  headerTitle: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 28,
    lineHeight: 36,
    color: COLORS.textTitle,
  },
  headerSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textDescription,
    marginTop: SPACING.xs,
  },
  categoriesScroll: { marginBottom: SPACING.xl },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryPillText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 12,
    color: COLORS.textMuted,
    letterSpacing: 0.5,
  },
  categoryPillTextActive: {
    color: COLORS.background,
  },
  articlesList: { gap: 0 },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.massive,
  },
  emptyText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: SPACING.md,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.xl,
    paddingTop: SPACING.xxxl,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailHeaderTitle: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 14,
    color: COLORS.textTitle,
    letterSpacing: 1,
  },
});
