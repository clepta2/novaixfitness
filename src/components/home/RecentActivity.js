import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const diff = Math.floor((new Date() - new Date(dateStr)) / 86400000);
  if (diff === 0) return 'Hoje';
  if (diff === 1) return 'Ontem';
  return `${diff}d atras`;
}

export default function RecentActivity({ workouts = [], onPress }) {
  if (workouts.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="time-outline" size={16} color={COLORS.textMuted} />
        <Text style={styles.title}>ATIVIDADE RECENTE</Text>
      </View>
      {workouts.slice(0, 3).map((w, i) => (
        <TouchableOpacity key={w.id || i} style={styles.row} onPress={() => onPress?.(w)} activeOpacity={0.7} accessibilityLabel={`${w.name || w.title || 'Treino'}, ${w.completed ? 'concluído' : 'pendente'}, ${w.duration_minutes || w.duration || 30} minutos`} accessibilityRole="button">
          <View style={[styles.dot, { backgroundColor: w.completed ? COLORS.success : COLORS.primary }]} />
          <View style={styles.info}>
            <Text style={styles.name} numberOfLines={1}>{w.name || w.title || 'Treino'}</Text>
            <Text style={styles.meta}>{w.category || 'Treino'} · {formatDate(w.completed_at || w.created_at)}</Text>
          </View>
          <Text style={styles.duration}>{w.duration_minutes || w.duration || 30}min</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: SPACING.lg },
  header: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: SPACING.md },
  title: { fontFamily: 'Montserrat-Bold', fontSize: 11, color: COLORS.textMuted, letterSpacing: 1 },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, marginBottom: SPACING.xs, borderWidth: 1, borderColor: COLORS.border },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: SPACING.md },
  info: { flex: 1 },
  name: { fontFamily: 'Montserrat-SemiBold', fontSize: 13, color: COLORS.textTitle },
  meta: { fontFamily: 'Inter-Regular', fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  duration: { fontFamily: 'Montserrat-Bold', fontSize: 12, color: COLORS.primary },
});
