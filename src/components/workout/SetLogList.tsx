// SetLogList.tsx
import { memo } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { typography } from '../../styles';

interface ExerciseLog {
  id: string;
  set_number: number;
  reps_done: number;
  weight_kg: number;
}

interface SetLogListProps {
  logs: ExerciseLog[];
  loading: boolean;
}

export default memo(function SetLogList({ logs, loading }: SetLogListProps): React.ReactElement {
  return (
    <View style={styles.container}>
      <Text style={typography.caption}>SÉRIES REALIZADAS:</Text>
      {loading ? (
        <ActivityIndicator size="small" color={COLORS.primary} style={{ marginTop: SPACING.md }} />
      ) : logs.length > 0 ? (
        logs.map((log) => (
          <View key={log.id} style={styles.item}>
            <View style={styles.badge}><Text style={styles.badgeText}>SÉRIE {log.set_number}</Text></View>
            <Text style={typography.h5}>{log.reps_done} REPS</Text>
            <Text style={typography.bodyMuted}>{log.weight_kg} kg</Text>
          </View>
        ))
      ) : (
        <Text style={[typography.caption, { marginTop: SPACING.sm }]}>Nenhuma série registrada.</Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: { borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: SPACING.md },
  item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: SPACING.xs },
  badge: { backgroundColor: COLORS.primary + '15', paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: 4 },
  badgeText: { fontFamily: 'Montserrat_700Bold', fontSize: 10, color: COLORS.primary },
});
