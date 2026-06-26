// src/hooks/useProfile.js
// Hook para buscar perfil do usuário - NOVAIX FITNESS

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import { getGamificationData } from '../services/gamification';

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gamification, setGamification] = useState(null);

  const fetchProfile = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);

      const gamData = await getGamificationData(user.id);
      setGamification(gamData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (updates) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({ id: user.id, ...updates }, { onConflict: 'id' });

      if (error) throw error;
      fetchProfile();
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err);
    }
  };

  const getStats = useCallback(async () => {
    if (!user?.id) return null;

    try {
      const { data, error } = await supabase
        .from('user_workouts')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const completed = data?.filter(w => w.completed).length || 0;
      const totalMinutes = data?.reduce((sum, w) => sum + (w.duration || 0), 0) || 0;

      return {
        totalWorkouts: completed,
        totalMinutes,
        streak: calculateStreak(data || []),
        totalXP: gamification?.totalXP || 0,
        level: gamification?.levelData?.level || 1,
      };
    } catch (err) {
      console.error('Erro ao buscar stats:', err);
      return null;
    }
  }, [user?.id, gamification]);

  return { profile, loading, error, updateProfile, getStats, gamification, refetch: fetchProfile };
}

function calculateStreak(workouts) {
  if (!workouts.length) return 0;

  const completedDates = [...new Set(
    workouts
      .filter(w => w.completed && w.completed_at)
      .map(w => new Date(w.completed_at).toDateString())
  )].sort((a, b) => new Date(b) - new Date(a));

  if (!completedDates.length) return 0;

  let streak = 1;
  const today = new Date().toDateString();

  if (completedDates[0] !== today) {
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (completedDates[0] !== yesterday) return 0;
  }

  for (let i = 1; i < completedDates.length; i++) {
    const current = new Date(completedDates[i - 1]);
    const prev = new Date(completedDates[i]);
    const diffDays = (current - prev) / 86400000;

    if (diffDays === 1) streak++;
    else break;
  }

  return streak;
}
