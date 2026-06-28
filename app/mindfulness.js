// app/mindfulness.js
// Tela de Mindfulness e Exercícios Respiratórios - NOVAIX FITNESS

import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../src/constants/spacing';
import { layout, typography } from '../src/styles';
import { breathingExercises } from '../src/data/breathingExercises';
import BreathingExercise from '../src/components/recovery/BreathingExercise';

export default function MindfulnessScreen() {
  const router = useRouter();
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);

  const handleComplete = (elapsedSeconds) => {
    setCompletedSessions(prev => prev + 1);
    setTotalMinutes(prev => prev + Math.ceil(elapsedSeconds / 60));
    setSelectedExercise(null);
  };

  if (selectedExercise) {
    return (
      <View style={layout.screen}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setSelectedExercise(null)}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textTitle} />
          </TouchableOpacity>
          <Text style={typography.h2}>{selectedExercise.name}</Text>
          <View style={{ width: 24 }} />
        </View>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.activeCard}>
            <Ionicons name={selectedExercise.icon} size={32} color={selectedExercise.color} />
            <Text style={styles.activeDescription}>{selectedExercise.description}</Text>
          </View>
          <BreathingExercise exercise={selectedExercise} onComplete={handleComplete} />
          <View style={styles.phaseGuide}>
            <Text style={styles.guideTitle}>Fases do exercício</Text>
            {selectedExercise.phases.map((phase, idx) => (
              <View key={idx} style={styles.phaseRow}>
                <View style={[styles.phaseDot, { backgroundColor: phase.type === 'inhale' ? COLORS.primary : phase.type === 'hold' ? COLORS.secondary : COLORS.success }]} />
                <Text style={styles.phaseText}>{phase.label}: {phase.duration}s</Text>
              </View>
            ))}
            <Text style={styles.phaseRow}>{selectedExercise.cycles} ciclos totais</Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={layout.screen}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textTitle} />
        </TouchableOpacity>
        <Text style={typography.h2}>Mindfulness</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{completedSessions}</Text>
            <Text style={styles.statLabel}>Sessões</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{totalMinutes}</Text>
            <Text style={styles.statLabel}>Minutos</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{breathingExercises.length}</Text>
            <Text style={styles.statLabel}>Técnicas</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>ESCOLHA UMA TÉCNICA</Text>
        {breathingExercises.map((exercise) => (
          <TouchableOpacity key={exercise.id} style={styles.exerciseCard} onPress={() => setSelectedExercise(exercise)} activeOpacity={0.8}>
            <View style={[styles.iconCircle, { backgroundColor: exercise.color + '20' }]}>
              <Ionicons name={exercise.icon} size={24} color={exercise.color} />
            </View>
            <View style={styles.exerciseInfo}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <Text style={styles.exerciseDescription}>{exercise.description}</Text>
              <View style={styles.exerciseMeta}>
                <Text style={styles.benefitTag}>{exercise.benefit}</Text>
                <Text style={styles.metaText}>{exercise.cycles} ciclos</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>
        ))}

        <View style={styles.tipCard}>
          <Ionicons name="bulb" size={20} color={COLORS.attention} />
          <Text style={styles.tipText}>Pratique em local silencioso, sentado ou deitado. Mantenha as costas retas e respire naturalmente entre os ciclos.</Text>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: SPACING.xl, paddingBottom: SPACING.md },
  scroll: { padding: SPACING.xl },
  statsRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.xxl },
  statCard: { flex: 1, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  statValue: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 24, color: COLORS.primary },
  statLabel: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted, marginTop: 4 },
  sectionTitle: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textMuted, letterSpacing: 1, marginBottom: SPACING.md },
  exerciseCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  iconCircle: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md },
  exerciseInfo: { flex: 1 },
  exerciseName: { fontFamily: 'Montserrat_700Bold', fontSize: 15, color: COLORS.textTitle, marginBottom: 2 },
  exerciseDescription: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textDescription, marginBottom: 6 },
  exerciseMeta: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  benefitTag: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.primary, backgroundColor: COLORS.primary + '15', paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: BORDER_RADIUS.sm, overflow: 'hidden' },
  metaText: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted },
  activeCard: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.xl, alignItems: 'center', marginBottom: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  activeDescription: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textDescription, textAlign: 'center', marginTop: SPACING.sm },
  phaseGuide: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginTop: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  guideTitle: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textMuted, letterSpacing: 1, marginBottom: SPACING.md },
  phaseRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm },
  phaseDot: { width: 8, height: 8, borderRadius: 4 },
  phaseText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textDescription },
  tipCard: { flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, marginTop: SPACING.xl, borderWidth: 1, borderColor: COLORS.border, gap: SPACING.md },
  tipText: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textDescription, lineHeight: 20 },
});
