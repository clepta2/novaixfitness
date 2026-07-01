import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

export default function StatsGrid({ analytics }) {
  const stats = [
    { icon: 'barbell', value: analytics?.totalWorkouts || 0, label: 'Treinos' },
    { icon: 'time', value: analytics?.totalMinutes || 0, label: 'Minutos' },
    { icon: 'speedometer', value: analytics?.avgDuration || 0, label: 'Media (min)' },
    { icon: 'flame', value: analytics?.streak || 0, label: 'Streak' },
  ];

  return (
    <View style={styles.grid}>
      {stats.map((stat, i) => (
        <View key={i} style={styles.card}>
          <Ionicons name={stat.icon} size={20} color={COLORS.primary} />
          <Text style={styles.value}>{stat.value}</Text>
          <Text style={styles.label}>{stat.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.xl },
  card: { width: '48%', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  value: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 28, color: COLORS.primary, marginTop: SPACING.sm },
  label: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
});
