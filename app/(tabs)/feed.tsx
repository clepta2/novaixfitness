// app/(tabs)/feed.tsx
// Tela de Comunidade/Feed com melhorias visuais - NOVAIX FITNESS


            ;
import { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, StyleSheet, Animated, ActivityIndicator, Modal, Image, Dimensions, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';
import { COLORS } from '../../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../../src/constants/spacing';
import { SHADOWS } from '../../src/constants/shadows';
import { PostCard, CreatePostModal, NotificationModal, ChallengesList, TutorialOverlay, ErrorBoundary, PostSkeleton, FeedEmptyState, FeedHeader, FeedFilters, StoryRing, StoryViewer, StoryCreateModal, DailyCheckIn, Loading, Avatar, ActiveDuelCard, ReelItem } from '../../src/components';
import { useTutorial } from '../../src/hooks/useTutorial';
import { useFeedData } from '../../src/hooks/useFeedData';
import { performCheckIn, getTodayCheckIn, getCheckInStreak } from '../../src/services/checkIn';
import { getActiveStories } from '../../src/services/stories';
import { useAuth } from '../../src/context/AuthContext';
import { useSecurity } from '../../src/hooks/useSecurity';
import { useI18n } from '../../src/i18n';
import { layout, typography } from '../../src/styles';
import { useResponsive } from '../../src/hooks/useResponsive';
import { MOCK_REELS } from '../../src/data/reels';
import { MOCK_DUELS } from '../../src/data/duels';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function FeedScreen() {
  const { user, profile } = useAuth();
  const { t } = useI18n();
  const { fabSize, fabBottom, fabRight, isSmall } = useResponsive();
  const { visible: tutorialVisible, steps: tutorialSteps, handleComplete, handleSkip } = useTutorial('feed', true);

  const filters = [t('common.all'), t('social.popular'), t('social.recent'), t('social.minePosts')];

  const {
    loading, loadingMore, refreshing, onRefresh, loadMore, hasMore,
    selectedFilter, setSelectedFilter,
    showCreatePost, setShowCreatePost,
    hasNotif, setHasNotif,
    showNotifications, setShowNotifications, filteredPosts, showEmpty,
    handleLike, handleNewPost, handleComment,
  } = useFeedData();

  const [showCheckIn, setShowCheckIn] = useState(false);
  const [checkInStreak, setCheckInStreak] = useState(1);
  const [stories, setStories] = useState<{ userId: string; name: string; avatar: string | null; stories: Array<{ user_id: string; profiles?: { name: string; avatar_url: string | null } }>; seen: boolean }[]>([]);
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  const [showStoryCreate, setShowStoryCreate] = useState(false);
  const [activeReelIndex, setActiveReelIndex] = useState<number | null>(null);
  const [showReelsModal, setShowReelsModal] = useState(false);
  const { checkAndPerform, log, ACTIONS } = useSecurity();

  // Animacao do FAB
  const fabAnim = useMemo(() => new Animated.Value(0), []);
  useEffect(() => {
    Animated.spring(fabAnim, { toValue: 1, friction: 5, delay: 500, useNativeDriver: true }).start();
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    checkDailyCheckIn();
    loadStories();
  }, [user?.id]);

  const checkDailyCheckIn = async () => {
    if (!user?.id) return;
    if ((global as any).hasShownCheckInThisSession) return;
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
      userId,
      name: userStories[0]?.profiles?.name || 'User',
      avatar: userStories[0]?.profiles?.avatar_url || null,
      stories: userStories,
      seen: false,
    })));
  };

  const handleCheckInClaim = async () => {
    if (!user?.id) return;
    await checkAndPerform(ACTIONS.CHECK_IN, 'check_in', async () => {
      await performCheckIn(user!.id);
    }, t('social.errorCheckIn'));
  };

  const handleViewStory = (storyGroup: { userId: string; name: string; avatar: string | null; stories: Array<{ user_id: string; profiles?: { name: string; avatar_url: string | null } }>; seen: boolean }) => {
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
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
        onScroll={(e) => {
          const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
          if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 200) loadMore();
        }}
        scrollEventThrottle={400}
      >
        <FeedHeader hasNotif={hasNotif} onNotificationsPress={() => { setHasNotif(false); setShowNotifications(true); }} />
        <FeedFilters filters={filters} selected={selectedFilter} onSelect={setSelectedFilter} />

        {/* Composer box Facebook style */}
        <View style={styles.composerCard}>
          <View style={styles.composerRow}>
            <Avatar name={user?.name || 'User'} size="md" />
            <TouchableOpacity style={styles.composerInputMock} onPress={() => setShowCreatePost(true)}>
              <Text style={styles.composerInputText}>
                No que você está pensando, {user?.name?.split(' ')[0] || 'Atleta'}?
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.composerDivider} />
          <View style={styles.composerActions}>
            <TouchableOpacity style={styles.composerActionBtn} onPress={() => { setShowCreatePost(true); }}>
              <Ionicons name="image" size={18} color="#45BD62" />
              <Text style={styles.composerActionLabel}>Foto</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.composerActionBtn} onPress={() => { setShowCreatePost(true); }}>
              <Ionicons name="videocam" size={18} color="#F02849" />
              <Text style={styles.composerActionLabel}>Vídeo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.composerActionBtn} onPress={() => { setShowCheckIn(true); }}>
              <Ionicons name="flame" size={18} color="#F7B928" />
              <Text style={styles.composerActionLabel}>Check-in</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stories */}
        <StoryRing 
          currentUserId={user?.id || ''} 
          currentUserAvatar={profile?.avatar_url}
          currentUserName={profile?.name}
          onViewStory={handleViewStory} 
          onAddStory={() => setShowStoryCreate(true)} 
        />

        {/* Reels Bar */}
        <View style={styles.reelsSection}>
          <Text style={styles.reelsSectionTitle}>Reels / Vídeos Curtos</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.reelsScroll}>
            {MOCK_REELS.map((reel, index) => (
              <TouchableOpacity key={reel.id} style={styles.reelCard} onPress={() => { setActiveReelIndex(index); setShowReelsModal(true); }}>
                <Image source={{ uri: reel.thumbnail }} style={styles.reelThumbnail} />
                <View style={styles.reelOverlay}>
                  <Ionicons name="play" size={12} color="white" />
                  <Text style={styles.reelViews}>{reel.views}</Text>
                </View>
                <Text style={styles.reelTitle} numberOfLines={1}>{reel.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Duelos de Treino */}
        <View style={styles.duelsSection}>
          <Text style={styles.duelsSectionTitle}>Duelos de Treino Ativos</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.duelsScroll}>
            {MOCK_DUELS.map((duel) => (
              <View key={duel.id} style={{ width: 285 }}>
                <ActiveDuelCard duel={duel} />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Desafios */}
        <ChallengesList userId={user?.id} />

        {/* Conteudo */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </View>
        ) : showEmpty ? (
          <FeedEmptyState hasFilter={selectedFilter !== t('common.all')} />
        ) : (
          filteredPosts.map((post, index) => (
            <View key={post.id} style={[styles.postWrapper, { opacity: Math.min(1, 0.5 + index * 0.1) }]}>
              <PostCard post={post} onLike={handleLike} onComment={handleComment} currentUserId={user?.id} />
            </View>
          ))
        )}

        {/* Loading mais */}
        {loadingMore && (
          <View style={styles.loadingMore}>
            <Loading variant="dots" />
          </View>
        )}

        {/* Fim do feed */}
        {!hasMore && filteredPosts.length > 0 && (
          <View style={styles.endOfFeed}>
            <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
            <Text style={styles.endOfFeedText}>{t('social.allPostsSeen')}</Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB com animacao */}
      <Animated.View style={[styles.fab, { 
        width: fabSize, height: fabSize, borderRadius: fabSize / 2,
        bottom: fabBottom, right: fabRight,
        transform: [{ scale: fabAnim }],
      }]}>
        <TouchableOpacity 
          style={styles.fabInner}
          onPress={() => setShowCreatePost(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={isSmall ? 24 : 28} color={COLORS.background} />
        </TouchableOpacity>
      </Animated.View>

      <CreatePostModal visible={showCreatePost} onClose={() => setShowCreatePost(false)} onSubmit={handleNewPost} userId={user?.id} />
      <NotificationModal visible={showNotifications} onClose={() => setShowNotifications(false)} />
      <DailyCheckIn visible={showCheckIn} streakDay={checkInStreak} xpEarned={0} onClose={() => setShowCheckIn(false)} onClaim={handleCheckInClaim} />
      <StoryViewer visible={showStoryViewer} stories={stories} initialIndex={selectedStoryIndex} onClose={() => setShowStoryViewer(false)} />
      <StoryCreateModal visible={showStoryCreate} onClose={() => { setShowStoryCreate(false); loadStories(); }} userId={user?.id} />

      {/* Reels Modal Viewer */}
      {showReelsModal && activeReelIndex !== null && (
        <Modal visible={showReelsModal} animationType="slide" transparent>
          <View style={styles.reelsModalContainer}>
            <FlatList
              data={MOCK_REELS}
              keyExtractor={(item) => item.id}
              initialScrollIndex={activeReelIndex}
              getItemLayout={(data, index) => ({ length: SCREEN_HEIGHT, offset: SCREEN_HEIGHT * index, index })}
              pagingEnabled
              showsVerticalScrollIndicator={false}
              onMomentumScrollEnd={(e) => {
                const index = Math.round(e.nativeEvent.contentOffset.y / SCREEN_HEIGHT);
                setActiveReelIndex(index);
              }}
              renderItem={({ item, index }) => (
                <ReelItem
                  item={item}
                  isPlaying={index === activeReelIndex}
                  onClose={() => { setShowReelsModal(false); setActiveReelIndex(null); }}
                  screenHeight={SCREEN_HEIGHT}
                />
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
  // FAB
  fab: {
    position: 'absolute',
    backgroundColor: COLORS.primary,
    ...SHADOWS.lg,
  },
  fabInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Story create
  storyCreateBtn: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.xs,
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm,
    marginBottom: SPACING.md, backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border,
  },
  storyCreateText: {
    fontFamily: 'Inter_500Medium', fontSize: 13, color: COLORS.primary,
  },

  // Loading
  loadingContainer: { gap: SPACING.md },
  loadingMore: { paddingVertical: SPACING.xl, alignItems: 'center' },

  // Post wrapper com fade in
  postWrapper: { marginBottom: SPACING.md },

  // End of feed
  endOfFeed: {
    alignItems: 'center', paddingVertical: SPACING.xl, gap: SPACING.sm,
  },
  endOfFeedText: {
    fontFamily: 'Inter_500Medium', fontSize: 13, color: COLORS.textMuted,
  },

  // Composer box
  composerCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  composerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  composerInputMock: {
    flex: 1,
    height: 40,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.lg,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  composerInputText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: COLORS.textMuted,
  },
  composerDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  composerActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  composerActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.xs,
  },
  composerActionLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: COLORS.textDescription,
  },
  // Reels styles
  reelsSection: { marginBottom: SPACING.md },
  reelsSectionTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.textTitle, marginBottom: SPACING.sm },
  reelsScroll: { gap: SPACING.sm, paddingRight: SPACING.lg },
  reelCard: { width: 100, height: 160, borderRadius: BORDER_RADIUS.md, overflow: 'hidden', backgroundColor: COLORS.surfaceElevated, position: 'relative' },
  reelThumbnail: { width: '100%', height: '100%' },
  reelOverlay: { position: 'absolute', bottom: SPACING.xs, left: SPACING.xs, flexDirection: 'row', alignItems: 'center', gap: 2, backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 4, paddingVertical: 2, borderRadius: BORDER_RADIUS.sm },
  reelViews: { fontFamily: 'Inter_600SemiBold', fontSize: 9, color: 'white' },
  reelTitle: { position: 'absolute', top: SPACING.xs, left: SPACING.xs, right: SPACING.xs, fontFamily: 'Montserrat_700Bold', fontSize: 10, color: 'white', textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: { width: -1, height: 1 }, textShadowRadius: 10 },
  reelsModalContainer: { flex: 1, backgroundColor: 'black', position: 'relative' },
  reelsModalVideo: { width: '100%', height: '100%' },
  reelsCloseBtn: { position: 'absolute', top: 50, right: 20, width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  reelsSideActions: { position: 'absolute', right: 20, bottom: 100, gap: SPACING.lg, alignItems: 'center', zIndex: 10 },
  reelsSideBtn: { alignItems: 'center', gap: 4 },
  reelsSideLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 11, color: 'white', textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: { width: -1, height: 1 }, textShadowRadius: 5 },
  reelsBottomInfo: { position: 'absolute', left: 20, bottom: 40, right: 80, gap: SPACING.xs, zIndex: 10 },
  reelsUserRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  reelsUserName: { fontFamily: 'Montserrat_700Bold', fontSize: 13, color: 'white', textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: { width: -1, height: 1 }, textShadowRadius: 5 },
  reelsVideoTitle: { fontFamily: 'Inter_500Medium', fontSize: 12, color: 'white', textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: { width: -1, height: 1 }, textShadowRadius: 5 },
  reelsNavigation: { position: 'absolute', left: 20, bottom: 200, gap: SPACING.xl, zIndex: 10 },
  reelsNavBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  // Duels styles
  duelsSection: { marginBottom: SPACING.md },
  duelsSectionTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.textTitle, marginBottom: SPACING.sm },
  duelsScroll: { gap: SPACING.sm, paddingRight: SPACING.lg },
});
