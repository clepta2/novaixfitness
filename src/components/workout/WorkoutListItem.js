// src/components/workout/WorkoutListItem.js
// Item de treino na lista animado - NOVAIX FITNESS

import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

const INTENSITY_COLORS = {
  'Leve': COLORS.success,
  'Moderado': COLORS.attention,
  'Intenso': COLORS.error,
};

function WorkoutListItem({ workout, isActive, onPress, index = 0 }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(-10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, delay: index * 50, useNativeDriver: true }),
      Animated.timing(translateX, { toValue: 0, duration: 200, delay: index * 50, useNativeDriver: true }),
    ]).start();
  }, []);

  const isCompleted = workout.completed;
  const isLocked = workout.locked;
  const intensityColor = INTENSITY_COLORS[workout.intensity] || COLORS.primary;

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateX }] }}>
      <TouchableOpacity
        style={[styles.container, isActive && styles.active, isCompleted && styles.completed]}
        onPress={() => !isLocked && onPress?.(workout)}
        activeOpacity={isLocked ? 1 : 0.7}
      >
        <View style={styles.timeSection}>
          <Text style={styles.timeText}>{workout.time}</Text>
          <View style={[styles.intensityDot, { backgroundColor: intensityColor }]} />
        </View>

        <View style={styles.info}>
          <Text style={styles.name}>{workout.name}</Text>
          <Text style={styles.focus}>{workout.focus}</Text>
          <View style={styles.metaRow}>
            {workout.sets > 0 && <Text style={styles.meta}>{workout.sets}S</Text>}
            {workout.reps > 0 && <Text style={styles.meta}>• {workout.reps} Rep</Text>}
            <Text style={[styles.meta, { color: intensityColor }]}>• {workout.intensity}</Text>
          </View>
        </View>

        <View style={styles.status}>
          {isCompleted ? (
            <View style={styles.checkCircle}>
              <Ionicons name="checkmark" size={16} color={COLORS.background} />
            </View>
          ) : isLocked ? (
            <View style={styles.lockIcon}>
              <Ionicons name="lock-closed" size={16} color={COLORS.textMuted} />
            </View>
          ) : (
            <View style={styles.playIcon}>
              <Ionicons name="play" size={18} color={COLORS.primary} />
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default WorkoutListItem;

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, marginBottom: SPACING.xs, borderWidth: 1, borderColor: COLORS.border },
  active: { backgroundColor: COLORS.primary + '10', borderColor: COLORS.primary },
  completed: { opacity: 0.6 },
  timeSection: { width: 50, alignItems: 'center', marginRight: SPACING.md },
  timeText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.textTitle },
  intensityDot: { width: 6, height: 6, borderRadius: 3, marginTop: SPACING.xs },
  info: { flex: 1 },
  name: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: COLORS.textTitle },
  focus: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textDescription, marginTop: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, marginTop: SPACING.xs },
  meta: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted },
  status: { marginLeft: SPACING.sm },
  checkCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.success, justifyContent: 'center', alignItems: 'center' },
  lockIcon: { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.surfaceOverlay, justifyContent: 'center', alignItems: 'center' },
  playIcon: { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.primary + '15', justifyContent: 'center', alignItems: 'center' },
});
