// app/(tabs)/feed.tsx
// Tela de Comunidade/Feed - NOVAIX FITNESS

import { useState, useEffect, useMemo , useRef} from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, StyleSheet, Animated, Modal, Dimensions, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../../src/constants/spacing';
import { SHADOWS } from '../../src/constants/shadows';
import { PostCard, CreatePostModal, NotificationModal, ChallengesList, TutorialOverlay, ErrorBoundary, PostSkeleton, FeedEmptyState, FeedHeader, FeedFilters, StoryRing, FeedStoryViewer, StoryCreateModal, DailyCheckIn, Loading, ReelItem } from '../../src/components';
import ComposerCard from '../../src/components/feed/ComposerCard';
import ReelsBar from '../../src/components/feed/ReelsBar';
import DuelsSection from '../../src/components/feed/DuelsSection';
import { useTutorial } from '../../src/hooks/useTutorial';
import { useFeedData } from '../../src/hooks/useFeedData';
import { performCheckIn, getTodayCheckIn, getCheckInStreak } from '../../src/services/checkIn';
import { getActiveStories } from '../../src/services/stories';
import { useAuth } from '../../src/context/AuthContext';
import { useSecurity } from '../../src/hooks/useSecurity';
import { useI18n } from '../../src/i18n';
import { layout } from '../../src/styles';
import { useResponsive } from '../../src/hooks/useResponsive';
import { useReelsFeed } from '../../src/hooks/useReelsFeed';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function FeedScreen() {
  const { user, profile } = useAuth();
  const { t } = useI18n();
  const { fabSize, fabBottom, fabRight, isSmall } = useResponsive();
  const { visible: tutorialVisible, steps: tutorialSteps, handleComplete, handleSkip } = useTutorial('feed', true);
  const filters = [t('common.all'), t('social.popular'), t('social.recent'), t('social.minePosts')];
  const {
    loading, loadingMore, refreshing, onRefresh, loadMore, hasMore,
    selectedFilter, setSelectedFilter, showCreatePost, setShowCreatePost,
    hasNotif, setHasNotif, showNotifications, setShowNotifications,
    filteredPosts, showEmpty, handleLike, handleNewPost, handleComment,
  } = useFeedData();

  const [showCheckIn, setShowCheckIn] = useState(false);
  const [checkInStreak, setCheckInStreak] = useState(1);
  const [stories, setStories] = useState<any[]>([]);
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  const [showStoryCreate, setShowStoryCreate] = useState(false);
  const [activeReelIndex, setActiveReelIndex] = useState<number | null>(null);
  const [showReelsModal, setShowReelsModal] = useState(false);
  const { checkAndPerform, ACTIONS } = useSecurity();
  const { reels: feedReels } = useReelsFeed();
  const fabAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(fabAnim, { toValue: 1, friction: 5, delay: 500, useNativeDriver: true }).start();
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    checkDailyCheckIn();
    loadStories();
  }, [user?.id]);

  const checkDailyCheckIn = async () => {
    if (!user?.id || (global as any).hasShownCheckInThisSession) return;
    const existing = await getTodayCheckIn(user.id);
    if (!existing) {
      const streak = await getCheckInStreak(user.id);
      setCheckInStreak(streak + 1);
      setShowCheckIn(true);
      (global as any).hasShownCheckInThisSession = true;
    }
  };

  const loadStories = async () => {
    const data = await getActiveStories(user?.id) as any[];
    const grouped: Record<string, any[]> = {};
    data.forEach((s: any) => {
      if (!grouped[s.user_id]) grouped[s.user_id] = [];
      grouped[s.user_id].push(s);
    });
    setStories(Object.entries(grouped).map(([userId, userStories]) => ({
      userId, name: userStories[0]?.profiles?.name || 'User',
      avatar: userStories[0]?.profiles?.avatar_url || null,
      stories: userStories, seen: false,
    })));
  };

  const handleCheckInClaim = async () => {
    if (!user?.id) return;
    await checkAndPerform(ACTIONS.CHECK_IN, 'check_in', async () => {
      await performCheckIn(user!.id);
    }, t('social.errorCheckIn'));
  };

  const handleViewStory = (storyGroup: any) => {
    const idx = stories.findIndex(s => s.userId === storyGroup.userId);
    setSelectedStoryIndex(idx >= 0 ? idx : 0);
    setShowStoryViewer(true);
  };

  return (
    <ErrorBoundary screenName="Feed">
    <View style={layout.screen}>
      <TutorialOverlay visible={tutorialVisible} steps={tutorialSteps} onComplete={handleComplete} onSkip={handleSkip} onRestart={handleSkip} />
      <ScrollView
        contentContainerStyle={layout.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} colors={[COLORS.primary]} />}
        showsVerticalScrollIndicator={false}
        onScroll={(e) => {
          const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
          if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 200) loadMore();
        }}
        scrollEventThrottle={400}
      >
        <FeedHeader hasNotif={hasNotif} onNotificationsPress={() => { setHasNotif(false); setShowNotifications(true); }} />
        <FeedFilters filters={filters} selected={selectedFilter} onSelect={setSelectedFilter} />
        <ComposerCard userName={(user as any)?.name || profile?.name} onPhoto={() => setShowCreatePost(true)} onVideo={() => setShowCreatePost(true)} onCheckIn={() => setShowCheckIn(true)} />
        <StoryRing currentUserId={user?.id || ''} currentUserAvatar={profile?.avatar_url} currentUserName={profile?.name} onViewStory={handleViewStory} onAddStory={() => setShowStoryCreate(true)} />
        <ReelsBar reels={feedReels} onPressReel={(i) => { setActiveReelIndex(i); setShowReelsModal(true); }} />
        <DuelsSection />
        <ChallengesList userId={user?.id} />

        {loading ? (
          <View style={styles.loadingContainer}>
            <PostSkeleton /><PostSkeleton /><PostSkeleton />
          </View>
        ) : showEmpty ? (
          <FeedEmptyState title={t('library.noWorkouts')} message={selectedFilter !== t('common.all') ? t('library.noWorkoutsMessage') : t('social.feedEmpty')} />
        ) : (
          filteredPosts.map((post, index) => (
            <View key={post.id} style={[styles.postWrapper, { opacity: Math.min(1, 0.8 + index * 0.05) }]}>
              <PostCard post={post} onLike={handleLike} onComment={handleComment} currentUserId={user?.id} />
            </View>
          ))
        )}

        {loadingMore && <View style={styles.loadingMore}><Loading variant="dots" /></View>}
        {!hasMore && filteredPosts.length > 0 && (
          <View style={styles.endOfFeed}>
            <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
            <Text style={styles.endOfFeedText}>{t('social.allPostsSeen')}</Text>
          </View>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      <Animated.View style={[styles.fab, { width: fabSize, height: fabSize, borderRadius: fabSize / 2, bottom: fabBottom, right: fabRight, transform: [{ scale: fabAnim }] }]}>
        <TouchableOpacity style={styles.fabInner} onPress={() => setShowCreatePost(true)} activeOpacity={0.8}>
          <Ionicons name="add" size={isSmall ? 24 : 28} color={COLORS.background} />
        </TouchableOpacity>
      </Animated.View>

      <CreatePostModal visible={showCreatePost} onClose={() => setShowCreatePost(false)} onSubmit={handleNewPost} userId={user?.id} />
      <NotificationModal visible={showNotifications} onClose={() => setShowNotifications(false)} />
      <DailyCheckIn visible={showCheckIn} streakDay={checkInStreak} xpEarned={0} onClose={() => setShowCheckIn(false)} onClaim={handleCheckInClaim} />
      <FeedStoryViewer visible={showStoryViewer} stories={stories} initialIndex={selectedStoryIndex} onClose={() => setShowStoryViewer(false)} />
      <StoryCreateModal visible={showStoryCreate} onClose={() => { setShowStoryCreate(false); loadStories(); }} userId={user?.id} />

      {showReelsModal && activeReelIndex !== null && (
        <Modal visible={showReelsModal} animationType="slide" transparent>
          <View style={styles.reelsModalContainer}>
            <FlatList
              data={feedReels} keyExtractor={(item) => item.id}
              initialScrollIndex={activeReelIndex}
              getItemLayout={(data, index) => ({ length: SCREEN_HEIGHT, offset: SCREEN_HEIGHT * index, index })}
              pagingEnabled showsVerticalScrollIndicator={false}
              onMomentumScrollEnd={(e) => setActiveReelIndex(Math.round(e.nativeEvent.contentOffset.y / SCREEN_HEIGHT))}
              renderItem={({ item, index }) => (
                <ReelItem item={item} isPlaying={index === activeReelIndex} onClose={() => { setShowReelsModal(false); setActiveReelIndex(null); }} screenHeight={SCREEN_HEIGHT} />
              )}
            />
          </View>
        </Modal>
      )}
    </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  fab: { position: 'absolute', backgroundColor: COLORS.primary, ...SHADOWS.lg },
  fabInner: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingContainer: { gap: SPACING.md },
  loadingMore: { paddingVertical: SPACING.xl, alignItems: 'center' },
  postWrapper: { marginBottom: SPACING.md },
  endOfFeed: { alignItems: 'center', paddingVertical: SPACING.xl, gap: SPACING.sm },
  endOfFeedText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: COLORS.textMuted },
  reelsModalContainer: { flex: 1, backgroundColor: 'black', position: 'relative' },
});
