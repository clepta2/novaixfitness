
import { useState, useEffect, useMemo , useRef} from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../src/constants/colors';
import { ErrorBoundary } from '../src/components';
import { layout, typography } from '../src/styles';
import { speakWelcome } from '../src/services/voiceCoach';
import { WARMUP_EXERCISES as EXERCISES } from '../src/data/warmupExercises';
import { styles } from '../src/styles/warmupStyles';

export default function WarmupScreen() {
  const router = useRouter();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [countdown, setCountdown] = useState(null);
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState([]);
  const anim = useRef(new Animated.Value(0)).current;

  const current = EXERCISES[currentIdx];
  const progress = completed.length / EXERCISES.length;

  useEffect(() => {
    Animated.spring(anim, { toValue: 1, tension: 30, friction: 8, useNativeDriver: true }).start();
  }, [currentIdx]);

  useEffect(() => {
    if (countdown === null || !started) return;
    if (countdown <= 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      completeExercise();
      return;
    }
    const id = setInterval(() => setCountdown(c => c - 1), 1000);
    return () => clearInterval(id);
  }, [countdown, started]);

  const startExercise = () => {
    setStarted(true);
    setCountdown(current.duration);
    anim.setValue(0);
    Animated.spring(anim, { toValue: 1, tension: 30, friction: 8, useNativeDriver: true }).start();
  };

  const completeExercise = () => {
    const newCompleted = [...completed, currentIdx];
    setCompleted(newCompleted);
    setStarted(false);
    setCountdown(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});

    if (currentIdx < EXERCISES.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      speakWelcome('Aquecimento completo');
    }
  };

  const skipExercise = () => {
    setStarted(false);
    setCountdown(null);
    if (currentIdx < EXERCISES.length - 1) setCurrentIdx(currentIdx + 1);
  };

  return (
    <ErrorBoundary screenName="Warmup">
    <View style={layout.screen}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Voltar" accessibilityRole="button">
          <Ionicons name="arrow-back" size={24} color={COLORS.textTitle} />
        </TouchableOpacity>
        <Text style={typography.h2}>Aquecimento</Text>
        <Text style={styles.counter}>{completed.length}/{EXERCISES.length}</Text>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.exerciseCard, { opacity: anim, transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) }] }]}>
          <View style={styles.exerciseIcon}>
            <Ionicons name={current.icon as any} size={40} color={COLORS.primary} />
          </View>
          <Text style={styles.exerciseName}>{current.name}</Text>
          <Text style={styles.exerciseDesc}>{current.desc}</Text>

          {countdown !== null ? (
            <View style={styles.timerSection}>
              <Text style={styles.timerValue}>{countdown}s</Text>
              <View style={styles.timerBar}>
                <View style={[styles.timerFill, { width: `${(countdown / current.duration) * 100}%` }]} />
              </View>
            </View>
          ) : null}

          <View style={styles.actions}>
            {!started ? (
              <TouchableOpacity style={styles.startBtn} onPress={startExercise} activeOpacity={0.8} accessibilityLabel="Iniciar exercÃ­cio" accessibilityRole="button">
                <Ionicons name="play" size={20} color={COLORS.background} />
                <Text style={styles.startBtnText}>INICIAR</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.skipBtn} onPress={skipExercise} activeOpacity={0.8} accessibilityLabel="Pular exercÃ­cio" accessibilityRole="button">
                <Text style={styles.skipBtnText}>PULAR</Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>

        <View style={styles.exerciseList}>
          {EXERCISES.map((ex, i) => (
            <View key={i} style={[styles.exerciseRow, i === currentIdx && styles.exerciseRowActive, completed.includes(i) && styles.exerciseRowDone]}>
              <View style={[styles.rowDot, completed.includes(i) && styles.rowDotDone]}>
                {completed.includes(i) ? <Ionicons name="checkmark" size={12} color="#fff" /> : <Text style={styles.rowNum}>{i + 1}</Text>}
              </View>
              <Text style={[styles.rowText, completed.includes(i) && styles.rowTextDone]}>{ex.name}</Text>
              <Text style={styles.rowDuration}>{ex.duration}s</Text>
            </View>
          ))}
        </View>

        {completed.length === EXERCISES.length && (
          <TouchableOpacity style={styles.doneBtn} onPress={() => router.back()} activeOpacity={0.8} accessibilityLabel="Aquecimento concluÃ­do, voltar" accessibilityRole="button">
            <Ionicons name="checkmark-circle" size={20} color={COLORS.background} />
            <Text style={styles.doneBtnText}>AQUECIMENTO CONCLUÃDO</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
    </ErrorBoundary>
  );
}
