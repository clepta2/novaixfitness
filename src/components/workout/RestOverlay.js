// src/components/workout/RestOverlay.js
// Overlay de descanso - NOVAIX FITNESS

import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

function RestOverlay({ timeRemaining, nextExercise, onSkip }) {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="pause-circle" size={48} color={COLORS.success} />
        <Text style={styles.title}>DESCANSO</Text>
        <Text style={styles.timer}>{timeString}</Text>

        {nextExercise && (
          <View style={styles.nextCard}>
            <Text style={styles.nextLabel}>PROXIMO EXERCICIO</Text>
            <Text style={styles.nextName}>{nextExercise.name}</Text>
            <Text style={styles.nextInfo}>{nextExercise.sets || 4} series x {nextExercise.reps || 10} reps</Text>
          </View>
        )}

        <TouchableOpacity style={styles.skipBtn} onPress={onSkip}>
          <Ionicons name="play-skip-forward" size={20} color={COLORS.background} />
          <Text style={styles.skipText}>PULAR DESCANSO</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default memo(RestOverlay);

const styles = StyleSheet.create({
  container: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(18, 22, 26, 0.95)', justifyContent: 'center', alignItems: 'center', zIndex: 100 },
  content: { alignItems: 'center', gap: SPACING.lg },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.success, letterSpacing: 3 },
  timer: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 72, color: COLORS.success },
  nextCard: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.xl, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border, minWidth: 200 },
  nextLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.textMuted, letterSpacing: 1, marginBottom: SPACING.xs },
  nextName: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle, marginBottom: 4 },
  nextInfo: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textDescription },
  skipBtn: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: COLORS.primary, paddingHorizontal: SPACING.xl, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.lg },
  skipText: { fontFamily: 'Montserrat_700Bold', fontSize: 13, color: COLORS.background, letterSpacing: 1 },
});
