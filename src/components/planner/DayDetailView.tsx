import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { typography } from '../../styles';
import { DAY_NAMES_FULL, DAY_KEYS, CATEGORY_COLORS } from '../../data/weekPlan';

function DayChip({ icon, text, borderColor }) {
  return (
    <View style={[styles.chip, borderColor && { borderColor }]}>
      {icon}
      <Text style={styles.chipText}>{text}</Text>
    </View>
  );
}

export default function DayDetailView({ dayKey, dayData, onEdit, onStart }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={typography.label}>{DAY_NAMES_FULL[DAY_KEYS.indexOf(dayKey)]}</Text>
        <TouchableOpacity onPress={onEdit}>
          <Ionicons name="create-outline" size={18} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
      <Text style={styles.name}>{dayData.workoutName}</Text>
      <View style={styles.meta}>
        <DayChip icon={<Ionicons name="time-outline" size={14} color={COLORS.primary} />} text={`${dayData.duration} min`} />
        {dayData.category && (
          <DayChip
            icon={<View style={[styles.catDot, { backgroundColor: CATEGORY_COLORS[dayData.category] }]} />}
            text={dayData.category}
            borderColor={CATEGORY_COLORS[dayData.category] + '40'}
          />
        )}
      </View>
      <TouchableOpacity style={styles.startBtn} onPress={onStart}>
        <Ionicons name="play" size={18} color={COLORS.background} />
        <Text style={styles.startBtnText}>INICIAR TREINO</Text>
      </TouchableOpacity>
    </View>
  );
}

export function TodayCard({ dayData }) {
  return (
    <View style={styles.card}>
      <Text style={typography.label}>HOJE</Text>
      {dayData && !dayData.isRest ? (
        <>
          <Text style={styles.name}>{dayData.workoutName}</Text>
          <View style={styles.meta}>
            <DayChip icon={<Ionicons name="time-outline" size={14} color={COLORS.primary} />} text={`${dayData.duration} min`} />
            {dayData.category && (
              <DayChip
                icon={<View style={[styles.catDot, { backgroundColor: CATEGORY_COLORS[dayData.category] }]} />}
                text={dayData.category}
                borderColor={CATEGORY_COLORS[dayData.category] + '40'}
              />
            )}
          </View>
        </>
      ) : (
        <View style={styles.restCard}>
          <Ionicons name="bed-outline" size={32} color={COLORS.textMuted} />
          <Text style={styles.restText}>Dia de descanso</Text>
          <Text style={styles.restSubtext}>Recupere-se para o próximo treino</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginTop: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontFamily: 'Montserrat_700Bold', fontSize: 18, color: COLORS.textTitle, marginTop: SPACING.sm, marginBottom: SPACING.md },
  meta: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.lg },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs, backgroundColor: COLORS.surfaceElevated, borderRadius: BORDER_RADIUS.sm, borderWidth: 1, borderColor: COLORS.border },
  chipText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textDescription },
  catDot: { width: 6, height: 6, borderRadius: 3 },
  startBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.md, height: 48 },
  startBtnText: { fontFamily: 'Montserrat_700Bold', fontSize: 13, color: COLORS.background, letterSpacing: 1 },
  restCard: { alignItems: 'center', paddingVertical: SPACING.lg, gap: SPACING.xs },
  restText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: COLORS.textDescription },
  restSubtext: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted },
});
