// src/components/workout/TimerModeSelector.js
// Seletor de modo do timer - NOVAIX FITNESS

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

const TIMER_MODES = [
  { id: 'countdown', label: 'Cronômetro', icon: 'timer', desc: 'Conta regressiva', color: COLORS.primary },
  { id: 'stopwatch', label: 'Cronômetro Corrido', icon: 'stopwatch', desc: 'Conta progressiva', color: COLORS.success },
  { id: 'free', label: 'Livre', icon: 'infinite', desc: 'Sem limite de tempo', color: COLORS.info },
];

const PRESETS = [
  { minutes: 15, label: '15 min' },
  { minutes: 30, label: '30 min' },
  { minutes: 45, label: '45 min' },
  { minutes: 60, label: '60 min' },
  { minutes: 90, label: '90 min' },
  { minutes: 120, label: '2h' },
];

export default function TimerModeSelector({ selectedMode, onModeChange, selectedDuration, onDurationChange }) {
  const [showCustom, setShowCustom] = useState(false);
  const [customMinutes, setCustomMinutes] = useState('');

  const handleCustom = () => {
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
            <Ionicons name={mode.icon} size={18} color={selectedMode === mode.id ? COLORS.background : mode.color} />
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
                  <TouchableOpacity onPress={() => setCustomMinutes(String(Math.max(1, parseInt(customMinutes || 0) - 5)))}>
                    <Ionicons name="remove-circle" size={24} color={COLORS.textMuted} />
                  </TouchableOpacity>
                  <Text style={styles.customValue}>{customMinutes || '--'}</Text>
                  <TouchableOpacity onPress={() => setCustomMinutes(String(Math.min(480, parseInt(customMinutes || 0) + 5)))}>
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
        <Ionicons name={TIMER_MODES.find(m => m.id === selectedMode)?.icon || 'timer'} size={16} color={COLORS.primary} />
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
  container: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 11, color: COLORS.textMuted, letterSpacing: 1, marginBottom: SPACING.md },
  modesRow: { flexDirection: 'row', gap: SPACING.xs, marginBottom: SPACING.md },
  modeBtn: { flex: 1, alignItems: 'center', padding: SPACING.sm, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border, gap: SPACING.xs },
  modeLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.textMuted },
  modeLabelActive: { color: COLORS.background },
  modeDesc: { fontFamily: 'Inter_400Regular', fontSize: 8, color: COLORS.textMuted },
  modeDescActive: { color: COLORS.background + 'CC' },
  durationSection: { marginBottom: SPACING.md },
  sectionLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.textMuted, letterSpacing: 1, marginBottom: SPACING.sm },
  presetsRow: { flexDirection: 'row', gap: SPACING.xs, flexWrap: 'wrap' },
  presetBtn: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.sm, borderWidth: 1, borderColor: COLORS.border, minWidth: 50, alignItems: 'center' },
  presetActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  presetText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textMuted },
  presetTextActive: { color: COLORS.background },
  customRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginTop: SPACING.md },
  customInput: { flex: 1 },
  customLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 9, color: COLORS.textMuted, marginBottom: SPACING.xs },
  customInputContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.sm, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs },
  customValue: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 20, color: COLORS.textTitle },
  customApplyBtn: { backgroundColor: COLORS.primary, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.sm },
  customApplyText: { fontFamily: 'Montserrat_700Bold', fontSize: 11, color: COLORS.background, letterSpacing: 0.5 },
  selectedInfo: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: COLORS.primary + '10', padding: SPACING.sm, borderRadius: BORDER_RADIUS.sm },
  selectedText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.primary },
});
