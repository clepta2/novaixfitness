import { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';

function TimerStats({ calories, xpEarned }) {
  if (calories <= 0 && xpEarned <= 0) return null;

  return (
    <View style={styles.row}>
      {calories > 0 && (
        <View style={styles.item}>
          <Ionicons name="flame" size={14} color={COLORS.secondary} />
          <Text style={styles.text}>{calories} kcal</Text>
        </View>
      )}
      {xpEarned > 0 && (
        <View style={styles.item}>
          <Ionicons name="star" size={14} color={COLORS.primary} />
          <Text style={[styles.text, { color: COLORS.primary }]}>+{xpEarned} XP</Text>
        </View>
      )}
    </View>
  );
}

export default memo(TimerStats);

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: SPACING.xl, marginTop: SPACING.lg },
  item: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  text: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: COLORS.textTitle },
});
