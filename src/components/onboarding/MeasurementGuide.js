// src/components/onboarding/MeasurementGuide.js
// Guia de medição - DATA DRIVEN

import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { MEASUREMENT_GUIDES } from '../../data/measurementGuides';

export default function MeasurementGuide({ bodyPart }) {
  const guide = MEASUREMENT_GUIDES[bodyPart];
  if (!guide) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{guide.title}</Text>
      <View style={styles.stepsBox}>
        {guide.steps.map((step, i) => (
          <View key={i} style={styles.stepRow}>
            <View style={styles.stepNum}><Text style={styles.stepNumText}>{i + 1}</Text></View>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}
      </View>
      <View style={styles.tipsRow}>
        <View style={[styles.tipCard, styles.tipCorrect]}>
          <Ionicons name="checkmark-circle" size={14} color="#00E676" />
          <Text style={styles.tipText}>{guide.correct}</Text>
        </View>
        <View style={[styles.tipCard, styles.tipIncorrect]}>
          <Ionicons name="close-circle" size={14} color="#FF1744" />
          <Text style={styles.tipText}>{guide.incorrect}</Text>
        </View>
      </View>
      <View style={styles.proTip}>
        <Ionicons name="bulb" size={12} color={COLORS.primary} />
        <Text style={styles.proTipText}>{guide.tip}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.lg, padding: SPACING.md, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md },
  title: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: COLORS.textTitle, marginBottom: SPACING.md },
  stepsBox: { marginBottom: SPACING.md },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.xs },
  stepNum: { width: 18, height: 18, borderRadius: 9, backgroundColor: COLORS.primary + '20', justifyContent: 'center', alignItems: 'center' },
  stepNumText: { fontFamily: 'Montserrat_700Bold', fontSize: 9, color: COLORS.primary },
  stepText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textDescription, flex: 1 },
  tipsRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.sm },
  tipCard: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, padding: SPACING.sm, borderRadius: BORDER_RADIUS.sm },
  tipCorrect: { backgroundColor: '#00E67610' },
  tipIncorrect: { backgroundColor: '#FF174410' },
  tipText: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textDescription, flex: 1 },
  proTip: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, padding: SPACING.sm, backgroundColor: COLORS.primary + '10', borderRadius: BORDER_RADIUS.sm },
  proTipText: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.primary },
});
