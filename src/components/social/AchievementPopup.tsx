// src/components/social/AchievementPopup.js
// Popup de conquista desbloqueada - NOVAIX FITNESS

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function AchievementPopup({ achievement, visible, onDismiss }) {
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible && achievement) {
      Animated.sequence([
        Animated.parallel([
          Animated.spring(slideAnim, { toValue: 0, tension: 30, friction: 8, useNativeDriver: true }),
          Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
        ]),
        Animated.spring(scaleAnim, { toValue: 1, tension: 30, friction: 8, useNativeDriver: true }),
      ]).start();

      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(slideAnim, { toValue: -100, duration: 300, useNativeDriver: true }),
          Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
        ]).start(() => onDismiss?.());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible, achievement]);

  if (!visible || !achievement) return null;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <Animated.View style={[styles.content, { transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.iconContainer}>
          <Ionicons name={achievement.icon || 'trophy'} size={32} color={COLORS.primary} />
        </View>

        <View style={styles.info}>
          <Text style={styles.label}>CONQUISTA DESBLOQUEADA!</Text>
          <Text style={styles.title}>{achievement.title}</Text>
          <Text style={styles.desc}>{achievement.description}</Text>
        </View>

        {achievement.xp && (
          <View style={styles.xpBadge}>
            <Ionicons name="star" size={14} color={COLORS.primary} />
            <Text style={styles.xpText}>+{achievement.xp} XP</Text>
          </View>
        )}
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: SPACING.lg,
    right: SPACING.lg,
    zIndex: 1000,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 2,
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  label: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 9,
    color: COLORS.primary,
    letterSpacing: 2,
    marginBottom: 2,
  },
  title: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
    color: COLORS.textTitle,
    marginBottom: 2,
  },
  desc: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: COLORS.textMuted,
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  xpText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 12,
    color: COLORS.primary,
  },
});
