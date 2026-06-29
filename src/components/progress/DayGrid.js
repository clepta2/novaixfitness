import { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { typography } from '../../styles';

const today = new Date().getDay();

export default memo(function DayGrid({ byDay }) {
  return (
    <View style={styles.card}>
      <Text style={typography.label}>DIAS DA SEMANA</Text>
      <View style={styles.grid}>
        {byDay?.map((day, i) => {
          const isToday = i === today;
          const hasWorkout = day.count > 0;
          return (
            <View key={i} style={[styles.item, isToday && styles.itemToday]}>
              <Text style={[styles.name, isToday && styles.nameToday]}>{day.day}</Text>
              <View style={[styles.circle, hasWorkout && styles.circleActive]}>
                {hasWorkout ? (
                  <Ionicons name="checkmark" size={16} color={COLORS.background} />
                ) : (
                  <Text style={styles.empty}>-</Text>
                )}
              </View>
              <Text style={styles.count}>{day.count}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  grid: { flexDirection: 'row', justifyContent: 'space-between', marginTop: SPACING.md },
  item: { alignItems: 'center', gap: SPACING.xs },
  itemToday: { transform: [{ scale: 1.1 }] },
  name: { ...typography.labelSmall },
  nameToday: { color: COLORS.primary, ...typography.h5, fontSize: 11 },
  circle: { width: 32, height: 32, borderRadius: BORDER_RADIUS.full, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: COLORS.border },
  circleActive: { backgroundColor: COLORS.success, borderColor: COLORS.success },
  empty: { color: COLORS.textMuted, fontSize: 12 },
  count: { ...typography.buttonSmall, color: COLORS.textTitle },
});
