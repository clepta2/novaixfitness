
// app/assessment/guided.js
// Avaliação guiada com timer

import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../../src/constants/spacing';
import { useGuidedAssessment } from '../../src/hooks/useGuidedAssessment';
import { ErrorBoundary } from '../../src/components';

export default function GuidedAssessmentScreen() {
  const router = useRouter();
  const {
    phase, test, currentTest, results, isRunning,
    elapsed, inputValue, setInputValue, prevResults,
    formatTime, handleStart, handleStop, handleNext,
    totalTests,
  } = useGuidedAssessment();

  if (phase === 'complete') {
    return (
      <ErrorBoundary screenName="GuidedAssessment">
      <View style={styles.done}>
        <Ionicons name="checkmark-circle" size={80} color={COLORS.primary} />
        <Text style={styles.doneTitle}>AVALIAÇÃO COMPLETA!</Text>
        <Text style={styles.doneScore}>Resultado: {Object.values(results).reduce((s, v) => s + v, 0)} pontos</Text>
        {prevResults && <Text style={styles.doneCompare}>Compare com: {prevResults.overall_score || 0} pontos (mês anterior)</Text>}
        <TouchableOpacity accessibilityLabel="Finalizar avaliação" accessibilityRole="button" style={styles.btn} onPress={() => router.back()}><Text style={styles.btnText}>FINALIZAR</Text></TouchableOpacity>
      </View>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary screenName="GuidedAssessment">
    <ScrollView style={styles.screen} contentContainerStyle={styles.scroll}>
      <View style={styles.progress}>{Array.from({ length: totalTests }, (_, i) => <View key={i} style={[styles.dot, i <= currentTest && styles.dotActive]} />)}</View>
      <Text style={styles.title}>AVALIAÇÃO GUIADA</Text>
      <Text style={styles.subtitle}>Siga as instruções e registre seu resultado</Text>

      <View style={styles.card}>
        <Text style={styles.cardNum}>TESTE {currentTest + 1}/{totalTests}</Text>
        <Text style={styles.cardTitle}>{test.title}</Text>
        <Text style={styles.cardDesc}>{test.description}</Text>
        <View style={styles.instr}><Ionicons name="information-circle" size={14} color={COLORS.primary} /><Text style={styles.instrText}>{test.instruction}</Text></View>

        {test.metric === 'seconds' ? (
          <View style={styles.timerArea}>
            <Text style={styles.timer}>{formatTime(elapsed)}</Text>
            {!isRunning ? (
              <TouchableOpacity accessibilityLabel="Iniciar cronômetro" accessibilityRole="button" style={[styles.timerBtn, { backgroundColor: COLORS.primary }]} onPress={handleStart}><Ionicons name="play" size={20} color={COLORS.background} /><Text style={styles.timerBtnTxt}>INICIAR</Text></TouchableOpacity>
            ) : (
              <TouchableOpacity accessibilityLabel="Parar cronômetro" accessibilityRole="button" style={[styles.timerBtn, { backgroundColor: COLORS.error }]} onPress={handleStop}><Ionicons name="stop" size={20} color={COLORS.background} /><Text style={styles.timerBtnTxt}>PARAR</Text></TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.repsArea}>
            <Text style={styles.repsLabel}>Repetições:</Text>
            <View style={styles.repsRow}>
              <TouchableOpacity accessibilityLabel="Diminuir repetição" accessibilityRole="button" style={styles.repsBtn} onPress={() => setInputValue(String(Math.max(0, parseInt(inputValue || 0) - 1)))}><Ionicons name="remove" size={20} color={COLORS.textMuted} /></TouchableOpacity>
              <Text style={styles.repsVal}>{inputValue || '0'}</Text>
              <TouchableOpacity accessibilityLabel="Aumentar repetição" accessibilityRole="button" style={styles.repsBtn} onPress={() => setInputValue(String(parseInt(inputValue || 0) + 1))}><Ionicons name="add" size={20} color={COLORS.textMuted} /></TouchableOpacity>
            </View>
          </View>
        )}

        {prevResults && (
          <View style={styles.prevBox}>
            <Text style={styles.prevLabel}>MÊS ANTERIOR:</Text>
            <Text style={styles.prevVal}>{prevResults[`${test.id}_result`] || '—'} {test.unit}</Text>
          </View>
        )}
      </View>

      <TouchableOpacity accessibilityLabel={currentTest < totalTests - 1 ? 'Próximo teste' : 'Finalizar avaliação'} accessibilityRole="button" style={[styles.btn, (!results[test.id] && test.metric === 'reps' && !inputValue) && styles.btnDis]} onPress={handleNext} disabled={!results[test.id] && test.metric === 'reps' && !inputValue}>
        <Text style={styles.btnText}>{currentTest < totalTests - 1 ? 'PRÓXIMO' : 'FINALIZAR'}</Text>
      </TouchableOpacity>
    </ScrollView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.xl, paddingTop: Platform.OS === 'ios' ? 54 : 40 },
  progress: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: SPACING.xl },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.surface },
  dotActive: { backgroundColor: COLORS.primary },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 22, color: COLORS.textTitle, marginBottom: SPACING.sm },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, marginBottom: SPACING.xl },
  card: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.xl, marginBottom: SPACING.xl },
  cardNum: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.primary, textTransform: 'uppercase', letterSpacing: 1.2 },
  cardTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 20, color: COLORS.textTitle, marginTop: SPACING.sm },
  cardDesc: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, marginTop: SPACING.sm },
  instr: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, padding: SPACING.md, backgroundColor: COLORS.primary + '10', borderRadius: BORDER_RADIUS.md, marginTop: SPACING.lg },
  instrText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.primary, flex: 1 },
  timerArea: { alignItems: 'center', marginTop: SPACING.xl },
  timer: { fontFamily: 'Montserrat_700Bold', fontSize: 48, color: COLORS.primary },
  timerBtn: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, paddingHorizontal: SPACING.xl, paddingVertical: SPACING.lg, borderRadius: BORDER_RADIUS.md, marginTop: SPACING.xl },
  timerBtnTxt: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.background },
  repsArea: { alignItems: 'center', marginTop: SPACING.xl },
  repsLabel: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textMuted, marginBottom: SPACING.md },
  repsRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xl },
  repsBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  repsVal: { fontFamily: 'Montserrat_700Bold', fontSize: 36, color: COLORS.textTitle, minWidth: 60, textAlign: 'center' },
  prevBox: { marginTop: SPACING.xl, padding: SPACING.md, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md },
  prevLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.textMuted, textTransform: 'uppercase' },
  prevVal: { fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textTitle, marginTop: SPACING.xs },
  btn: { backgroundColor: COLORS.primary, paddingVertical: SPACING.lg, borderRadius: BORDER_RADIUS.md, alignItems: 'center' },
  btnDis: { opacity: 0.5 },
  btnText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.background },
  done: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  doneTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 24, color: COLORS.textTitle, marginTop: SPACING.xl },
  doneScore: { fontFamily: 'Montserrat_600SemiBold', fontSize: 18, color: COLORS.primary, marginTop: SPACING.md },
  doneCompare: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, marginTop: SPACING.sm },
});
