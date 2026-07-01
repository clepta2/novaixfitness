// src/config/codeSplitting.js
// Configuracao de code splitting e lazy loading - NOVAIX FITNESS

import React, { lazy, Suspense } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { COLORS } from '../constants/colors';

function LoadingFallback() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );
}

export function lazyLoad(importFunc) {
  const LazyComponent = lazy(importFunc);

  return function LazyWrapper(props) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

export const LazyHome = lazyLoad(() => import('../components/home/HomeHeader'));
export const LazyWorkoutCard = lazyLoad(() => import('../components/workout/WorkoutCard'));
export const LazyExerciseAccordion = lazyLoad(() => import('../components/workout/ExerciseAccordion'));
export const LazyNutritionTracker = lazyLoad(() => import('../components/nutrition/NutritionTracker'));
export const LazySocialFeed = lazyLoad(() => import('../components/social/SocialFeed'));
export const LazyProgressCharts = lazyLoad(() => import('../components/progress/ProgressOverview'));
export const LazyGamificationSummary = lazyLoad(() => import('../components/home/GamificationSummary'));
export const LazyLeaderboard = lazyLoad(() => import('../components/social/Leaderboard'));
export const LazyAchievements = lazyLoad(() => import('../components/social/AchievementPopup'));
export const LazySubscriptionPlans = lazyLoad(() => import('../components/paywall/PlanCard'));
export const LazyAIRecommendations = lazyLoad(() => import('../components/home/DailyWorkoutCard'));
export const LazyHealthSync = lazyLoad(() => import('../components/settings/OfflineSettings'));

export const LAZY_COMPONENTS = {
  home: LazyHome,
  workoutCard: LazyWorkoutCard,
  exerciseAccordion: LazyExerciseAccordion,
  nutritionTracker: LazyNutritionTracker,
  socialFeed: LazySocialFeed,
  progressCharts: LazyProgressCharts,
  gamification: LazyGamificationSummary,
  leaderboard: LazyLeaderboard,
  achievements: LazyAchievements,
  subscription: LazySubscriptionPlans,
  aiRecommendations: LazyAIRecommendations,
  healthSync: LazyHealthSync,
};
