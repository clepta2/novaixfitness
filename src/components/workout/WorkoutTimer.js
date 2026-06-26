// src/components/workout/WorkoutTimer.js
// Timer de treino com anel de progresso circular - NOVAIX FITNESS

import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';

const SIZE = 200;
const STROKE = 8;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function WorkoutTimer({ timeRemaining, totalTime, phase, exerciseName, setInfo }) {
  const progress = totalTime > 0 ? (totalTime - timeRemaining) / totalTime : 0;
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);
  const isResting = phase === 'resting';
  const color = isResting ? COLORS.success : COLORS.primary;

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <View style={styles.container}>
      <Svg width={SIZE} height={SIZE} style={styles.svg}>
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke={COLORS.border}
          strokeWidth={STROKE}
          fill="none"
        />
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke={color}
          strokeWidth={STROKE}
          fill="none"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
        />
      </Svg>

      <View style={styles.overlay}>
        <Text style={[styles.phase, { color }]}>{isResting ? 'DESCANSO' : 'EXERCICIO'}</Text>
        <Text style={[styles.time, { color }]}>{timeString}</Text>
        {exerciseName && (
          <Text style={styles.exerciseName} numberOfLines={1}>{exerciseName}</Text>
        )}
        {setInfo && (
          <Text style={styles.setInfo}>{setInfo}</Text>
        )}
      </View>
    </View>
  );
}

export default memo(WorkoutTimer);

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  svg: { transform: [{ rotate: '0deg' }] },
  overlay: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  phase: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, letterSpacing: 2, marginBottom: 4 },
  time: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 48, letterSpacing: 2 },
  exerciseName: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textSecondary, marginTop: SPACING.sm, textAlign: 'center', maxWidth: 160 },
  setInfo: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted, marginTop: 4 },
});
