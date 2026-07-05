import { supabase } from '../config/supabase';
import { TABLES } from '../config/tables';
import { APP_CONFIG } from '../config/app';
import {
  buildWorkoutPrompt, buildNutritionPrompt, buildAnalysisPrompt,
  parseWorkoutRecommendation, parseNutritionAdvice, parseProgressAnalysis,
  getFallbackRecommendation, getFallbackNutrition, getFallbackAnalysis, getFallbackMotivation,
} from './aiPrompts';

export async function getWorkoutRecommendation(userId: string, preferences: Record<string, unknown> = {}, forceRegenerate = false) {
  const userProfile = await getUserProfile(userId);
  const recentWorkouts = await getRecentWorkouts(userId);
  const stats = await getUserStats(userId);
  const prompt = buildWorkoutPrompt(userProfile, recentWorkouts, stats, preferences);

  try {
    const response = await callGemini(prompt, forceRegenerate);
    return parseWorkoutRecommendation(response);
  } catch (err: any) {
    if (err.message === 'COINS_INSUFFICIENT') throw err;
    if (__DEV__) console.warn('Erro na recomendacao IA:', err);
    return getFallbackRecommendation(userProfile, recentWorkouts);
  }
}

export async function getNutritionAdvice(userId: string, goal: string, restrictions: string[] = [], forceRegenerate = false) {
  const userProfile = await getUserProfile(userId);
  const mealHistory = await getMealHistory(userId);
  const prompt = buildNutritionPrompt(userProfile, mealHistory, goal, restrictions);

  try {
    const response = await callGemini(prompt, forceRegenerate);
    return parseNutritionAdvice(response);
  } catch (err: any) {
    if (err.message === 'COINS_INSUFFICIENT') throw err;
    if (__DEV__) console.warn('Erro no conselho nutricional IA:', err);
    return getFallbackNutrition(userProfile, goal);
  }
}

export async function analyzeProgress(userId: string, forceRegenerate = false) {
  const stats = await getUserStats(userId);
  const weightHistory = await getWeightHistory(userId);
  const workouts = await getRecentWorkouts(userId, 30);
  const prompt = buildAnalysisPrompt(stats, weightHistory, workouts);

  try {
    const response = await callGemini(prompt, forceRegenerate);
    return parseProgressAnalysis(response);
  } catch (err: any) {
    if (err.message === 'COINS_INSUFFICIENT') throw err;
    if (__DEV__) console.warn('Erro na analise IA:', err);
    return getFallbackAnalysis(stats);
  }
}

export async function getMotivationalMessage(userId: string, forceRegenerate = false) {
  const stats = await getUserStats(userId);
  const prompt = `Generate a short motivational message in Portuguese for a fitness app user. They have completed ${stats.total_workouts} workouts and have a ${stats.current_streak}-day streak. Keep it under 50 words.`;
  try { return await callGemini(prompt, forceRegenerate); } catch (err: any) { if (err.message === 'COINS_INSUFFICIENT') throw err; return getFallbackMotivation(stats); }
}

const GEMINI_API_URL = `${APP_CONFIG.apis.geminiBaseUrl}`;

async function callGemini(prompt: string, forceRegenerate: boolean) {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  const API_BASE = process.env.EXPO_PUBLIC_API_URL;

  const response = await fetch(`${API_BASE}/api/ai/recommend`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ prompt, forceRegenerate }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Erro na recomendacao IA');
  return data.response;
}

async function getUserProfile(userId: string) {
  const { data } = await supabase.from(TABLES.PROFILES).select('*, onboarding_v2 (*)').eq('id', userId).single();
  return data;
}

async function getRecentWorkouts(userId: string, limit = 10) {
  const { data } = await supabase.from(TABLES.USER_WORKOUTS).select('*, workouts (name, category, level, exercises)')
    .eq('user_id', userId).eq('completed', true).order('completed_at', { ascending: false }).limit(limit);
  return data || [];
}

async function getUserStats(userId: string) {
  const { data } = await supabase.rpc('get_user_stats', { p_user_id: userId });
  return data || {};
}

async function getMealHistory(userId: string) {
  const { data } = await supabase.from(TABLES.MEAL_LOGS).select('*').eq('user_id', userId).order('logged_at', { ascending: false }).limit(14);
  return data || [];
}

async function getWeightHistory(userId: string) {
  const { data } = await supabase.from(TABLES.WEIGHT_LOGS).select('weight, recorded_at')
    .eq('user_id', userId).order('recorded_at', { ascending: true }).limit(30);
  return data || [];
}
