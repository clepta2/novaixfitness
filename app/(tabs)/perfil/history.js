// app/(tabs)/perfil/history.js
// Histórico de Treinos - NOVAIX FITNESS

import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../../../src/constants/spacing';
import { Card, Badge } from '../../../src/components';
import { useAuth } from '../../../src/context/AuthContext';
import { supabase } from '../../../src/config/supabase';
import { layout, typography } from '../../../src/styles';

export default function HistoryScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    if (!user?.id) { setLoading(false); return; }
    try {
      const { data, error } = await supabase
        .from('user_workouts')
        .select('*, workouts(title, category, level, duration_minutes)')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      if (!error && data) {
        setWorkouts(data);
      }
    } catch (err) {
      console.error('Erro ao buscar histórico:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={layout.screen}>
      <View style={layout.header}>
        <TouchableOpacity onPress={() => router.back()} style={layout.headerBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textTitle} />
        </TouchableOpacity>
        <Text style={typography.h4}>Histórico de Treinos</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={layout.scroll} showsVerticalScrollIndicator={false}>
          {workouts.length > 0 ? (
            workouts.map((item) => (
              <Card key={item.id} variant="surface" style={styles.historyCard}>
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={typography.h4}>{item.workouts?.title || 'Treino Concluído'}</Text>
                    <Text style={typography.caption}>{formatDate(item.completed_at || item.created_at)}</Text>
                  </View>
                  <Badge value={item.workouts?.category || 'TREINO'} variant="primary" size="sm" />
                </View>

                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Ionicons name="time-outline" size={16} color={COLORS.textMuted} />
                    <Text style={typography.bodySmall}>
                      {item.duration || item.workouts?.duration_minutes || 0} min
                    </Text>
                  </View>
                  {item.rating && (
                    <View style={styles.statItem}>
                      <Ionicons name="star" size={16} color="#FFD600" />
                      <Text style={typography.bodySmall}>{item.rating}/5</Text>
                    </View>
                  )}
                  <View style={styles.statItem}>
                    <Ionicons name={item.completed ? 'checkmark-circle' : 'time'} size={16} color={item.completed ? COLORS.success : COLORS.warning} />
                    <Text style={[typography.bodySmall, { color: item.completed ? COLORS.success : COLORS.warning }]}>
                      {item.completed ? 'Concluído' : 'Em andamento'}
                    </Text>
                  </View>
                </View>

                {item.notes ? (
                  <View style={styles.notesContainer}>
                    <Text style={[typography.caption, { fontStyle: 'italic' }]}>"{item.notes}"</Text>
                  </View>
                ) : null}
              </Card>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="barbell-outline" size={48} color={COLORS.textMuted} />
              <Text style={[typography.h5, { marginTop: SPACING.md }]}>Nenhum treino no histórico ainda</Text>
              <Text style={typography.bodyMuted}>Inicie e conclua treinos para vê-los aqui!</Text>
            </View>
          )}
          <View style={{ height: 50 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  historyCard: { padding: SPACING.lg, marginBottom: SPACING.md },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.md },
  statsRow: { flexDirection: 'row', gap: SPACING.lg, borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: SPACING.md },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  notesContainer: { marginTop: SPACING.md, padding: SPACING.sm, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.sm },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 100 },
});
