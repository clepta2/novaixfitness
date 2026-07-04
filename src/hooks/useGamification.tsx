// Hook de gamificação - NOVAIX FITNESS

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  awardXP,
  checkAchievements,
  getRankings,
  getUserRank,
  getUserAchievements,
  calculateLevel,
  getXPForNextLevel,
  getLevelProgress,
  getUserGamificationProfile,
} from '../services/gamification';
import { Achievement } from '../types';

interface GamificationProfile {
  xp: number;
  [key: string]: unknown;
}

interface UserRank {
  rank: number;
  [key: string]: unknown;
}

interface AwardResult {
  xpGained?: number;
  [key: string]: unknown;
}

interface UseGamificationReturn {
  profile: GamificationProfile | null;
  achievements: Achievement[];
  rankings: unknown[];
  userRank: UserRank | null;
  loading: boolean;
  award: (eventType: string, metadata?: Record<string, unknown>) => Promise<AwardResult | null>;
  refresh: () => void;
  level: number;
  xpForNext: number;
  levelProgress: number;
  data?: GamificationProfile | null;
  refreshing?: boolean;
  error?: string | null;
  onRefresh?: () => void;
}

interface UseAchievementsReturn {
  achievements: Achievement[];
  loading: boolean;
}

interface UseRankingsReturn {
  rankings: unknown[];
  loading: boolean;
}

export function useGamification(): UseGamificationReturn {
  const { user } = useAuth();
  const [profile, setProfile] = useState<GamificationProfile | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [rankings, setRankings] = useState<unknown[]>([]);
  const [userRank, setUserRank] = useState<UserRank | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!user?.id) return;
    loadData();
  }, [user?.id]);

  async function loadData(): Promise<void> {
    if (!user?.id) { setLoading(false); return; }
    setLoading(true);
    try {
      const [rankData, achievementsData, rank, profileData] = await Promise.all([
        getRankings('weekly'),
        getUserAchievements(user.id),
        getUserRank(user.id),
        getUserGamificationProfile(user.id),
      ]);
      setRankings(rankData);
      setAchievements(achievementsData as any);
      setUserRank(rank);
      setProfile(profileData);
    } catch (err) {
      if (__DEV__) console.warn('Erro ao carregar gamificacao:', err);
    }
    setLoading(false);
  }

  const award = useCallback(async (eventType: string, metadata: Record<string, unknown> = {}): Promise<AwardResult | null> => {
    if (!user?.id) return null;
    try {
      const result = await awardXP(user.id, eventType, metadata);
      const newAchievements = await checkAchievements(user.id);
      if (newAchievements.length > 0) {
        setAchievements(prev => [...prev, ...newAchievements.map((a: any) => ({ ...a, unlocked: true }))]);
      }
      return result;
    } catch (err) {
      if (__DEV__) console.error('Erro ao conceder XP:', err);
      return null;
    }
  }, [user?.id]);

  const refresh = useCallback((): void => { loadData(); }, [user?.id]);

  const unlockedIds = achievements.filter(a => a.unlocked).map(a => a.id);
  const xpBreakdown = profile ? {
    workout: profile.totalWorkouts * 50,
    streak: profile.streak * 5,
    achievements: achievements.filter(a => a.unlocked).reduce((sum, a) => sum + (a.xpReward || 0), 0),
  } : {};

  return {
    profile,
    data: profile,
    achievements,
    rankings,
    userRank,
    loading,
    refreshing: false,
    error: null,
    award,
    refresh,
    onRefresh: refresh,
    unlockedIds,
    xpBreakdown,
    level: calculateLevel(profile?.total_xp || profile?.xp || 0),
    xpForNext: getXPForNextLevel(calculateLevel(profile?.total_xp || profile?.xp || 0)),
    levelProgress: getLevelProgress(profile?.total_xp || profile?.xp || 0),
  };
}

export function useAchievements(): UseAchievementsReturn {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!user?.id) return;
    getUserAchievements(user.id)
      .then(data => setAchievements(data as any))
      .catch((err) => { if (__DEV__) console.error('Erro ao carregar conquistas:', err); })
      .finally(() => setLoading(false));
  }, [user?.id]);

  return { achievements, loading };
}

export function useRankings(period: string = 'weekly'): UseRankingsReturn {
  const [rankings, setRankings] = useState<unknown[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    getRankings(period)
      .then(setRankings)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [period]);

  return { rankings, loading };
}
