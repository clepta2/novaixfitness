// src/components/activity/ActivitySection.tsx
// Seção de atividades reutilizável

import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import ActivityStarter from './ActivityStarter';
import ActivityListItem from './ActivityListItem';

interface Activity {
  id: string;
  type: string;
  duration_seconds: number;
  distance_meters: number;
  calories: number;
  started_at: string;
}

interface ActivitySectionProps {
  activeActivity: string | null;
  activities: Activity[];
  onStart: (type: string) => void;
  onFinish: () => void;
  maxVisible?: number;
}

export default function ActivitySection({ activeActivity, activities, onStart, onFinish, maxVisible = 5 }: ActivitySectionProps) {
  const visibleActivities = activities.slice(0, maxVisible);

  return (
    <View style={styles.section}>
      <Text style={styles.title}>ATIVIDADES</Text>
      <ActivityStarter activeActivity={activeActivity} onStart={onStart} onFinish={onFinish} />
      {visibleActivities.length > 0 && (
        <View style={styles.list}>
          {visibleActivities.map((a) => (
            <ActivityListItem key={a.id} activity={a} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: SPACING.lg, backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg,
  },
  title: {
    fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textTitle,
    letterSpacing: 1, marginBottom: SPACING.md,
  },
  list: { marginTop: SPACING.md, gap: SPACING.sm },
});
