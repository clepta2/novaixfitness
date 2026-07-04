import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

const ACTIVITY_TYPES = {
  workout: { icon: 'barbell', color: COLORS.success, label: 'Treinou' },
  streak: { icon: 'flame', color: COLORS.primary, label: 'Sequência' },
  achievement: { icon: 'trophy', color: COLORS.attention, label: 'Conquista' },
  meal: { icon: 'nutrition', color: COLORS.info, label: 'Refeição' },
};

type Props = {
  activity?: any;
};

export default memo(function ActivityItem({ activity = {} }: Props) {
  const config = ACTIVITY_TYPES[activity.type] || ACTIVITY_TYPES.workout;

  return (
    <View style={styles.container}>
      <View style={[styles.icon, { backgroundColor: config.color + '20' }]}>
        <Ionicons name={config.icon} size={18} color={config.color} />
      </View>

      <View style={styles.info}>
        <View style={styles.header}>
          <Text style={styles.user}>{activity.user?.name || 'Atleta'}</Text>
          <Text style={styles.time}>{activity.timeAgo}</Text>
        </View>
        <Text style={styles.text}>{activity.text}</Text>

        {activity.xp > 0 && (
          <View style={styles.xpBadge}>
            <Ionicons name="star" size={10} color={COLORS.primary} />
            <Text style={styles.xpText}>+{activity.xp} XP</Text>
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.likeBtn}>
        <Ionicons name="heart-outline" size={18} color={COLORS.textMuted} />
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: { flexDirection: 'row', gap: SPACING.md, padding: SPACING.sm },
  icon: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  info: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  user: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: COLORS.textTitle },
  time: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted },
  text: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textDescription },
  xpBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: SPACING.xs, alignSelf: 'flex-start', backgroundColor: COLORS.primary + '15', paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: BORDER_RADIUS.sm },
  xpText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.primary },
  likeBtn: { padding: SPACING.xs },
});
