import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { typography } from '../../styles';

export default function DashboardStats({ data, onPress }) {
  const items = [
    { icon: 'barbell', value: data?.totalWorkouts || 0, label: 'Treinos' },
    { icon: 'time', value: `${Math.round((data?.totalMinutes || 0) / 60)}h`, label: 'Tempo' },
    { icon: 'flame', value: data?.streak || 0, label: 'Streak' },
    { icon: 'star', value: data?.xp || 0, label: 'XP' },
  ];

  return (
    <View style={styles.grid}>
      {items.map((item, i) => (
        <TouchableOpacity key={i} style={styles.card} onPress={onPress} accessibilityLabel={`${item.label}: ${item.value}`} accessibilityRole="button">
          <Ionicons name={item.icon} size={22} color={COLORS.primary} />
          <Text style={styles.value}>{item.value}</Text>
          <Text style={styles.label}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.xl },
  card: { width: '48%', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  value: typography.stat,
  label: { ...typography.labelSmall, marginTop: 2 },
});
