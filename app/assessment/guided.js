// app/assessment/guided.js
// Avaliação guiada com timer

import { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../../src/constants/spacing';
import { supabase } from '../../src/config/supabase';
import { useAuth } from '../../src/context/AuthContext';

const TESTS = [
  { id: 'plank', title: 'PRANCHA', description: 'Segure a posição máxima', instruction: 'Corpo reto, cotovelos apoiados', metric: 'seconds', unit: 'seg' },
  { id: 'pushups', title: 'FLEXÕES', description: 'Máximo de flexões', instruction: 'Corpo reto, desça até o peito', metric: 'reps', unit: 'reps' },
  { id: 'squat_hold', title: 'AGACHAMENTO', description: 'Fique agachado o máximo', instruction: 'Joelhos na direção dos pés', metric: 'seconds', unit: 'seg' },
  { id: 'situps', title: 'ABDOMINAIS', description: 'Máximo em 1 minuto', instruction: 'Costas no chão, toque os pés', metric: 'reps', unit: 'reps' },
];

export default function GuidedAssessmentScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [phase, setPhase] = useState('intro');
  const [currentTest, setCurrentTest] = useState(0);
  const [results, setResults] = useState({});
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [prevResults, setPrevResults] = useState(null);
  const timerRef = useRef(null);
  const test = TESTS[currentTest];

  useEffect(() => { loadPrevious(); }, [user?.id]);
  useEffect(() => {
    if (isRunning) timerRef.current = setInterval(() => setElapsed(p => p + 1), 1000);
    else clearInterval(timerRef.current);
    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  const loadPrevious = async () => {
    if (!user?.id) return;
    const { data } = await supabase.from('fitness_assessments').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1).single();
    if (data) setPrevResults(data);
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const handleStart = () => { setIsRunning(true); setElapsed(0); };
  const handleStop = () => { setIsRunning(false); setResults({ ...results, [test.id]: elapsed }); };

  const handleNext = () => {
    if (test.metric === 'reps' && inputValue) setResults({ ...results, [test.id]: parseInt(inputValue) || 0 });
    if (currentTest < TESTS.length - 1) { setCurrentTest(currentTest + 1); setElapsed(0); setInputValue(''); }
    else saveResults();
  };

  const saveResults = async () => {
    if (!user?.id) return;
    await supabase.from('fitness_assessments').insert({ user_id: user.id, pushups_result: String(results.pushups || 0), squat_result: String(results.squat_hold || 0), plank_result: String(results.plank || 0), overall_score: Object.values(results).reduce((s, v) => s + v, 0) });
    setPhase('complete');
  };

  if (phase === 'complete') {
    return (
      <View style={styles.done}>
        <Ionicons name="checkmark-circle" size={80} color={COLORS.primary} />
        <Text style={styles.doneTitle}>AVALIAÇÃO COMPLETA!</Text>
        <Text style={styles.doneScore}>Resultado: {Object.values(results).reduce((s, v) => s + v, 0)} pontos</Text>
        {prevResults && <Text style={styles.doneCompare}>Compare com: {prevResults.overall_score || 0} pontos (mês anterior)</Text>}
        <TouchableOpacity style={styles.btn} onPress={() => router.back()}><Text style={styles.btnText}>FINALIZAR</Text></TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scroll}>
      <View style={styles.progress}>{TESTS.map((_, i) => <View key={i} style={[styles.dot, i <= currentTest && styles.dotActive]} />)}</View>
      <Text style={styles.title}>AVALIAÇÃO GUIADA</Text>
      <Text style={styles.subtitle}>Siga as instruções e registre seu resultado</Text>

      <View style={styles.card}>
        <Text style={styles.cardNum}>TESTE {currentTest + 1}/{TESTS.length}</Text>
        <Text style={styles.cardTitle}>{test.title}</Text>
        <Text style={styles.cardDesc}>{test.description}</Text>
        <View style={styles.instr}><Ionicons name="information-circle" size={14} color={COLORS.primary} /><Text style={styles.instrText}>{test.instruction}</Text></View>

        {test.metric === 'seconds' ? (
          <View style={styles.timerArea}>
            <Text style={styles.timer}>{formatTime(elapsed)}</Text>
            {!isRunning ? (
              <TouchableOpacity style={[styles.timerBtn, { backgroundColor: COLORS.primary }]} onPress={handleStart}><Ionicons name="play" size={20} color={COLORS.background} /><Text style={styles.timerBtnTxt}>INICIAR</Text></TouchableOpacity>
            ) : (
              <TouchableOpacity style={[styles.timerBtn, { backgroundColor: COLORS.error }]} onPress={handleStop}><Ionicons name="stop" size={20} color={COLORS.background} /><Text style={styles.timerBtnTxt}>PARAR</Text></TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.repsArea}>
            <Text style={styles.repsLabel}>Repetições:</Text>
            <View style={styles.repsRow}>
              <TouchableOpacity style={styles.repsBtn} onPress={() => setInputValue(String(Math.max(0, parseInt(inputValue || 0) - 1)))}><Ionicons name="remove" size={20} color={COLORS.textMuted} /></TouchableOpacity>
              <Text style={styles.repsVal}>{inputValue || '0'}</Text>
              <TouchableOpacity style={styles.repsBtn} onPress={() => setInputValue(String(parseInt(inputValue || 0) + 1))}><Ionicons name="add" size={20} color={COLORS.textMuted} /></TouchableOpacity>
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

      <TouchableOpacity style={[styles.btn, (!results[test.id] && test.metric === 'reps' && !inputValue) && styles.btnDis]} onPress={handleNext} disabled={!results[test.id] && test.metric === 'reps' && !inputValue}>
        <Text style={styles.btnText}>{currentTest < TESTS.length - 1 ? 'PRÓXIMO' : 'FINALIZAR'}</Text>
      </TouchableOpacity>
    </ScrollView>
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
