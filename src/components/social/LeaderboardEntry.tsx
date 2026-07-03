// src/components/social/LeaderboardEntry.tsx
// Individual leaderboard entry row

import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { COLORS } from '../../constants/colors';

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

interface LeaderboardEntryProps {
  item: LeaderboardEntryData;
  isCurrentUser: boolean;
}

const RANK_COLORS: Record<number, string> = {
  1: COLORS.gold || '#FFD700',
  2: COLORS.textMuted || '#8892A0',
  3: '#CD7F32',
};

function getRankIcon(rank: number) {
  if (rank === 1) return 'trophy';
  if (rank === 2) return 'medal';
  if (rank === 3) return 'ribbon';
  return null;
}

function getRankStyle(rank: number) {
  const color = RANK_COLORS[rank];
  return color ? { backgroundColor: color + '20', borderColor: color } : {};
}

export default function LeaderboardEntry({ item, isCurrentUser }: LeaderboardEntryProps) {
  const rankIcon = getRankIcon(item.rank);
  const rankColor = RANK_COLORS[item.rank] || COLORS.textMuted;

  return (
    <View style={[styles.entry, isCurrentUser && styles.entryCurrentUser, getRankStyle(item.rank)]}>
      <View style={styles.rankContainer}>
        {rankIcon ? (
          <Ionicons name={rankIcon as any} size={20} color={rankColor} />
        ) : (
          <Text style={styles.rankNumber}>{item.rank}</Text>
        )}
      </View>
      <Image
        source={{ uri: item.userAvatar }}
        style={[styles.avatar, item.rank <= 3 && styles.avatarTopThree]}
      />
      <View style={styles.info}>
        <Text style={[styles.userName, isCurrentUser && styles.userNameCurrentUser]} numberOfLines={1}>
          {item.userName}{isCurrentUser && ' (Você)'}
        </Text>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Ionicons name="flash" size={12} color={COLORS.primary} />
            <Text style={styles.statValue}>{item.xp.toLocaleString()} XP</Text>
          </View>
          <View style={styles.stat}>
            <Ionicons name="barbell" size={12} color={COLORS.secondary || '#00D4AA'} />
            <Text style={styles.statValue}>{item.workouts}</Text>
          </View>
        </View>
      </View>
      {item.previousRank !== undefined && item.previousRank !== item.rank && (
        <View style={styles.rankChange}>
          <Ionicons
            name={item.rank < item.previousRank ? 'arrow-up' : 'arrow-down'}
            size={14}
            color={item.rank < item.previousRank ? COLORS.success || '#4CAF50' : COLORS.error || '#F44336'}
          />
          <Text style={[styles.rankChangeText, {
            color: item.rank < item.previousRank ? COLORS.success || '#4CAF50' : COLORS.error || '#F44336',
          }]}>
            {Math.abs(item.rank - item.previousRank)}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  entry: {
    flexDirection: 'row', alignItems: 'center', padding: SPACING.md,
    backgroundColor: COLORS.surface || '#1E232A', borderRadius: BORDER_RADIUS.md,
    borderWidth: 1, borderColor: COLORS.border || '#2A3040',
  },
  entryCurrentUser: {
    borderColor: COLORS.primary, backgroundColor: COLORS.primary + '10',
  },
  rankContainer: {
    width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center',
    backgroundColor: COLORS.surfaceOverlay || '#2A3040', marginRight: SPACING.md,
  },
  rankNumber: {
    fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.textTitle || '#FFFFFF',
  },
  avatar: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.surfaceOverlay || '#2A3040',
    borderWidth: 2, borderColor: COLORS.border || '#2A3040', marginRight: SPACING.md,
  },
  avatarTopThree: {
    borderColor: COLORS.primary,
  },
  info: { flex: 1 },
  userName: {
    fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: COLORS.textTitle || '#FFFFFF', marginBottom: 4,
  },
  userNameCurrentUser: { color: COLORS.primary },
  statsRow: { flexDirection: 'row', gap: SPACING.md },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statValue: {
    fontFamily: 'Inter_500Medium', fontSize: 12, color: COLORS.textMuted || '#8892A0',
  },
  rankChange: {
    flexDirection: 'row', alignItems: 'center', gap: 2, marginLeft: SPACING.sm,
  },
  rankChangeText: {
    fontFamily: 'Montserrat_700Bold', fontSize: 12,
  },
});
