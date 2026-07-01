// src/components/onboarding/SingleSelectStep.tsx
// Step de seleção única
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

interface Option {
  id: string;
  icon?: string;
  label: string;
}

interface Step {
  title: string;
  subtitle?: string;
  options: Option[];
}

interface SingleSelectStepProps {
  step: Step;
  value: string | null;
  onSelect: (id: string) => void;
}

export default function SingleSelectStep({ step, value, onSelect }: SingleSelectStepProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{step.title}</Text>
      {step.subtitle && <Text style={styles.subtitle}>{step.subtitle}</Text>}
      <View style={styles.optionsGrid}>
        {step.options.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[styles.optionCard, value === option.id && styles.optionActive]}
            onPress={() => onSelect(option.id)}
          >
            {option.icon && <Ionicons name={option.icon as any} size={24} color={value === option.id ? COLORS.primary : COLORS.textMuted} />}
            <Text style={[styles.optionText, value === option.id && styles.optionTextActive]}>{option.label}</Text>
            {value === option.id && <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: SPACING.xl },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 20, color: COLORS.textTitle, marginBottom: SPACING.sm },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, marginBottom: SPACING.xl },
  optionsGrid: { gap: SPACING.md },
  optionCard: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, padding: SPACING.lg, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border },
  optionActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '10' },
  optionText: { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 15, color: COLORS.textTitle },
  optionTextActive: { color: COLORS.primary },
});
