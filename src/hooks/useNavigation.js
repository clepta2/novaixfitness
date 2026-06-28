// src/hooks/useNavigation.js
// Custom Hook de Navegação Segura - NOVAIX FITNESS

import { useRouter } from 'expo-router';
import { useCallback } from 'react';

export function useNavigation() {
  const router = useRouter();

  const navigate = useCallback((pathname, params) => {
    router.push({ pathname, params });
  }, [router]);

  const replace = useCallback((pathname, params) => {
    router.replace({ pathname, params });
  }, [router]);

  const back = useCallback((fallbackPath = '/(tabs)/home') => {
    if (router.canGoBack?.() || router.canGoBack) {
      // O router do expo-router tem canGoBack como função ou boolean dependendo do ambiente/versão.
      const canGoBack = typeof router.canGoBack === 'function' ? router.canGoBack() : !!router.canGoBack;
      if (canGoBack) {
        router.back();
        return;
      }
    }
    router.replace(fallbackPath);
  }, [router]);

  return {
    router,
    navigate,
    replace,
    back,
    canGoBack: () => {
      if (router.canGoBack?.()) return true;
      return !!router.canGoBack;
    }
  };
}
