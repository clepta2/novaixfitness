import React, { useEffect, Suspense, useState, lazy } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useFonts } from 'expo-font';
import { Montserrat_400Regular, Montserrat_600SemiBold, Montserrat_700Bold, Montserrat_800ExtraBold } from '@expo-google-fonts/montserrat';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { ActivityIndicator, View } from 'react-native';
import { ThemeProvider as NavigationThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { ThemeProvider, useTheme } from '../src/context/ThemeContext';
import { COLORS } from '../src/constants/colors';
import { BRAND_SHORT } from '../src/constants/brand';
import { registerForPushNotificationsAsync, addNotificationReceivedListener, addNotificationResponseListener } from '../src/services/pushNotifications';
import { setupCrashHandler } from '../src/services/crashReport';
import { startAutoSync, stopAutoSync } from '../src/services/autoSync';
import { injectWebStyles, ErrorBoundary, OfflineIndicator } from '../src/components';
import { APP_SCREENS, PUBLIC_ROUTES } from '../src/config/appScreens';
import { initSentry, captureError } from '../src/config/sentry';

import { I18nProvider } from '../src/i18n';

// Lazy-loaded heavy screens for bundle optimization
const LazyDashboard = lazy(() => import('./dashboard'));
const LazyAdmin = lazy(() => import('./admin'));
const LazyAnalytics = lazy(() => import('./analytics'));
const LazyMarketplace = lazy(() => import('./marketplace'));
const LazyForum = lazy(() => import('./forum'));
const LazyNutrition = lazy(() => import('./nutrition'));
const LazyGamification = lazy(() => import('./gamification'));
const LazyBlog = lazy(() => import('./blog'));
const LazyPlayer = lazy(() => import('./player'));
const LazyWorkoutDetail = lazy(() => import('./workout-detail'));
const LazyLive = lazy(() => import('./live'));
const LazySocial = lazy(() => import('./social'));

// Map of heavy screens to their lazy-loaded versions
const LAZY_SCREEN_MAP: Record<string, React.LazyExoticComponent<React.ComponentType<any>>> = {
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

// Wrapper for lazy-loaded screens with Suspense fallback
function LazyScreenWrapper({ name }: { name: string }) {
  const LazyComponent = LAZY_SCREEN_MAP[name];
  if (!LazyComponent) return null;
  return (
    <Suspense fallback={<LoadingScreen />}>
      <LazyComponent />
    </Suspense>
  );
}

const INTRO_STORAGE_KEY = '@novaix:intro_seen';

initSentry();

function AuthRedirect() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const [introSeen, setIntroSeen] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(INTRO_STORAGE_KEY).then((val) => setIntroSeen(val === 'true'));
  }, []);

  useEffect(() => {
    if (loading || introSeen === null) return;
    const inTabsGroup = segments[0] === '(tabs)';
    const inOnboarding = segments[0] === 'onboarding';
    const inPaywall = segments[0] === 'paywall';
    const currentRoute = segments[0] || 'index';
    const isPublicRoute = PUBLIC_ROUTES.includes(currentRoute as any);

    if (user) {
      if (!profile) return;
      const step = profile.current_step || 'onboarding';
      if (step === 'onboarding') { if (!inOnboarding) router.replace('/onboarding/objetivo'); return; }
      if (step === 'pagamento') { if (!inPaywall) router.replace('/paywall'); return; }
      if (isPublicRoute || inOnboarding || inPaywall) router.replace('/(tabs)/home');
      return;
    }
    if (!introSeen && currentRoute !== 'intro') { router.replace('/intro'); return; }
    if (inTabsGroup || inOnboarding || inPaywall) router.replace('/');
  }, [user, profile, loading, segments, introSeen]);

  useEffect(() => {
    if (!user?.id) return;
    registerForPushNotificationsAsync(user.id);
    const receivedSub = addNotificationReceivedListener(({ title, body }: { title?: string; body?: string }) => {
      if (title || body) {
        import('react-native').then(({ Alert, Platform }) => {
          if (Platform.OS === 'web') alert(`${title}: ${body}`);
          else Alert.alert(title || BRAND_SHORT, body || '');
        });
      }
    });
    const responseSub = addNotificationResponseListener(router);
    return () => { receivedSub?.remove(); responseSub?.remove(); };
  }, [user?.id, router]);

  return null;
}

function LoadingScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );
}

function AppContent() {
  const { isDark } = useTheme();
  const navTheme = isDark ? DarkTheme : DefaultTheme;

  useEffect(() => { startAutoSync(() => {}); return () => stopAutoSync(); }, []);

  return (
    <ErrorBoundary screenName="AppRoot">
      <NavigationThemeProvider value={navTheme}>
        <OfflineIndicator />
        <Suspense fallback={<LoadingScreen />}>
          <Stack screenOptions={{ headerShown: false }}>
            {APP_SCREENS.map(name => {
              const isLazy = name in LAZY_SCREEN_MAP;
              return isLazy ? (
                <Stack.Screen
                  key={name}
                  {...{ name, component: () => <LazyScreenWrapper name={name} /> } as any}
                />
              ) : (
                <Stack.Screen key={name} name={name} />
              );
            })}
            <Stack.Screen name="(tabs)" />
          </Stack>
        </Suspense>
      </NavigationThemeProvider>
    </ErrorBoundary>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular, Montserrat_600SemiBold, Montserrat_700Bold, Montserrat_800ExtraBold,
    Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold,
  });

  useEffect(() => { setupCrashHandler(); injectWebStyles(); }, []);

  if (!fontsLoaded) return <LoadingScreen />;

  return (
    <I18nProvider initialLocale={null}>
      <AuthProvider>
        <ThemeProvider>
          <AuthRedirect />
          <AppContent />
        </ThemeProvider>
      </AuthProvider>
    </I18nProvider>
  );
}
