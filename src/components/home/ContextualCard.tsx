import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef } from 'react';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { scale } from '../../utils/responsive';

function getStreakMotivation(streak: any) {
  if (streak >= 30) return { text: `${streak} dias seguidos! Lenda!`, icon: 'trophy', color: COLORS.gold };
  if (streak >= 14) return { text: `${streak} dias! Incrivel!`, icon: 'flame', color: COLORS.secondary };
  if (streak >= 7) return { text: `${streak} dias! Continue assim!`, icon: 'trending-up', color: COLORS.success };
  if (streak >= 3) return { text: `${streak} dias no flow!`, icon: 'flash', color: COLORS.primary };
  return null;
}

export default function ContextualCard({ card, onAction, streak = 0 }) {
  const motivation = getStreakMotivation(streak);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 50, friction: 8, useNativeDriver: true }),
    ]).start();

    if (motivation) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.05, duration: 1000, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [streak]);

  const handlePress = () => {
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); } catch {}
    Animated.sequence([
      Animated.spring(pulseAnim, { toValue: 0.95, tension: 50, friction: 3, useNativeDriver: true }),
      Animated.spring(pulseAnim, { toValue: 1, tension: 50, friction: 3, useNativeDriver: true }),
    ]).start();
    onAction?.();
  };

  return (
    <Animated.View style={[styles.card, { backgroundColor: COLORS.surface, opacity: fadeAnim, transform: [{ translateY: slideAnim }, { scale: pulseAnim }] }]}>
      <View style={styles.header}>
        <View style={[styles.iconWrap, { backgroundColor: card.iconColor + '20' }]}>
          <Ionicons name={card.icon} size={scale(24)} color={card.iconColor} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title}>{card.title}</Text>
          <Text style={[styles.subtitle, { color: card.iconColor }]}>{card.subtitle}</Text>
        </View>
      </View>

      {motivation && (
        <View style={[styles.motivationRow, { backgroundColor: motivation.color + '15' }]}>
          <Ionicons name={motivation.icon as any} size={14} color={motivation.color} />
          <Text style={[styles.motivationText, { color: motivation.color }]}>{motivation.text}</Text>
        </View>
      )}

      <Text style={styles.description}>{card.description}</Text>

      <TouchableOpacity style={[styles.actionBtn, { backgroundColor: card.iconColor }]} onPress={handlePress} activeOpacity={0.8} accessibilityLabel={card.actionLabel} accessibilityRole="button">
        <Text style={styles.actionLabel}>{card.actionLabel}</Text>
        <Ionicons name="arrow-forward" size={16} color={COLORS.background} />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  headerText: { flex: 1 },
  title: {
    fontSize: 13,
    fontFamily: 'Montserrat_700Bold',
    color: COLORS.textTitle,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    marginTop: 2,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: COLORS.textMuted,
    lineHeight: 20,
    marginBottom: SPACING.lg,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm + 2,
    borderRadius: BORDER_RADIUS.md,
    gap: 6,
  },
  actionLabel: {
    fontSize: 13,
    fontFamily: 'Montserrat_700Bold',
    color: COLORS.background,
    letterSpacing: 0.5,
  },
  motivationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primary + '10',
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: SPACING.md,
  },
  motivationText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
});
