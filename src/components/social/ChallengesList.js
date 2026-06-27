// src/components/social/ChallengesList.js
// Carrossel de desafios semanais - NOVAIX FITNESS

import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { supabase } from '../../config/supabase';
import { getNutritionContent } from '../../services/nutritionContent';
import ChallengeModal from './ChallengeModal';

const ICON_MAP = { Hidratação: 'water', Proteína: 'flash', Treino: 'barbell', Geral: 'fitness', Sono: 'moon', Nutrição: 'nutrition' };
const COLOR_MAP = { Hidratação: COLORS.info, Proteína: COLORS.success, Treino: COLORS.primary, Geral: COLORS.primary, Sono: COLORS.info, Nutrição: COLORS.attention };

function AnimatedProgressBar({ progress, target, color }) {
  const animatedValue = useMemo(() => new Animated.Value(0), []);
  const pct = target > 0 ? Math.min(100, (progress / target) * 100) : 0;
  useEffect(() => { Animated.spring(animatedValue, { toValue: pct, tension: 30, friction: 8, useNativeDriver: false }).start(); }, [pct, animatedValue]);
  const width = animatedValue.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });
  return (
    <View style={styles.progressSection}>
      <View style={styles.progressBar}><Animated.View style={[styles.progressFill, { width, backgroundColor: color }]} /></View>
      <Text style={styles.progressText}>{progress}/{target}</Text>
    </View>
  );
}

function ChallengeCard({ challenge, index, onPress, onShare }) {
  const animatedValue = useMemo(() => new Animated.Value(0), []);
  const icon = ICON_MAP[challenge.category] || 'fitness';
  const color = COLOR_MAP[challenge.category] || COLORS.primary;
  const progress = challenge.progress || 0;
  const isComplete = progress >= (challenge.target || 7);

  useEffect(() => { Animated.spring(animatedValue, { toValue: 1, tension: 30, friction: 8, delay: index * 100, useNativeDriver: true }).start(); }, [animatedValue, index]);
  const scale = animatedValue.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] });

  return (
    <Animated.View style={[styles.card, { transform: [{ scale }] }, isComplete && { opacity: 0.85 }]}>
      <TouchableOpacity style={styles.cardContent} onPress={() => onPress?.(challenge)} activeOpacity={0.8}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
            <Ionicons name={isComplete ? 'checkmark-circle' : icon} size={22} color={isComplete ? COLORS.success : color} />
          </View>
          <View style={styles.cardInfo}>
            <Text style={[styles.cardTitle, isComplete && { color: COLORS.success }]}>{challenge.title}</Text>
            <Text style={styles.cardDesc}>{challenge.desc}</Text>
          </View>
          <TouchableOpacity onPress={() => onShare?.(challenge)}><Ionicons name="share-social" size={14} color={COLORS.textMuted} /></TouchableOpacity>
        </View>
        <AnimatedProgressBar progress={progress} target={challenge.target || 7} color={color} />
        <View style={styles.cardFooter}>
          <View style={styles.footerItem}><Ionicons name="time" size={12} color={COLORS.textMuted} /><Text style={styles.footerText}>{challenge.duration}</Text></View>
          <View style={styles.footerItem}><Ionicons name="people" size={12} color={COLORS.textMuted} /><Text style={styles.footerText}>{challenge.participants || 0}</Text></View>
          <View style={styles.footerItem}><Ionicons name="trophy" size={12} color={COLORS.primary} /><Text style={[styles.footerText, { color: COLORS.primary }]}>{challenge.reward} XP</Text></View>
        </View>
        {isComplete && (
          <View style={styles.completeBadge}><Ionicons name="checkmark-circle" size={14} color={COLORS.success} /><Text style={styles.completeText}>COMPLETO!</Text></View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function ChallengesList({ userId }) {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => { loadChallenges(); }, []);

  const loadChallenges = async () => {
    setLoading(true);
    try {
      const data = await getNutritionContent('challenges');
      if (data?.challenges) {
        const enriched = await Promise.all(data.challenges.map(async (c, i) => {
          const challengeId = `challenge_${i}`;
          let progress = 0, participants = 0;
          if (userId) {
            const { data: participant } = await supabase.from('challenge_participants').select('progress').eq('user_id', userId).eq('challenge_id', challengeId).maybeSingle();
            if (participant) progress = participant.progress || 0;
          }
          const { count } = await supabase.from('challenge_participants').select('*', { count: 'exact', head: true }).eq('challenge_id', challengeId);
          participants = count || 0;
          return { ...c, id: challengeId, progress, target: c.target || 7, participants };
        }));
        setChallenges(enriched);
      }
    } catch { }
    finally { setLoading(false); }
  };

  const handleJoin = async (challenge) => {
    if (!userId) return;
    try {
      const { data: existing } = await supabase.from('challenge_participants').select('id, progress').eq('user_id', userId).eq('challenge_id', challenge.id).maybeSingle();
      if (existing) {
        await supabase.from('challenge_participants').update({ progress: (existing.progress || 0) + 1 }).eq('id', existing.id);
      } else {
        await supabase.from('challenge_participants').insert({ user_id: userId, challenge_id: challenge.id, progress: 1, joined_at: new Date().toISOString() });
      }
      setChallenges(prev => prev.map(c => c.id === challenge.id ? { ...c, progress: Math.min((c.progress || 0) + 1, c.target) } : c));
    } catch { }
  };

  const handleShare = async (challenge) => {
    try { await Share.share({ message: `🏆 Estou no desafio "${challenge.title}" no NOVAIX! Participe também!` }); } catch { }
  };

  const totalXP = challenges.filter(c => c.progress >= c.target).reduce((sum, c) => sum + (c.reward || 0), 0);
  const completedCount = challenges.filter(c => c.progress >= c.target).length;

  if (loading) {
    return <View style={styles.loading}><Ionicons name="sync" size={20} color={COLORS.textMuted} /><Text style={styles.loadingText}>Carregando...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="trophy" size={18} color={COLORS.primary} />
        <Text style={styles.title}>DESAFIOS DA SEMANA</Text>
        {totalXP > 0 && <View style={styles.xpBadge}><Text style={styles.xpText}>{totalXP} XP</Text></View>}
      </View>

      {completedCount > 0 && (
        <View style={styles.statsBar}>
          <View style={styles.statItem}><Text style={styles.statValue}>{completedCount}/{challenges.length}</Text><Text style={styles.statLabel}>Completos</Text></View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}><Text style={[styles.statValue, { color: COLORS.primary }]}>{totalXP}</Text><Text style={styles.statLabel}>XP Ganho</Text></View>
        </View>
      )}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
        {challenges.map((c, i) => <ChallengeCard key={c.id} challenge={c} index={i} onPress={setSelected} onShare={handleShare} />)}
      </ScrollView>

      <ChallengeModal challenge={selected} visible={!!selected} onClose={() => setSelected(null)} onJoin={handleJoin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.lg },
  loading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, padding: SPACING.xl },
  loadingText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textMuted },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md, paddingHorizontal: SPACING.xl },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textMuted, letterSpacing: 1, flex: 1 },
  xpBadge: { backgroundColor: COLORS.primary + '20', paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs, borderRadius: BORDER_RADIUS.sm },
  xpText: { fontFamily: 'Montserrat_700Bold', fontSize: 11, color: COLORS.primary },
  statsBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, marginHorizontal: SPACING.xl, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle },
  statLabel: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted, marginTop: 2 },
  statDivider: { width: 1, height: 24, backgroundColor: COLORS.border },
  scroll: { paddingLeft: SPACING.xl },
  card: { width: 260, marginRight: SPACING.md },
  cardContent: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  cardHeader: { flexDirection: 'row', gap: SPACING.md, marginBottom: SPACING.md },
  iconContainer: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  cardInfo: { flex: 1 },
  cardTitle: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: COLORS.textTitle, marginBottom: 2 },
  cardDesc: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted },
  progressSection: { marginBottom: SPACING.md },
  progressBar: { height: 8, backgroundColor: COLORS.surfaceOverlay, borderRadius: 4, overflow: 'hidden', marginBottom: SPACING.xs },
  progressFill: { height: '100%', borderRadius: 4 },
  progressText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textTitle, textAlign: 'right' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: SPACING.sm },
  footerItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  footerText: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted },
  completeBadge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.xs, marginTop: SPACING.sm, backgroundColor: COLORS.success + '15', paddingVertical: SPACING.xs, borderRadius: BORDER_RADIUS.sm },
  completeText: { fontFamily: 'Montserrat_700Bold', fontSize: 10, color: COLORS.success, letterSpacing: 1 },
});
