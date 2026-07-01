// src/components/workout/TimerModeSelector.tsx
// Seletor de modo do timer - NOVAIX FITNESS

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { TextStyle, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

interface TimerMode {
  id: string;
  label: string;
  icon: string;
  desc: string;
  color: string;
}

interface Preset {
  minutes: number;
  label: string;
}

const TIMER_MODES: TimerMode[] = [
  { id: 'countdown', label: 'Cronômetro', icon: 'timer', desc: 'Conta regressiva', color: COLORS.primary },
  { id: 'stopwatch', label: 'Cronômetro Corrido', icon: 'stopwatch', desc: 'Conta progressiva', color: COLORS.success },
  { id: 'free', label: 'Livre', icon: 'infinite', desc: 'Sem limite de tempo', color: COLORS.info },
];

const PRESETS: Preset[] = [
  { minutes: 15, label: '15 min' },
  { minutes: 30, label: '30 min' },
  { minutes: 45, label: '45 min' },
  { minutes: 60, label: '60 min' },
  { minutes: 90, label: '90 min' },
  { minutes: 120, label: '2h' },
];

interface TimerModeSelectorProps {
  selectedMode: string;
  onModeChange: (mode: string) => void;
  selectedDuration: number;
  onDurationChange: (minutes: number) => void;
}

export default function TimerModeSelector({ selectedMode, onModeChange, selectedDuration, onDurationChange }: TimerModeSelectorProps): React.ReactElement {
  const [showCustom, setShowCustom] = useState<boolean>(false);
  const [customMinutes, setCustomMinutes] = useState<string>('');

  const handleCustom = (): void => {
    const mins = parseInt(customMinutes);
    if (mins > 0 && mins <= 480) {
      onDurationChange(mins);
      setShowCustom(false);
      setCustomMinutes('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MODO DO TIMER</Text>

      <View style={styles.modesRow}>
        {TIMER_MODES.map(mode => (
          <TouchableOpacity
            key={mode.id}
            style={[styles.modeBtn, selectedMode === mode.id && { backgroundColor: mode.color, borderColor: mode.color }]}
            onPress={() => onModeChange(mode.id)}
          >
            <Ionicons name={mode.icon as any} size={18} color={selectedMode === mode.id ? COLORS.background : mode.color} />
            <Text style={[styles.modeLabel, selectedMode === mode.id && styles.modeLabelActive]}>{mode.label}</Text>
            <Text style={[styles.modeDesc, selectedMode === mode.id && styles.modeDescActive]}>{mode.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedMode === 'countdown' && (
        <View style={styles.durationSection}>
          <Text style={styles.sectionLabel}>DURAÇÃO</Text>
          <View style={styles.presetsRow}>
            {PRESETS.map(preset => (
              <TouchableOpacity
                key={preset.minutes}
                style={[styles.presetBtn, selectedDuration === preset.minutes && styles.presetActive]}
                onPress={() => onDurationChange(preset.minutes)}
              >
                <Text style={[styles.presetText, selectedDuration === preset.minutes && styles.presetTextActive]}>{preset.label}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[styles.presetBtn, !PRESETS.find(p => p.minutes === selectedDuration) && styles.presetActive]}
              onPress={() => setShowCustom(!showCustom)}
            >
              <Ionicons name="create-outline" size={14} color={!PRESETS.find(p => p.minutes === selectedDuration) ? COLORS.background : COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          {showCustom && (
            <View style={styles.customRow}>
              <View style={styles.customInput}>
                <Text style={styles.customLabel}>MINUTOS</Text>
                <View style={styles.customInputContainer}>
                  <TouchableOpacity onPress={() => setCustomMinutes(String(Math.max(1, parseInt(customMinutes || '0') - 5)))}>
                    <Ionicons name="remove-circle" size={24} color={COLORS.textMuted} />
                  </TouchableOpacity>
                  <Text style={styles.customValue}>{customMinutes || '--'}</Text>
                  <TouchableOpacity onPress={() => setCustomMinutes(String(Math.min(480, parseInt(customMinutes || '0') + 5)))}>
                    <Ionicons name="add-circle" size={24} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity style={styles.customApplyBtn} onPress={handleCustom}>
                <Text style={styles.customApplyText}>APLICAR</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      <View style={styles.selectedInfo}>
        <Ionicons name={(TIMER_MODES.find(m => m.id === selectedMode)?.icon || 'timer') as any} size={16} color={COLORS.primary} />
        <Text style={styles.selectedText}>
          {selectedMode === 'countdown'
            ? `Cronômetro ${selectedDuration} min`
            : selectedMode === 'stopwatch'
            ? 'Cronômetro Corrido (sem limite)'
            : 'Modo Livre (sem controle)'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border } as ViewStyle,
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 11, color: COLORS.textMuted, letterSpacing: 1, marginBottom: SPACING.md } as TextStyle,
  modesRow: { flexDirection: 'row', gap: SPACING.xs, marginBottom: SPACING.md } as ViewStyle,
  modeBtn: { flex: 1, alignItems: 'center', padding: SPACING.sm, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border, gap: SPACING.xs } as ViewStyle,
  modeLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.textMuted } as TextStyle,
  modeLabelActive: { color: COLORS.background } as TextStyle,
  modeDesc: { fontFamily: 'Inter_400Regular', fontSize: 8, color: COLORS.textMuted } as TextStyle,
  modeDescActive: { color: COLORS.background + 'CC' } as TextStyle,
  durationSection: { marginBottom: SPACING.md } as ViewStyle,
  sectionLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.textMuted, letterSpacing: 1, marginBottom: SPACING.sm } as TextStyle,
  presetsRow: { flexDirection: 'row', gap: SPACING.xs, flexWrap: 'wrap' } as ViewStyle,
  presetBtn: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.sm, borderWidth: 1, borderColor: COLORS.border, minWidth: 50, alignItems: 'center' } as ViewStyle,
  presetActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary } as ViewStyle,
  presetText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textMuted } as TextStyle,
  presetTextActive: { color: COLORS.background } as TextStyle,
  customRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginTop: SPACING.md } as ViewStyle,
  customInput: { flex: 1 } as ViewStyle,
  customLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 9, color: COLORS.textMuted, marginBottom: SPACING.xs } as TextStyle,
  customInputContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.sm, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs } as ViewStyle,
  customValue: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 20, color: COLORS.textTitle } as TextStyle,
  customApplyBtn: { backgroundColor: COLORS.primary, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.sm } as ViewStyle,
  customApplyText: { fontFamily: 'Montserrat_700Bold', fontSize: 11, color: COLORS.background, letterSpacing: 0.5 } as TextStyle,
  selectedInfo: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: COLORS.primary + '10', padding: SPACING.sm, borderRadius: BORDER_RADIUS.sm } as ViewStyle,
  selectedText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.primary } as TextStyle,
});
