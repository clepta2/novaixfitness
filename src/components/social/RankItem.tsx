import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

const RANK_COLORS = [COLORS.attention, COLORS.textMuted, COLORS.secondary];
const RANK_ICONS = ['trophy', 'medal', 'ribbon'];

interface RankItemData {
  name: string;
  level?: string;
  xp?: number;
  workouts?: number;
}

interface RankItemProps {
  item: RankItemData;
  index: number;
  isCurrentUser?: boolean;
}

function RankItem({ item, index, isCurrentUser }: RankItemProps) {
  const rankColor = index < 3 ? RANK_COLORS[index] : COLORS.textMuted;
  const rankIcon = index < 3 ? RANK_ICONS[index] : null;

  return (
    <View style={[styles.container, isCurrentUser && styles.current]}>
      <View style={[styles.badge, { backgroundColor: rankColor + '20' }]}>
        {rankIcon ? (
          <Ionicons name={rankIcon} size={16} color={rankColor} />
        ) : (
          <Text style={[styles.number, { color: rankColor }]}>{index + 1}</Text>
        )}
      </View>

      <View style={styles.info}>
        <Text style={[styles.name, isCurrentUser && styles.nameCurrent]}>{item.name}</Text>
        <Text style={styles.level}>{item.level || 'Nível 1'}</Text>
      </View>

      <View style={styles.stats}>
        <Text style={styles.xp}>{item.xp?.toLocaleString() || 0} XP</Text>
        <Text style={styles.workouts}>{item.workouts || 0} treinos</Text>
      </View>
    </View>
  );
}

export default memo(RankItem);

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, padding: SPACING.sm, borderRadius: BORDER_RADIUS.sm },
  current: { backgroundColor: COLORS.primary + '10' },
  badge: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  number: { fontFamily: 'Montserrat_700Bold', fontSize: 12 },
  info: { flex: 1 },
  name: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: COLORS.textTitle },
  nameCurrent: { color: COLORS.primary },
  level: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted },
  stats: { alignItems: 'flex-end' },
  xp: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.primary },
  workouts: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted },
});
