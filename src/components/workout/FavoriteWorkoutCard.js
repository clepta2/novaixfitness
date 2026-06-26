// src/components/workout/FavoriteWorkoutCard.js
// Card horizontal de favorito - NOVAIX FITNESS

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

export default function FavoriteWorkoutCard({ workout, onPress, onRemove }) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress?.(workout)} activeOpacity={0.8}>
      <View style={styles.header}>
        <View style={styles.icon}>
          <Ionicons name="heart" size={14} color={COLORS.error} />
        </View>
        <Text style={styles.time}>{workout.favoritedAt}</Text>
      </View>
      <Text style={styles.name}>{workout.name}</Text>
      <Text style={styles.meta}>{workout.duration} min • {workout.level}</Text>
      <TouchableOpacity style={styles.removeBtn} onPress={() => onRemove?.(workout.id)}>
        <Ionicons name="heart-dislike-outline" size={14} color={COLORS.textMuted} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 160,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginRight: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.error + '30',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  icon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.error + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  time: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted },
  name: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.textTitle, marginBottom: SPACING.xs },
  meta: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted, marginBottom: SPACING.md },
  removeBtn: { alignSelf: 'flex-end' },
});
