import { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

function DailyStats({ workouts = 0, minutes = 0, calories = 0, goal = 1 }) {
  const router = useRouter();
  const completed = workouts >= goal;

  const stats = [
    { icon: 'barbell', value: workouts, label: 'Treinos', color: COLORS.primary },
    { icon: 'time', value: minutes, label: 'Minutos', color: COLORS.info },
    { icon: 'flame', value: calories, label: 'Calorias', color: COLORS.secondary },
  ];

  return (
    <TouchableOpacity style={styles.card} onPress={() => router.push('/player-list')} activeOpacity={0.8}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name={completed ? 'checkmark-circle' : 'today'} size={18} color={completed ? COLORS.success : COLORS.primary} />
          <Text style={styles.title}>HOJE</Text>
        </View>
        {completed ? (
          <View style={styles.doneBadge}>
            <Ionicons name="checkmark" size={12} color={COLORS.background} />
            <Text style={styles.doneText}>FEITO!</Text>
          </View>
        ) : (
          <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
        )}
      </View>
      <View style={styles.statsRow}>
        {stats.map((stat) => (
          <View key={stat.label} style={styles.statItem}>
            <View style={[styles.iconWrap, { backgroundColor: stat.color + '15' }]}>
              <Ionicons name={stat.icon} size={18} color={stat.color} />
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
}

export default memo(DailyStats);

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.lg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textTitle, letterSpacing: 1 },
  doneBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.success, paddingHorizontal: SPACING.sm, paddingVertical: 3, borderRadius: 10 },
  doneText: { fontFamily: 'Montserrat_700Bold', fontSize: 10, color: COLORS.background },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center', gap: SPACING.xs },
  iconWrap: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  statValue: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle },
  statLabel: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted },
});
