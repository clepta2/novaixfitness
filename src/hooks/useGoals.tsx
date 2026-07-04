// src/hooks/useGoals.ts
// Hook de metas de curto prazo - NOVAIX FITNESS

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import { GOAL_TYPES, getUnlockedAchievements } from '../data/achievements';
import { calcStreak } from '../helpers/streaks';
import type { Achievement } from '../types';

interface Goal {
  id: string;
  user_id: string;
  goal_type: string;
  target_value: number;
  target_unit: string;
  target_days: number;
  completed: boolean;
  created_at: string;
  [key: string]: unknown;
}

interface GoalStats {
  totalWorkouts: number;
  streak: number;
  maxStreak: number;
  totalMeals: number;
  waterStreak: number;
  totalXp: number;
  totalXP: number;
  totalMinutes: number;
  level: number;
}

export function useGoals() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [unlocked, setUnlocked] = useState<string[]>([]);
  const [stats, setStats] = useState<GoalStats>({
    totalWorkouts: 0, streak: 0, maxStreak: 0, totalMeals: 0, waterStreak: 0,
    totalXp: 0, totalXP: 0, totalMinutes: 0, level: 0,
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGoalType, setNewGoalType] = useState<string | null>(null);
  const [newGoalTarget, setNewGoalTarget] = useState('');

  const loadData = useCallback(async () => {
    if (!user?.id) return;
    try {
      const { data: goalsData } = await supabase.from('short_term_goals')
        .select('*').eq('user_id', user.id).eq('completed', false)
        .order('created_at', { ascending: false });
      setGoals((goalsData || []) as Goal[]);

      const { data: unlockedData } = await supabase.from('user_achievements')
        .select('achievement_id').eq('user_id', user.id);
      setUnlocked(unlockedData?.map(a => a.achievement_id as string) || []);

      const { data: workouts } = await supabase.from('user_workouts')
        .select('id, completed_at').eq('user_id', user.id).eq('completed', true);
      const { data: profile } = await supabase.from('profiles')
        .select('total_xp').eq('id', user.id).single();
      const streak = calcStreak(workouts || []);
      setStats({
        totalWorkouts: workouts?.length || 0,
        streak, maxStreak: streak, totalMeals: 0, waterStreak: 0,
        totalXp: profile?.total_xp || 0, totalXP: profile?.total_xp || 0,
        totalMinutes: workouts?.reduce((s: number, w: any) => s + (w.duration || 0), 0) || 0,
        level: 1,
      });
    } catch (err) {
      if (__DEV__) console.error('Erro ao carregar metas:', err);
    }
  }, [user?.id]);

  useEffect(() => { loadData(); }, [loadData]);

  const addGoal = useCallback(async () => {
    if (!newGoalType || !newGoalTarget || !user?.id) return;
    try {
      const goalType = GOAL_TYPES.find(g => g.id === newGoalType);
      await supabase.from('short_term_goals').insert({
        user_id: user.id, goal_type: newGoalType,
        target_value: parseFloat(newGoalTarget),
        target_unit: goalType?.unit, target_days: 30,
      });
      setNewGoalType(null);
      setNewGoalTarget('');
      setShowAddModal(false);
      loadData();
    } catch (err) {
      if (__DEV__) console.error('Erro ao adicionar meta:', err);
    }
  }, [newGoalType, newGoalTarget, user?.id, loadData]);

  const unlockedNow = getUnlockedAchievements(stats);
  const newAchievements = unlockedNow.filter((a: any) => !unlocked.includes(a.id));

  return {
    goals, unlocked, stats, newAchievements, showAddModal,
    setShowAddModal, newGoalType, setNewGoalType,
    newGoalTarget, setNewGoalTarget, addGoal,
  };
}
