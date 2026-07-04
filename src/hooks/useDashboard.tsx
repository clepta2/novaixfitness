// src/hooks/useDashboard.ts
// Hook de carregamento e processamento de dados do Dashboard

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';
import {
  getWorkoutAnalytics,
  getWorkoutFrequency,
  getMonthlyComparison,
  getWeightHistory,
  calculateMuscleBalance,
} from '../services/analytics';

interface FrequencyPoint {
  week: string;
  count: number;
}

interface MonthlyPoint {
  month: string;
  workouts: number;
}

interface WeightPoint {
  date: string;
  weight: number;
}

interface MuscleBalanceData {
  [muscle: string]: number;
}

interface DashboardData {
  analytics: unknown;
  freq: FrequencyPoint[];
  monthly: MonthlyPoint[];
  weightHistory: WeightPoint[];
  muscleBalance: MuscleBalanceData;
  prevMuscleBalance: MuscleBalanceData;
  xp: number;
  totalWorkouts: number;
  totalMinutes: number;
  streak: number;
  height: number | null;
  weight: number | null;
  recentWorkouts: unknown[];
  weekWorkouts: number;
  weekMinutes: number;
  weekCalories: number;
}

interface ChartData {
  labels: string[];
  datasets: { data: number[] }[];
}

export function useDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    if (!user?.id) {
      setRefreshing(false);
      return;
    }
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString();
      const sixtyDaysAgo = new Date(Date.now() - 60 * 86400000).toISOString();
      const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();

      const [analytics, freq, monthly, weight, profile, recentWorkouts, prevWorkouts, weekWorkouts] = await Promise.all([
        getWorkoutAnalytics(user.id, 'month'),
        getWorkoutFrequency(user.id),
        getMonthlyComparison(user.id),
        getWeightHistory(user.id),
        supabase.from('profiles').select('total_xp, total_workouts, total_minutes, max_streak, physical_data').eq('id', user.id).single(),
        supabase.from('user_workouts').select('workouts(category), completed_at').eq('user_id', user.id).gte('completed_at', thirtyDaysAgo).order('completed_at', { ascending: false }),
        supabase.from('user_workouts').select('workouts(category)').eq('user_id', user.id).gte('completed_at', sixtyDaysAgo).lt('completed_at', thirtyDaysAgo),
        supabase.from('user_workouts').select('duration').eq('user_id', user.id).gte('completed_at', weekAgo),
      ]);

      const p: any = profile.data || {};
      const weekData = weekWorkouts.data || [];

      const formattedFreq = Object.entries(freq || {}).map(([week, count]) => ({ week, count: count as number }));
      const formattedMonthly = Object.entries(monthly || {}).map(([month, workouts]) => ({ month, workouts: workouts as number }));

      const mappedRecent = (recentWorkouts.data || []).map((w: any) => ({
        ...w,
        workouts: Array.isArray(w.workouts) ? w.workouts[0] : w.workouts
      }));
      const mappedPrev = (prevWorkouts.data || []).map((w: any) => ({
        ...w,
        workouts: Array.isArray(w.workouts) ? w.workouts[0] : w.workouts
      }));

      setData({
        analytics,
        freq: formattedFreq,
        monthly: formattedMonthly,
        weightHistory: weight,
        muscleBalance: calculateMuscleBalance(mappedRecent),
        prevMuscleBalance: calculateMuscleBalance(mappedPrev),
        xp: p.total_xp || 0,
        totalWorkouts: p.total_workouts || 0,
        totalMinutes: p.total_minutes || 0,
        streak: p.max_streak || 0,
        height: p.physical_data?.height,
        weight: p.physical_data?.weight,
        recentWorkouts: recentWorkouts.data || [],
        weekWorkouts: weekData.length,
        weekMinutes: weekData.reduce((s: number, w: { duration?: number }) => s + (w.duration || 0), 0),
        weekCalories: Math.round(weekData.reduce((s: number, w: { duration?: number }) => s + (w.duration || 0), 0) * 8),
      });
    } catch (err) {
      if (__DEV__) console.error('Erro ao carregar dashboard:', err);
    } finally {
      setRefreshing(false);
    }
  }, [user?.id]);

  useEffect(() => { loadData(); }, [loadData]);

  const bmi = useMemo(() => {
    return data?.weight && data?.height
      ? (data.weight / ((data.height / 100) ** 2)).toFixed(1)
      : null;
  }, [data?.weight, data?.height]);

  const freqChartData = useMemo<ChartData | null>(() => {
    return data?.freq?.length > 0
      ? { labels: data.freq.map(f => f.week), datasets: [{ data: data.freq.map(f => f.count || 0) }] }
      : null;
  }, [data?.freq]);

  const monthlyChartData = useMemo<ChartData | null>(() => {
    return data?.monthly?.length > 1
      ? { labels: data.monthly.map(m => m.month), datasets: [{ data: data.monthly.map(m => m.workouts) }] }
      : null;
  }, [data?.monthly]);

  const weightChartData = useMemo<ChartData | null>(() => {
    return data?.weightHistory?.length > 1
      ? { labels: data.weightHistory.map(w => w.date), datasets: [{ data: data.weightHistory.map(w => w.weight) }] }
      : null;
  }, [data?.weightHistory]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
  }, [loadData]);

  return { data, refreshing, bmi, freqChartData, monthlyChartData, weightChartData, onRefresh };
}
