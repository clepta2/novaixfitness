// src/components/nutrition/SupplementTracker.js
// Rastreador de suplementos/vitaminas - NOVAIX FITNESS

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { supabase } from '../../config/supabase';

const COMMON_SUPPLEMENTS = [
  { id: 'whey', name: 'Whey Protein', icon: 'flask', color: COLORS.primary, time: 'Pós-treino' },
  { id: 'creatine', name: 'Creatina', icon: 'flash', color: COLORS.success, time: 'Pré-treino' },
  { id: 'multivitamin', name: 'Multivitamínico', icon: 'medkit', color: COLORS.info, time: 'Manhã' },
  { id: 'omega3', name: 'Ômega 3', icon: 'fish', color: COLORS.attention, time: 'Almoço' },
  { id: 'vitamind', name: 'Vitamina D', icon: 'sunny', color: COLORS.attention, time: 'Manhã' },
  { id: 'bcaa', name: 'BCAA', icon: 'fitness', color: COLORS.secondary, time: 'Durante treino' },
];

function SupplementItem({ supplement, taken, onToggle }) {
  return (
    <TouchableOpacity style={[styles.item, taken && styles.itemTaken]} onPress={onToggle}>
      <View style={[styles.itemIcon, { backgroundColor: supplement.color + '20' }]}>
        <Ionicons name={supplement.icon} size={18} color={supplement.color} />
      </View>
      <View style={styles.itemInfo}>
        <Text style={[styles.itemName, taken && styles.itemNameTaken]}>{supplement.name}</Text>
        <Text style={styles.itemTime}>{supplement.time}</Text>
      </View>
      <Ionicons name={taken ? 'checkmark-circle' : 'ellipse-outline'} size={24} color={taken ? COLORS.success : COLORS.textMuted} />
    </TouchableOpacity>
  );
}

export default function SupplementTracker({ userId }) {
  const [taken, setTaken] = useState(() => new Set());

  useEffect(() => { loadToday(); }, [userId]);

  const loadToday = async () => {
    if (!userId) return;
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { data } = await supabase.from('supplement_logs')
        .select('supplement_id')
        .eq('user_id', userId)
        .gte('logged_at', today.toISOString());
      if (data) {
        setTaken(new Set(data.map(d => d.supplement_id)));
      }
    } catch { }
  };

  const toggleSupplement = async (supplement) => {
    const newTaken = new Set(taken);
    if (newTaken.has(supplement.id)) {
      newTaken.delete(supplement.id);
      await supabase.from('supplement_logs')
        .delete()
        .eq('user_id', userId)
        .eq('supplement_id', supplement.id)
        .gte('logged_at', new Date().setHours(0, 0, 0, 0));
    } else {
      newTaken.add(supplement.id);
      await supabase.from('supplement_logs').insert({
        user_id: userId,
        supplement_id: supplement.id,
        logged_at: new Date().toISOString(),
      });
    }
    setTaken(newTaken);
  };

  const takenCount = taken.size;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="medkit" size={18} color={COLORS.primary} />
        <Text style={styles.title}>SUPLEMENTOS</Text>
        <Text style={styles.count}>{takenCount}/{COMMON_SUPPLEMENTS.length}</Text>
      </View>

      <View style={styles.list}>
        {COMMON_SUPPLEMENTS.map(supp => (
          <SupplementItem
            key={supp.id}
            supplement={supp}
            taken={taken.has(supp.id)}
            onToggle={() => toggleSupplement(supp)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textMuted, letterSpacing: 1, flex: 1 },
  count: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.primary },
  list: { gap: SPACING.xs },
  item: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, padding: SPACING.sm, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.sm },
  itemTaken: { backgroundColor: COLORS.success + '10' },
  itemIcon: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  itemInfo: { flex: 1 },
  itemName: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: COLORS.textTitle },
  itemNameTaken: { color: COLORS.success },
  itemTime: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted },
});
