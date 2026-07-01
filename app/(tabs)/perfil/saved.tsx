// app/(tabs)/perfil/saved.js
// Página de posts salvos/bookmarks

import { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../../src/constants/colors';
import { SPACING } from '../../../src/constants/spacing';
import { useAuth } from '../../../src/context/AuthContext';
import { supabase } from '../../../src/config/supabase';
import { Header, ErrorBoundary, PostCard } from '../../../src/components';
import { formatRelativeDate } from '../../../src/helpers/dates';

export default function SavedPostsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (user?.id) loadSaved(); }, [user?.id]);

  const loadSaved = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('saved_posts')
      .select('post_id, posts(*, profiles:user_id(name, avatar_url))')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    setPosts((data as any[] || []).map((s: any) => ({
      id: s.posts?.id,
      userId: s.posts?.user_id,
      user: { name: s.posts?.profiles?.name || 'Atleta', avatar: s.posts?.profiles?.avatar_url || null },
      content: s.posts?.content,
      image: s.posts?.image_url,
      createdAt: formatRelativeDate(s.posts?.created_at),
      likes: s.posts?.likes_count || 0,
      comments: s.posts?.comments_count || 0,
      isLiked: false,
    })).filter((p: any) => p.id));
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSaved();
    setRefreshing(false);
  };

  return (
    <ErrorBoundary screenName="SavedPosts">
      <View style={styles.screen}>
        <Header title="SALVOS" showBack onBack={() => router.back()} />

        {loading ? (
          <View style={styles.center}>
            <Text style={styles.loadingText}>Carregando...</Text>
          </View>
        ) : posts.length === 0 ? (
          <View style={styles.center}>
            <Ionicons name="bookmark-outline" size={48} color={COLORS.textMuted} />
            <Text style={styles.emptyTitle}>Nenhum post salvo</Text>
            <Text style={styles.emptyDesc}>Salve posts interessantes para ver depois</Text>
          </View>
        ) : (
          <FlatList
            data={posts}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.list}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
            renderItem={({ item }) => (
              <PostCard post={item} currentUserId={user?.id} />
            )}
          />
        )}
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: SPACING.md },
  list: { padding: SPACING.lg, paddingBottom: SPACING.massive },
  loadingText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted },
  emptyTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle },
  emptyDesc: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textMuted },
});
