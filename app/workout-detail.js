// app/workout-detail.js
// Detalhe do Treino - NOVAIX FITNESS

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet, ActivityIndicator, Animated } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../src/constants/spacing';
import { Badge, ExerciseAccordion, WorkoutInfo, VideoPreview, MoreOptionsModal, RatingModal, WorkoutQuickStats, WorkoutHeaderDetail, ErrorBoundary } from '../src/components';
import BottomTabBar from '../src/components/ui/BottomTabBar';
import { supabase } from '../src/config/supabase';
import { useAuth } from '../src/context/AuthContext';
import { shareWorkout } from '../src/services/share';
import { cacheWorkoutDetail, getCachedWorkoutDetail, isWorkoutCached } from '../src/services/offline';
import { queueFavoriteAction } from '../src/services/offlineManager';
import useNetworkStatus from '../src/hooks/useNetworkStatus';
import { layout, typography } from '../src/styles';
import { fallbackWorkout } from '../src/data/workouts';
import { styles } from '../src/styles/workoutDetailStyles';

const CATEGORY_COLORS = {
  'Musculação': COLORS.primary, 'HIIT': COLORS.error, 'Cardio': COLORS.secondary,
  'Yoga': COLORS.info, 'Calistenia': COLORS.success, 'Natação': COLORS.info,
};

function LoadingSkeleton() {
  return (
    <View style={[layout.screen, styles.loadingContainer]}>
      <View style={styles.skeletonHeader} />
      <View style={[styles.skeletonLine, { width: '80%' }]} />
      <View style={[styles.skeletonLine, { width: '60%' }]} />
      <View style={styles.skeletonGrid}>
        {[1, 2, 3, 4].map(i => <View key={i} style={styles.skeletonCard} />)}
      </View>
      <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: SPACING.xl }} />
    </View>
  );
}

export default function WorkoutDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const [workout, setWorkout] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [showVideo, setShowVideo] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const { isOnline } = useNetworkStatus();

  useEffect(() => {
    if (!id) return;
    supabase.from('workouts').select('*').eq('id', id).single()
      .then(({ data, error }) => {
        const w = error || !data ? null : data;
        if (w) { setWorkout(w); cacheWorkoutDetail(w); }
        else return getCachedWorkoutDetail(id);
      })
      .then(cached => { if (cached && !workout) setWorkout(cached); })
      .catch(() => getCachedWorkoutDetail(id).then(cached => cached && setWorkout(cached)))
      .finally(() => setLoading(false));
    isWorkoutCached(id).then(setIsOffline);
  }, [id]);

  useEffect(() => {
    if (!user?.id) return;
    supabase.from('profiles').select('subscription_status').eq('id', user.id).single()
      .then(({ data }) => { if (data) setProfile(data); });
    if (id) {
      supabase.from('favorites').select('id').eq('user_id', user.id).eq('workout_id', id).single()
        .then(({ data }) => setIsFavorite(!!data));
    }
  }, [user?.id, id]);

  const toggleFavorite = useCallback(async () => {
    if (!user?.id || !id) return;
    try {
      if (isOnline) {
        if (isFavorite) {
          await supabase.from('favorites').delete().eq('user_id', user.id).eq('workout_id', id);
        } else {
          await supabase.from('favorites').insert({ user_id: user.id, workout_id: id });
        }
      } else {
        await queueFavoriteAction(user.id, id, isFavorite ? 'remove' : 'add');
      }
      setIsFavorite(!isFavorite);
    } catch { Alert.alert('Erro', 'Falha ao atualizar favorito'); }
  }, [user?.id, id, isFavorite, isOnline]);

  const handleOption = useCallback(async (opt) => {
    setShowOptions(false);
    if (opt === 'share') {
      shareWorkout(workout);
    }
    if (opt === 'rate') return setShowRating(true);
    if (opt === 'save') {
      await cacheWorkoutDetail(workout);
      setIsOffline(true);
      Alert.alert('Salvo', 'Treino disponível offline');
    }
  }, [workout]);

  const handleStart = useCallback(async () => {
    if (!user?.id || !id) return;
    const isSubscribed = profile?.subscription_status === 'premium' || profile?.subscription_status === 'active';
    const isLocked = (workout?.is_premium || false) && !isSubscribed;

    if (isLocked) {
      Alert.alert('Conteúdo Premium 🔒', 'Este treino é exclusivo para assinantes Premium.', [{ text: 'Mais tarde', style: 'cancel' }, { text: 'Ver Planos', onPress: () => router.push('/paywall') }]);
      return;
    }

    try {
      const { data } = await supabase.from('user_workouts').insert({ user_id: user.id, workout_id: id, completed: false, duration: workout?.duration_minutes || workout?.duration || 0 }).select('id').single();
      router.push({ pathname: '/player', params: { id, user_workout_id: data?.id } });
    } catch { router.push({ pathname: '/player', params: { id } }); }
  }, [user?.id, id, router, workout, profile]);

  const handleRating = useCallback(async ({ rating, comment }) => {
    if (!user?.id || !id) return;
    try {
      await supabase.from('user_workouts').upsert({ user_id: user.id, workout_id: id, rating, notes: comment }, { onConflict: 'user_id,workout_id' });
      Alert.alert('Obrigado!', 'Avaliação registrada.');
    } catch { Alert.alert('Erro', 'Falha ao salvar.'); }
  }, [user?.id, id]);

  const exercises = workout?.exercises || [];
  const totalSets = useMemo(() => exercises.reduce((sum, ex) => sum + (ex.sets || 0), 0), [exercises]);

  if (loading) return <LoadingSkeleton />;

  return (
    <ErrorBoundary screenName="WorkoutDetail">
    <View style={layout.screen}>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: 180 }]} showsVerticalScrollIndicator={false}>
        <WorkoutHeaderDetail
          workout={workout}
          isFavorite={isFavorite}
          isOffline={isOffline}
          onBack={() => router.back()}
          onFavorite={toggleFavorite}
          onOptions={() => setShowOptions(true)}
        />

        <VideoPreview videoId={workout?.video_id} showVideo={showVideo} onToggle={() => setShowVideo(!showVideo)} />

        <WorkoutQuickStats
          duration={workout?.duration_minutes || workout?.duration || 45}
          calories={Math.round((workout?.duration_minutes || workout?.duration || 45) * 8)}
          exerciseCount={exercises.length}
          totalSets={totalSets}
        />

        <View style={styles.exercisesSection}>
          <View style={styles.exercisesHeader}>
            <Text style={styles.exercisesTitle}>EXERCÍCIOS ({exercises.length})</Text>
            <Text style={styles.exercisesSubtitle}>{totalSets} séries no total</Text>
          </View>

          {exercises.map((ex, i) => (
            <ExerciseAccordion
              key={ex.id || ex.name}
              exercise={ex}
              index={i}
              isOpen={expanded === (ex.id || ex.name)}
              onToggle={() => setExpanded(expanded === (ex.id || ex.name) ? null : (ex.id || ex.name))}
            />
          ))}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.startBtn} activeOpacity={0.8} onPress={handleStart} accessibilityLabel="Iniciar treino" accessibilityRole="button">
          <Ionicons name="play" size={20} color={COLORS.background} />
          <Text style={styles.startText}>INICIAR TREINO</Text>
        </TouchableOpacity>
      </View>

      <MoreOptionsModal visible={showOptions} onSelect={handleOption} onClose={() => setShowOptions(false)} />
      <RatingModal visible={showRating} onClose={() => setShowRating(false)} onSubmit={handleRating} />
      <BottomTabBar activeTab="library" />
    </View>
    </ErrorBoundary>
  );
}
