import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { supabase } from '../../config/supabase';
import { useState, useEffect } from 'react';

const MUSCLES = [
  { key: 'chest', label: 'Peito', icon: 'body' },
  { key: 'back', label: 'Costas', icon: 'body' },
  { key: 'legs', label: 'Pernas', icon: 'walk' },
  { key: 'shoulders', label: 'Ombros', icon: 'body' },
  { key: 'arms', label: 'Braços', icon: 'barbell' },
  { key: 'core', label: 'Abdômen', icon: 'fitness' },
];

export default function MuscleMiniRadar({ userId }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!userId) return;
    async function load() {
      try {
        const thirtyAgo = new Date(Date.now() - 30 * 86400000).toISOString();
        const { data: workouts } = await supabase.from('user_workouts').select('workouts(category)').eq('user_id', userId).gte('completed_at', thirtyAgo);
        if (!workouts?.length) return;
        const counts = {};
        workouts.forEach(w => {
          const cat = (w.workouts?.category || '').toLowerCase();
          if (cat.includes('peito') || cat.includes('chest')) counts.chest = (counts.chest || 0) + 1;
          if (cat.includes('costa') || cat.includes('back')) counts.back = (counts.back || 0) + 1;
          if (cat.includes('perna') || cat.includes('leg')) counts.legs = (counts.legs || 0) + 1;
          if (cat.includes('ombro') || cat.includes('shoulder')) counts.shoulders = (counts.shoulders || 0) + 1;
          if (cat.includes('braço') || cat.includes('arm') || cat.includes('biceps')) counts.arms = (counts.arms || 0) + 1;
          if (cat.includes('abdom') || cat.includes('core')) counts.core = (counts.core || 0) + 1;
        });
        const max = Math.max(...Object.values(counts), 1);
        const balanced = MUSCLES.map(m => ({ ...m, value: Math.round(((counts[m.key] || 0) / max) * 100) }));
        setData(balanced);
      } catch {}
    }
    load();
  }, [userId]);

  if (!data) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="pulse" size={16} color={COLORS.primary} />
        <Text style={styles.title}>EQUILÍBRIO MUSCULAR</Text>
      </View>
      <View style={styles.bars}>
        {data.map(m => (
          <View key={m.key} style={styles.row}>
            <Text style={styles.label}>{m.label}</Text>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: `${m.value}%`, backgroundColor: m.value > 70 ? COLORS.success : m.value > 30 ? COLORS.primary : COLORS.attention }]} />
            </View>
            <Text style={styles.value}>{m.value}%</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  header: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: SPACING.md },
  title: { fontFamily: 'Montserrat-Bold', fontSize: 11, color: COLORS.textMuted, letterSpacing: 1 },
  bars: { gap: SPACING.xs },
  row: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  label: { fontFamily: 'Inter-SemiBold', fontSize: 11, color: COLORS.textDescription, width: 60 },
  barTrack: { flex: 1, height: 6, backgroundColor: COLORS.background, borderRadius: 3, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 3 },
  value: { fontFamily: 'Montserrat-SemiBold', fontSize: 10, color: COLORS.textMuted, width: 30, textAlign: 'right' },
});
