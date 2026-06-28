import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';

export default function StepIndicator({ steps, currentStep }) {
  return (
    <>
      <View style={styles.row}>
        {steps.map((s, i) => (
          <View key={i} style={[styles.dot, i <= currentStep && styles.dotActive, i < currentStep && styles.dotDone]}>
            <Text style={[styles.dotText, i <= currentStep && styles.dotTextActive]}>{i < currentStep ? '✓' : i + 1}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.label}>{steps[currentStep]}</Text>
    </>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'center', gap: SPACING.sm, marginBottom: SPACING.xs },
  dot: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.surface, borderWidth: 1.5, borderColor: COLORS.border, justifyContent: 'center', alignItems: 'center' },
  dotActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  dotDone: { backgroundColor: COLORS.success, borderColor: COLORS.success },
  dotText: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textMuted },
  dotTextActive: { color: COLORS.background },
  label: { textAlign: 'center', fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textMuted, letterSpacing: 1, marginBottom: SPACING.md },
});
