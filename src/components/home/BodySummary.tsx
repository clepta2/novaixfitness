import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { supabase } from '../../config/supabase';

export default function BodySummary({ userId }) {
  const router = useRouter();
  const [latest, setLatest] = useState(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!userId) { setLoading(false); return; }
      try {
        const [measurementsRes, photosRes] = await Promise.all([
          supabase.from('physical_progress').select('weight, body_fat, recorded_at').eq('user_id', userId).order('recorded_at', { ascending: false }).limit(1),
          supabase.from('progress_photos').select('id, image_url, label').eq('user_id', userId).order('created_at', { ascending: false }).limit(3),
        ]);
        if (measurementsRes.data?.length > 0) setLatest(measurementsRes.data[0]);
        if (photosRes.data) setPhotos(photosRes.data);
      } catch {}
      finally { setLoading(false); }
    }
    load();
  }, [userId]);

  if (loading || (!latest && photos.length === 0)) return null;

  const bmi = latest?.weight ? (latest.weight / ((170 / 100) ** 2)).toFixed(1) : null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="body" size={18} color={COLORS.primary} />
        <Text style={styles.title}>EVOLUÇÃO CORPORAL</Text>
        <TouchableOpacity onPress={() => router.push('/body-measures')} style={styles.seeAll}>
          <Text style={styles.seeAllText}>Ver tudo</Text>
          <Ionicons name="chevron-forward" size={14} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        {latest?.weight && (
          <View style={styles.statItem}>
            <Ionicons name="scale-outline" size={16} color={COLORS.primary} />
            <Text style={styles.statValue}>{latest.weight}kg</Text>
            <Text style={styles.statLabel}>Peso</Text>
          </View>
        )}
        {bmi && (
          <View style={styles.statItem}>
            <Ionicons name="body" size={16} color={COLORS.info} />
            <Text style={styles.statValue}>{bmi}</Text>
            <Text style={styles.statLabel}>IMC</Text>
          </View>
        )}
        {latest?.body_fat && (
          <View style={styles.statItem}>
            <Ionicons name="water" size={16} color={COLORS.secondary} />
            <Text style={styles.statValue}>{latest.body_fat}%</Text>
            <Text style={styles.statLabel}>Gordura</Text>
          </View>
        )}
      </View>

      {photos.length > 0 && (
        <View style={styles.photosRow}>
          <Text style={styles.photosLabel}>Fotos recentes</Text>
          <TouchableOpacity onPress={() => router.push('/progress-photos')}>
            <Text style={styles.photosSeeAll}>Ver todas →</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.md },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  title: { flex: 1, fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textMuted, letterSpacing: 1 },
  seeAll: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  seeAllText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.primary },
  statsRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md },
  statItem: { flex: 1, alignItems: 'center', backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.sm, padding: SPACING.sm, gap: 2 },
  statValue: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.textTitle },
  statLabel: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted },
  photosRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  photosLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textMuted },
  photosSeeAll: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.primary },
});
