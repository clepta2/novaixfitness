// src/components/workout/FavoriteWorkoutCard.tsx
// Card horizontal de favorito - NOVAIX FITNESS

import React, { useRef, useEffect, memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

const LEVEL_COLORS: Record<string, string> = {
  'Iniciante': COLORS.success, 'Intermediário': COLORS.attention, 'Avançado': COLORS.error,
};

interface FavoriteWorkout {
  id?: string;
  name: string;
  duration?: number;
  level?: string;
  category?: string;
  favoritedAt?: string;
}

interface FavoriteWorkoutCardProps {
  workout: FavoriteWorkout;
  onPress?: (workout: FavoriteWorkout) => void;
  onRemove?: (id?: string) => void;
  index?: number;
}

export default memo(function FavoriteWorkoutCard({ workout, onPress, onRemove, index = 0 }: FavoriteWorkoutCardProps): React.ReactElement {
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, tension: 30, friction: 8, delay: index * 50, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, delay: index * 50, useNativeDriver: true }),
    ]).start();
  }, []);

  const levelColor = LEVEL_COLORS[workout?.level || ''] || COLORS.primary;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity style={styles.card} onPress={() => onPress?.(workout)} activeOpacity={0.8}>
        <View style={styles.cardHeader}>
          <View style={styles.heartIcon}>
            <Ionicons name="heart" size={14} color={COLORS.error} />
          </View>
          {workout.favoritedAt && <Text style={styles.time}>{workout.favoritedAt}</Text>}
        </View>

        <Text style={styles.name} numberOfLines={2}>{workout.name}</Text>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="time" size={12} color={COLORS.textMuted} />
            <Text style={styles.metaText}>{workout.duration} min</Text>
          </View>
          <View style={[styles.levelBadge, { backgroundColor: levelColor + '20' }]}>
            <Text style={[styles.levelText, { color: levelColor }]}>{workout.level?.slice(0, 3)}</Text>
          </View>
        </View>

        {workout.category && (
          <View style={styles.categoryRow}>
            <Ionicons name="pricetag" size={10} color={COLORS.textMuted} />
            <Text style={styles.categoryText}>{workout.category}</Text>
          </View>
        )}
      </TouchableOpacity>

      {onRemove && (
        <TouchableOpacity style={styles.removeBtn} onPress={() => onRemove?.(workout.id)}>
          <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: { width: 160, marginRight: SPACING.md },
  card: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.error + '30' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  heartIcon: { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.error + '15', justifyContent: 'center', alignItems: 'center' },
  time: { fontFamily: 'Inter_400Regular', fontSize: 9, color: COLORS.textMuted },
  name: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: COLORS.textTitle, marginBottom: SPACING.sm, minHeight: 36 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xs },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaText: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted },
  levelBadge: { paddingHorizontal: SPACING.xs, paddingVertical: 2, borderRadius: BORDER_RADIUS.sm },
  levelText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 9, letterSpacing: 0.5 },
  categoryRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  categoryText: { fontFamily: 'Inter_400Regular', fontSize: 9, color: COLORS.textMuted },
  removeBtn: { position: 'absolute', top: SPACING.sm, right: SPACING.sm },
});
