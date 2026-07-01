// src/hooks/useAI.ts
// Hook de recomendacoes IA - NOVAIX FITNESS

import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getWorkoutRecommendation,
  getNutritionAdvice,
  analyzeProgress,
  getMotivationalMessage,
} from '../services/aiRecommendations';

interface Recommendation {
  workouts?: unknown[];
  reasoning?: string;
}

interface NutritionAdvice {
  meals?: unknown[];
  tips?: string[];
}

interface ProgressAnalysis {
  summary?: string;
  metrics?: Record<string, number>;
}

export function useWorkoutRecommendation() {
  const { user } = useAuth();
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRecommendation = useCallback(async (preferences: Record<string, unknown> = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWorkoutRecommendation(user?.id, preferences);
      setRecommendation(data as any);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar recomendação');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  return { recommendation, loading, error, getRecommendation };
}

export function useNutritionAdvice() {
  const { user } = useAuth();
  const [advice, setAdvice] = useState<NutritionAdvice | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAdvice = useCallback(async (goal: string, restrictions: string[] = []) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getNutritionAdvice(user?.id, goal, restrictions);
      setAdvice(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar conselho nutricional');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  return { advice, loading, error, getAdvice };
}

export function useProgressAnalysis() {
  const { user } = useAuth();
  const [analysis, setAnalysis] = useState<ProgressAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAnalysis = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeProgress(user?.id);
      setAnalysis(data as any);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao analisar progresso');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  return { analysis, loading, error, getAnalysis };
}

export function useMotivationalMessage() {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchMessage = useCallback(async () => {
    setLoading(true);
    try {
      const msg = await getMotivationalMessage(user?.id);
      setMessage(msg);
    } catch (err) {
      if (__DEV__) console.error('Erro ao buscar mensagem motivacional:', err);
    }
    setLoading(false);
  }, [user?.id]);

  return { message, loading, fetchMessage };
}
