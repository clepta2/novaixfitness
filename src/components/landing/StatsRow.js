import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';

export default function StatsRow({ stats }) {
  return (
    <View style={styles.statsRow}>
      {stats.map((stat, i) => (
        <View key={i} style={styles.statItem}>
          <Text style={styles.statValue}>{stat.value}</Text>
          <Text style={styles.statLabel}>{stat.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', borderTopWidth: 1, borderBottomWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)', paddingVertical: SPACING.xxl, backgroundColor: COLORS.surface },
  statItem: { alignItems: 'center' },
  statValue: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 32, color: COLORS.primary, textShadowColor: 'rgba(204, 255, 0, 0.1)', textShadowOffset: { width: 0, height: 4 }, textShadowRadius: 10 },
  statLabel: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textDescription, marginTop: 6, letterSpacing: 0.5 },
});
