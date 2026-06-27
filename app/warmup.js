import { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../src/constants/spacing';
import { layout, typography } from '../src/styles';
import { speakWelcome } from '../src/services/voiceCoach';

const EXERCISES = [
  { name: 'Rotação de Pescoço', duration: 30, icon: 'accessibility', desc: 'Gire lentamente em ambos os sentidos' },
  { name: 'Círculos de Braço', duration: 30, icon: 'body', desc: 'Círculos amplos para frente e trás' },
  { name: 'Agachamento Dinâmico', duration: 40, icon: 'walk', desc: 'Agache e suba devagar, 12 reps' },
  { name: 'Alongamento de Quadril', duration: 30, icon: 'fitness', desc: 'Estique cada lado por 15s' },
  { name: 'Jumping Jacks Leve', duration: 30, icon: 'pulse', desc: 'Pule abrindo braços e pernas' },
  { name: 'Mountain Climber Lento', duration: 30, icon: 'trending-up', desc: 'Alterne joelhos no peito, controle o ritmo' },
];

export default function WarmupScreen() {
  const router = useRouter();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [countdown, setCountdown] = useState(null);
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState([]);
  const anim = useMemo(() => new Animated.Value(0), []);

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
    <View style={layout.screen}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
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
            <Ionicons name={current.icon} size={40} color={COLORS.primary} />
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
              <TouchableOpacity style={styles.startBtn} onPress={startExercise} activeOpacity={0.8}>
                <Ionicons name="play" size={20} color="#12161A" />
                <Text style={styles.startBtnText}>INICIAR</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.skipBtn} onPress={skipExercise} activeOpacity={0.8}>
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
          <TouchableOpacity style={styles.doneBtn} onPress={() => router.back()} activeOpacity={0.8}>
            <Ionicons name="checkmark-circle" size={20} color="#12161A" />
            <Text style={styles.doneBtnText}>AQUECIMENTO CONCLUÍDO</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: SPACING.xl, paddingBottom: SPACING.md },
  counter: { fontFamily: 'Montserrat-Bold', fontSize: 14, color: COLORS.primary },
  progressTrack: { height: 4, backgroundColor: COLORS.surface, marginHorizontal: SPACING.xl, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 2 },
  content: { padding: SPACING.xl },
  exerciseCard: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.xl, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.xl },
  exerciseIcon: { width: 72, height: 72, borderRadius: 36, backgroundColor: COLORS.primary + '15', justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.md },
  exerciseName: { fontFamily: 'Montserrat-Bold', fontSize: 18, color: COLORS.textTitle, marginBottom: 4, textAlign: 'center' },
  exerciseDesc: { fontFamily: 'Inter-Regular', fontSize: 13, color: COLORS.textMuted, textAlign: 'center', marginBottom: SPACING.lg },
  timerSection: { alignItems: 'center', marginBottom: SPACING.lg, width: '100%' },
  timerValue: { fontFamily: 'Montserrat-ExtraBold', fontSize: 48, color: COLORS.primary, marginBottom: SPACING.sm },
  timerBar: { height: 6, backgroundColor: COLORS.background, borderRadius: 3, width: '100%', overflow: 'hidden' },
  timerFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 3 },
  actions: { width: '100%' },
  startBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.md, padding: SPACING.md },
  startBtnText: { fontFamily: 'Montserrat-Bold', fontSize: 14, color: '#12161A', letterSpacing: 1 },
  skipBtn: { alignItems: 'center', padding: SPACING.md },
  skipBtnText: { fontFamily: 'Montserrat-SemiBold', fontSize: 13, color: COLORS.textMuted },
  exerciseList: { gap: SPACING.xs },
  exerciseRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  exerciseRowActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '08' },
  exerciseRowDone: { opacity: 0.5 },
  rowDot: { width: 24, height: 24, borderRadius: 12, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md },
  rowDotDone: { backgroundColor: COLORS.success },
  rowNum: { fontFamily: 'Montserrat-Bold', fontSize: 11, color: COLORS.textMuted },
  rowText: { flex: 1, fontFamily: 'Inter-SemiBold', fontSize: 13, color: COLORS.textTitle },
  rowTextDone: { textDecorationLine: 'line-through', color: COLORS.textMuted },
  rowDuration: { fontFamily: 'Montserrat-SemiBold', fontSize: 12, color: COLORS.textMuted },
  doneBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: COLORS.success, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, marginTop: SPACING.xl },
  doneBtnText: { fontFamily: 'Montserrat-Bold', fontSize: 14, color: '#fff', letterSpacing: 1 },
});
