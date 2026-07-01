import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

interface NextLevel {
  label: string;
  min: number;
}

interface StreakConfig {
  color: string;
}

interface StreakProgressProps {
  streak: number;
  nextLevel: NextLevel | null;
  config: StreakConfig;
}

function StreakProgress({ streak, nextLevel, config }: StreakProgressProps) {
  if (!nextLevel) return null;
  const progress = (streak / nextLevel.min) * 100;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Próximo: {nextLevel.label} ({nextLevel.min} dias)</Text>
      <View style={styles.progressBar}>
        <View style={[styles.fill, { width: `${Math.min(100, progress)}%`, backgroundColor: config.color }]} />
      </View>
      <Text style={styles.text}>{streak}/{nextLevel.min}</Text>
    </View>
  );
}

export default memo(StreakProgress);

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.sm, padding: SPACING.md, marginBottom: SPACING.md },
  label: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted, marginBottom: SPACING.xs },
  progressBar: { height: 6, backgroundColor: COLORS.surfaceOverlay, borderRadius: 3, overflow: 'hidden', marginBottom: SPACING.xs },
  fill: { height: '100%', borderRadius: 3 },
  text: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.primary, textAlign: 'right' },
});
