import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { TIMER_CONTROLS } from '../../data/workoutTexts';

const QUICK_TIMES = [
  { seconds: 15, label: '15s', icon: 'flash' },
  { seconds: 30, label: '30s', icon: 'time' },
  { seconds: 60, label: '1m', icon: 'time' },
  { seconds: 90, label: '1.5m', icon: 'time' },
  { seconds: 120, label: '2m', icon: 'time' },
];

export default function TimerControls({ showQuick, onToggleQuick, onAddTime, onSubtractTime, onChangeTime }) {
  return (
    <>
      <View style={styles.row}>
        <TouchableOpacity style={styles.timeBtn} onPress={onSubtractTime}>
          <Ionicons name="remove-circle" size={24} color={COLORS.textMuted} />
          <Text style={styles.timeBtnText}>-15s</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickToggle} onPress={onToggleQuick}>
          <Ionicons name="timer" size={16} color={COLORS.primary} />
          <Text style={styles.quickToggleText}>{TIMER_CONTROLS.quickTime}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.timeBtn} onPress={onAddTime}>
          <Ionicons name="add-circle" size={24} color={COLORS.primary} />
          <Text style={[styles.timeBtnText, { color: COLORS.primary }]}>+15s</Text>
        </TouchableOpacity>
      </View>
      {showQuick && (
        <View style={styles.quickRow}>
          {QUICK_TIMES.map(t => (
            <TouchableOpacity key={t.seconds} style={styles.quickBtn} onPress={() => onChangeTime(t.seconds)}>
              <Ionicons name={t.icon} size={14} color={COLORS.primary} />
              <Text style={styles.quickBtnText}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  timeBtn: { alignItems: 'center', gap: 2 },
  timeBtnText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.textMuted },
  quickToggle: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, backgroundColor: COLORS.primary + '15', borderRadius: BORDER_RADIUS.sm },
  quickToggleText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.primary },
  quickRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.md },
  quickBtn: { alignItems: 'center', gap: 2, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.sm, borderWidth: 1, borderColor: COLORS.border },
  quickBtnText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.textMuted },
});
