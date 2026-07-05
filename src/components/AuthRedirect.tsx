// src/components/AuthRedirect.tsx
// Redirect logic baseado no estado de auth - NOVAIX FITNESS

import { useState, useEffect } from 'react'
import { useRouter, useSegments } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext'
import { BRAND_SHORT } from '../constants/brand';
import { PUBLIC_ROUTES } from '../config/appScreens'
import { registerForPushNotificationsAsync, addNotificationReceivedListener, addNotificationResponseListener } from '../services/notifications';

const INTRO_STORAGE_KEY = '@novaix:intro_seen';

export function AuthRedirect() {
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
