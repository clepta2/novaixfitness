// src/components/profile/RankingCard.js
// Card de ranking global - NOVAIX FITNESS

import React, { useState, useEffect, useRef, memo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { supabase } from '../../config/supabase';
import { SECTION_TITLES, LABELS } from '../../data/profileTexts';

export default memo(function RankingCard({ userId, compact = false }) {
  const router = useRouter();
  const [rankings, setRankings] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, []);

  useEffect(() => {
    async function loadRanking() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, name, total_xp, total_workouts')
          .not('total_xp', 'is', null)
          .order('total_xp', { ascending: false })
          .limit(20);

        if (error) throw error;

        if (data) {
          const ranked = data.map((p, i) => ({
            ...p,
            rank: i + 1,
            initials: (p.name || 'A').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
          }));
          setRankings(ranked);

          const userPos = ranked.findIndex(r => r.id === userId);
          if (userPos >= 0) {
            setUserRank(ranked[userPos]);
          } else {
            const { data: userData } = await supabase
              .from('profiles')
              .select('id, name, total_xp, total_workouts')
              .eq('id', userId)
              .single();

            if (userData) {
              const { count } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true })
                .gt('total_xp', userData.total_xp || 0);

              setUserRank({
                ...userData,
                rank: (count || 0) + 1,
                initials: (userData.name || 'A').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
              });
            }
          }
        }
      } catch (err) {
        if (__DEV__) console.error('Erro ao carregar ranking:', err);
      }
    }
    loadRanking();
  }, [userId]);

  const getMedalColor = (rank) => {
    if (rank === 1) return COLORS.gold;
    if (rank === 2) return COLORS.textMuted;
    if (rank === 3) return COLORS.bronze;
    return COLORS.textMuted;
  };

  return (
    <Animated.View style={[styles.container, compact && styles.containerCompact, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <Ionicons name="trophy" size={20} color={COLORS.primary} />
        <Text style={styles.title}>{SECTION_TITLES.ranking}</Text>
        <TouchableOpacity onPress={() => router.push('/gamification')} style={styles.seeMore} accessibilityLabel="Ver ranking completo" accessibilityRole="button">
          <Text style={styles.seeMoreText}>{LABELS.seeMore}</Text>
          <Ionicons name="chevron-forward" size={14} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {userRank && (
        <View style={[styles.userPosition, compact && styles.userPositionCompact]}>
          <Text style={styles.userPositionText}>#{userRank.rank}</Text>
          <Text style={styles.userXP}>{userRank.total_xp || 0} XP</Text>
        </View>
      )}

      <FlatList
          removeClippedSubviews={true}
          maxToRenderPerBatch={compact ? 5 : 10}
          windowSize={compact ? 3 : 5}
        data={rankings.slice(0, compact ? 5 : 10)}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View style={[styles.rankItem, item.id === userId && styles.rankItemUser]}>
            <View style={[styles.rankBadge, { backgroundColor: getMedalColor(item.rank) + '20' }]}>
              <Text style={[styles.rankNumber, { color: getMedalColor(item.rank) }]}>{item.rank}</Text>
            </View>
            <View style={[styles.rankAvatar, { backgroundColor: getMedalColor(item.rank) + '30' }]}>
              <Text style={[styles.rankInitials, { color: getMedalColor(item.rank) }]}>{item.initials}</Text>
            </View>
            <View style={styles.rankInfo}>
              <Text style={styles.rankName} numberOfLines={1}>{item.name || LABELS.athlete}</Text>
              <Text style={styles.rankXP}>{item.total_xp || 0} XP</Text>
            </View>
            {item.rank <= 3 && (
              <Ionicons name={item.rank === 1 ? 'trophy' : 'medal'} size={16} color={getMedalColor(item.rank)} />
            )}
          </View>
        )}
      />
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  containerCompact: { padding: SPACING.md },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.textTitle, letterSpacing: 1, flex: 1 },
  seeMore: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  seeMoreText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: COLORS.primary },
  userPosition: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.primary + '10', borderRadius: 8, padding: SPACING.md, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.primary + '30' },
  userPositionCompact: { padding: SPACING.sm, marginBottom: SPACING.sm },
  userPositionText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: COLORS.primary },
  userXP: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.primary },
  rankItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  rankItemUser: { backgroundColor: COLORS.primary + '08', borderRadius: 8, paddingHorizontal: SPACING.sm },
  rankBadge: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.sm },
  rankNumber: { fontFamily: 'Montserrat_700Bold', fontSize: 12 },
  rankAvatar: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.sm },
  rankInitials: { fontFamily: 'Montserrat_700Bold', fontSize: 13 },
  rankInfo: { flex: 1 },
  rankName: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textTitle },
  rankXP: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted },
});
