import { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../src/constants/spacing';
import { IntroSlide, DotIndicator, ErrorBoundary } from '../src/components';

const STORAGE_KEY = '@novaix:intro_seen';
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SLIDES = [
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

function IntroScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const isLastSlide = currentIndex === SLIDES.length - 1;

  const markIntroSeen = useCallback(async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, 'true');
    } catch (_e) {}
  }, []);

  const goToLogin = useCallback(async () => {
    await markIntroSeen();
    router.replace('/');
  }, [markIntroSeen, router]);

  const handleNext = useCallback(() => {
    if (isLastSlide) {
      goToLogin();
    } else {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    }
  }, [currentIndex, isLastSlide, goToLogin]);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <TouchableOpacity
        style={[styles.skipBtn, { top: insets.top + SPACING.sm }]}
        onPress={goToLogin}
        accessibilityLabel="Pular introdução"
        accessibilityRole="button"
      >
        <Text style={styles.skipText}>Pular</Text>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(_, index) => ({ length: SCREEN_WIDTH, offset: SCREEN_WIDTH * index, index })}
        renderItem={({ item, index }) => (
          <IntroSlide icon={item.icon} title={item.title} subtitle={item.subtitle} index={index} />
        )}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
      />

      <View style={[styles.bottomSection, { paddingBottom: insets.bottom + SPACING.lg }]}>
        <DotIndicator total={SLIDES.length} currentIndex={currentIndex} />

        <TouchableOpacity
          style={[styles.nextBtn, isLastSlide && styles.nextBtnLast]}
          onPress={handleNext}
          accessibilityLabel={isLastSlide ? 'Começar a usar' : 'Próximo slide'}
          accessibilityRole="button"
        >
          <Text style={styles.nextBtnText}>{isLastSlide ? 'Começar' : 'Avançar'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function IntroWrapper() {
  return (
    <ErrorBoundary screenName="Intro">
      <IntroScreen />
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  skipBtn: {
    position: 'absolute',
    right: SPACING.xl,
    zIndex: 10,
    padding: SPACING.sm,
  },
  skipText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: COLORS.textDescription,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  bottomSection: {
    alignItems: 'center',
    paddingTop: SPACING.xl,
    gap: SPACING.xl,
  },
  nextBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 64,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    minWidth: 200,
    alignItems: 'center',
  },
  nextBtnLast: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 80,
  },
  nextBtnText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 15,
    color: COLORS.background,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
});
