// src/hooks/useHomeData.ts
// Hook de dados da home screen - NOVAIX FITNESS

import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../constants/colors';
import { tryIf } from '../utils/tryIf';
import { supabase } from '../config/supabase';
import { calculateLevel } from '../services/gamification';
import { isWorkoutCached } from '../services/offline';
import { performCheckIn, getTodayCheckIn, getCheckInStreak } from '../services/checkIn';
import { getTimeOfDay } from '../data/contextCards';

const CHECKIN_SHOWN_KEY = '@novaix:checkin_shown_date';

export interface ProfileData {
  subscription_status?: string;
  onboarding?: { level?: string; [key: string]: unknown };
  streak?: number;
  current_step?: string;
  [key: string]: unknown;
}

export interface DailyWorkout {
  id?: string;
  name: string;
  type: string;
  videoId: string;
  timer: string;
  is_premium: boolean;
}

export interface RecentWorkout {
  id: string;
  name: string;
  category?: string;
  completed: boolean;
  completed_at: string;
  created_at: string;
  duration_minutes?: number;
}

const fallbackDaily: DailyWorkout = { name: 'QUEIMA SUPERIORES', type: 'HIIT/CALISTENIA', videoId: '', timer: '00:30:15', is_premium: false };
const userLevelMap: Record<string, string> = { beginner: 'Iniciante', intermediate: 'Intermediario', advanced: 'Avancado' };

export function useHomeData(userId: string | undefined) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [dailyWorkout, setDailyWorkout] = useState<DailyWorkout>(fallbackDaily);
  const [dailyOffline, setDailyOffline] = useState(false);
  const [recentWorkouts, setRecentWorkouts] = useState<RecentWorkout[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [levelData, setLevelData] = useState<{ color: string; icon: string; level: number } | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState(getTimeOfDay());
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [checkInStreak, setCheckInStreak] = useState(1);

  const isSubscribed = profile?.subscription_status === 'premium' || profile?.subscription_status === 'active';

  useEffect(() => {
    const interval = setInterval(() => setTimeOfDay(getTimeOfDay()), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!userId) return;
    supabase.from('profiles').select('subscription_status, onboarding, streak, total_xp').eq('id', userId).single().then(({ data }) => {
      if (data) setProfile(data as ProfileData);
      const level = calculateLevel(data?.total_xp || 0);
      setLevelData({ color: COLORS.primary, icon: 'flash', level: level || 1 });
    });
    checkDailyCheckIn(userId);
  }, [userId]);

  const checkDailyCheckIn = async (uid: string) => {
    const today = new Date().toISOString().split('T')[0];
    const shownResult = await tryIf(async () => {
      return await AsyncStorage.getItem(CHECKIN_SHOWN_KEY);
    }, { retries: 1, baseDelay: 500 });
    if (shownResult.ok && shownResult.data === today) return;
    const existing = await getTodayCheckIn(uid);
    if (!existing) {
      const streak = await getCheckInStreak(uid);
      setCheckInStreak(streak + 1);
      setShowCheckIn(true);
      await tryIf(async () => {
        await AsyncStorage.setItem(CHECKIN_SHOWN_KEY, today);
      }, { retries: 1, baseDelay: 500 });
    }
  };

  const handleCheckInClaim = async () => {
    if (!userId) return;
    await performCheckIn(userId);
  };

  const fetchData = useCallback(async () => {
    if (!userId) return;
    const result = await tryIf(async () => {
      const [{ data }, { data: recent }, { data: catData }] = await Promise.all([
        supabase.from('workouts').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('user_workouts').select('*, workouts(title, category, duration_minutes)').eq('user_id', userId).order('completed_at', { ascending: false }).limit(3),
        supabase.from('workouts').select('category'),
      ]);
      return { data, recent, catData };
    }, { retries: 1, baseDelay: 500 });
    if (result.ok) {
      const { data, recent, catData } = result.data!;
      const wData = data || [];
      const currentLevel = userLevelMap[profile?.onboarding?.level || ''];
      let sorted = [...wData];
      if (currentLevel) sorted.sort((a: any, b: any) => (a.level === currentLevel ? -1 : b.level === currentLevel ? 1 : 0));
      if (sorted.length > 0) {
        const dw = sorted[0] as any;
        setDailyWorkout({ id: dw.id, name: dw.title || dw.name, type: dw.category || 'Treino', videoId: dw.video_id || 'dQw4w9WgXcQ', timer: `00:${String(dw.duration_minutes || dw.duration || 30).padStart(2, '0')}:00`, is_premium: dw.is_premium || false });
        isWorkoutCached(dw.id).then(setDailyOffline);
      }
      if (recent && recent.length > 0) {
        setRecentWorkouts(recent.map((w: any) => ({ id: w.id, name: w.workouts?.title || 'Treino', category: w.workouts?.category, completed: w.completed, completed_at: w.completed_at, created_at: w.created_at, duration_minutes: w.duration_minutes || w.workouts?.duration_minutes })));
      }
      if (catData) {
        const c: Record<string, number> = {};
        catData.forEach((w: any) => { const k = (w.category || 'outros').toLowerCase(); c[k] = (c[k] || 0) + 1; });
        setCategoryCounts(c);
      }
      if (profile?.onboarding?.level) {
        const level = calculateLevel(Number(profile?.total_xp) || 0);
        setLevelData({ color: COLORS.primary, icon: 'flash', level: level || 1 });
      }
    } else {
      if (__DEV__) console.error('Erro ao carregar home:', result.error);
    }
    setInitialLoading(false);
  }, [userId, profile?.onboarding?.level]);

  useEffect(() => { if (!profile) fetchData(); }, [profile, fetchData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);

  return {
    profile, dailyWorkout, dailyOffline, recentWorkouts, categoryCounts,
    levelData, initialLoading, refreshing, timeOfDay, showCheckIn, checkInStreak,
    isSubscribed, onRefresh, setShowCheckIn, handleCheckInClaim,
  };
}
