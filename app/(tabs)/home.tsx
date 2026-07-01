import { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, RefreshControl, Animated, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/constants/colors';
import { DailyWorkoutCard, TutorialOverlay, ErrorBoundary, HomeHeader, HomeSkeleton, CategoryGrid, ContextualCard, RecentActivity, BodySummary, DailyCheckIn, CommonOfflineBanner } from '../../src/components';
import { useAuth } from '../../src/context/AuthContext';
import { supabase } from '../../src/config/supabase';
import { useTutorial } from '../../src/hooks/useTutorial';
import { calculateLevel } from '../../src/services/gamification';
import { useNetworkStatus } from '../../src/hooks/useNetworkStatus';
import { syncPendingActions, getPendingActionsCount } from '../../src/services/sync';
import { isWorkoutCached } from '../../src/services/offline';
import { performCheckIn, getTodayCheckIn, getCheckInStreak } from '../../src/services/checkIn';
import { useStaggeredEntry } from '../../src/utils/animations';
import { layout } from '../../src/styles';
import { HOME_CATEGORIES } from '../../src/data/categories';
import { CONTEXT_CARDS, getTimeOfDay } from '../../src/data/contextCards';
import { useI18n } from '../../src/i18n';

interface ProfileData {
  subscription_status?: string;
  onboarding?: { level?: string; [key: string]: unknown };
  streak?: number;
  current_step?: string;
  [key: string]: unknown;
}

const fallbackDaily = { name: 'QUEIMA SUPERIORES', type: 'HIIT/CALISTENIA', videoId: '', timer: '00:30:15', is_premium: false };
const userLevelMap: Record<string, string> = { beginner: 'Iniciante', intermediate: 'Intermediário', advanced: 'Avançado' };

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [dailyWorkout, setDailyWorkout] = useState(fallbackDaily);
  const [pendingCount, setPendingCount] = useState(0);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [levelData, setLevelData] = useState<{ color: string; icon: string; level: number } | null>(null);
  const { isConnected } = useNetworkStatus();
  const [dailyOffline, setDailyOffline] = useState(false);
  const { visible: tutorialVisible, steps: tutorialSteps, handleComplete, handleSkip } = useTutorial('home', true);
  const [timeOfDay, setTimeOfDay] = useState(getTimeOfDay());
  const [recentWorkouts, setRecentWorkouts] = useState<{ id: string; name: string; category?: string; completed: boolean; completed_at: string; created_at: string; duration_minutes?: number }[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [initialLoading, setInitialLoading] = useState(true);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [checkInStreak, setCheckInStreak] = useState(1);

  const [anim0, anim1, anim2, anim3] = [0, 1, 2, 3].map(useStaggeredEntry);

  useEffect(() => {
    const interval = setInterval(() => setTimeOfDay(getTimeOfDay()), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    supabase.from('profiles').select('subscription_status, onboarding, streak').eq('id', user.id).single().then(({ data }) => {
      if (data) setProfile(data as ProfileData);
      if (user.id) {
        const level = calculateLevel(0);
        setLevelData({ color: COLORS.primary, icon: 'flash', level: level || 1 });
      }
    });
    checkDailyCheckIn();
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

  const handleCheckInClaim = async () => {
    if (!user?.id) return;
    await performCheckIn(user.id);
  };

  const isSubscribed = profile?.subscription_status === 'premium' || profile?.subscription_status === 'active';

  const fetchData = useCallback(async () => {
    try {
      const [{ data }, { data: recent }, { data: catData }] = await Promise.all([
        supabase.from('workouts').select('*').order('created_at', { ascending: false }).limit(5),
        user?.id ? supabase.from('user_workouts').select('*, workouts(title, category, duration_minutes)').eq('user_id', user.id).order('completed_at', { ascending: false }).limit(3) : { data: [] },
        supabase.from('workouts').select('category'),
      ]);
      const wData = data || [];
      let sorted = [...wData];
      const currentLevel = userLevelMap[profile?.onboarding?.level || ''];
      if (currentLevel) sorted.sort((a: Record<string, unknown>, b: Record<string, unknown>) => (a.level === currentLevel ? -1 : b.level === currentLevel ? 1 : 0));
      if (sorted.length > 0) {
        const dw = sorted[0] as Record<string, unknown>;
        const daily = { id: dw.id as string, name: (dw.title || dw.name) as string, type: (dw.category || 'Treino') as string, videoId: (dw.video_id || 'dQw4w9WgXcQ') as string, timer: `00:${String((dw.duration_minutes || dw.duration || 30) as number).padStart(2, '0')}:00`, is_premium: (dw.is_premium || false) as boolean };
        setDailyWorkout(daily);
        isWorkoutCached(dw.id as string).then(setDailyOffline);
      }
      if (recent && Array.isArray(recent) && recent.length > 0) setRecentWorkouts(recent.map((w: Record<string, unknown>) => ({ id: w.id as string, name: ((w.workouts as Record<string, unknown>)?.title || 'Treino') as string, category: (w.workouts as Record<string, unknown>)?.category as string, completed: w.completed as boolean, completed_at: w.completed_at as string, created_at: w.created_at as string, duration_minutes: (w.duration_minutes || (w.workouts as Record<string, unknown>)?.duration_minutes) as number })));
      if (catData) { const c: Record<string, number> = {}; (catData as Record<string, unknown>[]).forEach((w: Record<string, unknown>) => { const k = ((w.category as string) || 'outros').toLowerCase(); c[k] = (c[k] || 0) + 1; }); setCategoryCounts(c); }
      if (profile?.onboarding?.level) {
        const level = calculateLevel(0);
        setLevelData({ color: COLORS.primary, icon: 'flash', level: level || 1 });
      }
    } catch (err) {
      if (__DEV__) console.error('Erro ao carregar home:', err);
    } finally {
      setInitialLoading(false);
    }
  }, [user?.id, profile?.onboarding?.level]);

  useEffect(() => { if (!user || profile) fetchData(); }, [profile, user, fetchData]);

  const handleSync = async () => {
    if (isConnected && (await syncPendingActions()).synced > 0) {
      setPendingCount(0);
      fetchData();
    }
  };
  useEffect(() => { if (isConnected) getPendingActionsCount().then(setPendingCount); }, [isConnected]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);

  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Atleta';
  const showPremiumAlert = useCallback(() => Alert.alert(t('subscription.features.premium'), t('subscription.upgrade'), [{ text: t('common.cancel'), style: 'cancel' }, { text: t('subscription.plans'), onPress: () => router.push('/paywall') }]), [router, t]);

  return (
    <ErrorBoundary screenName="Home">
    <View style={layout.screen}>
      <TutorialOverlay visible={tutorialVisible} steps={tutorialSteps} onComplete={handleComplete} onSkip={handleSkip} onRestart={handleSkip} />
      <CommonOfflineBanner visible={!isConnected} pendingCount={pendingCount} onSync={handleSync} />
      {initialLoading ? (
        <HomeSkeleton />
      ) : (
      <ScrollView contentContainerStyle={layout.scroll} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />} showsVerticalScrollIndicator={false}>

        <Animated.View style={{ opacity: anim0.opacity, transform: [{ translateY: anim0.translateY }] }}>
          <HomeHeader userName={userName} levelData={levelData} streak={profile?.streak} onChatPress={() => router.push('/chat-coach')} onNotificationsPress={() => router.push('/notifications')} userAvatar={user?.user_metadata?.avatar_url} />
        </Animated.View>

        <Animated.View style={{ opacity: anim1.opacity, transform: [{ translateY: anim1.translateY }] }}>
          <ContextualCard card={CONTEXT_CARDS[timeOfDay as keyof typeof CONTEXT_CARDS]} onAction={() => router.push(CONTEXT_CARDS[timeOfDay as keyof typeof CONTEXT_CARDS].actionRoute)} streak={profile?.streak || 0} />
        </Animated.View>

        {timeOfDay === 'afternoon' && (
          <Animated.View style={{ opacity: anim2.opacity, transform: [{ translateY: anim2.translateY }] }}>
            <DailyWorkoutCard workout={dailyWorkout} onStart={() => dailyWorkout.is_premium && !isSubscribed ? showPremiumAlert() : router.push('/player-list')} isOfflineCached={dailyOffline} />
          </Animated.View>
        )}

        {recentWorkouts.length > 0 && (
          <RecentActivity workouts={recentWorkouts} onPress={() => router.push('/player-list')} />
        )}

        <Animated.View style={{ opacity: anim2.opacity, transform: [{ translateY: anim2.translateY }] }}>
          <CategoryGrid categories={HOME_CATEGORIES} categoryCounts={categoryCounts} onPress={(cat: { category: string }) => router.push({ pathname: '/library', params: { category: cat.category } })} />
        </Animated.View>

        <Animated.View style={{ opacity: anim3.opacity, transform: [{ translateY: anim3.translateY }] }}>
          <BodySummary userId={user?.id} />
        </Animated.View>

        <View style={{ height: 100 }} />
      </ScrollView>
      )}
      <DailyCheckIn visible={showCheckIn} streakDay={checkInStreak} xpEarned={0} onClose={() => setShowCheckIn(false)} onClaim={handleCheckInClaim} />
    </View>
    </ErrorBoundary>
  );
}
