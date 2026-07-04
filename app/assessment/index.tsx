
// app/assessment/index.tsx
// Avaliacao com animacoes de entrada - NOVAIX FITNESS


import { useMemo, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../../src/constants/spacing';
import { SHADOWS } from '../../src/constants/shadows';
import { supabase } from '../../src/config/supabase';
import { useAuth } from '../../src/context/AuthContext';
import { ErrorBoundary, ProgressRing, GradientButton } from '../../src/components';
import { useResponsive } from '../../src/hooks/useResponsive';

const TESTS = [
  { id: 'pushups', title: 'FLEXOES', description: 'Quantas flexoes consecutivas?', icon: 'body', color: COLORS.primary, options: ['Nenhuma', '1-5', '6-15', '16-30', '30+'], scores: [0, 1, 2, 3, 4] },
  { id: 'squat', title: 'AGACHAMENTO', description: 'Aguenta 30s agachado?', icon: 'walk', color: COLORS.success, options: ['Nao', 'Com dificuldade', 'Sim', 'Facil'], scores: [0, 1, 2, 3] },
  { id: 'plank', title: 'PRANCHA', description: 'Aguenta 30s de prancha?', icon: 'fitness', color: COLORS.secondary, options: ['Nao', '<15s', '15-30s', '>30s'], scores: [0, 1, 2, 3] },
  { id: 'run', title: 'CORRIDA', description: '1km no menor tempo possivel', icon: 'speedometer', color: COLORS.attention, options: ['Nao corro', '>12min', '8-12min', '<8min'], scores: [0, 1, 2, 3] },
  { id: 'flexibility', title: 'FLEXIBILIDADE', description: 'Consegue tocar os pes em pe?', icon: 'body', color: COLORS.info, options: ['Nao', 'Quase', 'Sim', 'Mao no chao'], scores: [0, 1, 2, 3] },
  { id: 'abs', title: 'ABDOMINAIS', description: 'Quantos consecutivos?', icon: 'fitness', color: COLORS.purple, options: ['Nenhum', '1-10', '11-25', '25+'], scores: [0, 1, 2, 3] },
  { id: 'balance', title: 'EQUILIBRIO', description: 'Aguenta 30s em 1 pe?', icon: 'body', color: COLORS.cyan, options: ['Nao', '<15s', '15-30s', '>30s'], scores: [0, 1, 2, 3] },
];

export default function AssessmentScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { isSmall } = useResponsive();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentTest, setCurrentTest] = useState(0);
  const [saved, setSaved] = useState(false);

  // Animacoes
  const fadeAnim = useMemo(() => new Animated.Value(0), []);
  const slideAnim = useMemo(() => new Animated.Value(20), []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 8, tension: 55, useNativeDriver: true }),
    ]).start();
  }, [currentTest]);

  const test = TESTS[currentTest];
  const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
  const maxScore = TESTS.reduce((sum, t) => sum + Math.max(...t.scores), 0);
  const level = totalScore <= 7 ? 'Iniciante' : totalScore <= 16 ? 'Intermediario' : 'Avancado';
  const progress = ((currentTest + 1) / TESTS.length) * 100;

  const handleAnswer = (score: number) => {
    const newAnswers = { ...answers, [test.id]: score };
    setAnswers(newAnswers);
    if (currentTest < TESTS.length - 1) {
      setCurrentTest(currentTest + 1);
    } else {
      saveAssessment(newAnswers);
    }
  };

  const saveAssessment = async (finalAnswers: Record<string, number>) => {
    if (!user?.id) return;
    const finalScore = Object.values(finalAnswers).reduce((sum, score) => sum + score, 0);
    try {
      await supabase.from('fitness_assessments').insert({
        user_id: user.id,
        pushups_result: TESTS[0].options[finalAnswers[TESTS[0].id] || 0],
        squat_result: TESTS[1].options[finalAnswers[TESTS[1].id] || 0],
        plank_result: TESTS[2].options[finalAnswers[TESTS[2].id] || 0],
        overall_score: finalScore,
      });
      setSaved(true);
    } catch (err) {
      if (__DEV__) console.error('Erro ao salvar avaliacao:', err);
    }
  };

  if (saved) {
    return (
      <ErrorBoundary screenName="Assessment">
        <View style={styles.completedContainer}>
          <ProgressRing progress={100} size={100} strokeWidth={8} label={level} />
          <Text style={styles.completedTitle}>AVALIACAO COMPLETA!</Text>
          <Text style={styles.completedLevel}>Seu nivel: {level}</Text>
          <Text style={styles.completedScore}>Pontuacao: {totalScore}/{maxScore}</Text>
          <GradientButton title="CONTINUAR" onPress={() => router.back()} size={isSmall ? 'md' : 'lg'} />
        </View>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary screenName="Assessment">
      <ScrollView style={styles.screen} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textTitle} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>AVALIACAO FISICA</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Progresso */}
        <View style={styles.progressSection}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>Teste {currentTest + 1} de {TESTS.length}</Text>
        </View>

        {/* Teste atual */}
        <Animated.View style={[styles.testCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={[styles.testIcon, { backgroundColor: test.color + '15' }]}>
            <Ionicons name={test.icon} size={32} color={test.color} />
          </View>
          <Text style={styles.testTitle}>{test.title}</Text>
          <Text style={styles.testDescription}>{test.description}</Text>

          {/* Opcoes */}
          <View style={styles.optionsGrid}>
            {test.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.optionBtn, answers[test.id] === index && styles.optionBtnActive]}
                onPress={() => handleAnswer(test.scores[index])}
              >
                <Text style={[styles.optionText, answers[test.id] === index && styles.optionTextActive]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Score parcial */}
        <View style={styles.scoreSection}>
          <Text style={styles.scoreLabel}>Pontuacao parcial</Text>
          <Text style={styles.scoreValue}>{totalScore}/{maxScore}</Text>
        </View>
      </ScrollView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.xl },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.xl },
  headerTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle },

  // Progresso
  progressSection: { marginBottom: SPACING.xl },
  progressBar: { height: 6, backgroundColor: COLORS.surfaceElevated, borderRadius: 3, overflow: 'hidden', marginBottom: SPACING.xs },
  progressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 3 },
  progressText: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted },

  // Teste
  testCard: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.xl, padding: SPACING.xl, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.md },
  testIcon: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.lg },
  testTitle: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 20, color: COLORS.textTitle, marginBottom: SPACING.xs },
  testDescription: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, textAlign: 'center', marginBottom: SPACING.xl },

  // Opcoes
  optionsGrid: { width: '100%', gap: SPACING.sm },
  optionBtn: { paddingVertical: SPACING.md, paddingHorizontal: SPACING.lg, backgroundColor: COLORS.surfaceElevated, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border },
  optionBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  optionText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textTitle, textAlign: 'center' },
  optionTextActive: { color: COLORS.background },

  // Score
  scoreSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: SPACING.xl, padding: SPACING.md, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border },
  scoreLabel: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textMuted },
  scoreValue: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.primary },

  // Completado
  completedContainer: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl, gap: SPACING.lg },
  completedTitle: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 24, color: COLORS.textTitle, textAlign: 'center' },
  completedLevel: { fontFamily: 'Montserrat_700Bold', fontSize: 18, color: COLORS.primary, textAlign: 'center' },
  completedScore: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, textAlign: 'center' },
});
