// app/challenges/index.js
// Desafios diários

import { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../../src/constants/spacing';
import { useAuth } from '../../src/context/AuthContext';
import { supabase } from '../../src/config/supabase';
import { getDailyChallenges, CHALLENGE_TYPES } from '../../src/data/dailyChallenges';

export default function ChallengesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [stats, setStats] = useState({ workoutsToday: 0, waterToday: 0 });

  useEffect(() => { loadData(); }, [user?.id]);

  const loadData = async () => {
    if (!user?.id) return;
    const today = new Date().toISOString().split('T')[0];
    const todayStart = new Date().setHours(0, 0, 0, 0);
    const todayStartISO = new Date(todayStart).toISOString();
    const { data: completedData } = await supabase.from('daily_challenges').select('challenge_type').eq('user_id', user.id).eq('date', today);
    setCompleted(completedData?.map(c => c.challenge_type) || []);
    const { data: workouts } = await supabase.from('user_workouts').select('id').eq('user_id', user.id).eq('completed', true).gte('completed_at', todayStartISO);
    const { data: water } = await supabase.from('water_logs').select('amount_ml').eq('user_id', user.id).gte('logged_at', todayStartISO);
    setStats({ workoutsToday: workouts?.length || 0, waterToday: water?.reduce((s, w) => s + w.amount_ml, 0) || 0 });
    setChallenges(getDailyChallenges(3));
  };

  const completeChallenge = async (challenge) => {
    if (completed.includes(challenge.type)) return;
    const today = new Date().toISOString().split('T')[0];
    await supabase.from('daily_challenges').insert({ user_id: user.id, challenge_type: challenge.type, challenge_text: challenge.text, xp_reward: challenge.xp, date: today });
    setCompleted([...completed, challenge.type]);
  };

  const totalXP = challenges.filter(c => completed.includes(c.type)).reduce((s, c) => s + c.xp, 0);

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color={COLORS.textMuted} /></TouchableOpacity>
        <Text style={styles.headerTitle}>DESAFIOS DIÁRIOS</Text>
        <View style={styles.xpBadge}><Ionicons name="flash" size={16} color={COLORS.primary} /><Text style={styles.xpText}>+{totalXP} XP</Text></View>
      </View>
      <FlatList data={challenges} contentContainerStyle={styles.list} renderItem={({ item }) => {
        const isDone = completed.includes(item.type);
        const typeInfo = CHALLENGE_TYPES.find(t => t.id === item.type);
        return (
          <TouchableOpacity style={[styles.card, isDone && styles.cardDone]} onPress={() => completeChallenge(item)}>
            <View style={styles.cardLeft}>
              <Ionicons name={typeInfo?.icon || 'flag'} size={24} color={isDone ? COLORS.primary : COLORS.textMuted} />
              <View><Text style={[styles.cardText, isDone && styles.cardTextDone]}>{item.text}</Text><Text style={styles.cardXp}>+{item.xp} XP</Text></View>
            </View>
            {isDone ? <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} /> : <Ionicons name="arrow-forward" size={20} color={COLORS.textMuted} />}
          </TouchableOpacity>
        );
      }} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.lg, paddingTop: Platform.OS === 'ios' ? 54 : 40 },
  headerTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle },
  xpBadge: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, backgroundColor: COLORS.primary + '15', paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: BORDER_RADIUS.full },
  xpText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.primary },
  list: { padding: SPACING.lg },
  card: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.lg, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, marginBottom: SPACING.sm },
  cardDone: { opacity: 0.6 },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, flex: 1 },
  cardText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textTitle },
  cardTextDone: { textDecorationLine: 'line-through', color: COLORS.textMuted },
  cardXp: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.primary, marginTop: 2 },
});
