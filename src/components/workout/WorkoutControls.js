// src/components/workout/WorkoutControls.js
// Controles do treino - NOVAIX FITNESS

import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

function WorkoutControls({ phase, onPause, onResume, onSkip, onStop, onMarkComplete }) {
  const isPaused = phase === 'paused';
  const isExercising = phase === 'exercising';

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity style={styles.stopBtn} onPress={onStop}>
          <Ionicons name="stop" size={24} color={COLORS.error} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.mainBtn, isPaused && styles.mainBtnResume]}
          onPress={isPaused ? onResume : onPause}
        >
          <Ionicons name={isPaused ? 'play' : 'pause'} size={32} color={COLORS.background} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipBtn} onPress={onSkip}>
          <Ionicons name="play-skip-forward" size={24} color={COLORS.textMuted} />
        </TouchableOpacity>
      </View>

      {isExercising && (
        <TouchableOpacity style={styles.completeBtn} onPress={onMarkComplete}>
          <Ionicons name="checkmark-circle" size={20} color={COLORS.background} />
          <Text style={styles.completeText}>CONCLUIR SERIE</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default memo(WorkoutControls);

const styles = StyleSheet.create({
  container: { gap: SPACING.md },
  row: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: SPACING.xl },
  stopBtn: { width: 52, height: 52, borderRadius: 26, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: COLORS.error },
  mainBtn: { width: 72, height: 72, borderRadius: 36, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  mainBtnResume: { backgroundColor: COLORS.success },
  skipBtn: { width: 52, height: 52, borderRadius: 26, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: COLORS.border },
  completeBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.success, paddingVertical: SPACING.lg, borderRadius: BORDER_RADIUS.lg },
  completeText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.background, letterSpacing: 1 },
});
