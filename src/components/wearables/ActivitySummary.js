import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

export default function ActivitySummary({ steps, stepsGoal, calories, caloriesGoal, distance }) {
  const stepsPct = stepsGoal > 0 ? Math.round((steps / stepsGoal) * 100) : 0;
  const calPct = caloriesGoal > 0 ? Math.round((calories / caloriesGoal) * 100) : 0;

  const metrics = [
    { icon: 'footsteps', value: steps, label: 'Passos', pct: stepsPct, color: COLORS.primary },
    { icon: 'flame', value: calories, label: 'Calorias', pct: calPct, color: COLORS.secondary },
    { icon: 'map', value: `${(distance || 0).toFixed(1)}`, label: 'km', pct: null, color: COLORS.info },
  ];

  return (
    <View style={st.card} accessibilityLabel="Resumo de atividades de hoje">
      <Text style={st.title}>ATIVIDADES DE HOJE</Text>
      <View style={st.row}>
        {metrics.map((m, i) => (
          <View key={i} style={st.item}>
            <View style={[st.circle, { borderColor: m.color + '40' }]}>  
              <Text style={[st.circleVal, { color: m.color }]}>{m.value}</Text>
            </View>
            <Ionicons name={m.icon} size={20} color={m.color} style={{ marginTop: SPACING.xs }} />
            <Text style={st.label}>{m.label}</Text>
            {m.pct != null && <Text style={[st.pct, { color: m.pct >= 100 ? COLORS.success : COLORS.textMuted }]}>{m.pct}%</Text>}
          </View>
        ))}
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  card: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.lg, marginBottom: SPACING.md },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textDescription, letterSpacing: 1, marginBottom: SPACING.lg },
  row: { flexDirection: 'row', justifyContent: 'space-around' },
  item: { alignItems: 'center', flex: 1 },
  circle: { width: 56, height: 56, borderRadius: 28, borderWidth: 3, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.xs },
  circleVal: { fontFamily: 'Montserrat_700Bold', fontSize: 14 },
  label: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted, marginTop: 4 },
  pct: { fontFamily: 'Inter_600SemiBold', fontSize: 11, marginTop: 2 },
});
