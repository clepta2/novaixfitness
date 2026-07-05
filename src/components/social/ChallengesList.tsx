import React, { useState, useEffect, memo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { supabase } from '../../config/supabase';
import { getNutritionContent } from '../../services/nutritionContent';
import * as Haptics from 'expo-haptics';
import ChallengeModal from './ChallengeModal';
import ChallengeCard from './ChallengeCard';

type Props = {
  userId?: string;
};

export default memo(function ChallengesList({ userId }: Props) {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  useEffect(() => { loadChallenges(); }, [userId]);

  const loadChallenges = async () => {
    try {
      const content = await getNutritionContent('challenges');
      const weekChallenges = (content?.challenges || []).slice(0, 5);
      if (userId) {
        const { data: logs } = await supabase
          .from('daily_challenges')
          .select('challenge_id, completed')
          .eq('user_id', userId)
          .gte('created_at', new Date(Date.now() - 7 * 86400000).toISOString());
        const logMap = {};
        (logs || []).forEach(l => { logMap[l.challenge_id] = l.completed; });
        weekChallenges.forEach(c => { c.progress = logMap[c.id] ? 1 : 0; });
      }
      setChallenges(weekChallenges);
    } catch (err) { console.error('Erro ao carregar desafios:', err); }
    finally { setLoading(false); }
  };

  const handleComplete = async (challenge) => {
    if (!userId) return;
    try {
      await supabase.from('daily_challenges').insert({ user_id: userId, challenge_id: challenge.id, completed: true });
      try { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch {}
      setChallenges(prev => prev.map(c => c.id === challenge.id ? { ...c, progress: 1 } : c));
    } catch (err) { console.error('Erro ao completar desafio:', err); }
  };

  const handleShare = async (challenge) => {
    try {
      const { Share } = require('react-native');
      await Share.share({ message: `Completei o desafio "${challenge.title}" no NOVAIX! ${challenge.reward} XP ganhos!` });
    } catch {}
  };

  if (loading || challenges.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="trophy" size={18} color={COLORS.primary} />
        <Text style={styles.title}>DESAFIOS DA SEMANA</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {challenges.map((c, i) => (
          <ChallengeCard key={c.id || i} challenge={c} index={i} onPress={setSelectedChallenge} onShare={handleShare} />
        ))}
      </ScrollView>
      <ChallengeModal visible={!!selectedChallenge} challenge={selectedChallenge} onClose={() => setSelectedChallenge(null)} onJoin={() => {}} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.lg },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md, paddingHorizontal: SPACING.xl },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textMuted, letterSpacing: 1 },
});
