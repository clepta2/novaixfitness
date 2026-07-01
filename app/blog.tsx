// @ts-nocheck
// app/blog.js
// Tela Blog/Artigos - NOVAIX FITNESS

import { useState, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/constants/colors';
import { ErrorBoundary, ArticleCard, ArticleDetail } from '../src/components';
import { ARTICLES, ARTICLE_CATEGORIES } from '../src/data/articles';
import { styles } from '../src/styles/blogStyles';

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
          <TouchableOpacity onPress={handleBack} style={styles.backBtn} accessibilityLabel="Voltar" accessibilityRole="button">
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
    <ErrorBoundary screenName="Blog">
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
                accessibilityLabel={`Filtrar por ${cat.label}`}
                accessibilityRole="tab"
                accessibilityState={{ selected: isActive }}
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
    </ErrorBoundary>
  );
}
