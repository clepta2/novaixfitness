import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import type { ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { typography } from '../../styles';

interface ExerciseItem {
  id?: string;
  name: string;
}

interface ExerciseSelectorProps {
  exercises: ExerciseItem[];
  selected: string;
  onSelect: (name: string) => void;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
}

export default function ExerciseSelector({ exercises, selected, onSelect, voiceEnabled, onToggleVoice }: ExerciseSelectorProps): React.ReactElement {
  return (
    <>
      <View style={styles.header}>
        <Text style={typography.label}>REGISTRO DE SÉRIES</Text>
        <TouchableOpacity onPress={onToggleVoice} style={styles.voiceToggle}>
          <Ionicons name={voiceEnabled ? 'volume-medium' : 'volume-mute'} size={16} color={COLORS.primary} />
          <Text style={styles.voiceText}>{voiceEnabled ? 'VOZ ATIVA' : 'MUTADO'}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
        {exercises.map((ex) => (
          <TouchableOpacity key={ex.id || ex.name} style={[styles.chip, selected === ex.name && styles.chipActive]} onPress={() => onSelect(ex.name)}>
            <Text style={[styles.chipText, selected === ex.name && styles.chipTextActive]}>{ex.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xs },
  voiceToggle: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  voiceText: { fontFamily: 'Montserrat_700Bold', fontSize: 10, color: COLORS.textMuted },
  scroll: { flexDirection: 'row', marginVertical: SPACING.md },
  chip: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: 20, backgroundColor: COLORS.background, marginRight: SPACING.xs, borderWidth: 1, borderColor: COLORS.border },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { fontFamily: 'Montserrat_700Bold', fontSize: 11, color: COLORS.textMuted },
  chipTextActive: { color: COLORS.background },
});
