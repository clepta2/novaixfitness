// src/hooks/useIntro.ts
// Hook de estado da intro (slide tracking, seen flag)

import { useState, useRef, useCallback, useMemo } from 'react';
import { Animated, type FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NativeSyntheticEvent, ViewToken } from 'react-native';

const STORAGE_KEY = '@novaix:intro_seen';

interface IntroSlide {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
}

export const INTRO_SLIDES: IntroSlide[] = [
  {
    id: '1',
    icon: 'flash-outline',
    title: 'NOVAIX FITNESS',
    subtitle: 'Sua evolução no treino começa aqui. App completo para transformar seu corpo e mente.',
  },
  {
    id: '2',
    icon: 'barbell-outline',
    title: 'Treinos Personalizados',
    subtitle: 'IA que adapta seus treinos ao seu nível, objetivos e disponibilidade.',
  },
  {
    id: '3',
    icon: 'stats-chart-outline',
    title: 'Acompanhe seu Progresso',
    subtitle: 'Fotos, medidas, gráficos e análises detalhadas da sua evolução.',
  },
  {
    id: '4',
    icon: 'people-outline',
    title: 'Comunidade Ativa',
    subtitle: 'Compartilhe, compita e conquiste seus objetivos junto com outros.',
  },
];

type Router = {
  replace: (path: string) => void;
};

export function useIntro(router: Router) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<IntroSlide>>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const isLastSlide = currentIndex === INTRO_SLIDES.length - 1;

  const markIntroSeen = useCallback(async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, 'true');
    } catch (_e) {
      if (__DEV__) console.warn('Intro: erro ao salvar flag:', _e);
    }
  }, []);

  const goToLogin = useCallback(async () => {
    await markIntroSeen();
    router.replace('/(tabs)/home');
  }, [markIntroSeen, router]);

  const handleNext = useCallback(() => {
    if (isLastSlide) {
      goToLogin();
    } else {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    }
  }, [currentIndex, isLastSlide, goToLogin]);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0 && viewableItems[0].index != null) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useMemo(() => ({ viewAreaCoveragePercentThreshold: 50 }), []);

  return {
    currentIndex,
    flatListRef,
    scrollX,
    isLastSlide,
    goToLogin,
    handleNext,
    onViewableItemsChanged,
    viewabilityConfig,
  };
}
