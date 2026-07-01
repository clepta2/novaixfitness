import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

interface Exercise {
  id: string;
  name: string;
  equipment: string;
  level: string;
}

interface Muscle {
  id: string;
  label: string;
  exercises: Exercise[];
}

interface ExerciseStepProps {
  muscles: Muscle[];
  selectedMuscles: string[];
  selectedExercises: string[];
  onToggle: (id: string) => void;
}

export default function ExerciseStep({ muscles, selectedMuscles, selectedExercises, onToggle }: ExerciseStepProps): React.JSX.Element {
  const filtered = muscles.filter((m: Muscle) => selectedMuscles.includes(m.id));

  return (
    <>
      <Text style={styles.title}>QUE EXERCÍCIOS VOCÊ QUER?</Text>
      <Text style={styles.subtitle}>Escolha os exercícios dos grupos selecionados</Text>
      {filtered.map((muscle) => (
        <View key={muscle.id} style={styles.section}>
          <Text style={styles.sectionTitle}>{muscle.label}</Text>
          {muscle.exercises.map((exercise) => {
            const active = selectedExercises.includes(exercise.id);
            return (
              <TouchableOpacity
                key={exercise.id}
                style={[styles.card, active && styles.cardActive]}
                onPress={() => onToggle(exercise.id)}
              >
                <View style={styles.info}>
                  <Text style={[styles.name, active && styles.nameActive]}>{exercise.name}</Text>
                  <Text style={styles.meta}>{exercise.equipment} · {exercise.level}</Text>
                </View>
                {active && <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />}
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
      <Text style={styles.hint}>Selecionou {selectedExercises.length} exercício(s)</Text>
    </>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 20, color: COLORS.textTitle, marginBottom: SPACING.sm },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, marginBottom: SPACING.xl },
  hint: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.primary, marginTop: SPACING.lg, textAlign: 'center' },
  section: { marginBottom: SPACING.xl },
  sectionTitle: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: COLORS.primary, marginBottom: SPACING.md },
  card: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.sm },
  cardActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '10' },
  info: { flex: 1 },
  name: { fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textTitle },
  nameActive: { color: COLORS.primary },
  meta: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
});
