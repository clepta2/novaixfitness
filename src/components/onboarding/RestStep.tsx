import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

interface Activity {
  id: string;
  icon: string;
  label: string;
  duration: string;
}

interface RestStepProps {
  activities: Activity[];
  selectedActivities: string[];
  onToggle: (id: string) => void;
}

export default function RestStep({ activities, selectedActivities, onToggle }: RestStepProps): React.JSX.Element {
  return (
    <>
      <Text style={styles.title}>O QUE FAZER NOS DIAS DE DESCANSO?</Text>
      <Text style={styles.subtitle}>Atividades leves para manter o corpo em movimento</Text>
      <View style={styles.grid}>
        {activities.map((activity) => {
          const active = selectedActivities.includes(activity.id);
          return (
            <TouchableOpacity
              key={activity.id}
              style={[styles.card, active && styles.cardActive]}
              onPress={() => onToggle(activity.id)}
            >
              <Ionicons name={activity.icon as any} size={24} color={active ? COLORS.primary : COLORS.textMuted} />
              <Text style={[styles.label, active && styles.labelActive]}>{activity.label}</Text>
              <Text style={styles.duration}>{activity.duration}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 20, color: COLORS.textTitle, marginBottom: SPACING.sm },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, marginBottom: SPACING.xl },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  card: { width: '30%', padding: SPACING.md, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center' },
  cardActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '10' },
  label: { fontFamily: 'Inter_500Medium', fontSize: 12, color: COLORS.textTitle, marginTop: SPACING.sm, textAlign: 'center' },
  labelActive: { color: COLORS.primary },
  duration: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted, marginTop: SPACING.xs },
});
