// app/onboarding/dados-fisicos.js
// Tela 2 - Genero + Dados Fisicos - NOVAIX FITNESS

import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../../src/constants/spacing';
import { OnboardingFooter, ErrorBoundary } from '../../src/components';
import DraggableSlider from '../../src/components/onboarding/DraggableSlider';
import MiniCalendar from '../../src/components/onboarding/MiniCalendar';
import LocationSection from '../../src/components/onboarding/LocationSection';
import { useAuth } from '../../src/context/AuthContext';

const genders = [
  { id: 'male', label: 'Masculino', icon: 'male', color: COLORS.purple },
  { id: 'female', label: 'Feminino', icon: 'female', color: COLORS.pink },
];

const isDateValid = (ds) => {
  if (ds.length !== 10) return false;
  const [d, m, y] = ds.split('/').map(Number);
  if (!d || !m || !y || m < 1 || m > 12 || d < 1 || d > 31) return false;
  const ml = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (y % 400 === 0 || (y % 100 !== 0 && y % 4 === 0)) ml[1] = 29;
  if (d > ml[m - 1]) return false;
  const cy = new Date().getFullYear();
  return y >= 1920 && y <= cy - 10;
};

export default function OnboardingStep2() {
  const router = useRouter();
  const { saveOnboarding, onboarding, updateProfile } = useAuth();
  const [gender, setGender] = useState(onboarding?.gender || null);
  const [dob, setDob] = useState(onboarding?.birth_date || '');
  const [showCalendar, setShowCalendar] = useState(false);
  const [weight, setWeight] = useState(onboarding?.weight || 70);
  const [height, setHeight] = useState(onboarding?.height || 170);
  const [state, setState] = useState(onboarding?.state || '');
  const [city, setCity] = useState(onboarding?.city || '');
  const [cep, setCep] = useState(onboarding?.cep || '');
  const [street, setStreet] = useState(onboarding?.street || '');
  const [neighborhood, setNeighborhood] = useState(onboarding?.neighborhood || '');
  const [number, setNumber] = useState(onboarding?.number || '');
  const [nearTo, setNearTo] = useState(onboarding?.near_to || '');

  const dobValid = isDateValid(dob);
  const canProceed = gender && dobValid;

  const handleNext = async () => {
    if (!canProceed) return;
    const [d, m, y] = dob.split('/').map(Number);
    const today = new Date();
    let age = today.getFullYear() - y;
    if (today.getMonth() < m - 1 || (today.getMonth() === m - 1 && today.getDate() < d)) age--;
    await saveOnboarding({ ...onboarding, gender, birth_date: dob, age, weight, height, state, city, cep, street, neighborhood, number, near_to: nearTo });
    await updateProfile({ current_step: 'onboarding' });
    router.push('/onboarding/modelo');
  };

  return (
    <ErrorBoundary screenName="DadosFisicos">
    <KeyboardAvoidingView style={s.screen} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <View style={s.header}>
          <View style={s.stepPill}>
            <View style={s.stepDot} />
            <Text style={s.stepText}>PASSO 2 DE 6</Text>
          </View>
          <Text style={s.title}>SOBRE VOCÊ</Text>
          <Text style={s.subtitle}>Dados físicos e localização</Text>
          <View style={s.progressWrap}>
            <View style={s.progressTrack}>
              <View style={[s.progressFill, { width: '33.3%' }]} />
            </View>
            <Text style={s.progressLabel}>33%</Text>
          </View>
        </View>

        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={s.accentDot} />
            <Text style={s.sectionLabel}>GÊNERO</Text>
          </View>
          <View style={s.genderRow}>
            {genders.map((g) => (
              <TouchableOpacity
                key={g.id}
                style={[s.genderCard, gender === g.id && s.genderCardActive]}
                onPress={() => setGender(g.id)}
                activeOpacity={0.85}
              >
                <View style={[s.iconWrap, { backgroundColor: gender === g.id ? g.color + '30' : g.color + '15' }]}>
                  <Ionicons name={g.icon} size={28} color={g.color} />
                </View>
                <Text style={[s.genderLabel, gender === g.id && s.genderLabelActive]}>{g.label}</Text>
                {gender === g.id && (
                  <View style={s.checkBadge}>
                    <Ionicons name="checkmark" size={10} color={COLORS.background} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={s.accentDot} />
            <Text style={s.sectionLabel}>DATA DE NASCIMENTO</Text>
          </View>
          <View style={s.dateRow}>
            <TouchableOpacity style={s.dateBox} onPress={() => setShowCalendar(true)} activeOpacity={0.8}>
              <Ionicons name="calendar-outline" size={18} color={dob ? COLORS.primary : COLORS.textMuted} />
              <Text style={[s.dateText, !dob && { color: COLORS.textMuted }]}>{dob || 'DD/MM/AAAA'}</Text>
              {dob && dobValid && <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />}
            </TouchableOpacity>
          </View>
          {dob.length > 0 && (
            <Text style={[s.helper, { color: dobValid ? COLORS.success : COLORS.error }]}>
              {dobValid ? '✓ Data válida' : '✗ Inválida (mínimo 10 anos)'}
            </Text>
          )}
        </View>

        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={s.accentDot} />
            <Text style={s.sectionLabel}>DADOS FÍSICOS</Text>
          </View>
          <DraggableSlider label="PESO" value={weight} setValue={setWeight} min={30} max={200} unit="kg" />
          <View style={{ height: SPACING.md }} />
          <DraggableSlider label="ALTURA" value={height} setValue={setHeight} min={120} max={220} unit="cm" />
        </View>

        <LocationSection state={state} setState={setState} city={city} setCity={setCity} cep={cep} setCep={setCep} street={street} setStreet={setStreet} neighborhood={neighborhood} setNeighborhood={setNeighborhood} number={number} setNumber={setNumber} nearTo={nearTo} setNearTo={setNearTo} />
      </ScrollView>

      <View style={s.footerWrap}>
        <OnboardingFooter onBack={() => router.back()} onNext={handleNext} canProceed={canProceed} />
      </View>

      <MiniCalendar visible={showCalendar} selectedDate={dob} onSelect={(d) => { setDob(d); setShowCalendar(false); }} onClose={() => setShowCalendar(false)} />
    </KeyboardAvoidingView>
    </ErrorBoundary>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flexGrow: 1, padding: SPACING.xl, paddingTop: Platform.OS === 'ios' ? 54 : 40, paddingBottom: SPACING.xxl },
  footerWrap: { borderTopWidth: 1, borderTopColor: COLORS.border },
  header: { alignItems: 'center', marginBottom: SPACING.xxl },
  stepPill: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, backgroundColor: COLORS.primary + '15', paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: BORDER_RADIUS.full, marginBottom: SPACING.md },
  stepDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.primary },
  stepText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.primary, letterSpacing: 1.5 },
  title: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 26, color: COLORS.textTitle, textAlign: 'center', marginBottom: SPACING.xs },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textMuted, textAlign: 'center', marginBottom: SPACING.lg },
  progressWrap: { width: '100%', flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  progressTrack: { flex: 1, height: 4, backgroundColor: COLORS.border, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 2 },
  progressLabel: { fontFamily: 'Inter_500Medium', fontSize: 11, color: COLORS.primary, width: 30 },
  section: { marginBottom: SPACING.xl },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  accentDot: { width: 3, height: 16, backgroundColor: COLORS.primary, borderRadius: 2 },
  sectionLabel: { fontFamily: 'Montserrat_700Bold', fontSize: 11, color: COLORS.textTitle, textTransform: 'uppercase', letterSpacing: 1.5 },
  genderRow: { flexDirection: 'row', gap: SPACING.md },
  genderCard: { flex: 1, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, borderWidth: 2, borderColor: COLORS.border, padding: SPACING.lg, alignItems: 'center', gap: SPACING.sm, position: 'relative' },
  genderCardActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '08', shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  iconWrap: { width: 52, height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center' },
  genderLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: COLORS.textMuted },
  genderLabelActive: { color: COLORS.primary },
  checkBadge: { position: 'absolute', top: SPACING.sm, right: SPACING.sm, width: 18, height: 18, borderRadius: 9, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  dateRow: { width: '100%' },
  dateBox: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, height: 52, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 1.5, borderColor: COLORS.border, paddingHorizontal: SPACING.lg },
  dateText: { flex: 1, color: COLORS.textTitle, fontSize: 15, fontFamily: 'Inter_500Medium' },
  helper: { fontSize: 11, fontFamily: 'Inter_500Medium', marginTop: SPACING.xs, marginLeft: 2 },
});