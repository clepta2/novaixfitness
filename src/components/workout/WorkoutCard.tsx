// src/components/workout/WorkoutCard.tsx
// Card de treino reutilizável - NOVAIX FITNESS

import React, { memo, useRef, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import type { ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

interface Workout {
  id: string;
  name: string;
  level: string;
  duration?: number;
  duration_minutes?: number;
  rating?: number;
  exercises?: number | unknown[];
}

interface WorkoutCardProps {
  workout: Workout;
  onPress?: (workout: Workout) => void;
  onFavorite?: (id: string) => void;
  isFavorite?: boolean;
  showFavorite?: boolean;
  isOfflineCached?: boolean;
  index?: number;
}

interface LevelConfig {
  color: string;
  icon: string;
}

const LEVEL_CONFIG: Record<string, LevelConfig> = {
  'Iniciante': { color: COLORS.success, icon: 'leaf' },
  'Intermediário': { color: COLORS.attention, icon: 'flame' },
  'Avançado': { color: COLORS.error, icon: 'flash' },
  'beginner': { color: COLORS.success, icon: 'leaf' },
  'intermediate': { color: COLORS.attention, icon: 'flame' },
  'advanced': { color: COLORS.error, icon: 'flash' },
};

function WorkoutCard({ workout, onPress, onFavorite, isFavorite = false, showFavorite = true, isOfflineCached = false, index = 0 }: WorkoutCardProps): React.ReactElement {
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, tension: 40, friction: 8, delay: index * 50, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, delay: index * 50, useNativeDriver: true }),
    ]).start();
  }, []);

  const handlePress = useCallback(() => onPress?.(workout), [onPress, workout]);
  const handleFavorite = useCallback(() => onFavorite?.(workout.id), [onFavorite, workout.id]);

  const levelConfig = LEVEL_CONFIG[workout.level] || LEVEL_CONFIG['Intermediário'];
  const duration = workout.duration || workout.duration_minutes || 30;
  const rating = workout.rating || 0;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.8} accessibilityLabel={`Treino ${workout.name}, ${duration} minutos, nivel ${workout.level || 'intermediario'}`} accessibilityRole="button">
        <View style={styles.cardLeft}>
          <View style={[styles.iconContainer, { backgroundColor: levelConfig.color + '15' }]}>
            <Ionicons name="play" size={20} color={levelConfig.color} />
          </View>
        </View>

        <View style={styles.cardCenter}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>{workout.name}</Text>
            {isOfflineCached && (
              <View style={styles.offlineBadge}>
                <Ionicons name="download" size={8} color={COLORS.primary} />
                <Text style={styles.offlineText}>OFF</Text>
              </View>
            )}
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="time" size={12} color={COLORS.textMuted} />
              <Text style={styles.metaText}>{duration}min</Text>
            </View>
            <View style={styles.metaDot} />
            <View style={styles.metaItem}>
              <Ionicons name={levelConfig.icon as any} size={12} color={levelConfig.color} />
              <Text style={[styles.metaText, { color: levelConfig.color }]}>{workout.level || 'Intermediário'}</Text>
            </View>
            {rating > 0 && (
              <>
                <View style={styles.metaDot} />
                <View style={styles.metaItem}>
                  <Ionicons name="star" size={12} color={COLORS.attention} />
                  <Text style={styles.metaText}>{rating.toFixed(1)}</Text>
                </View>
              </>
            )}
          </View>

          {workout.exercises && (
            <View style={styles.exerciseBar}>
              <View style={[styles.exerciseFill, { width: `${Math.min(100, (workout.exercises as number / 10) * 100)}%` }]} />
            </View>
          )}
        </View>

        {showFavorite && (
          <TouchableOpacity
            style={styles.favoriteBtn}
            onPress={handleFavorite}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={22} color={isFavorite ? COLORS.error : COLORS.textMuted} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

export default memo(WorkoutCard);

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.sm },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardLeft: { marginRight: SPACING.md },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardCenter: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, marginBottom: SPACING.xs },
  name: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: COLORS.textTitle, flex: 1 },
  offlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: COLORS.primary + '20',
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
  },
  offlineText: { fontFamily: 'Montserrat_700Bold', fontSize: 8, color: COLORS.primary, letterSpacing: 1 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaText: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted },
  metaDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: COLORS.border },
  exerciseBar: { height: 3, backgroundColor: COLORS.surfaceOverlay, borderRadius: 1.5, marginTop: SPACING.sm, overflow: 'hidden' },
  exerciseFill: { height: '100%', backgroundColor: COLORS.primary + '60', borderRadius: 1.5 },
  favoriteBtn: { padding: SPACING.sm },
});
