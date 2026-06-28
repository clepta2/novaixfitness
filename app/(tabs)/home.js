// app/(tabs)/home.js
// Tela Principal - Home - NOVAIX FITNESS

import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, Animated, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../src/constants/colors';
import { SPACING, ICON_SIZES } from '../../src/constants/spacing';
import { DailyWorkoutCard, OfflineBanner, TutorialOverlay, ErrorBoundary } from '../../src/components';
import { useAuth } from '../../src/context/AuthContext';
import { supabase } from '../../src/config/supabase';
import { useTutorial } from '../../src/hooks/useTutorial';
import { getGamificationData } from '../../src/services/gamification';
import { useNetworkStatus } from '../../src/hooks/useNetworkStatus';
import { syncPendingActions, getPendingActionsCount } from '../../src/services/sync';
import { isWorkoutCached } from '../../src/services/offline';
import { cacheDailyWorkout, getCachedDailyWorkout, cacheLibrary, getCachedLibrary } from '../../src/services/offlineManager';
import { useStaggeredEntry } from '../../src/utils/animations';
import { layout, typography } from '../../src/styles';
import { scale } from '../../src/utils/responsive';
import { HOME_CATEGORIES } from '../../src/data/categories';
import { CONTEXT_CARDS, getTimeOfDay } from '../../src/data/contextCards';
import ContextualCard from '../../src/components/home/ContextualCard';
import RecentActivity from '../../src/components/home/RecentActivity';
import { styles } from '../../src/styles/homeStyles';

const fallbackDaily = { name: 'QUEIMA SUPERIORES', type: 'HIIT/CALISTENIA', videoId: '', timer: '00:30:15', is_premium: false };
const userLevelMap = { beginner: 'Iniciante', intermediate: 'Intermediário', advanced: 'Avançado' };

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [dailyWorkout, setDailyWorkout] = useState(fallbackDaily);
  const [pendingCount, setPendingCount] = useState(0);
  const [profile, setProfile] = useState(null);
  const [levelData, setLevelData] = useState(null);
  const { isConnected } = useNetworkStatus();
  const [dailyOffline, setDailyOffline] = useState(false);
  const { visible: tutorialVisible, steps: tutorialSteps, handleComplete, handleSkip } = useTutorial('home', true);
  const [timeOfDay, setTimeOfDay] = useState(getTimeOfDay());
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({});

  const [anim0, anim1, anim2] = [0, 1, 2].map(useStaggeredEntry);

  useEffect(() => {
    const interval = setInterval(() => setTimeOfDay(getTimeOfDay()), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    supabase.from('profiles').select('subscription_status, onboarding, streak').eq('id', user.id).single().then(({ data }) => {
      if (data) setProfile(data);
      getGamificationData(user.id).then(gam => gam && setLevelData(gam.levelData));
    });
  }, [user?.id]);

  const userPhysicalLevel = userLevelMap[profile?.onboarding?.level];
  const isSubscribed = profile?.subscription_status === 'premium' || profile?.subscription_status === 'active';

  const fetchData = useCallback(async () => {
    try {
      const [{ data }, { data: recent }, { data: catData }, gamData] = await Promise.all([
        supabase.from('workouts').select('*').order('created_at', { ascending: false }).limit(5),
        user?.id ? supabase.from('user_workouts').select('*, workouts(title, category, duration_minutes)').eq('user_id', user.id).order('completed_at', { ascending: false }).limit(3) : { data: [] },
        supabase.from('workouts').select('category'),
        user?.id ? getGamificationData(user.id) : null,
      ]);
      const wData = data || [];
      if (wData.length > 0) await cacheLibrary(wData);
      let sorted = [...wData];
      if (userPhysicalLevel) sorted.sort((a, b) => (a.level === userPhysicalLevel ? -1 : b.level === userPhysicalLevel ? 1 : 0));
      if (sorted.length > 0) {
        const dw = sorted[0];
        const daily = { id: dw.id, name: dw.title || dw.name, type: dw.category || 'Treino', videoId: dw.video_id || 'dQw4w9WgXcQ', timer: `00:${(dw.duration_minutes || dw.duration || 30).toString().padStart(2, '0')}:00`, is_premium: dw.is_premium || false };
        setDailyWorkout(daily);
        cacheDailyWorkout(daily);
        isWorkoutCached(dw.id).then(setDailyOffline);
      }
      if (recent?.length > 0) setRecentWorkouts(recent.map(w => ({ id: w.id, name: w.workouts?.title || 'Treino', category: w.workouts?.category, completed: w.completed, completed_at: w.completed_at, created_at: w.created_at, duration_minutes: w.duration_minutes || w.workouts?.duration_minutes })));
      if (catData) { const c = {}; catData.forEach(w => { const k = (w.category || 'outros').toLowerCase(); c[k] = (c[k] || 0) + 1; }); setCategoryCounts(c); }
      if (gamData?.levelData) setLevelData(gamData.levelData);
    } catch (err) {
      if (__DEV__) console.error('Erro ao carregar home:', err);
      const cached = await getCachedDailyWorkout();
      if (cached) { setDailyWorkout(cached); setDailyOffline(true); }
    }
  }, [userPhysicalLevel, user?.id]);

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
  const showPremiumAlert = useCallback(() => Alert.alert('Conteúdo Premium 🔒', 'Este treino é exclusivo para assinantes Premium.', [{ text: 'Mais tarde', style: 'cancel' }, { text: 'Ver Planos', onPress: () => router.push('/paywall') }]), [router]);

  return (
    <ErrorBoundary screenName="Home">
    <View style={layout.screen}>
      <TutorialOverlay
        visible={tutorialVisible}
        steps={tutorialSteps}
        onComplete={handleComplete}
        onSkip={handleSkip}
      />
      <OfflineBanner visible={!isConnected} pendingCount={pendingCount} onSync={handleSync} />
      <ScrollView
        contentContainerStyle={layout.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[layout.header, { opacity: anim0.opacity, transform: [{ translateY: anim0.translateY }] }]}>
          <View>
            <Text style={typography.bodyMuted}>BEM-VINDO,</Text>
            <Text style={typography.h2}>{userName.toUpperCase()}!</Text>
          </View>
          <View style={styles.headerActions}>
            {levelData && (
              <View style={[styles.levelBadge, { backgroundColor: levelData.color + '20' }]}>
                <Ionicons name={levelData.icon} size={14} color={levelData.color} />
                <Text style={[styles.levelText, { color: levelData.color }]}>Nv.{levelData.level}</Text>
              </View>
            )}
            <View style={styles.streakBadge}>
              <Ionicons name="flame" size={16} color={COLORS.primary} />
              <Text style={styles.streakText}>{profile?.streak || 0}</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/chat-coach')} style={layout.headerBtn}>
              <Ionicons name="chatbubbles-outline" size={ICON_SIZES.md} color={COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/notifications')} style={layout.headerBtn}>
              <Ionicons name="notifications-outline" size={ICON_SIZES.md} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Animated.View style={{ opacity: anim1.opacity, transform: [{ translateY: anim1.translateY }] }}>
          <ContextualCard
            card={CONTEXT_CARDS[timeOfDay]}
            onAction={() => router.push(CONTEXT_CARDS[timeOfDay].actionRoute)}
            streak={profile?.streak || 0}
          />
        </Animated.View>

        {timeOfDay === 'afternoon' && (
          <Animated.View style={{ opacity: anim1.opacity, transform: [{ translateY: anim1.translateY }], marginTop: SPACING.md }}>
            <DailyWorkoutCard
              workout={dailyWorkout}
              onStart={() => dailyWorkout.is_premium && !isSubscribed ? showPremiumAlert() : router.push('/player-list')}
              isOfflineCached={dailyOffline}
            />
          </Animated.View>
        )}

        {recentWorkouts.length > 0 && (
          <RecentActivity workouts={recentWorkouts} onPress={() => router.push('/player-list')} />
        )}

        <Animated.View style={{ opacity: anim2.opacity, transform: [{ translateY: anim2.translateY }] }}>
          <Text style={[typography.label, { marginTop: SPACING.xl, marginBottom: SPACING.md }]}>CATEGORIAS DE TREINO</Text>
          <View style={styles.categoriesRow}>
            {HOME_CATEGORIES.map((cat) => (
              <TouchableOpacity key={cat.key} style={[styles.categoryCard, { backgroundColor: cat.bg }]} onPress={() => router.push({ pathname: '/library', params: { category: cat.category } })} activeOpacity={0.8}>
                <View style={styles.categoryIconWrap}><Ionicons name={cat.icon} size={scale(28)} color={cat.color} /></View>
                <Text style={[styles.categoryLabel, { color: cat.color }]}>{cat.label}</Text>
                <Text style={[styles.categoryCount, { color: cat.color }]}>{categoryCounts[cat.category] || 0} TREINOS</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
    </ErrorBoundary>
  );
}
