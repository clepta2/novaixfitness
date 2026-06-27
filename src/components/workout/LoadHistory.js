// src/components/workout/LoadHistory.js
// Histórico de Carga e Repetições - NOVAIX FITNESS

import { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

export default function LoadHistory({ exerciseName }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => { fetchLoadHistory(); }, [user?.id, exerciseName]);

  const fetchLoadHistory = useCallback(async () => {
    if (!user?.id || !exerciseName) { setLoading(false); return; }
    setLoading(true);
    try {
      const { data } = await supabase.from('user_exercise_logs')
        .select('id, set_number, reps_done, weight_kg, created_at')
        .eq('exercise_name', exerciseName)
        .order('created_at', { ascending: false })
        .limit(20);
      if (data) setHistory(groupLogsByDate(data));
    } catch (err) { console.error('Erro:', err); }
    finally { setLoading(false); }
  }, [user?.id, exerciseName]);

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  }, [history]);

  if (loading) return <View style={styles.loading}><Ionicons name="sync" size={16} color={COLORS.textMuted} /></View>;

  if (history.length === 0) {
    return (
      <View style={styles.empty}>
        <Ionicons name="stats-chart-outline" size={18} color={COLORS.textMuted} />
        <Text style={styles.emptyText}>Nenhum histórico. Suas cargas aparecerão aqui após concluir séries.</Text>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <Ionicons name="trending-up" size={16} color={COLORS.primary} />
        <Text style={styles.title}>HISTÓRICO DE CARGAS</Text>
      </View>

      {history.map((session, i) => (
        <View key={i} style={styles.sessionRow}>
          <View style={styles.dateBadge}>
            <Text style={styles.dateText}>{session.date}</Text>
          </View>
          <View style={styles.setsWrapper}>
            {session.items.map((log) => (
              <View key={log.id} style={styles.setTag}>
                <Text style={styles.setTagText}>
                  S{log.set_number} <Text style={styles.highlight}>{log.reps_done}</Text>x<Text style={styles.highlight}>{log.weight_kg}</Text>kg
                </Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </Animated.View>
  );
}

function groupLogsByDate(logs) {
  const groups = {};
  logs.forEach(log => {
    const d = new Date(log.created_at);
    const dateStr = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (!groups[dateStr]) groups[dateStr] = [];
    groups[dateStr].push(log);
  });
  return Object.entries(groups).map(([date, items]) => ({
    date, items: items.sort((a, b) => a.set_number - b.set_number),
  })).slice(0, 5);
}

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.md, padding: SPACING.md, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  title: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.textMuted, letterSpacing: 1 },
  loading: { padding: SPACING.xl, alignItems: 'center' },
  empty: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.sm, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.md },
  emptyText: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted, flex: 1 },
  sessionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  dateBadge: { backgroundColor: COLORS.primary + '15', paddingHorizontal: SPACING.sm, paddingVertical: 3, borderRadius: BORDER_RADIUS.sm, marginRight: SPACING.md },
  dateText: { fontFamily: 'Montserrat_700Bold', fontSize: 10, color: COLORS.primary },
  setsWrapper: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs, flex: 1, justifyContent: 'flex-end' },
  setTag: { backgroundColor: COLORS.background, paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: BORDER_RADIUS.sm, borderWidth: 1, borderColor: COLORS.border },
  setTagText: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted },
  highlight: { fontFamily: 'Montserrat_700Bold', color: COLORS.primary },
});
