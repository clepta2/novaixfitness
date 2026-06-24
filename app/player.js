// app/player.js
// Tela do Player - YouTube + Cronômetro - NOVAIX FITNESS

import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../src/constants/colors';

const exercises = [
  { id: '1', name: 'Crucifixo Inclinado', sets: 3, reps: 12, rest: 15 },
  { id: '2', name: 'Supino Reto Barra', sets: 4, reps: 10, rest: 15 },
  { id: '3', name: 'Crossover Polia Alta', sets: 3, reps: 12, rest: 15 },
  { id: '4', name: 'Tríceps Testa Barra W', sets: 3, reps: 12, rest: 15 },
];

export default function PlayerScreen() {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(45);
  const [isResting, setIsResting] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isPlaying && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      // Tempo acabou
      clearInterval(timerRef.current);
      if (!isResting) {
        // Iniciar descanso
        setIsResting(true);
        setTimeRemaining(exercises[currentExercise].rest);
      } else {
        // Descanso acabou, próxima série
        setIsResting(false);
        if (currentSet < exercises[currentExercise].sets) {
          setCurrentSet((prev) => prev + 1);
          setTimeRemaining(45);
        } else {
          // Próximo exercício
          if (currentExercise < exercises.length - 1) {
            setCurrentExercise((prev) => prev + 1);
            setCurrentSet(1);
            setTimeRemaining(45);
          } else {
            // Treino acabou
            setIsPlaying(false);
          }
        }
      }
    }

    return () => clearInterval(timerRef.current);
  }, [isPlaying, timeRemaining, isResting]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const exercise = exercises[currentExercise];
  const progress = ((currentExercise * exercise.sets + currentSet) / 
    (exercises.length * exercise.sets)) * 100;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textTitle} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>TREINO ATIVO</Text>
            <Text style={styles.headerSubtitle}>PROGRAMA: HIPERTROFIA - FASE 1</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="ellipsis-vertical" size={24} color={COLORS.textTitle} />
          </TouchableOpacity>
        </View>

        {/* Área do Vídeo */}
        <View style={styles.videoContainer}>
          <View style={styles.videoPlaceholder}>
            <Ionicons name="play-circle" size={64} color={COLORS.primary} />
            <Text style={styles.videoText}>{exercise.name}</Text>
          </View>
          <Text style={styles.videoProgress}>
            {currentExercise + 1} de {exercises.length}
          </Text>
        </View>

        {/* Cronômetro */}
        <View style={styles.timerContainer}>
          <Text style={styles.timerLabel}>
            {isResting ? 'DESCANSO' : 'TEMPO DE EXECUÇÃO'}
          </Text>
          <View style={styles.timerDisplay}>
            <Text style={[styles.timerText, isResting && styles.timerTextRest]}>
              {formatTime(timeRemaining)}
            </Text>
            <Text style={styles.timerTotal}>/ 00:45</Text>
          </View>
          <Text style={styles.timerSubLabel}>
            DESCANSO: {exercise.rest}"
          </Text>
        </View>

        {/* Progresso */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressLabel}>PROGRESSO DO TREINO</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>
            Total: {exercises.length} Exercícios (Faltam {exercises.length - currentExercise - 1})
          </Text>
        </View>

        {/* Lista de Exercícios */}
        <View style={styles.exercisesContainer}>
          <Text style={styles.exercisesTitle}>LISTA DE EXERCÍCIOS</Text>
          {exercises.map((ex, index) => (
            <View
              key={ex.id}
              style={[
                styles.exerciseItem,
                index === currentExercise && styles.exerciseItemActive,
                index < currentExercise && styles.exerciseItemCompleted,
              ]}
            >
              <View style={styles.exerciseNumber}>
                <Text style={styles.exerciseNumberText}>{index + 1}</Text>
              </View>
              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseName}>{ex.name}</Text>
                <Text style={styles.exerciseDetails}>
                  {ex.sets} Séries | {ex.reps} Rep
                </Text>
              </View>
              {index === currentExercise && (
                <Ionicons name="play-circle" size={24} color={COLORS.primary} />
              )}
              {index < currentExercise && (
                <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Controles */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.controlButton}>
          <Ionicons name="skip-back" size={32} color={COLORS.textTitle} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.playButton} onPress={togglePlay}>
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={40}
            color={COLORS.background}
          />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.controlButton}>
          <Ionicons name="skip-forward" size={32} color={COLORS.textTitle} />
        </TouchableOpacity>
      </View>

      {/* Bottom Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="barbell" size={24} color={COLORS.primary} />
          <Text style={styles.tabLabel}>Treinos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="people" size={24} color={COLORS.textMuted} />
          <Text style={styles.tabLabel}>Comunidade</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="person" size={24} color={COLORS.textMuted} />
          <Text style={styles.tabLabel}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 60,
    paddingBottom: 200,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerInfo: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 18,
    color: COLORS.textTitle,
    textTransform: 'uppercase',
  },
  headerSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  videoContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  videoPlaceholder: {
    height: 200,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: COLORS.textTitle,
    marginTop: 12,
  },
  videoProgress: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
    padding: 8,
  },
  timerContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  timerLabel: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: COLORS.textTitle,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  timerDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  timerText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 64,
    color: COLORS.primary,
  },
  timerTextRest: {
    color: COLORS.success,
  },
  timerTotal: {
    fontFamily: 'Inter_400Regular',
    fontSize: 18,
    color: COLORS.textMuted,
    marginLeft: 8,
  },
  timerSubLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 8,
  },
  progressContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  progressLabel: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: COLORS.textTitle,
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  progressText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.textMuted,
  },
  exercisesContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
  },
  exercisesTitle: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: COLORS.textTitle,
    marginBottom: 12,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  exerciseItemActive: {
    backgroundColor: COLORS.primary + '10',
    marginHorizontal: -16,
    paddingHorizontal: 16,
    borderBottomWidth: 0,
  },
  exerciseItemCompleted: {
    opacity: 0.6,
  },
  exerciseNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  exerciseNumberText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 14,
    color: COLORS.textTitle,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: COLORS.textTitle,
  },
  exerciseDetails: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
    paddingVertical: 20,
    backgroundColor: COLORS.background,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingBottom: 20,
  },
  tabItem: {
    alignItems: 'center',
  },
  tabLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 4,
  },
});
