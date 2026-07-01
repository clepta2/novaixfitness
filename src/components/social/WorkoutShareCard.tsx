import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { shareWorkout } from '../../services/share';

function WorkoutShareCard({ workout }) {
  const handleShare = () => {
    shareWorkout({ name: workout.name, duration: workout.duration, exercises: workout.exercisesCount, xp: workout.xpEarned }).catch(() => {});
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Ionicons name="trophy-outline" size={20} color={COLORS.primary} />
        <Text style={styles.title} numberOfLines={1}>{workout.name}</Text>
      </View>
      <View style={styles.stats}>
        <View style={styles.stat}>
          <Ionicons name="time-outline" size={14} color={COLORS.textMuted} />
          <Text style={styles.statText}>{workout.duration}min</Text>
        </View>
        <View style={styles.stat}>
          <Ionicons name="list-outline" size={14} color={COLORS.textMuted} />
          <Text style={styles.statText}>{workout.exercisesCount} ex.</Text>
        </View>
        <View style={styles.stat}>
          <Ionicons name="flash-outline" size={14} color={COLORS.primary} />
          <Text style={styles.xpText}>+{workout.xpEarned} XP</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.shareBtn} onPress={handleShare} activeOpacity={0.8}>
        <Ionicons name="share-social-outline" size={18} color={COLORS.background} />
        <Text style={styles.shareBtnText}>COMPARTILHAR</Text>
      </TouchableOpacity>
    </View>
  );
}

export default memo(WorkoutShareCard);

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.textTitle, flex: 1 },
  stats: { flexDirection: 'row', gap: SPACING.lg, marginBottom: SPACING.lg },
  stat: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  statText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted },
  xpText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.primary },
  shareBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.primary, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.md },
  shareBtnText: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.background, letterSpacing: 1 },
});
