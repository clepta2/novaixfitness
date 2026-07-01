import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, RefreshControl, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../src/constants/spacing';
import { layout, typography } from '../src/styles';
import { useAuth } from '../src/context/AuthContext';
import { useSupabaseData } from '../src/hooks';
import { useRealtimePosts } from '../src/hooks/useRealtimePosts';
import { supabase } from '../src/config/supabase';
import { getUnreadCount } from '../src/services/notifications';
import { ErrorBoundary, PostCard, ChallengesList, Leaderboard, CreatePostModal, NotificationModal, SocialHub, QuickSocialActions } from '../src/components';
import { PostSkeleton, FeedEmptyState } from '../src/components/social/FeedSkeleton';
import { formatRelativeDate } from '../src/helpers/dates';

export default function SocialScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const { data: dbPosts, refetch, loading } = useSupabaseData('posts', {
    select: '*, profiles:user_id(name, avatar_url)',
    orderBy: { column: 'created_at', ascending: false },
    mockData: [],
  });

  useEffect(() => {
    if (!user?.id) return;
    getUnreadCount(user.id).then(setUnreadCount).catch(() => {});
  }, [user?.id]);

  useEffect(() => {
    if (dbPosts) {
      setPosts(dbPosts.map(p => ({
        id: p.id, userId: p.user_id,
        user: { name: p.profiles?.name || 'Atleta', avatar: p.profiles?.avatar_url || null },
        content: p.content, image: p.image_url,         createdAt: formatRelativeDate(p.created_at),
        likes: p.likes_count || 0, comments: p.comments_count || 0, isLiked: false,
      })));
    }
  }, [dbPosts]);

  const onInsert = useCallback((p) => setPosts(prev => prev.some(x => x.id === p.id) ? prev : [p, ...prev]), []);
  const onUpdate = useCallback((u) => setPosts(prev => prev.map(p => p.id === u.id ? { ...p, likes: u.likes, comments: u.comments } : p)), []);
  const onDelete = useCallback((id) => setPosts(prev => prev.filter(p => p.id !== id)), []);
  useRealtimePosts(onInsert, onUpdate, onDelete);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    if (user?.id) {
      getUnreadCount(user.id).then(setUnreadCount).catch(() => {});
    }
    setRefreshing(false);
  }, [refetch, user?.id]);

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
    } catch (err) { if (__DEV__) console.error(err); }
  };

  const handleComment = async (postId, text) => {
    if (!user) return;
    try {
      const { error } = await supabase.from('post_comments').insert({ post_id: postId, user_id: user.id, content: text });
      if (error) throw error;
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: p.comments + 1 } : p));
    } catch (err) { if (__DEV__) console.error(err); }
  };

  const handleNewPost = async (postData) => {
    if (!user) return;
    try {
      const { data, error } = await supabase.from('posts').insert({
        user_id: user.id, content: postData.content, image_url: postData.image,
      }).select('*, profiles:user_id(name, avatar_url)').single();
      if (error) throw error;
      setPosts(prev => [{
        id: data.id, userId: data.user_id,
        user: { name: data.profiles?.name || 'Você', avatar: data.profiles?.avatar_url || null },
        content: data.content, image: data.image_url, createdAt: 'Agora', likes: 0, comments: 0, isLiked: false,
      }, ...prev]);
    } catch (err) { if (__DEV__) console.error(err); }
  };

  const handleQuickAction = (actionId) => {
    if (actionId === 'post') setShowCreatePost(true);
    else if (actionId === 'workout') router.push('/player');
    else if (actionId === 'invite') router.push('/(tabs)/perfil/links');
  };

  const renderFeed = () => {
    if (loading) return <View>{[1, 2, 3].map(i => <PostSkeleton key={i} />)}</View>;
    if (posts.length === 0) return <FeedEmptyState hasFilter={false} />;
    return posts.map(p => <PostCard key={p.id} post={p} onLike={handleLike} onComment={handleComment} currentUserId={user?.id} />);
  };

  return (
    <ErrorBoundary screenName="SocialHub">
      <View style={layout.screen}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Voltar" accessibilityRole="button">
            <Ionicons name="arrow-back" size={24} color={COLORS.textTitle} />
          </TouchableOpacity>
          <Text style={typography.h2}>COMUNIDADE</Text>
          <TouchableOpacity style={styles.notifBtn} onPress={() => setShowNotifications(true)} accessibilityLabel="Notificações">
            <Ionicons name="notifications-outline" size={22} color={COLORS.textMuted} />
            {unreadCount > 0 && <View style={styles.notifDot} />}
          </TouchableOpacity>
        </View>
        <SocialHub badgeCounts={{ feed: 2, challenges: 1 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} colors={[COLORS.primary]} />}>
          <QuickSocialActions onPress={handleQuickAction} />
          <View style={{ marginTop: SPACING.lg }} />
          {renderFeed()}
          <View style={{ marginTop: SPACING.lg }} />
          <ChallengesList userId={user?.id} />
          <View style={{ marginTop: SPACING.lg }} />
          <Leaderboard userId={user?.id} />
        </SocialHub>
        <CreatePostModal visible={showCreatePost} onClose={() => setShowCreatePost(false)} onSubmit={handleNewPost} userId={user?.id} />
        <NotificationModal visible={showNotifications} onClose={() => setShowNotifications(false)} />
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.lg, paddingTop: SPACING.xl, paddingBottom: SPACING.md },
  notifBtn: { position: 'relative', padding: SPACING.xs },
  notifDot: { position: 'absolute', top: 4, right: 4, width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.error },
});
