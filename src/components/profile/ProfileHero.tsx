// src/components/profile/ProfileHero.js
// Hero do perfil: avatar + nome + level + stats horizontais - NOVAIX FITNESS

import React, { memo, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from '../ui/Avatar';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS, ICON_SIZES } from '../../constants/spacing';
import { scale } from '../../utils/responsive';
import { getXPProgress } from '../../constants/gamification';
import { LABELS, STAT_DEFS } from '../../data/profileTexts';

const STAT_COLORS = { streak: COLORS.secondary, workouts: COLORS.primary, time: COLORS.info, favorites: COLORS.error };

function StatChip({ icon, color, label, value, unit }) {
  return (
    <View style={styles.chip}>
      <View style={[styles.chipIcon, { backgroundColor: color + '22' }]}>
        <Ionicons name={icon} size={ICON_SIZES.sm} color={color} />
      </View>
      <Text style={styles.chipValue}>{value}<Text style={styles.chipUnit}>{unit}</Text></Text>
      <Text style={styles.chipLabel}>{label}</Text>
    </View>
  );
}

function ProfileHero({ name, email, memberSince, uri, onPressAvatar, onEditName, stats, xp = 0 }) {
  const { current, progress } = getXPProgress(xp);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Avatar + nome */}
      <View style={styles.topRow}>
        <TouchableOpacity onPress={onPressAvatar} activeOpacity={0.8}>
          <Avatar name={name} uri={uri} size="xl" />
          <View style={styles.editAvatar}>
            <Ionicons name="camera" size={12} color={COLORS.textTitle} />
          </View>
        </TouchableOpacity>

        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>{name}</Text>
            <TouchableOpacity onPress={onEditName} style={styles.editBtn}>
              <Ionicons name="create-outline" size={16} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
          <Text style={styles.email} numberOfLines={1}>{email}</Text>
          <Text style={styles.member}>{LABELS.memberSince} {memberSince}</Text>

          {/* Level badge + XP bar */}
          <View style={styles.levelRow}>
            <View style={[styles.levelBadge, { backgroundColor: current.color + '22' }]}>
              <Ionicons name={current.icon as any} size={12} color={current.color} />
              <Text style={[styles.levelText, { color: current.color }]}>Nv.{current.level} {current.name}</Text>
            </View>
            <Text style={styles.xpText}>{xp} XP</Text>
          </View>
          <View style={styles.xpTrack}>
            <View style={[styles.xpFill, { width: `${Math.max(progress * 100, 3)}%`, backgroundColor: current.color }]} />
          </View>
        </View>
      </View>

      {/* Stats horizontais */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsRow} contentContainerStyle={styles.statsContent}>
        {STAT_DEFS.map((s) => (
          <StatChip key={s.key} icon={s.icon} color={STAT_COLORS[s.key]} label={s.label} value={stats?.[s.key] ?? 0} unit={s.unit} />
        ))}
        <StatChip icon="star" color={COLORS.attention} label={LABELS.xpTotal} value={xp} unit=" pts" />
      </ScrollView>
    </Animated.View>
  );
}

export default memo(ProfileHero);

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.xl, padding: SPACING.lg, marginBottom: SPACING.xl, borderWidth: 1, borderColor: COLORS.border },
  topRow: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.lg, marginBottom: SPACING.lg },
  editAvatar: { position: 'absolute', bottom: 0, right: 0, width: 22, height: 22, borderRadius: 11, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: 2 },
  name: { fontFamily: 'Montserrat_700Bold', fontSize: scale(16), color: COLORS.textTitle, flex: 1 },
  editBtn: { padding: 4 },
  email: { fontFamily: 'Inter_400Regular', fontSize: scale(12), color: COLORS.textMuted, marginBottom: 2 },
  member: { fontFamily: 'Inter_400Regular', fontSize: scale(11), color: COLORS.textDescription, marginBottom: SPACING.sm },
  levelRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  levelBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 999, paddingHorizontal: SPACING.sm, paddingVertical: 3 },
  levelText: { fontFamily: 'Montserrat_600SemiBold', fontSize: scale(10) },
  xpText: { fontFamily: 'Montserrat_700Bold', fontSize: scale(11), color: COLORS.primary },
  xpTrack: { height: 5, backgroundColor: COLORS.background, borderRadius: 3, overflow: 'hidden' },
  xpFill: { height: '100%', borderRadius: 3 },
  statsRow: { marginHorizontal: -SPACING.sm },
  statsContent: { paddingHorizontal: SPACING.sm, gap: SPACING.sm },
  chip: { width: scale(72), backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, padding: SPACING.sm, alignItems: 'center', gap: 3 },
  chipIcon: { width: scale(36), height: scale(36), borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  chipValue: { fontFamily: 'Montserrat_800ExtraBold', fontSize: scale(14), color: COLORS.textTitle },
  chipUnit: { fontFamily: 'Inter_400Regular', fontSize: scale(10), color: COLORS.textMuted },
  chipLabel: { fontFamily: 'Inter_400Regular', fontSize: scale(10), color: COLORS.textMuted, textAlign: 'center' },
});
