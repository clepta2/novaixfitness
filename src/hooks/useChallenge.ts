// src/hooks/useChallenge.ts
// Hook para gerenciar desafios entre amigos - NOVAIX FITNESS

import { useState, useCallback } from 'react';
import { supabase } from '../config/supabase';

export interface Challenge {
  id: string;
  challenger_id: string;
  challenged_id: string;
  type: 'reps' | 'duration' | 'distance';
  duration: '1day' | '3days' | '1week';
  stake: number;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  challenger_progress?: number;
  challenged_progress?: number;
  created_at: string;
  expires_at: string;
}

interface UseChallengeOptions {
  userId: string;
}

export function useChallenge({ userId }: UseChallengeOptions) {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchChallenges = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('challenges')
        .select('*')
        .or(`challenger_id.eq.${userId},challenged_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setChallenges(data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const createChallenge = useCallback(async (challengeData: {
    friendId: string;
    type: string;
    duration: string;
    stake: number;
    workoutName?: string;
  }) => {
    try {
      const { data, error: createError } = await supabase
        .from('challenges')
        .insert({
          challenger_id: userId,
          challenged_id: challengeData.friendId,
          type: challengeData.type,
          duration: challengeData.duration,
          stake: challengeData.stake,
          workout_name: challengeData.workoutName,
          status: 'pending',
          expires_at: getExpirationDate(challengeData.duration),
        })
        .select()
        .single();

      if (createError) throw createError;
      setChallenges(prev => [data, ...prev]);
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error(String(err));
    }
  }, [userId]);

  const acceptChallenge = useCallback(async (challengeId: string) => {
    try {
      const { error: updateError } = await supabase
        .from('challenges')
        .update({ status: 'active', started_at: new Date().toISOString() })
        .eq('id', challengeId)
        .eq('challenged_id', userId);

      if (updateError) throw updateError;
      setChallenges(prev =>
        prev.map(c => (c.id === challengeId ? { ...c, status: 'active' as const } : c))
      );
    } catch (err) {
      throw err instanceof Error ? err : new Error(String(err));
    }
  }, [userId]);

  const declineChallenge = useCallback(async (challengeId: string) => {
    try {
      const { error: updateError } = await supabase
        .from('challenges')
        .update({ status: 'cancelled' })
        .eq('id', challengeId)
        .eq('challenged_id', userId);

      if (updateError) throw updateError;
      setChallenges(prev =>
        prev.map(c => (c.id === challengeId ? { ...c, status: 'cancelled' as const } : c))
      );
    } catch (err) {
      throw err instanceof Error ? err : new Error(String(err));
    }
  }, [userId]);

  const updateProgress = useCallback(async (challengeId: string, progress: number) => {
    try {
      const challenge = challenges.find(c => c.id === challengeId);
      if (!challenge) return;

      const isChallenger = challenge.challenger_id === userId;
      const updateField = isChallenger ? 'challenger_progress' : 'challenged_progress';

      const { error: updateError } = await supabase
        .from('challenges')
        .update({ [updateField]: progress })
        .eq('id', challengeId);

      if (updateError) throw updateError;
      setChallenges(prev =>
        prev.map(c =>
          c.id === challengeId
            ? { ...c, [isChallenger ? 'challenger_progress' : 'challenged_progress']: progress }
            : c
        )
      );
    } catch (err) {
      throw err instanceof Error ? err : new Error(String(err));
    }
  }, [challenges, userId]);

  const getActiveChallenges = useCallback(() => {
    return challenges.filter(c => c.status === 'active');
  }, [challenges]);

  const getPendingChallenges = useCallback(() => {
    return challenges.filter(c => c.status === 'pending' && c.challenged_id === userId);
  }, [challenges, userId]);

  const getCompletedChallenges = useCallback(() => {
    return challenges.filter(c => c.status === 'completed');
  }, [challenges]);

  return {
    challenges,
    isLoading,
    error,
    fetchChallenges,
    createChallenge,
    acceptChallenge,
    declineChallenge,
    updateProgress,
    getActiveChallenges,
    getPendingChallenges,
    getCompletedChallenges,
  };
}

function getExpirationDate(duration: string): string {
  const now = new Date();
  switch (duration) {
    case '1day':
      now.setDate(now.getDate() + 1);
      break;
    case '3days':
      now.setDate(now.getDate() + 3);
      break;
    case '1week':
      now.setDate(now.getDate() + 7);
      break;
    default:
      now.setDate(now.getDate() + 3);
  }
  return now.toISOString();
}

export default useChallenge;
