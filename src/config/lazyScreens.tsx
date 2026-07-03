// src/config/lazyScreens.tsx
// Declaracoes de lazy loading das telas pesadas - NOVAIX FITNESS

import React, { Suspense, lazy } from 'react';

const LazyDashboard = lazy(() => import('../../app/dashboard'));
const LazyAdmin = lazy(() => import('../../app/admin'));
const LazyAnalytics = lazy(() => import('../../app/analytics'));
const LazyMarketplace = lazy(() => import('../../app/marketplace'));
const LazyForum = lazy(() => import('../../app/forum'));
const LazyNutrition = lazy(() => import('../../app/nutrition'));
const LazyGamification = lazy(() => import('../../app/gamification'));
const LazyBlog = lazy(() => import('../../app/blog'));
const LazyPlayer = lazy(() => import('../../app/player'));
const LazyWorkoutDetail = lazy(() => import('../../app/workout-detail'));
const LazyLive = lazy(() => import('../../app/live'));
const LazySocial = lazy(() => import('../../app/social'));

export const LAZY_SCREEN_MAP: Record<string, React.LazyExoticComponent<React.ComponentType<any>>> = {
  dashboard: LazyDashboard,
  admin: LazyAdmin,
  analytics: LazyAnalytics,
  marketplace: LazyMarketplace,
  forum: LazyForum,
  nutrition: LazyNutrition,
  gamification: LazyGamification,
  blog: LazyBlog,
  player: LazyPlayer,
  'workout-detail': LazyWorkoutDetail,
  live: LazyLive,
  social: LazySocial,
};

function LoadingFallback() {
  const { ActivityIndicator, View } = require('react-native');
  const { COLORS } = require('../constants/colors');
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );
}

export function LazyScreenWrapper({ name }: { name: string }) {
  const LazyComponent = LAZY_SCREEN_MAP[name];
  if (!LazyComponent) return null;
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LazyComponent />
    </Suspense>
  );
}
