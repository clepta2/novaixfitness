// src/components/workout/RestOverlay.js
// Overlay de descanso com visual premium - NOVAIX FITNESS

import React, { memo, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { REST, COMPLETION } from '../../data/workoutTexts';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { formatTimeShort, CIRCLE_CONSTANTS } from '../../helpers/timer';

const { SIZE: CIRCLE_SIZE, STROKE: CIRCLE_STROKE, RADIUS: CIRCLE_RADIUS, CIRCUMFERENCE: CIRCLE_CIRCUMFERENCE } = CIRCLE_CONSTANTS;

function RestOverlay({ timeRemaining, totalTime, nextExercise, onSkip, nextSet, nextIndex, totalExercises }) {
  const isUrgent = timeRemaining <= 5;
  const timerColor = isUrgent ? COLORS.error : COLORS.success;
  const progress = totalTime > 0 ? (totalTime - timeRemaining) / totalTime : 0;
  const strokeDashoffset = CIRCLE_CIRCUMFERENCE * (1 - progress);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const prevTimeRef = useRef(timeRemaining);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 30, friction: 8, useNativeDriver: true }),
    ]).start();
  }, []);

  useEffect(() => {
    if (isUrgent) {
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 150, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
      ]).start();
      try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
    }
    if (timeRemaining === 0 && prevTimeRef.current > 0) {
      try { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch {}
    }
    prevTimeRef.current = timeRemaining;
  }, [timeRemaining, isUrgent]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Animated.View style={[styles.content, { transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.timerWrap}>
          <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE}>
            <Defs>
              <LinearGradient id="restGrad" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor={timerColor} />
                <Stop offset="1" stopColor={timerColor} stopOpacity="0.5" />
              </LinearGradient>
            </Defs>
            <Circle cx={CIRCLE_SIZE / 2} cy={CIRCLE_SIZE / 2} r={CIRCLE_RADIUS} stroke={COLORS.surfaceOverlay} strokeWidth={CIRCLE_STROKE} fill="none" />
            <Circle
              cx={CIRCLE_SIZE / 2} cy={CIRCLE_SIZE / 2} r={CIRCLE_RADIUS}
              stroke="url(#restGrad)" strokeWidth={CIRCLE_STROKE} fill="none"
              strokeDasharray={CIRCLE_CIRCUMFERENCE} strokeDashoffset={strokeDashoffset}
              strokeLinecap="round" transform={`rotate(-90 ${CIRCLE_SIZE / 2} ${CIRCLE_SIZE / 2})`}
            />
          </Svg>

          <View style={styles.timerOverlay}>
            <View style={[styles.phaseBadge, { backgroundColor: timerColor + '20' }]}>
              <Ionicons name="moon" size={12} color={timerColor} />
              <Text style={[styles.phaseText, { color: timerColor }]}>{REST.phaseLabel}</Text>
            </View>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <Text style={[styles.timer, { color: timerColor }]}>{formatTimeShort(timeRemaining)}</Text>
            </Animated.View>
            <Text style={styles.progressPct}>{Math.round(progress * 100)}%</Text>
          </View>
        </View>

        <Animated.View style={[styles.nextCard, { transform: [{ translateY: slideAnim }] }]}>
          {nextExercise && (
            <>
              <View style={styles.nextHeader}>
                <Ionicons name="arrow-forward-circle" size={20} color={COLORS.primary} />
                <Text style={styles.nextLabel}>{REST.nextExerciseLabel}</Text>
              </View>
              <Text style={styles.nextName}>{nextExercise.name}</Text>
              <View style={styles.nextMeta}>
                <View style={styles.nextMetaItem}>
                  <Ionicons name="repeat" size={14} color={COLORS.textMuted} />
                  <Text style={styles.nextMetaText}>{nextExercise.sets || 4}x{nextExercise.reps || 10}</Text>
                </View>
                <View style={styles.nextMetaDivider} />
                <View style={styles.nextMetaItem}>
                  <Ionicons name="time" size={14} color={COLORS.textMuted} />
                  <Text style={styles.nextMetaText}>{nextExercise.rest || 60}s</Text>
                </View>
                {nextExercise.muscle && (
                  <>
                    <View style={styles.nextMetaDivider} />
                    <View style={styles.nextMetaItem}>
                      <Ionicons name="barbell" size={14} color={COLORS.textMuted} />
                      <Text style={styles.nextMetaText}>{nextExercise.muscle}</Text>
                    </View>
                  </>
                )}
              </View>
              {totalExercises > 1 && (
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${((nextIndex + 1) / totalExercises) * 100}%` }]} />
                </View>
              )}
              <Text style={styles.progressText}>{nextIndex + 1}/{totalExercises} {COMPLETION.exercisesUnit}</Text>
            </>
          )}
        </Animated.View>

        <TouchableOpacity style={styles.skipBtn} onPress={onSkip} activeOpacity={0.8}>
          <Ionicons name="play-skip-forward" size={20} color={COLORS.background} />
          <Text style={styles.skipText}>{REST.skipRest}</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}

export default memo(RestOverlay);

const styles = StyleSheet.create({
  container: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(18, 22, 26, 0.98)', justifyContent: 'center', alignItems: 'center', zIndex: 100 },
  content: { alignItems: 'center', gap: SPACING.xl },
  timerWrap: { position: 'relative', width: CIRCLE_SIZE, height: CIRCLE_SIZE, justifyContent: 'center', alignItems: 'center' },
  timerOverlay: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  phaseBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: SPACING.md, paddingVertical: 4, borderRadius: BORDER_RADIUS.sm, marginBottom: SPACING.sm },
  phaseText: { fontFamily: 'Montserrat_700Bold', fontSize: 10, letterSpacing: 2 },
  timer: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 52, letterSpacing: 2 },
  progressPct: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textMuted, marginTop: 4 },
  nextCard: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.xl, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border, minWidth: 260 },
  nextHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  nextLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.primary, letterSpacing: 1 },
  nextName: { fontFamily: 'Montserrat_700Bold', fontSize: 18, color: COLORS.textTitle, marginBottom: SPACING.sm },
  nextMeta: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  nextMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  nextMetaText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textDescription },
  nextMetaDivider: { width: 1, height: 12, backgroundColor: COLORS.border },
  progressBar: { height: 4, backgroundColor: COLORS.surfaceOverlay, borderRadius: 2, overflow: 'hidden', marginBottom: SPACING.xs },
  progressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 2 },
  progressText: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted },
  skipBtn: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: COLORS.primary, paddingHorizontal: SPACING.xl, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.lg },
  skipText: { fontFamily: 'Montserrat_700Bold', fontSize: 13, color: COLORS.background, letterSpacing: 1 },
});
