import { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

interface WeeklyStatsProps {
  workouts?: number;
  minutes?: number;
  calories?: number;
}

function WeeklyStats({ workouts = 0, minutes = 0, calories = 0 }: WeeklyStatsProps): React.JSX.Element {
  const router = useRouter();

  const stats = [
    { icon: 'barbell' as const, value: workouts, label: 'Treinos', color: COLORS.primary },
    { icon: 'time' as const, value: minutes, label: 'Minutos', color: COLORS.info },
    { icon: 'flame' as const, value: calories, label: 'Calorias', color: COLORS.secondary },
  ];

  return (
    <TouchableOpacity style={styles.card} onPress={() => router.push('/weekly-progress')} activeOpacity={0.8}>
      <View style={styles.header}>
        <Text style={styles.title}>RESUMO DA SEMANA</Text>
        <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
      </View>
      <View style={styles.statsRow}>
        {stats.map((stat) => (
          <View key={stat.label} style={styles.statItem}>
            <View style={[styles.iconWrap, { backgroundColor: stat.color + '15' }]}>
              <Ionicons name={stat.icon} size={20} color={stat.color} />
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
}

export default memo(WeeklyStats);

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.lg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  title: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textMuted, letterSpacing: 1 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center', gap: SPACING.xs },
  iconWrap: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  statValue: { fontFamily: 'Montserrat_700Bold', fontSize: 18, color: COLORS.textTitle },
  statLabel: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted },
});
