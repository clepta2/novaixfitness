
import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/constants/colors';
import { SPACING } from '../src/constants/spacing';
import { layout, typography } from '../src/styles';
import { ForumPost, CreateForumPostModal, ErrorBoundary } from '../src/components';
import { ForumFilters, ForumEmptyState } from '../src/components/social';
import { FORUM_CATEGORIES, MOCK_POSTS } from '../src/data/forumCategories';
import { useAuth } from '../src/context/AuthContext';
import { useSupabaseData } from '../src/hooks';

export default function ForumScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const { data: dbPosts, refetch, loading, insert } = useSupabaseData('forum_posts', {
    select: '*, profiles:user_id(name, avatar_url)',
    orderBy: { column: 'created_at', ascending: false },
    mockData: MOCK_POSTS,
  });

  useEffect(() => {
    if (dbPosts) {
      setPosts(dbPosts.map(p => ({
        id: p.id, category: p.category,
        author: p.profiles?.name || p.author || 'Atleta',
        authorAvatar: p.profiles?.avatar_url || p.authorAvatar || null,
        title: p.title, content: p.content,
        likes: p.likes_count ?? p.likes ?? 0,
        replies: p.replies_count ?? p.replies ?? 0,
        createdAt: p.created_at || p.createdAt,
      })));
    }
  }, [dbPosts]);

  const onRefresh = async () => { setRefreshing(true); try { await refetch(); } finally { setRefreshing(false); } };

  const handleCreatePost = async (postData) => {
    if (!user) return;
    const { error } = await insert({ user_id: user.id, title: postData.title, content: postData.content, category: postData.category });
    if (error) Alert.alert('Erro', 'Ao criar post: ' + (typeof error === 'string' ? error : error.message || String(error)));
    else refetch();
  };

  const filteredPosts = posts.filter(post => {
    const matchCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchSearch = !search || post.title.toLowerCase().includes(search.toLowerCase()) || (post.content || '').toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <ErrorBoundary screenName="Forum">
    <View style={layout.screen}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingTop: layout.scroll.paddingTop }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing || (loading && posts.length === 0)} onRefresh={onRefresh} tintColor={COLORS.primary} />}
      >
        <View style={layout.header}>
          <TouchableOpacity accessibilityLabel="Voltar" accessibilityRole="button" onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textTitle} />
          </TouchableOpacity>
          <Text style={typography.h2}>FORUM</Text>
          {user && (
            <TouchableOpacity accessibilityLabel="Criar novo post" accessibilityRole="button" onPress={() => setShowCreateModal(true)}>
              <Ionicons name="add-circle-outline" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          )}
        </View>

        <ForumFilters categories={FORUM_CATEGORIES} selected={selectedCategory} onSelect={setSelectedCategory} search={search} onSearchChange={setSearch} />

        <View style={{ paddingHorizontal: SPACING.lg }}>
          {filteredPosts.length === 0 ? (
            <ForumEmptyState />
          ) : (
            filteredPosts.map(post => <ForumPost key={post.id} post={post} />)
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      <CreateForumPostModal visible={showCreateModal} onClose={() => setShowCreateModal(false)} onSubmit={handleCreatePost} />
    </View>
    </ErrorBoundary>
  );
}
