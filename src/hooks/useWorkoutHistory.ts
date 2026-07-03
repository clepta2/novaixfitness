import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';

export type Period = 'week' | 'month' | 'quarter' | 'year' | 'all';

export const PERIODS: { id: Period; label: string }[] = [
  { id: 'week', label: '7 dias' },
  { id: 'month', label: '30 dias' },
  { id: 'quarter', label: '3 meses' },
  { id: 'year', label: '1 ano' },
  { id: 'all', label: 'Tudo' },
];

interface WorkoutHistoryItem {
  id: string;
  user_id: string;
  workout_id: string;
  completed: boolean;
  completed_at: string | null;
  duration: number | null;
  rating: number | null;
  notes: string | null;
  workouts?: { title: string; category: string };
  [key: string]: unknown;
}

interface HistoryStats {
  total: number;
  duration: number;
  avgRating: number;
}

interface UseWorkoutHistoryReturn {
  workouts: WorkoutHistoryItem[];
  selectedPeriod: Period;
  setSelectedPeriod: (period: Period) => void;
  loading: boolean;
  stats: HistoryStats;
  formatDate: (dateStr: string | null) => string;
  formatDuration: (min: number | null) => string;
}

export function useWorkoutHistory(): UseWorkoutHistoryReturn {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<WorkoutHistoryItem[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('month');
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<HistoryStats>({ total: 0, duration: 0, avgRating: 0 });

  const loadWorkouts = useCallback(async (): Promise<void> => {
    if (!user?.id) return;
    setLoading(true);
    try {
      let query = supabase.from('user_workouts')
        .select('*, workouts(title, category)')
        .eq('user_id', user.id).eq('completed', true)
        .order('completed_at', { ascending: false });

      const now = new Date();
      if (selectedPeriod === 'week') query = query.gte('completed_at', new Date(now.getTime() - 7 * 86400000).toISOString());
      else if (selectedPeriod === 'month') query = query.gte('completed_at', new Date(now.getTime() - 30 * 86400000).toISOString());
      else if (selectedPeriod === 'quarter') query = query.gte('completed_at', new Date(now.getTime() - 90 * 86400000).toISOString());
      else if (selectedPeriod === 'year') query = query.gte('completed_at', new Date(now.getTime() - 365 * 86400000).toISOString());

      const { data } = await query;
      setWorkouts((data as WorkoutHistoryItem[]) || []);

      const total = data?.length || 0;
      const duration = data?.reduce((sum: number, w: WorkoutHistoryItem) => sum + (w.duration || 0), 0) || 0;
      const ratings = data?.filter((w: WorkoutHistoryItem) => w.rating).map((w: WorkoutHistoryItem) => w.rating!) || [];
      const avgRating = ratings.length > 0
        ? parseFloat((ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length).toFixed(1)) : 0;
      setStats({ total, duration, avgRating });
    } catch (err) {
      if (__DEV__) console.error('Erro ao carregar histórico:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedPeriod, user?.id]);

  useEffect(() => { loadWorkouts(); }, [loadWorkouts]);

  const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatDuration = (min: number | null): string => {
    if (!min) return '0min';
    if (min < 60) return `${min}min`;
    return `${Math.floor(min / 60)}h${min % 60 > 0 ? ` ${min % 60}min` : ''}`;
  };

  return {
    workouts, selectedPeriod, setSelectedPeriod,
    loading, stats, formatDate, formatDuration,
  };
}
