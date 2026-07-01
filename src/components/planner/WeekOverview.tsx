import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { typography } from '../../styles';
import { DAY_NAMES_FULL, DAY_KEYS } from '../../data/weekPlan';

interface DayData {
  isRest?: boolean;
  [key: string]: unknown;
}

interface WeekPlan {
  [key: string]: DayData | null;
}

interface WeekOverviewProps {
  weekPlan: WeekPlan;
  todayKey: string;
}

export default function WeekOverview({ weekPlan, todayKey }: WeekOverviewProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={typography.label}>RESUMO DA SEMANA</Text>
      <View style={styles.grid}>
        {DAY_KEYS.map((key) => {
          const day = weekPlan[key];
          const isActive = !day?.isRest;
          const isCurrentDay = key === todayKey;
          return (
            <View key={key} style={[styles.day, isCurrentDay && styles.dayActive]}>
              <Text style={[styles.dayLabel, isCurrentDay && styles.dayLabelActive]}>
                {DAY_NAMES_FULL[DAY_KEYS.indexOf(key)].substring(0, 3).toUpperCase()}
              </Text>
              <View style={[styles.dot, isActive && { backgroundColor: COLORS.success }, isCurrentDay && styles.dotActive]} />
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: SPACING.xl },
  grid: { flexDirection: 'row', justifyContent: 'space-between', marginTop: SPACING.md },
  day: { alignItems: 'center', gap: SPACING.xs },
  dayLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.textMuted, letterSpacing: 0.5 },
  dayLabelActive: { color: COLORS.primary },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.border },
  dotActive: { backgroundColor: COLORS.success },
});
