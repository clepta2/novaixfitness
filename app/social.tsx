
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/constants/colors';
import { SPACING } from '../src/constants/spacing';
import { layout, typography } from '../src/styles';
import { useAuth } from '../src/context/AuthContext';
import { useSupabaseData } from '../src/hooks';
import { useI18n } from '../src/i18n';
import { ErrorBoundary, ChallengesList, Leaderboard, CreatePostModal, NotificationModal, SocialHub, QuickSocialActions } from '../src/components';
import { StoryRing, FeedStoryViewer, StoryCreateModal, GymCheckIn, WorkoutGroups, SocialFeed } from '../src/components/social';
import { useSocialFeed } from '../src/hooks/useSocialFeed';
import { socialStyles } from '../src/styles/socialStyles';

export default function SocialScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useI18n();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  const [showStoryCreate, setShowStoryCreate] = useState(false);
  const [showGymCheckIn, setShowGymCheckIn] = useState(false);

  const feed = useSocialFeed(user, t);

  const { data: dbPosts, refetch, loading } = useSupabaseData('posts', {
    select: '*, profiles:user_id(name, avatar_url)',
    orderBy: { column: 'created_at', ascending: false },
    mockData: [],
  });

  useEffect(() => { feed.loadInitial(); }, [user?.id]);
  useEffect(() => { if (dbPosts) feed.setPostsFromDb(dbPosts); }, [dbPosts]);

  const onRefresh = useCallback(() => feed.onRefresh(refetch), [feed, refetch]);

  const handleQuickAction = (actionId: string) => {
    if (actionId === 'post') setShowCreatePost(true);
    else if (actionId === 'workout') router.push('/player');
    else if (actionId === 'invite') router.push('/(tabs)/perfil/links');
    else if (actionId === 'checkin') setShowGymCheckIn(true);
    else if (actionId === 'live') router.push('/live');
    else if (actionId === 'chat') router.push('/chat');
  };

  const handleViewStory = (storyGroup: any) => {
    const idx = feed.stories.findIndex(s => s.userId === storyGroup.userId);
    setSelectedStoryIndex(idx >= 0 ? idx : 0);
    setShowStoryViewer(true);
  };

  return (
    <ErrorBoundary screenName="SocialHub">
      <View style={layout.screen}>
        <View style={socialStyles.header}>
          <TouchableOpacity accessibilityLabel={t('common.back')} accessibilityRole="button" onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textTitle} />
          </TouchableOpacity>
          <Text style={typography.h2}>{t('social.community').toUpperCase()}</Text>
          <TouchableOpacity accessibilityLabel={t('profile.notifications')} accessibilityRole="button" style={socialStyles.notifBtn} onPress={() => setShowNotifications(true)}>
            <Ionicons name="notifications-outline" size={22} color={COLORS.textMuted} />
            {feed.unreadCount > 0 && <View style={socialStyles.notifDot} />}
          </TouchableOpacity>
        </View>
        <SocialHub badgeCounts={{ feed: 2, challenges: 1 }} refreshControl={<RefreshControl refreshing={feed.refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} colors={[COLORS.primary]} />}>
          {feed.stories.length > 0 && <StoryRing currentUserId={user?.id as string} onViewStory={handleViewStory} onAddStory={() => setShowStoryCreate(true)} />}
          <QuickSocialActions onPress={handleQuickAction} />
          <SocialFeed posts={feed.posts as any} loading={loading} userId={user?.id} onLike={feed.handleLike} onComment={feed.handleComment} />
          <WorkoutGroups currentUserId={user?.id} onSelectGroup={(g) => router.push({ pathname: '/(tabs)/group', params: { id: g.id } })} />
          <ChallengesList userId={user?.id} />
          <View style={{ marginTop: SPACING.lg }} />
          <Leaderboard userId={user?.id} />
        </SocialHub>
        <CreatePostModal visible={showCreatePost} onClose={() => setShowCreatePost(false)} onSubmit={feed.handleNewPost} userId={user?.id} />
        <NotificationModal visible={showNotifications} onClose={() => setShowNotifications(false)} />
        <GymCheckIn visible={showGymCheckIn} onClose={() => setShowGymCheckIn(false)} onCheckIn={({ gymName }) => feed.handleGymCheckIn(gymName)} recentCheckIns={feed.recentCheckIns} />
        <FeedStoryViewer visible={showStoryViewer} stories={feed.stories as any} initialIndex={selectedStoryIndex} onClose={() => setShowStoryViewer(false)} />
        <StoryCreateModal visible={showStoryCreate} onClose={() => { setShowStoryCreate(false); feed.loadInitial(); }} userId={user?.id} />
      </View>
    </ErrorBoundary>
  );
}
