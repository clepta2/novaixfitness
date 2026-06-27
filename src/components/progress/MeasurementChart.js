import { View, Text, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { typography } from '../../styles';
import { MEASUREMENT_TYPES } from '../../services/body-measurements';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const chartConfig = {
  backgroundColor: COLORS.surface,
  backgroundGradientFrom: COLORS.surface,
  backgroundGradientTo: COLORS.surface,
  decimalPlaces: 1,
  color: (opacity = 1) => `rgba(204, 255, 0, ${opacity})`,
  labelColor: () => COLORS.textMuted,
  style: { borderRadius: 16 },
  propsForDots: { r: '4', strokeWidth: '2', stroke: COLORS.primary },
};

export default function MeasurementChart({ selectedChart, onSelectChart, chartData }) {
  return (
    <>
      <View style={styles.selector}>
        {MEASUREMENT_TYPES.map((m) => (
          <TouchableOpacity
            key={m.key}
            style={[styles.btn, selectedChart === m.key && styles.btnActive]}
            onPress={() => onSelectChart(m.key)}
          >
            <Text style={[typography.caption, selectedChart === m.key && styles.btnText]}>{m.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {chartData.length > 1 && (
        <View style={styles.card}>
          <LineChart
            data={{ labels: chartData.map(d => d.date), datasets: [{ data: chartData.map(d => d.value) }] }}
            width={SCREEN_WIDTH - 80} height={200}
            chartConfig={chartConfig} bezier fromZero
          />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  selector: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs, marginBottom: SPACING.xl },
  btn: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.full, borderWidth: 1, borderColor: COLORS.border },
  btnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  btnText: { color: COLORS.background, ...typography.h5 },
  card: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.xl, borderWidth: 1, borderColor: COLORS.border },
});
