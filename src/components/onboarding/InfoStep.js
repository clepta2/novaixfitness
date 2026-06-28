// src/components/onboarding/InfoStep.js
// Step informativo (welcome)
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

export default function InfoStep({ step, onNext }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{step.title}</Text>
      <Text style={styles.subtitle}>{step.subtitle}</Text>
      {step.bullets?.map((bullet, i) => (
        <View key={i} style={styles.bulletRow}>
          <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
          <Text style={styles.bulletText}>{bullet}</Text>
        </View>
      ))}
      {step.securityNote && (
        <View style={styles.securityNote}>
          <Ionicons name="lock-closed" size={16} color={COLORS.textMuted} />
          <Text style={styles.securityText}>{step.securityNote}</Text>
        </View>
      )}
      <TouchableOpacity style={styles.button} onPress={onNext}>
        <Text style={styles.buttonText}>{step.buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: SPACING.xl },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 20, color: COLORS.textTitle, marginBottom: SPACING.sm },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, marginBottom: SPACING.xl, lineHeight: 20 },
  bulletRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  bulletText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textDescription },
  securityNote: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, marginTop: SPACING.xl, marginBottom: SPACING.xl },
  securityText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted },
  button: { backgroundColor: COLORS.primary, paddingVertical: SPACING.lg, borderRadius: BORDER_RADIUS.md, alignItems: 'center' },
  buttonText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.background },
});
