
// app/mindfulness.js
// Tela de Mindfulness e Exercícios Respiratórios - NOVAIX FITNESS

import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/constants/colors';
import { layout, typography } from '../src/styles';
import { BREATHING_EXERCISES as breathingExercises } from '../src/data/breathingExercises';
import { BreathingExercise, ErrorBoundary } from '../src/components';
import { styles } from '../src/styles/mindfulnessStyles';

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
      <ErrorBoundary screenName="Mindfulness">
      <View style={layout.screen}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setSelectedExercise(null)} accessibilityLabel="Voltar" accessibilityRole="button">
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
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary screenName="Mindfulness">
    <View style={layout.screen}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Voltar" accessibilityRole="button">
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
          <TouchableOpacity key={exercise.id} style={styles.exerciseCard} onPress={() => setSelectedExercise(exercise)} activeOpacity={0.8} accessibilityLabel={`Iniciar ${exercise.name}`} accessibilityRole="button">
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
    </ErrorBoundary>
  );
}
