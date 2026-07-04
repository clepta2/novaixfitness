import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { getXPProgress } from '../../constants/gamification';

function GamificationSummary({ xp = 0, streak = 0, achievements = 0, totalAchievements = 0 }) {
  const router = useRouter();
  const { current, next, progress, xpInLevel, xpNeeded } = getXPProgress(xp);

  return (
    <TouchableOpacity style={styles.card} onPress={() => router.push('/gamification')} activeOpacity={0.8}>
      <View style={styles.header}>
        <View style={styles.levelInfo}>
          <View style={[styles.levelBadge, { backgroundColor: current.color + '20' }]}>
            <Ionicons name={current.icon as any} size={16} color={current.color} />
            <Text style={[styles.levelName, { color: current.color }]}>{current.name}</Text>
          </View>
          <Text style={styles.xpText}>{xp} XP</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: current.color }]} />
      </View>
      <Text style={styles.progressText}>{next ? `${xpInLevel} / ${xpNeeded} XP para ${next.name}` : 'Nivel maximo!'}</Text>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Ionicons name="flame" size={18} color={COLORS.primary} />
          <Text style={styles.statValue}>{streak}</Text>
          <Text style={styles.statLabel}>Sequência</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Ionicons name="trophy" size={18} color={COLORS.attention} />
          <Text style={styles.statValue}>{achievements}/{totalAchievements}</Text>
          <Text style={styles.statLabel}>Conquistas</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Ionicons name="flash" size={18} color={COLORS.primary} />
          <Text style={styles.statValue}>{current.level}</Text>
          <Text style={styles.statLabel}>Nível</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default memo(GamificationSummary);

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.lg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  levelInfo: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  levelBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: 12 },
  levelName: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12 },
  xpText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.textTitle },
  progressBar: { height: 6, backgroundColor: COLORS.background, borderRadius: 3, overflow: 'hidden', marginBottom: SPACING.xs },
  progressFill: { height: '100%', borderRadius: 3 },
  progressText: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted, marginBottom: SPACING.md },
  statsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  stat: { alignItems: 'center', gap: 4 },
  statValue: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle },
  statLabel: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted },
  statDivider: { width: 1, height: 30, backgroundColor: COLORS.border },
});
