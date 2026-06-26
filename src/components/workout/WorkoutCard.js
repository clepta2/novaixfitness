// src/components/workout/WorkoutCard.js
// Card de treino reutilizável - NOVAIX FITNESS

import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

function WorkoutCard({ workout, onPress, onFavorite, showFavorite = true }) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress?.(workout)} activeOpacity={0.8}>
      <View style={styles.icon}>
        <Ionicons name="play-circle" size={24} color={COLORS.primary} />
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{workout.name}</Text>
        <Text style={styles.meta}>
          {workout.category} • {workout.duration} min • {workout.level}
        </Text>
      </View>
      {showFavorite && (
        <TouchableOpacity onPress={() => onFavorite?.(workout.id)}>
          <Ionicons name="heart-outline" size={20} color={COLORS.textMuted} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

export default memo(WorkoutCard);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  info: { flex: 1 },
  name: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: COLORS.textTitle },
  meta: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
});
