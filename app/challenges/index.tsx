
// app/challenges/index.tsx
// Desafios diarios com cards animados - NOVAIX FITNESS


import { useMemo, useState, useEffect , useRef} from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../../src/constants/spacing';
import { SHADOWS } from '../../src/constants/shadows';
import { useAuth } from '../../src/context/AuthContext';
import { ErrorBoundary, Loading, EmptyState } from '../../src/components';
import { useMountedRef } from '../../src/hooks/useMountedRef';
import { useResponsive } from '../../src/hooks/useResponsive';
import { supabase } from '../../src/config/supabase';
import { getDailyChallenges, CHALLENGE_TYPES } from '../../src/data/dailyChallenges';

export default function ChallengesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { isSmall } = useResponsive();
  const mounted = useMountedRef();
  const [challenges, setChallenges] = useState<any[]>([]);
  const [completed, setCompleted] = useState<any[]>([]);
  const [stats, setStats] = useState({ workoutsToday: 0, waterToday: 0 });
  const [loading, setLoading] = useState(true);

  // Animacoes
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (!loading) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, friction: 8, tension: 55, useNativeDriver: true }),
      ]).start();
    }
  }, [loading]);

  useEffect(() => { loadData(); }, [user?.id]);

  const loadData = async () => {
    if (!user?.id) return;
    setLoading(true);
    const today = new Date().toISOString().split('T')[0];
    const todayStart = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();
    const { data: completedData } = await supabase.from('daily_challenges').select('challenge_type').eq('user_id', user.id).eq('date', today);
    if (!mounted.current) return;
    setCompleted(completedData?.map(c => c.challenge_type) || []);
    const { data: workouts } = await supabase.from('user_workouts').select('id').eq('user_id', user.id).eq('completed', true).gte('completed_at', todayStart);
    if (!mounted.current) return;
    const { data: water } = await supabase.from('water_logs').select('amount_ml').eq('user_id', user.id).gte('logged_at', todayStart);
    if (!mounted.current) return;
    setStats({ workoutsToday: workouts?.length || 0, waterToday: water?.reduce((s, w) => s + w.amount_ml, 0) || 0 });
    setChallenges(getDailyChallenges(3));
    setLoading(false);
  };

  const completeChallenge = async (challenge) => {
    if (!user?.id || completed.includes(challenge.type)) return;
    const today = new Date().toISOString().split('T')[0];
    await supabase.from('daily_challenges').insert({ user_id: user.id, challenge_type: challenge.type, challenge_text: challenge.text, xp_reward: challenge.xp, date: today });
    setCompleted([...completed, challenge.type]);
  };

  const totalXP = challenges.filter(c => completed.includes(c.type)).reduce((s, c) => s + c.xp, 0);

  if (loading) {
    return (
      <View style={styles.screen}>
        <View style={styles.loadingContainer}>
          <Loading variant="pulse" />
        </View>
      </View>
    );
  }

  return (
    <ErrorBoundary screenName="Challenges">
      <View style={styles.screen}>
        {/* Header */}
        <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textTitle} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { fontSize: isSmall ? 16 : 18 }]}>DESAFIOS DIARIOS</Text>
          <View style={styles.xpBadge}>
            <Ionicons name="flash" size={16} color={COLORS.primary} />
            <Text style={styles.xpText}>+{totalXP} XP</Text>
          </View>
        </Animated.View>

        {/* Progresso */}
        <View style={styles.progressSection}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(completed.length / challenges.length) * 100}%` }]} />
          </View>
          <Text style={styles.progressText}>{completed.length}/{challenges.length} concluidos</Text>
        </View>

        {/* Lista de desafios */}
        <FlatList
          data={challenges}
          contentContainerStyle={styles.list}
          renderItem={({ item, index }) => {
            const isDone = completed.includes(item.type);
            const typeInfo = CHALLENGE_TYPES.find(t => t.id === item.type);
            return (
              <Animated.View style={[styles.cardWrapper, { opacity: Math.min(1, 0.5 + index * 0.2) }]}>
                <TouchableOpacity
                  style={[styles.card, isDone && styles.cardDone]}
                  onPress={() => completeChallenge(item)}
                >
                  <View style={styles.cardLeft}>
                    <View style={[styles.iconWrap, { backgroundColor: (isDone ? COLORS.primary : COLORS.textMuted) + '15' }]}>
                      <Ionicons name={(typeInfo?.icon || 'flag') as any} size={22} color={isDone ? COLORS.primary : COLORS.textMuted} />
                    </View>
                    <View style={styles.cardInfo}>
                      <Text style={[styles.cardText, isDone && styles.cardTextDone]}>{item.text}</Text>
                      <Text style={styles.cardXp}>+{item.xp} XP</Text>
                    </View>
                  </View>
                  {isDone ? (
                    <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
                  ) : (
                    <Ionicons name="arrow-forward" size={20} color={COLORS.textMuted} />
                  )}
                </TouchableOpacity>
              </Animated.View>
            );
          }}
        />
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.lg },
  headerTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle },
  xpBadge: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, backgroundColor: COLORS.primary + '15', paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: BORDER_RADIUS.full },
  xpText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.primary },
  progressSection: { paddingHorizontal: SPACING.lg, marginBottom: SPACING.md },
  progressBar: { height: 6, backgroundColor: COLORS.surfaceElevated, borderRadius: 3, overflow: 'hidden', marginBottom: SPACING.xs },
  progressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 3 },
  progressText: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted },
  list: { padding: SPACING.lg },
  cardWrapper: { marginBottom: SPACING.sm },
  card: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.lg, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.sm },
  cardDone: { opacity: 0.6, borderColor: COLORS.primary + '30' },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, flex: 1 },
  iconWrap: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  cardInfo: { flex: 1 },
  cardText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textTitle },
  cardTextDone: { textDecorationLine: 'line-through', color: COLORS.textMuted },
  cardXp: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.primary, marginTop: 2 },
});
