import { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, Animated, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

interface BreathingPhase {
  type: 'inhale' | 'hold' | 'exhale';
  duration: number;
  label: string;
}

interface BreathingExerciseData {
  phases: BreathingPhase[];
  cycles: number;
}

interface BreathingExerciseProps {
  exercise: BreathingExerciseData;
  onComplete?: (elapsedTime: number) => void;
}

const PHASE_COLORS: Record<string, string> = {
  inhale: COLORS.primary,
  hold: COLORS.secondary,
  exhale: COLORS.success,
};

const MIN_SIZE = 120;
const MAX_SIZE = 220;

export default function BreathingExercise({ exercise, onComplete }: BreathingExerciseProps): React.JSX.Element {
  const scaleAnim = useRef<Animated.Value>(new Animated.Value(1)).current;
  const [isActive, setIsActive] = useState<boolean>(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState<number>(0);
  const [phaseCountdown, setPhaseCountdown] = useState<number>(0);
  const [currentCycle, setCurrentCycle] = useState<number>(1);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentPhase = exercise.phases[currentPhaseIndex];
  const phaseColor = PHASE_COLORS[currentPhase?.type] || COLORS.primary;
  const totalCycles = exercise.cycles;
  const totalPhases = exercise.phases.length;

  const formatTime = useCallback((seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }, []);

  const animatePhase = useCallback((phase: BreathingPhase): void => {
    const toValue = phase.type === 'inhale' ? 1.6 : phase.type === 'exhale' ? 1 : 1.6;
    Animated.timing(scaleAnim, {
      toValue,
      duration: phase.duration * 1000,
      useNativeDriver: false,
    }).start();
  }, [scaleAnim]);

  const startExercise = useCallback((): void => {
    setIsActive(true);
    setCurrentPhaseIndex(0);
    setCurrentCycle(1);
    setElapsedTime(0);
    setPhaseCountdown(exercise.phases[0].duration);
    animatePhase(exercise.phases[0]);

    timerRef.current = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
  }, [exercise, animatePhase]);

  const stopExercise = useCallback((): void => {
    setIsActive(false);
    scaleAnim.setValue(1);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    setCurrentPhaseIndex(0);
    setPhaseCountdown(0);
    setCurrentCycle(1);
    setElapsedTime(0);
  }, [scaleAnim]);

  useEffect((): (() => void) | undefined => {
    if (!isActive) return;

    intervalRef.current = setInterval(() => {
      setPhaseCountdown(prev => {
        if (prev <= 1) {
          const nextPhaseIdx = (currentPhaseIndex + 1) % totalPhases;
          const nextCycle = nextPhaseIdx === 0 ? currentCycle + 1 : currentCycle;

          if (nextCycle > totalCycles) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (timerRef.current) clearInterval(timerRef.current);
            setIsActive(false);
            scaleAnim.setValue(1);
            if (onComplete) onComplete(elapsedTime);
            return 0;
          }

          setCurrentPhaseIndex(nextPhaseIdx);
          setCurrentCycle(nextCycle);
          animatePhase(exercise.phases[nextPhaseIdx]);
          return exercise.phases[nextPhaseIdx].duration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isActive, currentPhaseIndex, currentCycle, totalCycles, totalPhases, exercise, animatePhase, onComplete, elapsedTime, scaleAnim]);

  return (
    <View style={styles.container}>
      <View style={styles.timerBar}>
        <Ionicons name="time-outline" size={14} color={COLORS.textMuted} />
        <Text style={styles.timerText}>{formatTime(elapsedTime)}</Text>
      </View>

      <TouchableOpacity style={styles.circleContainer} onPress={isActive ? stopExercise : startExercise} activeOpacity={0.8}>
        <Animated.View style={[styles.circle, { transform: [{ scale: scaleAnim }], backgroundColor: phaseColor + '20', borderColor: phaseColor }]}>
          <Text style={[styles.phaseLabel, { color: phaseColor }]}>{isActive ? currentPhase.label : 'TOQUE PARA INICIAR'}</Text>
          {isActive && <Text style={[styles.countdown, { color: phaseColor }]}>{phaseCountdown}</Text>}
        </Animated.View>
      </TouchableOpacity>

      {isActive && (
        <View style={styles.progressInfo}>
          <Text style={styles.cycleText}>Ciclo {currentCycle}/{totalCycles}</Text>
          <View style={styles.progressDots}>
            {exercise.phases.map((_, idx) => (
              <View key={idx} style={[styles.dot, idx === currentPhaseIndex && { backgroundColor: phaseColor }]} />
            ))}
          </View>
        </View>
      )}

      <TouchableOpacity style={styles.stopBtn} onPress={isActive ? stopExercise : startExercise}>
        <Ionicons name={isActive ? 'stop-circle' : 'play-circle'} size={48} color={isActive ? COLORS.error : COLORS.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: SPACING.xl },
  timerBar: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, marginBottom: SPACING.xl },
  timerText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: COLORS.textMuted },
  circleContainer: { marginBottom: SPACING.xl },
  circle: { width: MAX_SIZE, height: MAX_SIZE, borderRadius: MAX_SIZE / 2, borderWidth: 3, justifyContent: 'center', alignItems: 'center' },
  phaseLabel: { fontFamily: 'Montserrat_700Bold', fontSize: 14, letterSpacing: 1, textTransform: 'uppercase', textAlign: 'center' },
  countdown: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 48, marginTop: SPACING.xs },
  progressInfo: { alignItems: 'center', marginBottom: SPACING.lg },
  cycleText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textDescription, marginBottom: SPACING.sm },
  progressDots: { flexDirection: 'row', gap: SPACING.sm },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.border },
  stopBtn: { marginTop: SPACING.sm },
});
