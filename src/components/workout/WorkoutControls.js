// src/components/workout/WorkoutControls.js
// Controles do treino com visual premium - NOVAIX FITNESS

import React, { memo, useCallback, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

function ControlButton({ icon, size = 22, color, bgColor, borderColor, onPress, label, style }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = useCallback(() => {
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); } catch {}
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.9, duration: 80, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
    ]).start();
    onPress?.();
  }, [onPress]);

  return (
    <View style={[styles.btnContainer, style]}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: bgColor, borderColor }]}
          onPress={handlePress}
          activeOpacity={0.7}
        >
          <Ionicons name={icon} size={size} color={color} />
        </TouchableOpacity>
      </Animated.View>
      {label && <Text style={styles.btnLabel}>{label}</Text>}
    </View>
  );
}

function WorkoutControls({ phase, onPause, onResume, onSkip, onStop, onMarkComplete, currentSet, totalSets }) {
  const isPaused = phase === 'paused';
  const isExercising = phase === 'exercising';
  const isResting = phase === 'resting';

  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isExercising) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
          Animated.timing(glowAnim, { toValue: 0, duration: 1500, useNativeDriver: true }),
        ])
      ).start();
    } else {
      glowAnim.setValue(0);
    }
  }, [isExercising]);

  const glowOpacity = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.6] });

  return (
    <View style={styles.container}>
      {isExercising && (
        <View style={styles.setInfo}>
          <Text style={styles.setText}>SÉRIE {currentSet || 1} DE {totalSets || 4}</Text>
        </View>
      )}

      <View style={styles.row}>
        <ControlButton
          icon="stop"
          size={20}
          color={COLORS.error}
          bgColor={COLORS.surface}
          borderColor={COLORS.error}
          onPress={onStop}
          label="PARAR"
        />

        <View style={styles.mainBtnWrapper}>
          {isExercising && (
            <Animated.View style={[styles.glow, { opacity: glowOpacity, backgroundColor: COLORS.primary }]} />
          )}
          <ControlButton
            icon={isPaused ? 'play' : 'pause'}
            size={32}
            color={COLORS.background}
            bgColor={isPaused ? COLORS.success : COLORS.primary}
            borderColor="transparent"
            onPress={isPaused ? onResume : onPause}
            style={styles.mainBtn}
          />
        </View>

        <ControlButton
          icon="play-skip-forward"
          size={20}
          color={COLORS.textMuted}
          bgColor={COLORS.surface}
          borderColor={COLORS.border}
          onPress={onSkip}
          label="PULAR"
        />
      </View>

      {isExercising && (
        <TouchableOpacity style={styles.completeBtn} onPress={onMarkComplete} activeOpacity={0.8}>
          <View style={styles.completeIcon}>
            <Ionicons name="checkmark" size={24} color={COLORS.background} />
          </View>
          <View style={styles.completeInfo}>
            <Text style={styles.completeText}>CONCLUIR SÉRIE</Text>
            <Text style={styles.completeSubtext}>Avançar para próximo exercício</Text>
          </View>
          <Ionicons name="arrow-forward" size={18} color={COLORS.background + '80'} />
        </TouchableOpacity>
      )}

      {isResting && (
        <View style={styles.restHint}>
          <Ionicons name="information-circle" size={14} color={COLORS.textMuted} />
          <Text style={styles.restHintText}>Aguarde o descanso ou pule para o próximo</Text>
        </View>
      )}
    </View>
  );
}

export default memo(WorkoutControls);

const styles = StyleSheet.create({
  container: { gap: SPACING.md },
  setInfo: { alignItems: 'center', marginBottom: SPACING.xs },
  setText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textMuted, letterSpacing: 2 },
  row: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: SPACING.xl },
  btnContainer: { alignItems: 'center', gap: SPACING.xs },
  btn: { justifyContent: 'center', alignItems: 'center', borderWidth: 2 },
  mainBtnWrapper: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
  glow: { position: 'absolute', width: 80, height: 80, borderRadius: 40 },
  mainBtn: { width: 72, height: 72, borderRadius: 36 },
  btnLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 9, color: COLORS.textMuted, letterSpacing: 1 },
  completeBtn: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, backgroundColor: COLORS.success, paddingVertical: SPACING.lg, paddingHorizontal: SPACING.xl, borderRadius: BORDER_RADIUS.lg },
  completeIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.background + '20', justifyContent: 'center', alignItems: 'center' },
  completeInfo: { flex: 1 },
  completeText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.background, letterSpacing: 1 },
  completeSubtext: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.background + 'AA' },
  restHint: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.xs, paddingVertical: SPACING.sm },
  restHintText: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted },
});
