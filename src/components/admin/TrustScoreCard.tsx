import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

const getTrustColor = (score) => {
  if (score >= 80) return COLORS.success;
  if (score >= 50) return COLORS.attention;
  return COLORS.error;
};

export default function TrustScoreCard({ trust }) {
  if (!trust) return null;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.label}>CONFIANÇA</Text>
        <Text style={[styles.score, { color: getTrustColor(trust.trust_score) }]}>
          {trust.trust_score}/100
        </Text>
      </View>
      <View style={styles.bar}>
        <View style={[styles.fill, { width: `${trust.trust_score}%`, backgroundColor: getTrustColor(trust.trust_score) }]} />
      </View>
      <View style={styles.stats}>
        <Text style={styles.stat}>⚠️ {trust.warnings_count} avisos</Text>
        <Text style={styles.stat}>🚫 {trust.blocks_count} bloqueios</Text>
        <Text style={styles.stat}>🚩 {trust.reports_received} reports</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { margin: SPACING.lg, padding: SPACING.lg, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, borderWidth: 1, borderColor: COLORS.border },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  label: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textMuted, letterSpacing: 1 },
  score: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 24 },
  bar: { height: 6, backgroundColor: COLORS.surfaceElevated, borderRadius: 3, marginBottom: SPACING.md },
  fill: { height: 6, borderRadius: 3 },
  stats: { flexDirection: 'row', justifyContent: 'space-around' },
  stat: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted },
});
