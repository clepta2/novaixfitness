import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

interface GoalOption {
  id: string;
  icon: string;
  label: string;
  description: string;
}

interface GoalStepProps {
  options: GoalOption[];
  selectedGoal: string | null;
  onSelect: (id: string) => void;
}

export default function GoalStep({ options, selectedGoal, onSelect }: GoalStepProps): React.JSX.Element {
  return (
    <>
      <Text style={styles.title}>QUAL SEU OBJETIVO?</Text>
      <Text style={styles.subtitle}>Isso ajusta o plano alimentar e dicas</Text>
      <View style={styles.grid}>
        {options.map((option) => {
          const active = selectedGoal === option.id;
          return (
            <TouchableOpacity
              key={option.id}
              style={[styles.card, active && styles.cardActive]}
              onPress={() => onSelect(option.id)}
            >
              <Ionicons name={option.icon as any} size={24} color={active ? COLORS.primary : COLORS.textMuted} />
              <Text style={[styles.label, active && styles.labelActive]}>{option.label}</Text>
              <Text style={styles.description}>{option.description}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 20, color: COLORS.textTitle, marginBottom: SPACING.sm },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, marginBottom: SPACING.xl },
  grid: { gap: SPACING.md },
  card: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, padding: SPACING.lg, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border },
  cardActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '10' },
  label: { flex: 1, fontFamily: 'Montserrat_600SemiBold', fontSize: 16, color: COLORS.textTitle },
  labelActive: { color: COLORS.primary },
  description: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted },
});
