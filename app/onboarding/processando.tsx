
// app/onboarding/processando.js
// Tela de Carregamento - NOVAIX FITNESS

import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../src/constants/colors';
import { SPACING } from '../../src/constants/spacing';
import { ProgressBar, ErrorBoundary } from '../../src/components';
import { layout, typography } from '../../src/styles';
import useProcessing from '../../src/hooks/useProcessing';

export default function ProcessingScreen() {
  const { currentStep, elapsedTime, spin, formatTime, steps } = useProcessing();

  return (
    <ErrorBoundary screenName="Processando">
    <View style={layout.centered}>
      <View style={styles.header}>
        <Text style={typography.h3}>PROCESSANDO...</Text>
        <Text style={typography.h5}>PREPARANDO SUA NOVA EVOLUCAO NO TREINO</Text>
        <View style={styles.progressContainer}><ProgressBar {...{ value: currentStep + 1, max: steps.length, label: "", showValue: false, style: {} } as any} /></View>
      </View>

      <Text style={typography.h5}>{formatTime(elapsedTime)}</Text>

      <View style={styles.spinnerContainer}>
        <Animated.View style={[styles.spinner, { transform: [{ rotate: spin }] }]}>
          <View style={styles.spinnerRing} />
        </Animated.View>
        <View style={styles.spinnerCenter}>
          <Text style={typography.brand}>N</Text>
        </View>
        <Text style={typography.caption}>Evolucao Corporal</Text>
        <Text style={typography.h5}>CALCULANDO PLANO...</Text>
      </View>

      <View style={styles.stepsContainer}>
        {steps.map((step, index) => (
          <View key={index} style={[styles.stepItem, index <= currentStep && styles.stepItemActive]}>
            <Ionicons name={step.icon as any} size={16} color={index <= currentStep ? COLORS.primary : COLORS.textMuted} />
            <Text style={[typography.caption, index <= currentStep && { color: COLORS.primary }]}>{step.label}</Text>
          </View>
        ))}
      </View>
    </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', marginBottom: 30 },
  progressContainer: { width: '100%', marginTop: SPACING.xxl },
  spinnerContainer: { alignItems: 'center', marginBottom: 40 },
  spinner: { width: 150, height: 150, borderRadius: 75, borderWidth: 8, borderColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  spinnerRing: { position: 'absolute', width: 134, height: 134, borderRadius: 67, borderWidth: 4, borderColor: 'transparent', borderTopColor: COLORS.primary },
  spinnerCenter: { position: 'absolute', width: 100, height: 100, borderRadius: 50, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center' },
  stepsContainer: { width: '100%', gap: SPACING.md },
  stepItem: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, opacity: 0.5 },
  stepItemActive: { opacity: 1 },
});
