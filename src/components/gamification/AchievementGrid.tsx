// src/components/gamification/AchievementGrid.js
// Grid de conquistas com filtros - NOVAIX FITNESS

import React, { useState, memo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS, ICON_SIZES } from '../../constants/spacing';
import { ACHIEVEMENTS } from '../../constants/gamification';

const CATEGORIES = [
  { id: 'all', label: 'Todos', icon: 'grid' },
  { id: 'workout', label: 'Treino', icon: 'barbell' },
  { id: 'streak', label: 'Sequencia', icon: 'flame' },
  { id: 'social', label: 'Social', icon: 'chatbubble' },
  { id: 'level', label: 'Nivel', icon: 'trending-up' },
  { id: 'weekly', label: 'Semanal', icon: 'calendar' },
];

function AchievementBadge({ achievement, unlocked, onInfo }) {
  const color = unlocked ? achievement.color : COLORS.textMuted;
  return (
    <TouchableOpacity style={[styles.badge, !unlocked && styles.badgeLocked]} onPress={() => onInfo(achievement)} accessibilityLabel={`${achievement.name} - ${unlocked ? 'Desbloqueada' : 'Bloqueada'}`} accessibilityRole="button">
      <View style={[styles.iconWrap, { backgroundColor: color + '20' }]}>
        <Ionicons name={unlocked ? achievement.icon : 'lock-closed'} size={ICON_SIZES.md} color={color} />
      </View>
      <Text style={[styles.badgeName, !unlocked && styles.badgeNameLocked]} numberOfLines={1}>{unlocked ? achievement.name : 'Bloqueada'}</Text>
      <Text style={styles.badgeXP}>+{achievement.xpReward} XP</Text>
    </TouchableOpacity>
  );
}

function AchievementGrid({ unlockedIds = [], onAchievementPress }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedInfo, setSelectedInfo] = useState(null);
  const filtered = activeCategory === 'all' ? ACHIEVEMENTS : ACHIEVEMENTS.filter(a => a.category === activeCategory);
  const unlockedSet = new Set(unlockedIds);
  const handleInfo = (a) => onAchievementPress ? onAchievementPress(a) : setSelectedInfo(selectedInfo?.id === a.id ? null : a);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CONQUISTAS</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabs} contentContainerStyle={styles.tabsContent}>
        {CATEGORIES.map(cat => (
          <TouchableOpacity key={cat.id} style={[styles.tab, activeCategory === cat.id && styles.tabActive]} onPress={() => setActiveCategory(cat.id)} accessibilityLabel={`Filtrar por ${cat.label}`} accessibilityRole="button">
            <Ionicons name={cat.icon} size={12} color={activeCategory === cat.id ? COLORS.background : COLORS.textMuted} />
            <Text style={[styles.tabText, activeCategory === cat.id && styles.tabTextActive]}>{cat.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {selectedInfo && (
        <View style={styles.infoCard}>
          <View style={[styles.infoIcon, { backgroundColor: selectedInfo.color + '20' }]}>
            <Ionicons name={selectedInfo.icon} size={24} color={selectedInfo.color} />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoName}>{selectedInfo.name}</Text>
            <Text style={styles.infoDesc}>{selectedInfo.description}</Text>
          </View>
        </View>
      )}
      <View style={styles.grid}>
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="ribbon-outline" size={32} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>Complete treinos para desbloquear conquistas</Text>
          </View>
        ) : (
          filtered.map(a => (
            <AchievementBadge key={a.id} achievement={a} unlocked={unlockedSet.has(a.id)} onInfo={handleInfo} />
          ))
        )}
      </View>
    </View>
  );
}

export default memo(AchievementGrid);

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.textTitle, letterSpacing: 1, marginBottom: SPACING.md },
  tabs: { marginBottom: SPACING.md },
  tabsContent: { gap: SPACING.xs },
  tab: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: BORDER_RADIUS.full, backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.border },
  tabActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  tabText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.textMuted },
  tabTextActive: { color: COLORS.background },
  infoCard: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, marginBottom: SPACING.md },
  infoIcon: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  infoContent: { flex: 1 },
  infoName: { fontFamily: 'Montserrat_700Bold', fontSize: 13, color: COLORS.textTitle },
  infoDesc: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  empty: { width: '100%', alignItems: 'center', paddingVertical: SPACING.xl, gap: SPACING.sm },
  emptyText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textMuted, textAlign: 'center' },
  badge: { width: '30%', alignItems: 'center', paddingVertical: SPACING.md, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border },
  badgeLocked: { opacity: 0.5 },
  iconWrap: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.xs },
  badgeName: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.textTitle, textAlign: 'center', maxWidth: 80 },
  badgeNameLocked: { color: COLORS.textMuted },
  badgeXP: { fontFamily: 'Inter_400Regular', fontSize: 9, color: COLORS.primary, marginTop: 2 },
});
