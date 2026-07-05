
// app/progress/monthlyReview.js
// Revisão mensal de progresso

import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { ErrorBoundary } from '../../src/components';
import { COLORS } from '../../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../../src/constants/spacing';
import { supabase } from '../../src/config/supabase';

export default function MonthlyReviewScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [stats, setStats] = useState({ completed: 0, total: 4, rate: 0 });
  const [mood, setMood] = useState<string | null>(null);
  const [action, setAction] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      if (!user?.id) return;
      const { data } = await supabase.from('user_workouts').select('*').eq('user_id', user.id).eq('completed', true).gte('completed_at', new Date(Date.now() - 30 * 86400000).toISOString());
      const completed = data?.length || 0;
      const total = 16;
      setStats({ completed, total, rate: Math.round((completed / total) * 100) });
    }
    loadStats();
  }, [user?.id]);

  const getMessage = () => {
    if (stats.rate >= 75) return { text: 'Parabéns! Você completou ' + stats.rate + '% dos treinos!', icon: 'trophy', color: COLORS.primary };
    if (stats.rate >= 50) return { text: 'Bom trabalho! ' + stats.rate + '% concluídos!', icon: 'thumbs-up', color: COLORS.info };
    return { text: 'Você completou ' + stats.rate + '% dos treinos.', icon: 'fitness', color: COLORS.warning };
  };

  const msg = getMessage();

  return (
    <ErrorBoundary screenName="MonthlyReview">
    <ScrollView style={styles.screen} contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>SEU RESUMO MENSAL</Text>
      <Text style={styles.subtitle}>Como foi seu mês?</Text>

      <View style={styles.statsCard}>
        <Ionicons name={msg.icon as any} size={40} color={msg.color} />
        <Text style={[styles.statsText, { color: msg.color }]}>{msg.text}</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.completed}</Text>
            <Text style={styles.statLabel}>Completados</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statLabel}>Planejados</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.rate}%</Text>
            <Text style={styles.statLabel}>Aproveitamento</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionLabel}>COMO VOCÊ SE SENTE?</Text>
      <View style={styles.moodRow}>
        {[{ id: 'great', emoji: '😊', label: 'Ótimo' }, { id: 'good', emoji: '🙂', label: 'Bom' }, { id: 'regular', emoji: '😐', label: 'Regular' }, { id: 'bad', emoji: '😟', label: 'Ruim' }].map((m) => (
          <TouchableOpacity key={m.id} accessibilityLabel={`Sentimento ${m.label}`} accessibilityRole="button" style={[styles.moodPill, mood === m.id && styles.moodPillActive]} onPress={() => setMood(m.id)}>
            <Text style={styles.moodEmoji}>{m.emoji}</Text>
            <Text style={[styles.moodPillText, mood === m.id && styles.moodPillTextActive]}>{m.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionLabel}>O QUE QUER FAZER?</Text>
      <View style={styles.actionRow}>
        {[{ id: 'increase', label: 'Aumentar', icon: 'trending-up', color: COLORS.primary }, { id: 'maintain', label: 'Continuar', icon: 'equal', color: COLORS.info }, { id: 'decrease', label: 'Reduzir', icon: 'trending-down', color: COLORS.warning }].map((a) => (
          <TouchableOpacity key={a.id} accessibilityLabel={a.label} accessibilityRole="button" style={[styles.actionCard, action === a.id && { borderColor: a.color, backgroundColor: a.color + '10' }]} onPress={() => setAction(a.id)}>
            <Ionicons name={a.icon as any} size={24} color={action === a.id ? a.color : COLORS.textMuted} />
            <Text style={[styles.actionLabel, action === a.id && { color: a.color }]}>{a.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity accessibilityLabel="Atualizar meu plano" accessibilityRole="button" style={[styles.button, (!mood || !action) && styles.buttonDisabled]} onPress={() => router.replace('/(tabs)/home')} disabled={!mood || !action}>
        <Text style={styles.buttonText}>ATUALIZAR MEU PLANO</Text>
      </TouchableOpacity>
    </ScrollView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.xl, paddingTop: Platform.OS === 'ios' ? 54 : 40 },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 22, color: COLORS.textTitle, marginBottom: SPACING.sm },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, marginBottom: SPACING.xl },
  statsCard: { alignItems: 'center', padding: SPACING.xl, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, marginBottom: SPACING.xl },
  statsText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 16, marginTop: SPACING.md, textAlign: 'center' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: SPACING.xl },
  statItem: { alignItems: 'center' },
  statValue: { fontFamily: 'Montserrat_700Bold', fontSize: 24, color: COLORS.textTitle },
  statLabel: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted, marginTop: SPACING.xs },
  sectionLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: SPACING.md, marginTop: SPACING.lg },
  moodRow: { flexDirection: 'row', gap: SPACING.sm },
  moodPill: { flex: 1, alignItems: 'center', padding: SPACING.md, borderRadius: BORDER_RADIUS.md, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  moodPillActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '10' },
  moodEmoji: { fontSize: 24 },
  moodPillText: { fontFamily: 'Inter_500Medium', fontSize: 11, color: COLORS.textMuted, marginTop: SPACING.xs },
  moodPillTextActive: { color: COLORS.primary },
  actionRow: { flexDirection: 'row', gap: SPACING.sm },
  actionCard: { flex: 1, alignItems: 'center', padding: SPACING.lg, borderRadius: BORDER_RADIUS.md, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  actionLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textMuted, marginTop: SPACING.sm },
  button: { paddingVertical: SPACING.lg, borderRadius: BORDER_RADIUS.md, backgroundColor: COLORS.primary, alignItems: 'center', marginTop: SPACING.xl },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.background },
});


