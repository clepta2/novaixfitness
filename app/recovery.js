import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../src/constants/spacing';
import { useAuth } from '../src/context/AuthContext';
import { supabase } from '../src/config/supabase';
import { APP_CONFIG } from '../src/config/app';
import { layout, typography } from '../src/styles';

const WATER_GOAL = APP_CONFIG.waterGoalDefault;
const SLEEP_TIPS = [
  'Evite telas 1h antes de dormir',
  'Mantenha o quarto escuro e fresco',
  'Evite cafeína após 14h',
  'Tome um banho morno antes de dormir',
  'Pratique respiração 4-7-8',
];

export default function RecoveryScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [waterGlasses, setWaterGlasses] = useState(0);
  const [sleepHours, setSleepHours] = useState('');
  const [sleepQuality, setSleepQuality] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    supabase.from('recovery_logs').select('*').eq('user_id', user.id).gte('logged_at', today.toISOString()).order('logged_at', { ascending: false }).limit(1).then(({ data }) => {
      if (data?.[0]) { setWaterGlasses(data[0].water_glasses || 0); setSleepHours(String(data[0].sleep_hours || '')); setSleepQuality(data[0].sleep_quality); }
    });
  }, [user?.id]);

  const handleSave = async () => {
    if (!user?.id) return;
    try {
      await supabase.from('recovery_logs').upsert({
        user_id: user.id, water_glasses: waterGlasses, sleep_hours: parseFloat(sleepHours) || 0, sleep_quality: sleepQuality, logged_at: new Date().toISOString(),
      }, { onConflict: 'user_id,logged_at' });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar.');
    }
  };

  const qualityOptions = [
    { value: 'great', label: 'Ótimo', icon: 'happy', color: COLORS.success },
    { value: 'good', label: 'Bom', icon: 'thumbs-up', color: COLORS.primary },
    { value: 'ok', label: 'Regular', icon: 'remove', color: COLORS.attention },
    { value: 'bad', label: 'Ruim', icon: 'sad', color: COLORS.error },
  ];

  return (
    <View style={layout.screen}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textTitle} />
        </TouchableOpacity>
        <Text style={typography.h2}>Recuperação</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="water" size={20} color={COLORS.info} />
            <Text style={styles.sectionTitle}>HIDRATAÇÃO</Text>
          </View>
          <Text style={styles.sectionDesc}>Meta: {WATER_GOAL} copos por dia</Text>
          <View style={styles.waterGrid}>
            {Array.from({ length: WATER_GOAL }, (_, i) => (
              <TouchableOpacity key={i} style={[styles.waterGlass, i < waterGlasses && styles.waterGlassActive]} onPress={() => setWaterGlasses(i + 1 === waterGlasses ? i : i + 1)}>
                <Ionicons name={i < waterGlasses ? 'water' : 'water-outline'} size={24} color={i < waterGlasses ? COLORS.info : COLORS.textMuted} />
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.waterCount}>{waterGlasses}/{WATER_GOAL} copos</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="moon" size={20} color="#7B68EE" />
            <Text style={styles.sectionTitle}>SONO</Text>
          </View>
          <Text style={styles.sectionDesc}>Horas dormidas na noite anterior</Text>
          <TextInput style={styles.input} value={sleepHours} onChangeText={setSleepHours} placeholder="Ex: 7.5" placeholderTextColor={COLORS.textMuted} keyboardType="decimal-pad" />
          <Text style={styles.sectionDesc}>Como você se sentiu?</Text>
          <View style={styles.qualityRow}>
            {qualityOptions.map(opt => (
              <TouchableOpacity key={opt.value} style={[styles.qualityBtn, sleepQuality === opt.value && { backgroundColor: opt.color + '20', borderColor: opt.color }]} onPress={() => setSleepQuality(opt.value)}>
                <Ionicons name={opt.icon} size={20} color={sleepQuality === opt.value ? opt.color : COLORS.textMuted} />
                <Text style={[styles.qualityLabel, sleepQuality === opt.value && { color: opt.color }]}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="bulb" size={20} color={COLORS.attention} />
            <Text style={styles.sectionTitle}>DICA DE HOJE</Text>
          </View>
          <Text style={styles.tipText}>{SLEEP_TIPS[new Date().getDate() % SLEEP_TIPS.length]}</Text>
        </View>

        <TouchableOpacity style={[styles.saveBtn, saved && styles.saveBtnDone]} onPress={handleSave} activeOpacity={0.8}>
          <Ionicons name={saved ? 'checkmark-circle' : 'save-outline'} size={20} color="#fff" />
          <Text style={styles.saveBtnText}>{saved ? 'SALVO!' : 'SALVAR RECUPERAÇÃO'}</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: SPACING.xl, paddingBottom: SPACING.md },
  scroll: { padding: SPACING.xl },
  section: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.lg },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm },
  sectionTitle: { fontFamily: 'Montserrat-Bold', fontSize: 12, color: COLORS.textMuted, letterSpacing: 1 },
  sectionDesc: { fontFamily: 'Inter-Regular', fontSize: 13, color: COLORS.textMuted, marginBottom: SPACING.md },
  waterGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.sm },
  waterGlass: { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  waterGlassActive: { backgroundColor: COLORS.info + '15', borderColor: COLORS.info },
  waterCount: { fontFamily: 'Montserrat-SemiBold', fontSize: 13, color: COLORS.textTitle, textAlign: 'center' },
  input: { height: 48, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: SPACING.md, color: COLORS.textTitle, fontFamily: 'Inter-Regular', fontSize: 16, marginBottom: SPACING.md },
  qualityRow: { flexDirection: 'row', gap: SPACING.sm },
  qualityBtn: { flex: 1, alignItems: 'center', padding: SPACING.md, borderRadius: BORDER_RADIUS.md, backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.border },
  qualityLabel: { fontFamily: 'Inter-SemiBold', fontSize: 11, color: COLORS.textMuted, marginTop: 4 },
  tipText: { fontFamily: 'Inter-Regular', fontSize: 14, color: COLORS.textDescription, lineHeight: 20 },
  saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.md, padding: SPACING.md },
  saveBtnDone: { backgroundColor: COLORS.success },
  saveBtnText: { fontFamily: 'Montserrat-Bold', fontSize: 14, color: '#12161A', letterSpacing: 0.5 },
});
