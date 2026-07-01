// RestCountdown.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';

interface RestCountdownProps {
  countdown: number;
  onAdd: () => void;
  onSubtract: () => void;
  onSkip: () => void;
}

export default function RestCountdown({ countdown, onAdd, onSubtract, onSkip }: RestCountdownProps): React.ReactElement {
  return (
    <View style={styles.container}>
      <Ionicons name="time" size={20} color={COLORS.primary} />
      <Text style={styles.text}>DESCANSO: {countdown}s</Text>
      <View style={styles.controls}>
        <TouchableOpacity onPress={onAdd} style={styles.controlBtn}><Text style={styles.controlText}>+15s</Text></TouchableOpacity>
        <TouchableOpacity onPress={onSubtract} style={styles.controlBtn}><Text style={styles.controlText}>-15s</Text></TouchableOpacity>
        <TouchableOpacity onPress={onSkip} style={[styles.controlBtn, styles.skipBtn]}><Text style={styles.skipText}>Pular</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primary + '10', borderLeftWidth: 3, borderLeftColor: COLORS.primary, padding: SPACING.md, borderRadius: 8, marginBottom: SPACING.md, gap: SPACING.sm },
  text: { fontFamily: 'Montserrat_700Bold', fontSize: 13, color: COLORS.primary, flex: 1 },
  controls: { flexDirection: 'row', gap: SPACING.xs },
  controlBtn: { paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: 4, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  controlText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textTitle },
  skipBtn: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  skipText: { fontFamily: 'Montserrat_700Bold', fontSize: 11, color: COLORS.background },
});
