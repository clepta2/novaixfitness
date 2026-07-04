
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, TouchableOpacity, RefreshControl, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/constants/colors';
import { SPACING } from '../src/constants/spacing';
import { layout, typography } from '../src/styles';
import { useAuth } from '../src/context/AuthContext';
import { useSupabaseData } from '../src/hooks';
import { useRealtimePosts } from '../src/hooks/useRealtimePosts';
import { useSecurity } from '../src/hooks/useSecurity';
import { useI18n } from '../src/i18n';
import { useResponsive } from '../src/hooks/useResponsive';
import { supabase } from '../src/config/supabase';
import { getUnreadCount } from '../src/services/notifications';
import { useServiceCall } from '../src/hooks/useServiceCall';
import { ErrorBoundary, ChallengesList, Leaderboard, CreatePostModal, NotificationModal, SocialHub, QuickSocialActions } from '../src/components';
import { StoryRing, FeedStoryViewer, StoryCreateModal, GymCheckIn, WorkoutGroups, SocialFeed } from '../src/components/social';
import { getActiveStories } from '../src/services/stories';
import { checkIn, getRecentCheckIns } from '../src/services/gymCheckIn';
import { formatRelativeDate } from '../src/helpers/dates';
export default function SocialScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useI18n();
  const { call: serviceCall } = useServiceCall();
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const processingLikes = useRef(new Set());
  const [stories, setStories] = useState([]);
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  const [showStoryCreate, setShowStoryCreate] = useState(false);
  const [showGymCheckIn, setShowGymCheckIn] = useState(false);
  const [recentCheckIns, setRecentCheckIns] = useState([]);
  const { checkAndPerform, log, ACTIONS } = useSecurity();
  const { data: dbPosts, refetch, loading } = useSupabaseData('posts', {
    select: '*, profiles:user_id(name, avatar_url)',
    orderBy: { column: 'created_at', ascending: false },
    mockData: [],
  });

  const loadUserLikes = useCallback(async () => {
    if (!user?.id) return;
    try {
      const { data } = await supabase.from('post_likes').select('post_id').eq('user_id', user.id);
      if (data) {
        const likedIds = new Set(data.map((l: { post_id: string }) => l.post_id));
        setPosts(prev => prev.map(p => ({ ...p, isLiked: likedIds.has(p.id) })));
      }
    } catch (err) {
      if (__DEV__) console.error('Erro ao carregar likes:', err);
    }
  }, [user?.id]);

  const loadStories = useCallback(async () => {
    if (!user?.id) return;
    try {
      const data = await getActiveStories(user.id) as any[];
      const grouped = data.reduce((acc: any, s: any) => {
        if (!acc[s.user_id]) acc[s.user_id] = [];
        acc[s.user_id].push(s);
        return acc;
      }, {});
      setStories(Object.entries(grouped).map(([userId, userStories]: [string, any]) => ({
        userId, name: userStories[0].profiles?.name || 'User', avatar: userStories[0].profiles?.avatar_url || null, stories: userStories, seen: false,
      })));
    } catch (err) {
      if (__DEV__) console.error('Erro ao carregar stories:', err);
    }
  }, [user?.id]);

  const loadCheckIns = useCallback(async () => {
    try {
      const data = await getRecentCheckIns(5);
      setRecentCheckIns(data);
    } catch (err) {
      if (__DEV__) console.error('Erro ao carregar check-ins:', err);
    }
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    serviceCall(() => getUnreadCount(user.id)).then(r => { if (r.ok) setUnreadCount(r.data); }).catch(() => {});
    loadStories();
    loadCheckIns();
  }, [user?.id, loadStories, loadCheckIns, serviceCall]);
  useEffect(() => {
    if (dbPosts) {
      setPosts(dbPosts.map(p => ({
        id: p.id, userId: p.user_id,
        user: { name: p.profiles?.name || 'Atleta', avatar: p.profiles?.avatar_url || null },
        content: p.content, image: p.image_url, postType: p.post_type || 'text', secondImage: p.second_image_url,
        createdAt: formatRelativeDate(p.created_at), likes: p.likes_count || 0, comments: p.comments_count || 0, isLiked: false,
      })));
      loadUserLikes();
    }
  }, [dbPosts, loadUserLikes]);
  const onInsert = useCallback((p) => {
    setPosts(prev => prev.some(x => x.id === p.id) ? prev : [p, ...prev]);
    loadUserLikes();
  }, [loadUserLikes]);
  const onUpdate = useCallback((u) => setPosts(prev => prev.map(p => p.id === u.id ? { ...p, likes: u.likes, comments: u.comments } : p)), []);
  const onDelete = useCallback((id) => setPosts(prev => prev.filter(p => p.id !== id)), []);
  useRealtimePosts(onInsert, onUpdate, onDelete);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
      if (user?.id) {
        const result = await serviceCall(() => getUnreadCount(user.id));
        if (result.ok) setUnreadCount(result.data);
      }
      await loadStories();
      await loadCheckIns();
      await loadUserLikes();
    } finally {
      setRefreshing(false);
    }
  }, [refetch, user?.id, loadStories, loadCheckIns, loadUserLikes]);
  const handleLike = async (postId) => {
    if (!user || processingLikes.current.has(postId)) return;
    processingLikes.current.add(postId);
    const post = posts.find(p => p.id === postId);
    const wasLiked = post?.isLiked || false;
    const prevLikes = post?.likes || 0;
    try {
      await checkAndPerform(ACTIONS.REACTION_MADE, 'reaction', async () => {
        const { data: ext } = await supabase.from('post_likes').select('id').eq('post_id', postId).eq('user_id', user.id).single();
        if (ext) {
          await supabase.from('post_likes').delete().eq('id', ext.id);
          setPosts(prev => prev.map(p => p.id === postId ? { ...p, isLiked: false, likes: Math.max(0, p.likes - 1) } : p));
        } else {
          await supabase.from('post_likes').insert({ post_id: postId, user_id: user.id });
          setPosts(prev => prev.map(p => p.id === postId ? { ...p, isLiked: true, likes: p.likes + 1 } : p));
        }
      });
    } catch (err) {
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, isLiked: wasLiked, likes: prevLikes } : p));
      if (__DEV__) console.error('Erro ao curtir:', err);
    } finally {
      processingLikes.current.delete(postId);
    }
  };
  const handleComment = async (postId, text) => {
    if (!user || !text?.trim()) return;
    const prevComments = posts.find(p => p.id === postId)?.comments || 0;
    try {
      await checkAndPerform(ACTIONS.COMMENT_MADE, 'comment', async () => {
        const { error } = await supabase.from('post_comments').insert({ post_id: postId, user_id: user.id, content: text });
        if (error) throw error;
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: p.comments + 1 } : p));
      }, t('social.errorComment'));
    } catch (err) {
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: prevComments } : p));
      if (__DEV__) console.error('Erro ao comentar:', err);
    }
  };
  const handleNewPost = async (postData) => {
    if (!user) return;
    try {
      await checkAndPerform(ACTIONS.POST_CREATED, 'post', async () => {
        const { data, error } = await supabase.from('posts').insert({
          user_id: user.id, content: postData.content, image_url: postData.image,
          post_type: postData.postType || 'text', second_image_url: postData.secondImage || null, filter_applied: postData.filter || null,
        }).select('*, profiles:user_id(name, avatar_url)').single();
        if (error) throw error;
        setPosts(prev => [{
          id: data.id, userId: data.user_id, user: { name: data.profiles?.name || 'Você', avatar: data.profiles?.avatar_url || null },
          content: data.content, image: data.image_url, postType: data.post_type, secondImage: data.second_image_url,
          createdAt: t('social.justNow'), likes: 0, comments: 0, isLiked: false,
        }, ...prev]);
      }, t('social.errorPost'));
    } catch (err) {
      if (__DEV__) console.error('Erro ao criar post:', err);
    }
  };
  const handleQuickAction = (actionId) => {
    if (actionId === 'post') setShowCreatePost(true);
    else if (actionId === 'workout') router.push('/player');
    else if (actionId === 'invite') router.push('/(tabs)/perfil/links');
    else if (actionId === 'checkin') setShowGymCheckIn(true);
    else if (actionId === 'live') router.push('/live');
    else if (actionId === 'chat') router.push('/chat');
  };
  const handleGymCheckIn = async ({ gymName }) => {
    if (!user?.id) return;
    await checkAndPerform(ACTIONS.CHECK_IN, 'check_in', async () => {
      await checkIn(user.id, gymName);
      await loadCheckIns();
    }, t('social.errorCheckIn'));
  };
  const handleViewStory = (storyGroup) => {
    const idx = stories.findIndex(s => s.userId === storyGroup.userId);
    setSelectedStoryIndex(idx >= 0 ? idx : 0);
    setShowStoryViewer(true);
  };
  const handleSelectGroup = (group) => {
    router.push({ pathname: '/(tabs)/group', params: { id: group.id } });
  };
  return (
    <ErrorBoundary screenName="SocialHub">
      <View style={layout.screen}>
        <View style={styles.header}>
          <TouchableOpacity accessibilityLabel={t('common.back')} accessibilityRole="button" onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textTitle} />
          </TouchableOpacity>
          <Text style={typography.h2}>{t('social.community').toUpperCase()}</Text>
          <TouchableOpacity accessibilityLabel={t('profile.notifications')} accessibilityRole="button" style={styles.notifBtn} onPress={() => setShowNotifications(true)}>
            <Ionicons name="notifications-outline" size={22} color={COLORS.textMuted} />
            {unreadCount > 0 && <View style={styles.notifDot} />}
          </TouchableOpacity>
        </View>
        <SocialHub badgeCounts={{ feed: 2, challenges: 1 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} colors={[COLORS.primary]} />}>
          {stories.length > 0 && <StoryRing currentUserId={user?.id} onViewStory={handleViewStory} onAddStory={() => setShowStoryCreate(true)} />}
          <QuickSocialActions onPress={handleQuickAction} />
          <SocialFeed posts={posts} loading={loading} userId={user?.id} onLike={handleLike} onComment={handleComment} />
          <WorkoutGroups currentUserId={user?.id} onSelectGroup={handleSelectGroup} />
          <ChallengesList userId={user?.id} />
          <View style={{ marginTop: SPACING.lg }} />
          <Leaderboard userId={user?.id} />
        </SocialHub>
        <CreatePostModal visible={showCreatePost} onClose={() => setShowCreatePost(false)} onSubmit={handleNewPost} userId={user?.id} />
        <NotificationModal visible={showNotifications} onClose={() => setShowNotifications(false)} />
        <GymCheckIn visible={showGymCheckIn} onClose={() => setShowGymCheckIn(false)} onCheckIn={handleGymCheckIn} recentCheckIns={recentCheckIns} />
        <FeedStoryViewer visible={showStoryViewer} stories={stories} initialIndex={selectedStoryIndex} onClose={() => setShowStoryViewer(false)} />
        <StoryCreateModal visible={showStoryCreate} onClose={() => { setShowStoryCreate(false); loadStories(); }} userId={user?.id} />
      </View>
    </ErrorBoundary>
  );
}
const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.lg, paddingTop: SPACING.xl, paddingBottom: SPACING.md },
  notifBtn: { position: 'relative', padding: SPACING.xs },
  notifDot: { position: 'absolute', top: 4, right: 4, width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.error },
});
