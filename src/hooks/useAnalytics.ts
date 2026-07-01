// Hook principal de tracking de analytics

import { useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  trackEvent,
  trackScreenView,
  trackWorkoutStarted,
  trackWorkoutCompleted,
  trackMealLogged,
  trackWaterLogged,
  trackWeightLogged,
  trackAchievementUnlocked,
  trackSubscriptionStarted,
  trackSearchPerformed,
} from '../services/analyticsTracker';

interface TrackWorkout {
  start: (_workoutId: string, _workoutName: string) => void;
  complete: (_workoutId: string, _duration: number, _exercises: number) => void;
}

interface TrackNutrition {
  meal: (_mealType: string, _calories: number) => void;
  water: (_amountMl: number) => void;
  weight: (_weight: number) => void;
}

interface UseAnalyticsReturn {
  track: (_eventName: string, _properties?: Record<string, unknown>) => void;
  trackScreen: (_screenName: string) => void;
  trackWorkout: TrackWorkout;
  trackNutrition: TrackNutrition;
  trackAchievement: (_achievementId: string, _achievementName: string) => void;
  trackSubscription: (_planId: string, _planName: string) => void;
  trackSearch: (_query: string, _resultsCount: number) => void;
}

export function useAnalytics(): UseAnalyticsReturn {
  const { user } = useAuth();

  const track = useCallback((eventName: string, properties: Record<string, unknown> = {}): void => {
    trackEvent(eventName, properties, user?.id);
  }, [user?.id]);

  const trackScreen = useCallback((screenName: string): void => {
    trackScreenView(screenName, user?.id);
  }, [user?.id]);

  const trackWorkout: TrackWorkout = {
    start: useCallback((workoutId: string, workoutName: string): void => {
      trackWorkoutStarted(workoutId, workoutName, user?.id);
    }, [user?.id]),
    complete: useCallback((workoutId: string, duration: number, exercises: number): void => {
      trackWorkoutCompleted(workoutId, duration, exercises, user?.id);
    }, [user?.id]),
  };

  const trackNutrition: TrackNutrition = {
    meal: useCallback((mealType: string, calories: number): void => {
      trackMealLogged(mealType, calories, user?.id);
    }, [user?.id]),
    water: useCallback((amountMl: number): void => {
      trackWaterLogged(amountMl, user?.id);
    }, [user?.id]),
    weight: useCallback((weight: number): void => {
      trackWeightLogged(weight, user?.id);
    }, [user?.id]),
  };

  const trackAchievement = useCallback((achievementId: string, achievementName: string): void => {
    trackAchievementUnlocked(achievementId, achievementName, user?.id);
  }, [user?.id]);

  const trackSubscription = useCallback((planId: string, planName: string): void => {
    trackSubscriptionStarted(planId, planName, user?.id);
  }, [user?.id]);

  const trackSearch = useCallback((query: string, resultsCount: number): void => {
    trackSearchPerformed(query, resultsCount, user?.id);
  }, [user?.id]);

  return {
    track,
    trackScreen,
    trackWorkout,
    trackNutrition,
    trackAchievement,
    trackSubscription,
    trackSearch,
  };
}

// Re-exportar hooks de dados para compatibilidade
export { useAnalyticsData, useWorkoutAnalytics, useNutritionAnalytics, useProgressAnalytics, useEngagementMetrics } from './useAnalyticsData';
export { useCohortAnalysis, useUserRetention, useUserSegmentation } from './useAnalyticsAdmin';
