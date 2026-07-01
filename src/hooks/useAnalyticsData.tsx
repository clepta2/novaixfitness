// src/hooks/useAnalyticsData.ts
// Hooks de dados de analytics: treino, nutricao, progresso, engajamento

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getWorkoutAnalytics,
  getNutritionAnalytics,
  getProgressAnalytics,
  getEngagementMetrics,
  generateAnalyticsReport,
} from '../services/analyticsAdvanced';

interface AnalyticsReport {
  workouts?: Record<string, number>;
  nutrition?: Record<string, number>;
  progress?: Record<string, number>;
  engagement?: Record<string, number>;
}

interface WorkoutAnalyticsData {
  totalWorkouts: number;
  totalMinutes: number;
  avgDuration: number;
  streak: number;
  byCategory: Record<string, number>;
}

interface NutritionAnalyticsData {
  totalMeals: number;
  totalCalories: number;
  totalProtein: number;
  totalWater: number;
  byType: Record<string, number>;
}

interface ProgressAnalyticsData {
  weightChange: number;
  measurements: Record<string, number>;
}

interface EngagementMetricsData {
  screenViews: number;
  featuresUsed: number;
  daysActive: number;
  engagementRate: number;
  activeDays: number;
  streak: number;
  xpEarned: number;
}

export function useAnalyticsData(period: string = 'month') {
  const { user } = useAuth();
  const [data, setData] = useState<AnalyticsReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    loadData();
  }, [user?.id, period]);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const report = await generateAnalyticsReport(user.id, period);
      setData(report as any);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar analytics');
    }
    setLoading(false);
  }

  const refresh = useCallback(() => loadData(), [user?.id, period]);
  return { data, loading, error, refresh };
}

export function useWorkoutAnalytics(period: string = 'month') {
  const { user } = useAuth();
  const [data, setData] = useState<WorkoutAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    async function load() {
      setLoading(true);
      try {
        const res = await getWorkoutAnalytics(user.id, period);
        setData(res as any);
      } catch {}
      setLoading(false);
    }
    load();
  }, [user?.id, period]);

  return { data, loading };
}

export function useNutritionAnalytics(period: string = 'month') {
  const { user } = useAuth();
  const [data, setData] = useState<NutritionAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    async function load() {
      setLoading(true);
      try {
        const res = await getNutritionAnalytics(user.id, period);
        setData(res as any);
      } catch {}
      setLoading(false);
    }
    load();
  }, [user?.id, period]);

  return { data, loading };
}

export function useProgressAnalytics() {
  const { user } = useAuth();
  const [data, setData] = useState<ProgressAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    async function load() {
      setLoading(true);
      try {
        const res = await getProgressAnalytics(user.id);
        setData(res as any);
      } catch {}
      setLoading(false);
    }
    load();
  }, [user?.id]);

  return { data, loading };
}

export function useEngagementMetrics() {
  const { user } = useAuth();
  const [data, setData] = useState<EngagementMetricsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    async function load() {
      setLoading(true);
      try {
        const res = await getEngagementMetrics(user.id);
        setData(res as any);
      } catch {}
      setLoading(false);
    }
    load();
  }, [user?.id]);

  return { data, loading };
}
