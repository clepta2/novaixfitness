// src/components/profile/AchievementsCarousel.js
// Carrossel de conquistas - NOVAIX FITNESS

import { memo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS, ICON_SIZES } from '../../constants/spacing';
import { scale } from '../../utils/responsive';

function AchievementCard({ achievement, unlocked }) {
  const color = unlocked ? (achievement.color || COLORS.primary) : COLORS.textMuted;
  return (
    <View style={[styles.card, !unlocked && styles.locked]}>
      <View style={[styles.iconWrap, { backgroundColor: color + '22' }]}>
        <Ionicons
          name={unlocked ? (achievement.icon || 'trophy') : 'lock-closed'}
          size={ICON_SIZES.lg}
          color={color}
        />
      </View>
      {unlocked && <View style={styles.dot} />}
      <Text style={[styles.name, !unlocked && styles.lockedText]} numberOfLines={2}>
        {unlocked ? achievement.name : '???'}
      </Text>
      {unlocked && achievement.description && (
        <Text style={styles.desc} numberOfLines={2}>{achievement.description}</Text>
      )}
    </View>
  );
}

const PLACEHOLDER_LOCKED = Array.from({ length: 5 }, (_, i) => ({ id: `locked_${i}` }));

function AchievementsCarousel({ achievements = [], totalAchievements = 25 }) {
  const locked = PLACEHOLDER_LOCKED.slice(0, Math.max(0, Math.min(5, totalAchievements - achievements.length)));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>CONQUISTAS</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{achievements.length}/{totalAchievements}</Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {achievements.map((a) => (
          <AchievementCard key={a.id} achievement={a} unlocked />
        ))}
        {locked.map((a) => (
          <AchievementCard key={a.id} achievement={a} unlocked={false} />
        ))}
      </ScrollView>
    </View>
  );
}

export default memo(AchievementsCarousel);

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.xl },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  title: { fontFamily: 'Montserrat_600SemiBold', fontSize: scale(11), color: COLORS.textMuted, letterSpacing: 1, textTransform: 'uppercase' },
  badge: { backgroundColor: COLORS.primary + '22', borderRadius: 999, paddingHorizontal: SPACING.sm, paddingVertical: 2 },
  badgeText: { fontFamily: 'Montserrat_700Bold', fontSize: scale(10), color: COLORS.primary },
  scroll: { gap: SPACING.sm, paddingRight: SPACING.sm },
  card: { width: scale(90), backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, alignItems: 'center', gap: SPACING.xs, borderWidth: 1, borderColor: COLORS.border },
  locked: { opacity: 0.45 },
  iconWrap: { width: scale(52), height: scale(52), borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  dot: { position: 'absolute', top: SPACING.sm, right: SPACING.sm, width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary },
  name: { fontFamily: 'Montserrat_600SemiBold', fontSize: scale(10), color: COLORS.textTitle, textAlign: 'center' },
  lockedText: { color: COLORS.textMuted },
  desc: { fontFamily: 'Inter_400Regular', fontSize: scale(9), color: COLORS.textMuted, textAlign: 'center' },
});
