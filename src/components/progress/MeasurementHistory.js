import { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { typography } from '../../styles';

export default memo(function MeasurementHistory({ history, onDelete }) {
  return (
    <View style={styles.section}>
      <Text style={typography.label}>HISTÓRICO</Text>
      {history.slice(0, 10).map((m) => (
        <View key={m.id} style={styles.item}>
          <View style={styles.date}>
            <Ionicons name="calendar" size={16} color={COLORS.textMuted} />
            <Text style={typography.caption}>{new Date(m.recorded_at).toLocaleDateString('pt-BR')}</Text>
          </View>
          <View style={styles.values}>
            {m.weight && <Text style={styles.value}>{m.weight} kg</Text>}
            {m.waist && <Text style={styles.value}>{m.waist} cm</Text>}
            {m.chest && <Text style={styles.value}>{m.chest} cm</Text>}
          </View>
          <TouchableOpacity onPress={() => onDelete(m.id)}>
            <Ionicons name="trash-outline" size={16} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  section: { gap: SPACING.sm },
  item: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.sm, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  date: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, width: 100 },
  values: { flex: 1, flexDirection: 'row', gap: SPACING.md },
  value: { ...typography.h5, color: COLORS.primary, fontSize: 13 },
});
