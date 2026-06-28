// app/(tabs)/feed.js
// Tela de Comunidade/Feed - NOVAIX FITNESS

import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../../src/constants/spacing';
import { PostCard, CreatePostModal, NotificationModal, ChallengesList, TutorialOverlay, ErrorBoundary } from '../../src/components';
import { PostSkeleton, FeedEmptyState } from '../../src/components/social/FeedSkeleton';
import FeedHeader from '../../src/components/social/FeedHeader';
import FeedFilters from '../../src/components/social/FeedFilters';
import { useSupabaseData } from '../../src/hooks/useSupabaseData';
import { useRealtimePosts } from '../../src/hooks/useRealtimePosts';
import { useTutorial } from '../../src/hooks/useTutorial';
import { useAuth } from '../../src/context/AuthContext';
import { supabase } from '../../src/config/supabase';
import { layout, typography } from '../../src/styles';

const filters = ['Todos', 'Populares', 'Recentes', 'Meus Posts'];

function formatDate(dateStr) {
  if (!dateStr) return 'Sem data';
  const diff = Math.floor((new Date() - new Date(dateStr)) / 86400000);
  return diff === 0 ? 'Hoje' : diff === 1 ? 'Ontem' : diff < 7 ? `${diff} dias atrás` : new Date(dateStr).toLocaleDateString('pt-BR');
}

export default function FeedScreen() {
  const { user } = useAuth();
  const { data: dbPosts, refetch, loading } = useSupabaseData('posts', { select: '*, profiles:user_id(name, avatar_url)', orderBy: { column: 'created_at', ascending: false }, mockData: [] });

  const [posts, setPosts] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('Todos');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasNotif, setHasNotif] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

  const { visible: tutorialVisible, steps: tutorialSteps, handleComplete, handleSkip } = useTutorial('feed', true);

  const handleRealtimeInsert = useCallback((newPost) => {
    setPosts(prev => {
      if (prev.some(p => p.id === newPost.id)) return prev;
      return [newPost, ...prev];
    });
  }, []);

  const handleRealtimeUpdate = useCallback((update) => {
    setPosts(prev => prev.map(p => p.id === update.id ? { ...p, likes: update.likes, comments: update.comments } : p));
  }, []);

  const handleRealtimeDelete = useCallback((postId) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
  }, []);

  useRealtimePosts(handleRealtimeInsert, handleRealtimeUpdate, handleRealtimeDelete);

  useEffect(() => {
    if (dbPosts) {
      setPosts(dbPosts.map(p => ({
        id: p.id,
        userId: p.user_id,
        user: { name: p.profiles?.name || 'Atleta', avatar: p.profiles?.avatar_url || null },
        content: p.content,
        image: p.image_url,
        createdAt: formatDate(p.created_at),
        likes: p.likes_count || 0,
        comments: p.comments_count || 0,
        isLiked: false
      })));
    }
  }, [dbPosts]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleLike = async (postId) => {
    if (!user) return;
    try {
      const { data: ext } = await supabase.from('post_likes').select('id').eq('post_id', postId).eq('user_id', user.id).single();
      if (ext) {
        await supabase.from('post_likes').delete().eq('id', ext.id);
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, isLiked: false, likes: Math.max(0, p.likes - 1) } : p));
      } else {
        await supabase.from('post_likes').insert({ post_id: postId, user_id: user.id });
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, isLiked: true, likes: p.likes + 1 } : p));
      }
    } catch (err) {
      if (__DEV__) console.error(err);
    }
  };

  const handleNewPost = async (postData) => {
    if (!user) return;
    try {
      const { data, error } = await supabase.from('posts').insert({ user_id: user.id, content: postData.content, image_url: postData.image }).select('*, profiles:user_id(name, avatar_url)').single();
      if (error) throw error;
      setPosts(prev => [{
        id: data.id,
        userId: data.user_id,
        user: { name: data.profiles?.name || 'Você', avatar: data.profiles?.avatar_url || null },
        content: data.content,
        image: data.image_url,
        createdAt: 'Agora',
        likes: 0,
        comments: 0,
        isLiked: false
      }, ...prev]);
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível publicar seu post: ' + err.message);
    }
  };

  const handleComment = async (postId, text) => {
    if (!user) return;
    try {
      const { error } = await supabase.from('post_comments').insert({ post_id: postId, user_id: user.id, content: text });
      if (error) throw error;
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: p.comments + 1 } : p));
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível enviar o comentário: ' + err.message);
    }
  };

  const filteredPosts = posts.filter(post => {
    if (selectedFilter === 'Populares') return post.likes > 5;
    if (selectedFilter === 'Meus Posts') return post.userId === user?.id;
    return true;
  });

  const showEmpty = !loading && filteredPosts.length === 0;

  return (
    <ErrorBoundary screenName="Feed">
    <View style={layout.screen}>
      <TutorialOverlay
        visible={tutorialVisible}
        steps={tutorialSteps}
        onComplete={handleComplete}
        onSkip={handleSkip}
      />
      <ScrollView contentContainerStyle={layout.scroll} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />} showsVerticalScrollIndicator={false}>
        <FeedHeader hasNotif={hasNotif} onNotificationsPress={() => { setHasNotif(false); setShowNotifications(true); }} />
        <FeedFilters filters={filters} selected={selectedFilter} onSelect={setSelectedFilter} />

        <ChallengesList userId={user?.id} />

        {loading ? (
          <View>
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </View>
        ) : showEmpty ? (
          <FeedEmptyState hasFilter={selectedFilter !== 'Todos'} />
        ) : (
          filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} onLike={handleLike} onComment={handleComment} currentUserId={user?.id} />
          ))
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => setShowCreatePost(true)} activeOpacity={0.8}>
        <Ionicons name="add" size={28} color={COLORS.background} />
      </TouchableOpacity>
      <CreatePostModal visible={showCreatePost} onClose={() => setShowCreatePost(false)} onSubmit={handleNewPost} userId={user?.id} />
      <NotificationModal visible={showNotifications} onClose={() => setShowNotifications(false)} />
    </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  notifBadge: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.error },
  filtersScroll: { marginLeft: -SPACING.xl, paddingLeft: SPACING.xl, marginBottom: SPACING.xl },
  filters: { flexDirection: 'row', gap: SPACING.sm },
  chip: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.full, borderWidth: 1, borderColor: COLORS.border },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipTextActive: typography.chipActive,
  fab: { position: 'absolute', bottom: 100, right: SPACING.xl, width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
});
