// src/components/social/ExplorePage.tsx
// Pagina de explorar/descobrir conteudo da comunidade

import React, { useState, useCallback } from 'react';
import {
  View, Text, TextInput, FlatList, TouchableOpacity,
  RefreshControl, Image, StyleSheet, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { useTrendingContent, type TrendingPost } from '../../hooks/useTrendingContent';
import TrendingTopics from './TrendingTopics';
import SuggestedFollows from './SuggestedFollows';

const SCREEN_WIDTH = Dimensions.get('window').width;
const GRID_COLUMNS = 3;
const GRID_GAP = 3;
const GRID_ITEM_SIZE = (SCREEN_WIDTH - SPACING.lg * 2 - GRID_GAP * (GRID_COLUMNS - 1)) / GRID_COLUMNS;

const CATEGORIES = [
  { key: 'Todos', label: 'Todos', icon: 'grid' },
  { key: 'Treino', label: 'Treino', icon: 'barbell' },
  { key: 'Nutricao', label: 'Nutricao', icon: 'nutrition' },
  { key: 'Motivacao', label: 'Motivacao', icon: 'flame' },
  { key: 'Comunidade', label: 'Comunidade', icon: 'people' },
] as const;

interface ExplorePageProps {
  onPostPress?: (postId: string) => void;
  onUserPress?: (userId: string) => void;
  onHashtagPress?: (tag: string) => void;
}

export default function ExplorePage({ onPostPress, onUserPress, onHashtagPress }: ExplorePageProps) {
  const {
    trendingPosts, hashtags, suggestedUsers, loading, refreshing, onRefresh,
  } = useTrendingContent();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Todos');

  const filteredPosts = trendingPosts.filter((p) => {
    if (activeCategory === 'Todos') return true;
    const content = (p.content || '').toLowerCase();
    return content.includes(activeCategory.toLowerCase());
  });

  const renderGridItem = useCallback(({ item }: { item: TrendingPost }) => (
    <TouchableOpacity
      style={styles.gridItem}
      onPress={() => onPostPress?.(item.id)}
      activeOpacity={0.8}
    >
      {item.image_url ? (
        <Image source={{ uri: item.image_url }} style={styles.gridImage} />
      ) : (
        <View style={[styles.gridImage, styles.gridText]}>
          <Text style={styles.gridTextContent} numberOfLines={3}>{item.content}</Text>
        </View>
      )}
      <View style={styles.gridOverlay}>
        <View style={styles.gridStats}>
          <Ionicons name="heart" size={10} color="#fff" />
          <Text style={styles.gridStatText}>{item.likesCount}</Text>
          <Ionicons name="chatbubble" size={10} color="#fff" style={{ marginLeft: 4 }} />
          <Text style={styles.gridStatText}>{item.commentsCount}</Text>
        </View>
      </View>
    </TouchableOpacity>
  ), [onPostPress]);

  const renderHeader = () => (
    <View>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={16} color={COLORS.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar posts, hashtags, pessoas..."
          placeholderTextColor={COLORS.textMuted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <TrendingTopics hashtags={hashtags} onSelect={(tag) => onHashtagPress?.(tag)} />

      <SuggestedFollows users={suggestedUsers} onFollow={(id) => onUserPress?.(id)} />

      <View style={styles.categories}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.key}
            style={[styles.catBtn, activeCategory === cat.key && styles.catActive]}
            onPress={() => setActiveCategory(cat.key)}
          >
            <Ionicons name={cat.icon as any} size={12} color={activeCategory === cat.key ? COLORS.background : COLORS.textMuted} />
            <Text style={[styles.catText, activeCategory === cat.key && styles.catTextActive]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.id}
        numColumns={GRID_COLUMNS}
        renderItem={renderGridItem}
        ListHeaderComponent={renderHeader}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.empty}>
              <Ionicons name="search" size={32} color={COLORS.textMuted} />
              <Text style={styles.emptyText}>Nenhum post encontrado</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingBottom: SPACING.xxxl },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.full, marginHorizontal: SPACING.lg, marginVertical: SPACING.md,
    paddingHorizontal: SPACING.md, borderWidth: 1, borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1, fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textTitle,
    paddingVertical: SPACING.sm, marginLeft: SPACING.sm,
  },
  categories: {
    flexDirection: 'row', paddingHorizontal: SPACING.lg, gap: SPACING.xs,
    marginBottom: SPACING.md, flexWrap: 'wrap',
  },
  catBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs, borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
  },
  catActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  catText: { fontFamily: 'Inter_600SemiBold', fontSize: 11, color: COLORS.textMuted },
  catTextActive: { color: COLORS.background },
  row: { gap: GRID_GAP, paddingHorizontal: SPACING.lg },
  gridItem: {
    width: GRID_ITEM_SIZE, height: GRID_ITEM_SIZE, borderRadius: BORDER_RADIUS.sm,
    overflow: 'hidden', marginBottom: GRID_GAP, backgroundColor: COLORS.surface,
  },
  gridImage: { width: '100%', height: '100%' },
  gridText: { padding: SPACING.xs, justifyContent: 'center', backgroundColor: COLORS.surfaceElevated },
  gridTextContent: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textTitle },
  gridOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: SPACING.xs, paddingVertical: 3,
  },
  gridStats: { flexDirection: 'row', alignItems: 'center' },
  gridStatText: { fontFamily: 'Inter_600SemiBold', fontSize: 9, color: '#fff', marginLeft: 2 },
  empty: { alignItems: 'center', padding: SPACING.huge, gap: SPACING.sm },
  emptyText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textMuted },
});
