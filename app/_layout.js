import { useEffect, Suspense } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useFonts } from 'expo-font';
import {
  Montserrat_400Regular,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  Montserrat_800ExtraBold,
} from '@expo-google-fonts/montserrat';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { ActivityIndicator, View } from 'react-native';
import { ThemeProvider as NavigationThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { ThemeProvider, useTheme } from '../src/context/ThemeContext';
import { COLORS } from '../src/constants/colors';
import { setupNotificationListeners } from '../src/services/notifications';
import { registerForPushNotificationsAsync, addNotificationReceivedListener, addNotificationResponseListener } from '../src/services/pushNotifications';
import { setupCrashHandler } from '../src/services/crashReport';
import { startAutoSync, stopAutoSync } from '../src/services/autoSync';
import { injectWebStyles, ErrorBoundary, OfflineIndicator } from '../src/components';

// Rotas que nÃ£o necessitam autenticaÃ§Ã£o (login)
const PUBLIC_ROUTES = ['index', 'register', 'forgot-password', 'landing'];

function AuthRedirect() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    const inTabsGroup = segments[0] === '(tabs)';
    const inOnboarding = segments[0] === 'onboarding';
    const inPaywall = segments[0] === 'paywall';
    const currentRoute = segments[0] || 'index';
    const isPublicRoute = PUBLIC_ROUTES.includes(currentRoute);

    // 1. NÃ£o autenticado tentando acessar Ã¡rea restrita â†’ envia para o login (index)
    if (!user) {
      if (inTabsGroup || inOnboarding || inPaywall) {
        router.replace('/');
      }
      return;
    }

    // 2. Autenticado mas dados de perfil nÃ£o carregados ainda â†’ aguarda
    if (!profile) return;

    // 3. Verifica em qual etapa do cadastro/onboarding o usuÃ¡rio estÃ¡
    const step = profile.current_step || 'onboarding';

    if (step === 'onboarding') {
      if (!inOnboarding) {
        router.replace('/onboarding/objetivo');
      }
      return;
    }

    if (step === 'pagamento') {
      if (!inPaywall) {
        router.replace('/paywall');
      }
      return;
    }

    // 4. Autenticado e com todas as etapas concluÃ­das (tutorial ou home)
    // Se ele tentar voltar para rotas pÃºblicas, onboarding ou paywall, redireciona para a home
    if (isPublicRoute || inOnboarding || inPaywall) {
      router.replace('/(tabs)/home');
    }
  }, [user, profile, loading, segments]);

  useEffect(() => {
    if (!user?.id) return;

    registerForPushNotificationsAsync(user.id);

    const receivedSub = addNotificationReceivedListener(({ title, body }) => {
      if (__DEV__) console.log('Push recebido em foreground:', title, body);
    });

    const responseSub = addNotificationResponseListener(router);

    const tapSub = setupNotificationListeners(router);

    return () => {
      receivedSub?.remove();
      responseSub?.remove();
      tapSub?.remove?.();
    };
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

  useEffect(() => {
    startAutoSync();
    return () => stopAutoSync();
  }, []);

  return (
    <ErrorBoundary screenName="AppRoot">
      <NavigationThemeProvider value={navTheme}>
        <OfflineIndicator />
        <Suspense fallback={<LoadingScreen />}>
          <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="register" lazy />
          <Stack.Screen name="forgot-password" lazy />
          <Stack.Screen name="paywall" lazy />
          <Stack.Screen name="subscription" lazy />
          <Stack.Screen name="chat-coach" lazy />
          <Stack.Screen name="notification-settings" lazy />
          <Stack.Screen name="notifications" lazy />
          <Stack.Screen name="analytics" lazy />
          <Stack.Screen name="export-data" lazy />
          <Stack.Screen name="body-measures" lazy />
          <Stack.Screen name="progress-photos" lazy />
          <Stack.Screen name="weekly-progress" lazy />
          <Stack.Screen name="settings" lazy />
          <Stack.Screen name="dashboard" lazy />
          <Stack.Screen name="workout-detail" lazy />
          <Stack.Screen name="player-list" lazy />
          <Stack.Screen name="warmup" lazy />
          <Stack.Screen name="recovery" lazy />
          <Stack.Screen name="changelog" lazy />
          <Stack.Screen name="mindfulness" lazy />
          <Stack.Screen name="blog" lazy />
          <Stack.Screen name="forum" lazy />
          <Stack.Screen name="planner" lazy />
          <Stack.Screen name="marketplace" lazy />
          <Stack.Screen name="marketplace-detail" lazy />
          <Stack.Screen name="waitlist" lazy />
          <Stack.Screen name="admin" lazy />
            <Stack.Screen name="workout/preCheckin" lazy />
            <Stack.Screen name="workout/history" lazy />
            <Stack.Screen name="onboarding/loading" lazy />
            <Stack.Screen name="goals" lazy />
            <Stack.Screen name="assessment" lazy />
            <Stack.Screen name="assessment/guided" lazy />
            <Stack.Screen name="tools/metrics" lazy />
            <Stack.Screen name="shopping" lazy />
            <Stack.Screen name="challenges" lazy />
            <Stack.Screen name="settings/accessibility" lazy />
            <Stack.Screen name="progress" lazy />
            <Stack.Screen name="progress/initialPhoto" lazy />
            <Stack.Screen name="progress/monthlyReview" lazy />
            <Stack.Screen name="progress/report" lazy />
            <Stack.Screen name="ai" lazy />
            <Stack.Screen name="nutrition" lazy />
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
    <AuthProvider>
      <ThemeProvider>
        <AuthRedirect />
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}











