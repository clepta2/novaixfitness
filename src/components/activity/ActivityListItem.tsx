// src/components/activity/ActivityListItem.tsx
// Componente reutilizável para exibir uma atividade na lista

import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

const TYPE_ICONS: Record<string, string> = {
  running: 'walk',
  cycling: 'bicycle',
  walking: 'footsteps',
  hiking: 'map',
  swimming: 'water',
  other: 'fitness',
};

const TYPE_LABELS: Record<string, string> = {
  running: 'Corrida',
  cycling: 'Ciclismo',
  walking: 'Caminhada',
  hiking: 'Trilha',
  swimming: 'Natação',
  other: 'Outro',
};

interface Activity {
  id: string;
  type: string;
  duration_seconds: number;
  distance_meters: number;
  calories: number;
  started_at: string;
}

interface ActivityListItemProps {
  activity: Activity;
}

export default function ActivityListItem({ activity }: ActivityListItemProps) {
  const durationMin = Math.round(activity.duration_seconds / 60);
  const distanceKm = (activity.distance_meters / 1000).toFixed(1);
  const icon = TYPE_ICONS[activity.type] || 'fitness';
  const label = TYPE_LABELS[activity.type] || activity.type;

  return (
    <View style={styles.item}>
      <View style={[styles.iconWrap, { backgroundColor: COLORS.primary + '15' }]}>
        <Ionicons name={icon as any} size={16} color={COLORS.primary} />
      </View>
      <View style={styles.info}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.detail}>{durationMin}min · {distanceKm}km · {activity.calories}kcal</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    padding: SPACING.sm, backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
  },
  iconWrap: {
    width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center',
  },
  info: { flex: 1 },
  label: { fontFamily: 'Inter_500Medium', fontSize: 13, color: COLORS.textTitle },
  detail: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted },
});
