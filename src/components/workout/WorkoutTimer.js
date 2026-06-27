// src/components/workout/WorkoutTimer.js
// Timer de treino com modos flexíveis - NOVAIX FITNESS

import React, { memo, useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

const SIZE = 220;
const STROKE = 12;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const MODE_CONFIG = {
  countdown: { icon: 'timer', label: 'CRONÔMETRO', color: COLORS.primary },
  stopwatch: { icon: 'stopwatch', label: 'CRONÔMETRO CORRIDO', color: COLORS.success },
  free: { icon: 'infinite', label: 'MODO LIVRE', color: COLORS.info },
};

function formatTime(seconds) {
  const abs = Math.abs(seconds);
  const h = Math.floor(abs / 3600);
  const m = Math.floor((abs % 3600) / 60);
  const s = abs % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function WorkoutTimer({
  timeRemaining,
  totalTime,
  phase,
  exerciseName,
  setInfo,
  currentSet,
  totalSets,
  logs,
  calories,
  xpEarned,
  timerMode = 'countdown',
  elapsed = 0,
}) {
  const isResting = phase === 'resting';
  const isPaused = phase === 'paused';
  const modeConfig = MODE_CONFIG[timerMode] || MODE_CONFIG.countdown;
  const color = isResting ? COLORS.success : modeConfig.color;

  let displayTime, progress;
  if (timerMode === 'stopwatch') {
    displayTime = elapsed;
    progress = 0;
  } else if (timerMode === 'free') {
    displayTime = elapsed;
    progress = 0;
  } else {
    displayTime = timeRemaining;
    progress = totalTime > 0 ? (totalTime - timeRemaining) / totalTime : 0;
  }

  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const prevPhaseRef = useRef(phase);
  const prevTimeRef = useRef(timeRemaining);

  useEffect(() => {
    Animated.spring(scaleAnim, { toValue: 1, tension: 30, friction: 8, useNativeDriver: true }).start();
  }, []);

  useEffect(() => {
    if (phase === 'exercising' && !isPaused) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.02, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [phase, isPaused]);

  useEffect(() => {
    if (prevPhaseRef.current !== phase) {
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
      ]).start();
      prevPhaseRef.current = phase;
    }
  }, [phase]);

  useEffect(() => {
    if (timerMode === 'countdown' && timeRemaining <= 5 && timeRemaining > 0 && timeRemaining !== prevTimeRef.current) {
      try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
    }
    if (timeRemaining === 0 && prevTimeRef.current > 0) {
      try { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch {}
    }
    prevTimeRef.current = timeRemaining;
  }, [timeRemaining, timerMode]);

  const completedSets = logs?.filter(l => l.exerciseName === exerciseName).length || 0;
  const isUrgent = timerMode === 'countdown' && timeRemaining <= 5 && timeRemaining > 0 && !isResting;
  const isLow = timerMode === 'countdown' && timeRemaining <= 10 && timeRemaining > 5 && !isResting;
  const timeString = formatTime(displayTime);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.timerWrap, { transform: [{ scale: Animated.multiply(pulseAnim, scaleAnim) }] }]}>
        <Svg width={SIZE} height={SIZE}>
          <Defs>
            <LinearGradient id="timerGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={color} />
              <Stop offset="1" stopColor={color} stopOpacity="0.5" />
            </LinearGradient>
          </Defs>
          <Circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} stroke={COLORS.surfaceOverlay} strokeWidth={STROKE} fill="none" />
          <Circle
            cx={SIZE / 2} cy={SIZE / 2} r={RADIUS}
            stroke="url(#timerGrad)" strokeWidth={STROKE} fill="none"
            strokeDasharray={CIRCUMFERENCE} strokeDashoffset={strokeDashoffset}
            strokeLinecap="round" transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
          />
          {isUrgent && <Circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS + STROKE / 2 + 4} stroke={COLORS.error} strokeWidth={2} fill="none" opacity={0.5} />}
        </Svg>

        <View style={styles.overlay}>
          <View style={[styles.phaseContainer, { backgroundColor: color + '20' }]}>
            <Ionicons name={modeConfig.icon} size={12} color={color} />
            <Text style={[styles.phase, { color }]}>{isResting ? 'DESCANSO' : isPaused ? 'PAUSADO' : modeConfig.label}</Text>
          </View>

          <Text style={[styles.time, { color }, isUrgent && styles.timeUrgent, isLow && styles.timeLow]}>{timeString}</Text>

          {timerMode === 'countdown' && <Text style={styles.progress}>{Math.round(progress * 100)}%</Text>}

          {exerciseName && <Text style={styles.exerciseName} numberOfLines={1}>{exerciseName}</Text>}

          {setInfo && (
            <View style={styles.setBadge}>
              <Text style={styles.setText}>{setInfo}</Text>
            </View>
          )}

          {!isResting && totalSets > 0 && timerMode === 'countdown' && (
            <View style={styles.repRow}>
              {Array.from({ length: totalSets }).map((_, i) => (
                <View key={i} style={[styles.repDot, i < completedSets && styles.repDotDone]} />
              ))}
            </View>
          )}
        </View>
      </Animated.View>

      {(calories > 0 || xpEarned > 0) && (
        <View style={styles.statsRow}>
          {calories > 0 && (
            <View style={styles.statItem}>
              <Ionicons name="flame" size={14} color={COLORS.secondary} />
              <Text style={styles.statText}>{calories} kcal</Text>
            </View>
          )}
          {xpEarned > 0 && (
            <View style={styles.statItem}>
              <Ionicons name="star" size={14} color={COLORS.primary} />
              <Text style={[styles.statText, { color: COLORS.primary }]}>+{xpEarned} XP</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

export default memo(WorkoutTimer);

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  overlay: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  phaseContainer: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: SPACING.md, paddingVertical: 4, borderRadius: BORDER_RADIUS.sm, marginBottom: SPACING.sm },
  phase: { fontFamily: 'Montserrat_700Bold', fontSize: 10, letterSpacing: 2 },
  time: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 56, letterSpacing: 2 },
  timeUrgent: { color: COLORS.error }, timeLow: { color: COLORS.attention },
  progress: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  exerciseName: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, marginTop: SPACING.sm, textAlign: 'center', maxWidth: 180 },
  setBadge: { backgroundColor: COLORS.surfaceOverlay, paddingHorizontal: SPACING.md, paddingVertical: 3, borderRadius: BORDER_RADIUS.sm, marginTop: SPACING.xs },
  setText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textTitle },
  repRow: { flexDirection: 'row', gap: 6, marginTop: SPACING.md },
  repDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.surfaceOverlay },
  repDotDone: { backgroundColor: COLORS.primary },
  statsRow: { flexDirection: 'row', gap: SPACING.xl, marginTop: SPACING.lg },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  statText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: COLORS.textTitle },
});
