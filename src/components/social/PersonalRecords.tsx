// src/components/social/PersonalRecords.js
// Recordes pessoais de exercícios - NOVAIX FITNESS

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { supabase } from '../../config/supabase';

function RecordItem({ record }) {
  const isNew = record.isNew;

  return (
    <View style={[styles.recordItem, isNew && styles.recordItemNew]}>
      <View style={[styles.recordIcon, { backgroundColor: (isNew ? COLORS.primary : COLORS.success) + '20' }]}>
        <Ionicons name={isNew ? 'flash' : 'trophy'} size={18} color={isNew ? COLORS.primary : COLORS.success} />
      </View>

      <View style={styles.recordInfo}>
        <Text style={[styles.recordName, isNew && { color: COLORS.primary }]}>{record.exercise}</Text>
        <Text style={styles.recordDate}>{record.date}</Text>
      </View>

      <View style={styles.recordValues}>
        <View style={styles.recordValue}>
          <Text style={styles.recordNumber}>{record.weight}kg</Text>
          <Text style={styles.recordLabel}>Carga</Text>
        </View>
        <View style={styles.recordValue}>
          <Text style={styles.recordNumber}>{record.reps}</Text>
          <Text style={styles.recordLabel}>Reps</Text>
        </View>
      </View>

      {isNew && (
        <View style={styles.newBadge}>
          <Text style={styles.newText}>NOVO!</Text>
        </View>
      )}
    </View>
  );
}

export default function PersonalRecords({ userId }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadRecords(); }, [userId]);

  const loadRecords = async () => {
    if (!userId) { setLoading(false); return; }
    try {
      const { data } = await supabase
        .from('user_exercise_logs')
        .select('exercise_name, weight_kg, reps_done, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!data || data.length === 0) {
        setLoading(false);
        return;
      }

      const exerciseMap = {};
      data.forEach(log => {
        const name = log.exercise_name;
        if (!exerciseMap[name]) {
          exerciseMap[name] = { exercise: name, weight: log.weight_kg || 0, reps: log.reps_done || 0, date: new Date(log.created_at).toLocaleDateString('pt-BR'), isNew: false };
        }
        const currentWeight = log.weight_kg || 0;
        if (currentWeight > exerciseMap[name].weight) {
          exerciseMap[name] = { exercise: name, weight: currentWeight, reps: log.reps_done || 0, date: new Date(log.created_at).toLocaleDateString('pt-BR'), isNew: true };
        }
      });

      const sorted = Object.values(exerciseMap).sort((a, b) => b.weight - a.weight);
      setRecords(sorted.slice(0, 10));
    } catch (err) {
      if (__DEV__) console.error('Erro ao carregar recordes:', err);
    } finally {
      setLoading(false);
    }
  };

  const newRecords = records.filter(r => r.isNew).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="trophy" size={18} color={COLORS.primary} />
        <Text style={styles.title}>RECORDES PESSOAIS</Text>
        {newRecords > 0 && (
          <View style={styles.newBadgeHeader}>
            <Text style={styles.newHeaderText}>{newRecords} novos</Text>
          </View>
        )}
      </View>

      {loading ? (
        <View style={styles.loading}>
          <Ionicons name="sync" size={20} color={COLORS.textMuted} />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      ) : records.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="barbell-outline" size={32} color={COLORS.textMuted} />
          <Text style={styles.emptyText}>Registre treinos para ver seus recordes</Text>
        </View>
      ) : (
        <FlatList
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={5}
          data={records}
          keyExtractor={(item, i) => `${item.exercise}-${i}`}
          renderItem={({ item }) => <RecordItem record={item} />}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textMuted, letterSpacing: 1, flex: 1 },
  newBadgeHeader: { backgroundColor: COLORS.primary + '20', paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs, borderRadius: BORDER_RADIUS.sm },
  newHeaderText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.primary },
  loading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, padding: SPACING.xl },
  loadingText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textMuted },
  empty: { alignItems: 'center', padding: SPACING.xxl },
  emptyText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textMuted, marginTop: SPACING.sm, textAlign: 'center' },
  separator: { height: 1, backgroundColor: COLORS.border, marginVertical: SPACING.xs },
  recordItem: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, padding: SPACING.sm, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.sm },
  recordItemNew: { backgroundColor: COLORS.primary + '08', borderWidth: 1, borderColor: COLORS.primary + '30' },
  recordIcon: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  recordInfo: { flex: 1 },
  recordName: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: COLORS.textTitle },
  recordDate: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted },
  recordValues: { flexDirection: 'row', gap: SPACING.md },
  recordValue: { alignItems: 'center' },
  recordNumber: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.textTitle },
  recordLabel: { fontFamily: 'Inter_400Regular', fontSize: 9, color: COLORS.textMuted },
  newBadge: { backgroundColor: COLORS.primary, paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: BORDER_RADIUS.sm },
  newText: { fontFamily: 'Montserrat_700Bold', fontSize: 8, color: COLORS.background, letterSpacing: 1 },
});
