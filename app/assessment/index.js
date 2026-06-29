// app/assessment/index.js
// Avaliação inicial completa

import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../../src/constants/spacing';
import { supabase } from '../../src/config/supabase';
import { useAuth } from '../../src/context/AuthContext';
import { generateAdaptivePlan, getPlanSummary } from '../../src/services/adaptivePlan';

const TESTS = [
  { id: 'pushups', title: 'FLEXÕES', description: 'Quantas flexões consecutivas?', options: ['Nenhuma', '1-5', '6-15', '16-30', '30+'], scores: [0, 1, 2, 3, 4] },
  { id: 'squat', title: 'AGACHAMENTO', description: 'Aguenta 30s agachado?', options: ['Não', 'Com dificuldade', 'Sim', 'Fácil'], scores: [0, 1, 2, 3] },
  { id: 'plank', title: 'PRANCHA', description: 'Aguenta 30s de prancha?', options: ['Não', '<15s', '15-30s', '>30s'], scores: [0, 1, 2, 3] },
  { id: 'run', title: 'CORRIDA', description: '1km no menor tempo possível', options: ['Não corro', '>12min', '8-12min', '<8min'], scores: [0, 1, 2, 3] },
  { id: 'flexibility', title: 'FLEXIBILIDADE', description: 'Consegue tocar os pés em pé?', options: ['Não', 'Quase', 'Sim', 'Mão no chão'], scores: [0, 1, 2, 3] },
  { id: 'abs', title: 'ABDOMINAIS', description: 'Quantos consecutivos?', options: ['Nenhum', '1-10', '11-25', '25+'], scores: [0, 1, 2, 3] },
  { id: 'balance', title: 'EQUILÍBRIO', description: 'Aguenta 30s em 1 pé?', options: ['Não', '<15s', '15-30s', '>30s'], scores: [0, 1, 2, 3] },
];

export default function AssessmentScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [answers, setAnswers] = useState({});
  const [currentTest, setCurrentTest] = useState(0);
  const [saved, setSaved] = useState(false);

  const test = TESTS[currentTest];
  const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
  const maxScore = TESTS.reduce((sum, t) => sum + Math.max(...t.scores), 0);
  const level = totalScore <= 7 ? 'Iniciante' : totalScore <= 16 ? 'Intermediário' : 'Avançado';

  const handleAnswer = (score) => {
    setAnswers({ ...answers, [test.id]: score });
    if (currentTest < TESTS.length - 1) {
      setCurrentTest(currentTest + 1);
    } else {
      saveAssessment();
    }
  };

  const saveAssessment = async () => {
    if (!user?.id) return;
    try {
      await supabase.from('fitness_assessments').insert({
        user_id: user.id,
        pushups_result: TESTS[0].options[answers[TESTS[0].id] || 0],
        squat_result: TESTS[1].options[answers[TESTS[1].id] || 0],
        plank_result: TESTS[2].options[answers[TESTS[2].id] || 0],
        overall_score: totalScore,
      });
      setSaved(true);
    } catch (err) {
      if (__DEV__) console.error('Erro ao salvar avaliação:', err);
    }
  };

  if (saved) {
    return (
      <View style={styles.completedContainer}>
        <Ionicons name="checkmark-circle" size={80} color={COLORS.primary} />
        <Text style={styles.completedTitle}>AVALIAÇÃO COMPLETA!</Text>
        <Text style={styles.completedLevel}>Seu nível: {level}</Text>
        <Text style={styles.completedScore}>Pontuação: {totalScore}/{maxScore}</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>CONTINUAR</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scroll}>
      <View style={styles.progressBar}>
        {TESTS.map((_, i) => (
          <View key={i} style={[styles.progressDot, i <= currentTest && styles.progressDotActive]} />
        ))}
      </View>

      <Text style={styles.title}>AVALIAÇÃO INICIAL</Text>
      <Text style={styles.subtitle}>Vamos descobrir seu nível atual</Text>

      <View style={styles.testCard}>
        <Text style={styles.testNumber}>TESTE {currentTest + 1}/{TESTS.length}</Text>
        <Text style={styles.testTitle}>{test.title}</Text>
        <Text style={styles.testDescription}>{test.description}</Text>

        <View style={styles.optionsGrid}>
          {test.options.map((option, index) => (
            <TouchableOpacity key={index} style={styles.optionButton} onPress={() => handleAnswer(test.scores[index])}>
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.infoBox}>
        <Ionicons name="information-circle" size={16} color={COLORS.primary} />
        <Text style={styles.infoText}>Esses dados ajudam o coach a personalizar seus treinos</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.xl, paddingTop: Platform.OS === 'ios' ? 54 : 40 },
  progressBar: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: SPACING.xl },
  progressDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.surface },
  progressDotActive: { backgroundColor: COLORS.primary },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 22, color: COLORS.textTitle, marginBottom: SPACING.sm },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, marginBottom: SPACING.xl },
  testCard: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.xl, marginBottom: SPACING.xl },
  testNumber: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.primary, textTransform: 'uppercase', letterSpacing: 1.2 },
  testTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 20, color: COLORS.textTitle, marginTop: SPACING.sm },
  testDescription: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, marginTop: SPACING.sm },
  optionsGrid: { gap: SPACING.sm, marginTop: SPACING.xl },
  optionButton: { paddingVertical: SPACING.lg, paddingHorizontal: SPACING.xl, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center' },
  optionText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textTitle },
  infoBox: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, padding: SPACING.md, backgroundColor: COLORS.primary + '10', borderRadius: BORDER_RADIUS.md },
  infoText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.primary, flex: 1 },
  completedContainer: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  completedTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 24, color: COLORS.textTitle, marginTop: SPACING.xl },
  completedLevel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 18, color: COLORS.primary, marginTop: SPACING.md },
  completedScore: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, marginTop: SPACING.sm },
  button: { backgroundColor: COLORS.primary, paddingVertical: SPACING.lg, paddingHorizontal: SPACING.xxl, borderRadius: BORDER_RADIUS.md, marginTop: SPACING.xxl },
  buttonText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.background },
});

