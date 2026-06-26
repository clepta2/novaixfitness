import { useEffect, Suspense } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useFonts } from 'expo-font';
import {
  Montserrat_400Regular,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  Montserrat_800ExtraBold,
} from '@expo-google-fonts/montserrat';
import { Inter_400Regular, Inter_500Medium } from '@expo-google-fonts/inter';
import { ActivityIndicator, View } from 'react-native';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { COLORS } from '../src/constants/colors';
import { registerForPushNotifications, setupNotificationListeners } from '../src/services/notifications';

function AuthRedirect() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;
    const inAuthGroup = segments[0] === '(tabs)';
    if (!user && inAuthGroup) router.replace('/');
    else if (user && !inAuthGroup) router.replace('/(tabs)/home');
  }, [user, loading, segments]);

  useEffect(() => {
    if (user?.id) {
      registerForPushNotifications(user.id);
      setupNotificationListeners(router);
    }
  }, [user?.id]);

  return null;
}

function LoadingScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular, Montserrat_600SemiBold, Montserrat_700Bold, Montserrat_800ExtraBold,
    Inter_400Regular, Inter_500Medium,
  });

  if (!fontsLoaded) return <LoadingScreen />;

  return (
    <AuthProvider>
      <AuthRedirect />
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
          <Stack.Screen name="workout-detail" lazy />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </Suspense>
    </AuthProvider>
  );
}
