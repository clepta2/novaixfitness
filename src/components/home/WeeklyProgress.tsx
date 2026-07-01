import { useState, useEffect, useCallback, memo } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { Card } from '../ui/Card';
import ProgressBar from '../ui/ProgressBar';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../context/AuthContext';
import { typography } from '../../styles';

export default memo(function WeeklyProgress(): React.JSX.Element {
  const { user } = useAuth();
  const [completedThisWeek, setCompletedThisWeek] = useState(0);
  const [targetWeekly, setTargetWeekly] = useState(3);
  const [loading, setLoading] = useState(true);

  const fetchWeeklyStats = useCallback(async () => {
    if (!user?.id) { setLoading(false); return; }
    try {
      const now = new Date();
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1);
      const startOfWeek = new Date(now.setDate(diff));
      startOfWeek.setHours(0, 0, 0, 0);

      const [workoutsRes, profileRes] = await Promise.all([
        supabase
          .from('user_workouts')
          .select('id')
          .eq('user_id', user.id)
          .eq('completed', true)
          .gte('completed_at', startOfWeek.toISOString()),
        supabase
          .from('profiles')
          .select('onboarding')
          .eq('id', user.id)
          .single()
      ]);

      if (workoutsRes.data) {
        setCompletedThisWeek(workoutsRes.data.length);
      }

      if (profileRes.data?.onboarding) {
        const freqText = profileRes.data.onboarding.frequency || '';
        const parsed = parseInt(freqText.replace(/[^0-9]/g, ''), 10);
        if (!isNaN(parsed) && parsed > 0) {
          setTargetWeekly(parsed);
        }
      }
    } catch (err) {
      console.error('Erro ao buscar metas semanais:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchWeeklyStats();
  }, [fetchWeeklyStats]);

  if (loading) {
    return (
      <Card variant="surface" style={styles.card}>
        <ActivityIndicator size="small" color={COLORS.primary} />
      </Card>
    );
  }

  const progressText = `${completedThisWeek} DE ${targetWeekly} TREINOS CONCLUÍDOS`;
  const isGoalAchieved = completedThisWeek >= targetWeekly;

  return (
    <Card variant="surface" style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons
            name={isGoalAchieved ? 'trophy' : 'calendar-outline'}
            size={22}
            color={isGoalAchieved ? COLORS.attention : COLORS.primary}
          />
          <Text style={typography.h4}>META DA SEMANA</Text>
        </View>
        {isGoalAchieved && (
          <Text style={[typography.caption, { color: COLORS.success }]}>META ATINGIDA! 🎉</Text>
        )}
      </View>

      <ProgressBar value={completedThisWeek} max={targetWeekly} label={progressText} />
    </Card>
  );
});

const styles = StyleSheet.create({
  card: { padding: SPACING.lg, marginBottom: SPACING.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  titleContainer: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
});
