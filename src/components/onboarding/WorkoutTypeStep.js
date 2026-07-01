// src/components/onboarding/WorkoutTypeStep.js
// Step de seleção de tipo de treino
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

export default function WorkoutTypeStep({ step, value, onSelect }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{step.title}</Text>
      <Text style={styles.subtitle}>{step.subtitle}</Text>
      <View style={styles.typesGrid}>
        {step.options.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[styles.typeCard, value === option.id && styles.typeCardActive]}
            onPress={() => onSelect(option.id)}
          >
            <View style={[styles.iconWrap, { backgroundColor: option.color + '20' }]}>
              <Ionicons name={option.icon} size={40} color={option.color} />
            </View>
            <Text style={[styles.typeLabel, value === option.id && styles.typeLabelActive]}>
              {option.label}
            </Text>
            <Text style={styles.typeDescription}>{option.description}</Text>
            {value === option.id && (
              <View style={styles.selectedBadge}>
                <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: SPACING.xl },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 20, color: COLORS.textTitle, marginBottom: SPACING.sm },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, marginBottom: SPACING.xl, lineHeight: 20 },
  typesGrid: { gap: SPACING.md },
  typeCard: { padding: SPACING.xl, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, borderWidth: 2, borderColor: COLORS.border, alignItems: 'center' },
  typeCardActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '05' },
  iconWrap: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.md },
  typeLabel: { fontFamily: 'Montserrat_700Bold', fontSize: 18, color: COLORS.textTitle, marginBottom: SPACING.xs },
  typeLabelActive: { color: COLORS.primary },
  typeDescription: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textMuted, textAlign: 'center' },
  selectedBadge: { position: 'absolute', top: SPACING.md, right: SPACING.md },
});
