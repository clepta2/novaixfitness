// src/components/ui/WorkoutCardEnhanced.tsx
// Card de treino com efeitos de hover e animacoes - NOVAIX FITNESS

import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { SHADOWS } from '../../constants/shadows';

interface WorkoutCardEnhancedProps {
  name: string;
  category: string;
  level: string;
  duration: number;
  exercises?: number;
  isPremium?: boolean;
  isCompleted?: boolean;
  isFavorite?: boolean;
  thumbnail?: string;
  onPress?: () => void;
  onFavorite?: () => void;
}

export default function WorkoutCardEnhanced({
  name,
  category,
  level,
  duration,
  exercises = 0,
  isPremium = false,
  isCompleted = false,
  isFavorite = false,
  onPress,
  onFavorite,
}: WorkoutCardEnhancedProps) {
  const scaleAnim = useRef(Animated.Value(1)).current;
  const elevationAnim = useRef(Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 0.98, friction: 5, useNativeDriver: true }),
      Animated.timing(elevationAnim, { toValue: 1, duration: 200, useNativeDriver: false }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, friction: 5, useNativeDriver: true }),
      Animated.timing(elevationAnim, { toValue: 0, duration: 200, useNativeDriver: false }),
    ]).start();
  };

  const levelColor = level === 'Avancado' ? COLORS.error : level === 'Intermediario' ? COLORS.attention : COLORS.success;

  return (
    <Animated.View style={[styles.container, {
      transform: [{ scale: scaleAnim }],
      elevation: elevationAnim.interpolate({ inputRange: [0, 1], outputRange: [2, 6] }),
    }]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={styles.content}
      >
        {/* Header com badge */}
        <View style={styles.header}>
          <View style={styles.badges}>
            <View style={[styles.levelBadge, { backgroundColor: levelColor + '20' }]}>
              <Text style={[styles.levelText, { color: levelColor }]}>{level}</Text>
            </View>
            {isPremium && (
              <View style={styles.premiumBadge}>
                <Ionicons name="diamond" size={10} color={COLORS.background} />
                <Text style={styles.premiumText}>PRO</Text>
              </View>
            )}
          </View>
          {onFavorite && (
            <TouchableOpacity onPress={onFavorite} style={styles.favoriteBtn}>
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={20}
                color={isFavorite ? COLORS.error : COLORS.textMuted}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Titulo e info */}
        <Text style={styles.name} numberOfLines={2}>{name}</Text>
        <Text style={styles.category}>{category}</Text>

        {/* Stats */}
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Ionicons name="time-outline" size={14} color={COLORS.textMuted} />
            <Text style={styles.statText}>{duration}min</Text>
          </View>
          <View style={styles.stat}>
            <Ionicons name="barbell-outline" size={14} color={COLORS.textMuted} />
            <Text style={styles.statText}>{exercises} ex.</Text>
          </View>
        </View>

        {/* Status */}
        {isCompleted && (
          <View style={styles.completedBadge}>
            <Ionicons name="checkmark-circle" size={14} color={COLORS.success} />
            <Text style={styles.completedText}>Concluido</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  content: {
    padding: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  badges: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  levelBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  levelText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 10,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  premiumText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 9,
    color: COLORS.background,
  },
  favoriteBtn: {
    padding: SPACING.xs,
  },
  name: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
    color: COLORS.textTitle,
    marginBottom: SPACING.xs,
    lineHeight: 22,
  },
  category: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: SPACING.md,
  },
  stats: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.textMuted,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  completedText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: COLORS.success,
  },
});
