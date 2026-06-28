// src/components/ui/Timer.js
// Componente de Cronômetro NOVAIX FITNESS

import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { SHADOWS } from '../../constants/shadows';

export function Timer({ seconds, total, label, isResting, style }) {
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <View
      style={[styles.container, style]}
      accessibilityRole="text"
      accessibilityLabel={`${label || (isResting ? 'Descanso' : 'Tempo')}: ${formatTime(seconds)}${total ? ` de ${formatTime(total)}` : ''}`}
    >
      <Text style={styles.label}>{label || (isResting ? 'DESCANSO' : 'TEMPO')}</Text>
      <View style={styles.display}>
        <Text style={[styles.time, isResting && styles.resting]}>{formatTime(seconds)}</Text>
        {total && <Text style={styles.total}>/ {formatTime(total)}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  label: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: COLORS.textTitle,
    textTransform: 'uppercase',
    marginBottom: SPACING.sm,
  },
  display: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  time: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 64,
    color: COLORS.primary,
  },
  resting: {
    color: COLORS.success,
  },
  total: {
    fontFamily: 'Inter_400Regular',
    fontSize: 18,
    color: COLORS.textMuted,
    marginLeft: SPACING.sm,
  },
});
