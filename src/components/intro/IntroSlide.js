import { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

export default function IntroSlide({ icon, title, subtitle, index }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay: 100,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 600,
        delay: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container} accessibilityLabel={`${title}. ${subtitle}`}>
      <Animated.View style={[styles.iconContainer, { opacity: fadeAnim, transform: [{ translateY }] }]}>
        <View style={styles.iconCircle}>
          <Ionicons name={icon} size={64} color={COLORS.primary} />
        </View>
      </Animated.View>

      <Animated.View style={[styles.textContainer, { opacity: fadeAnim, transform: [{ translateY }] }]}>
        <Text style={styles.title} accessibilityRole="header">{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xxl,
  },
  iconContainer: {
    marginBottom: SPACING.huge,
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary + '30',
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  title: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 26,
    color: COLORS.textTitle,
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: SPACING.md,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.textDescription,
    textAlign: 'center',
  },
});
