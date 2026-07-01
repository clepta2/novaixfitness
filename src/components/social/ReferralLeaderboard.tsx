// @ts-nocheck
// src/components/social/ReferralLeaderboard.js
// Ranking de indicadores

import { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { Avatar } from '../ui/Avatar';
import { supabase } from '../../config/supabase';

export default function ReferralLeaderboard({ currentUserId }) {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => { loadLeaders(); }, []);

  const loadLeaders = async () => {
    const { data } = await supabase
      .from('referrals')
      .select('referrer_id, successful_referrals, bonus_days, profiles:user_id(name, avatar_url, level)')
      .order('successful_referrals', { ascending: false })
      .limit(10);

    setLeaders((data || []).map((l, i) => ({
      rank: i + 1,
      id: l.referrer_id,
      name: (l.profiles as any)?.name || 'User',
      avatar: (l.profiles as any)?.avatar_url,
      referrals: l.successful_referrals || 0,
      bonusDays: l.bonus_days || 0,
    })));
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <Ionicons name="trophy" size={16} color={COLORS.gold} />;
    if (rank === 2) return <Ionicons name="medal" size={16} color={COLORS.silver} />;
    if (rank === 3) return <Ionicons name="medal" size={16} color={COLORS.bronze} />;
    return <Text style={styles.rankText}>{rank}º</Text>;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>RANKING DE INDICAÇÕES</Text>
      <FlatList
        data={leaders}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.row, item.id === currentUserId && styles.rowActive]}>
            <View style={styles.rank}>{getRankIcon(item.rank)}</View>
            <Avatar {...{ name: item.name, size: "sm" } as any} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.referrals}>{item.referrals} indicações · +{item.bonusDays} dias</Text>
            </View>
          </View>
        )}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.lg },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textMuted, marginBottom: SPACING.md, letterSpacing: 1 },
  row: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, padding: SPACING.sm, borderRadius: BORDER_RADIUS.md, marginBottom: SPACING.xs, backgroundColor: COLORS.surfaceElevated },
  rowActive: { borderWidth: 1, borderColor: COLORS.primary },
  rank: { width: 24, alignItems: 'center' },
  rankText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.textMuted },
  info: { flex: 1 },
  name: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: COLORS.textTitle },
  referrals: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted },
});
