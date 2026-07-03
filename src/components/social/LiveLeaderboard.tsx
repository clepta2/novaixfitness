// src/components/social/LiveLeaderboard.tsx
// Real-time leaderboard with animated rank changes

import { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Animated, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import SpaceBetween from '../ui/SpaceBetween';
import { SHADOWS } from '../../constants/shadows';
import { useColors } from '../../context/ThemeContext';
import LeaderboardEntry from './LeaderboardEntry';

interface LeaderboardEntryData {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  xp: number;
  workouts: number;
  rank: number;
  previousRank?: number;
}

interface LiveLeaderboardProps {
  entries: LeaderboardEntryData[];
  currentUserId: string;
  onRefresh: () => Promise<void>;
  filter?: 'friends' | 'all' | 'global';
  onFilterChange?: (filter: 'friends' | 'all' | 'global') => void;
}

const FILTERS = [
  { key: 'friends', label: 'Amigos', icon: 'people' },
  { key: 'all', label: 'Todos', icon: 'globe' },
  { key: 'global', label: 'Global', icon: 'planet' },
];

export default function LiveLeaderboard({
  entries, currentUserId, onRefresh, filter = 'all', onFilterChange,
}: LiveLeaderboardProps) {
  const colors = useColors();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(filter);
  const [fadeAnim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    setSelectedFilter(filter);
  }, [filter]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
  }, [onRefresh]);

  const handleFilterChange = useCallback((newFilter: 'friends' | 'all' | 'global') => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
    setSelectedFilter(newFilter);
    onFilterChange?.(newFilter);
  }, [onFilterChange, fadeAnim]);

  const keyExtractor = useCallback((item: LeaderboardEntryData) => item.id, []);

  return (
    <View style={styles.container}>
      <SpaceBetween style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="trophy" size={20} color={colors.primary} />
          <Text style={[styles.title, { color: colors.textTitle }]}>RANKING AO VIVO</Text>
        </View>
        <View style={[styles.liveIndicator, { backgroundColor: colors.error + '20' }]}>
          <View style={[styles.liveDot, { backgroundColor: colors.error }]} />
          <Text style={[styles.liveText, { color: colors.error }]}>AO VIVO</Text>
        </View>
      </SpaceBetween>

      <View style={styles.filterContainer}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterBtn, selectedFilter === f.key && styles.filterBtnActive, {
              backgroundColor: selectedFilter === f.key ? colors.primary : colors.background,
              borderColor: selectedFilter === f.key ? colors.primary : colors.border,
            }]}
            onPress={() => handleFilterChange(f.key as any)}
          >
            <Ionicons name={f.icon as any} size={14} color={selectedFilter === f.key ? colors.background : colors.textMuted} />
            <Text style={[styles.filterText, selectedFilter === f.key && styles.filterTextActive, {
              color: selectedFilter === f.key ? colors.background : colors.textMuted,
            }]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Animated.View style={{ opacity: fadeAnim }}>
        <FlatList
          data={entries}
          renderItem={({ item, index }) => (
            <LeaderboardEntry item={item} isCurrentUser={item.userId === currentUserId} />
          )}
          keyExtractor={keyExtractor}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary} colors={[colors.primary]} />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="people-outline" size={48} color={colors.textMuted} />
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>Nenhum participante ainda</Text>
            </View>
          }
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg,
    borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.md,
  },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md,
  },
  headerLeft: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
  },
  title: {
    fontFamily: 'Montserrat_700Bold', fontSize: 14, letterSpacing: 0.5,
  },
  liveIndicator: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.xs,
    paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs, borderRadius: BORDER_RADIUS.full,
  },
  liveDot: { width: 8, height: 8, borderRadius: 4 },
  liveText: { fontFamily: 'Montserrat_700Bold', fontSize: 10, letterSpacing: 0.5 },
  filterContainer: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md },
  filterBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: SPACING.xs, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.md, borderWidth: 1,
  },
  filterBtnActive: {},
  filterText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11 },
  filterTextActive: {},
  listContent: { maxHeight: 400 },
  separator: { height: SPACING.sm },
  empty: { alignItems: 'center', paddingVertical: SPACING.xxl },
  emptyText: { fontFamily: 'Inter_400Regular', fontSize: 14, marginTop: SPACING.md },
});
