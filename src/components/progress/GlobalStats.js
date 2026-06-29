import { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { typography } from '../../styles';

export default memo(function GlobalStats({ totalWorkouts, streak, totalXP }) {
  const items = [
    { icon: 'trophy', value: totalWorkouts || 0, label: 'Total Treinos' },
    { icon: 'flame', value: streak || 0, label: 'Melhor Streak' },
    { icon: 'star', value: totalXP || 0, label: 'XP Total' },
  ];

  return (
    <View style={styles.card}>
      <Text style={typography.label}>ESTATISTICAS GLOBAIS</Text>
      <View style={styles.row}>
        {items.map((item, i) => (
          <View key={i} style={styles.item}>
            <Ionicons name={item.icon} size={18} color={COLORS.primary} />
            <Text style={styles.value}>{item.value}</Text>
            <Text style={styles.label}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  row: { flexDirection: 'row', justifyContent: 'space-around', marginTop: SPACING.md },
  item: { alignItems: 'center', gap: SPACING.xs },
  value: { ...typography.number, color: COLORS.primary },
  label: typography.labelSmall,
});
