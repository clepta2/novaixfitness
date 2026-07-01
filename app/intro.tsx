
// app/intro.tsx
// Intro com animacoes de entrada - NOVAIX FITNESS


            ;
import { useMemo } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, Animated,
  StyleSheet, Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../src/constants/spacing';
import { SHADOWS } from '../src/constants/shadows';
import { IntroSlide, DotIndicator, ErrorBoundary } from '../src/components';
import { useIntro, INTRO_SLIDES } from '../src/hooks/useIntro';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

function IntroScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    currentIndex,
    flatListRef,
    scrollX,
    isLastSlide,
    goToLogin,
    handleNext,
    onViewableItemsChanged,
    viewabilityConfig,
  } = useIntro(router);

  // Animacao de entrada
  const fadeAnim = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Skip button */}
      <TouchableOpacity
        style={[styles.skipBtn, { top: insets.top + SPACING.sm }]}
        onPress={goToLogin}
      >
        <Text style={styles.skipText}>Pular</Text>
      </TouchableOpacity>

      {/* Slides */}
      <Animated.View style={[{ flex: 1, opacity: fadeAnim }]}>
        <FlatList
          ref={flatListRef}
          data={INTRO_SLIDES}
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
          scrollEventThrottle={16}
        />
      </Animated.View>

      {/* Dots */}
      <View style={styles.dotsContainer}>
        {INTRO_SLIDES.map((_, index) => {
          const inputRange = [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH];
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 24, 8],
            extrapolate: 'clamp',
          });
          const dotOpacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  width: dotWidth,
                  opacity: dotOpacity,
                },
              ]}
            />
          );
        })}
      </View>

      {/* CTA Button */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={[styles.ctaBtn, isLastSlide && styles.ctaBtnActive]}
          onPress={isLastSlide ? goToLogin : handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.ctaBtnText}>
            {isLastSlide ? 'COMEÇAR' : 'PROXIMO'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
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
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  skipText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: COLORS.textMuted,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: SPACING.xl,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  bottomSection: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xxl,
  },
  ctaBtn: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  ctaBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    ...SHADOWS.md,
  },
  ctaBtnText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 14,
    color: COLORS.textTitle,
    letterSpacing: 1,
  },
});

export default IntroScreen;
