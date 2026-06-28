// app/onboarding/dados-fisicos.js
// Tela 2 - Genero + Dados Fisicos - NOVAIX FITNESS

import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../../src/constants/spacing';
import { Card, ProgressBar, OnboardingFooter } from '../../src/components';
import DraggableSlider from '../../src/components/onboarding/DraggableSlider';
import MiniCalendar from '../../src/components/onboarding/MiniCalendar';
import StatePickerModal from '../../src/components/onboarding/StatePickerModal';
import { useAuth } from '../../src/context/AuthContext';
import { typography } from '../../src/styles';
import { formatCEP } from '../../src/data/states';

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
  const [showStatePicker, setShowStatePicker] = useState(false);
  const [state, setState] = useState(onboarding?.state || '');
  const [city, setCity] = useState(onboarding?.city || '');
  const [cep, setCep] = useState(onboarding?.cep || '');
  const [loadingCep, setLoadingCep] = useState(false);

  const dobValid = isDateValid(dob);
  const canProceed = gender && dobValid;

  const handleCepChange = async (text) => {
    const formatted = formatCEP(text);
    setCep(formatted);
    if (formatted.replace(/\D/g, '').length === 8) {
      setLoadingCep(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${formatted.replace(/\D/g, '')}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setState(data.uf);
          setCity(data.localidade);
        }
      } catch {}
      setLoadingCep(false);
    }
  };

  const handleNext = async () => {
    if (!canProceed) return;
    const [d, m, y] = dob.split('/').map(Number);
    const today = new Date();
    let age = today.getFullYear() - y;
    if (today.getMonth() < m - 1 || (today.getMonth() === m - 1 && today.getDate() < d)) age--;
    await saveOnboarding({ ...onboarding, gender, birth_date: dob, age, weight, height, state, city, cep });
    await updateProfile({ current_step: 'onboarding' });
    router.push('/onboarding/modelo');
  };

  return (
    <KeyboardAvoidingView style={s.screen} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <View style={s.header}>
          <Text style={typography.h3}>SOBRE VOCE</Text>
          <Text style={typography.bodyMuted}>Genero, nascimento, dados fisicos e localizacao</Text>
          <View style={s.progressWrap}><ProgressBar value={2} max={6} /></View>
          <Text style={typography.caption}>Passo 2 de 6</Text>
        </View>

        <Text style={s.sectionLabel}>GENERO</Text>
        <View style={s.genderRow}>
          {genders.map((g) => (
            <Card key={g.id} variant={gender === g.id ? 'active' : 'surface'} onPress={() => setGender(g.id)} style={s.genderCard}>
              <View style={s.genderContent}>
                <View style={[s.iconWrap, { backgroundColor: g.color + '20' }]}>
                  <Ionicons name={g.icon} size={32} color={g.color} />
                </View>
                <Text style={typography.h5}>{g.label}</Text>
                {gender === g.id && <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} style={s.check} />}
              </View>
            </Card>
          ))}
        </View>

        <View style={{ height: SPACING.xl }} />
        <Text style={s.sectionLabel}>DATA DE NASCIMENTO</Text>
        <View style={s.dateRow}>
          <View style={s.dateInput}>
            <Text style={s.dateLabel}>DATA DE NASCIMENTO</Text>
            <View style={s.dateBox}>
              <Text style={[s.dateText, !dob && { color: COLORS.textMuted }]}>{dob || 'DD/MM/AAAA'}</Text>
            </View>
          </View>
          <TouchableOpacity style={s.calBtn} onPress={() => setShowCalendar(true)}>
            <Ionicons name="calendar" size={20} color={COLORS.background} />
          </TouchableOpacity>
        </View>
        {dob.length > 0 && (
          <Text style={[s.helper, { color: dobValid ? COLORS.primary : COLORS.errorLight }]}>
            {dobValid ? 'Valida' : 'Invalida (min 10 anos)'}
          </Text>
        )}

        <View style={{ height: SPACING.xl }} />
        <Text style={s.sectionLabel}>DADOS FISICOS</Text>
        <DraggableSlider label="PESO" value={weight} setValue={setWeight} min={30} max={200} unit="kg" />
        <View style={{ height: SPACING.md }} />
        <DraggableSlider label="ALTURA" value={height} setValue={setHeight} min={120} max={220} unit="cm" />

        <View style={{ height: SPACING.xl }} />
        <Text style={s.sectionLabel}>LOCALIZACAO</Text>
        <Text style={s.sectionLabel}>CEP</Text>
        <View style={s.cepRow}>
          <View style={s.cepInputWrap}>
            <TextInput
              style={s.cepInput}
              placeholder="00000-000"
              placeholderTextColor={COLORS.textMuted}
              value={cep}
              onChangeText={handleCepChange}
              keyboardType="numeric"
              maxLength={9}
            />
            {loadingCep && <Ionicons name="sync" size={16} color={COLORS.primary} style={s.cepLoader} />}
          </View>
        </View>

        <View style={{ height: SPACING.md }} />
        <Text style={s.sectionLabel}>ESTADO</Text>
        <TouchableOpacity style={s.stateBtn} onPress={() => setShowStatePicker(true)}>
          <Text style={[s.stateText, !state && { color: COLORS.textMuted }]}>{state || 'Selecionar estado'}</Text>
          <Ionicons name="chevron-down" size={18} color={COLORS.textMuted} />
        </TouchableOpacity>

        <View style={{ height: SPACING.md }} />
        <Text style={s.sectionLabel}>CIDADE</Text>
        <TextInput
          style={s.cityInput}
          placeholder="Cidade"
          placeholderTextColor={COLORS.textMuted}
          value={city}
          onChangeText={setCity}
        />
      </ScrollView>

      <View style={s.footerWrap}>
        <OnboardingFooter onBack={() => router.back()} onNext={handleNext} canProceed={canProceed} />
      </View>

      <MiniCalendar visible={showCalendar} selectedDate={dob} onSelect={(d) => { setDob(d); setShowCalendar(false); }} onClose={() => setShowCalendar(false)} />
      <StatePickerModal visible={showStatePicker} selectedState={state} onSelect={setState} onClose={() => setShowStatePicker(false)} />
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flexGrow: 1, padding: SPACING.xl, paddingTop: Platform.OS === 'ios' ? 54 : 40 },
  footerWrap: { borderTopWidth: 1, borderTopColor: COLORS.border },
  header: { alignItems: 'center', marginBottom: SPACING.xl },
  progressWrap: { width: '100%', marginTop: SPACING.lg },
  sectionLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: SPACING.sm },
  genderRow: { flexDirection: 'row', gap: SPACING.md },
  genderCard: { flex: 1, padding: SPACING.lg },
  genderContent: { alignItems: 'center' },
  iconWrap: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.sm },
  check: { position: 'absolute', top: 0, right: 0 },
  dateRow: { flexDirection: 'row', alignItems: 'flex-end', gap: SPACING.sm },
  dateInput: { flex: 1 },
  dateLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textTitle, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: SPACING.sm },
  dateBox: { height: 48, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 1.5, borderColor: COLORS.border, paddingHorizontal: SPACING.lg, justifyContent: 'center' },
  dateText: { color: COLORS.textTitle, fontSize: 15, fontFamily: 'Inter_500Medium' },
  calBtn: { width: 48, height: 48, borderRadius: BORDER_RADIUS.md, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  helper: { fontSize: 11, fontFamily: 'Inter_500Medium', marginTop: SPACING.xs },
  cepRow: { flexDirection: 'row', gap: SPACING.sm },
  cepInputWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', height: 48, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 1.5, borderColor: COLORS.border, paddingHorizontal: SPACING.lg },
  cepInput: { flex: 1, color: COLORS.textTitle, fontSize: 15, fontFamily: 'Inter_500Medium' },
  cepLoader: { marginLeft: SPACING.sm },
  stateBtn: { height: 48, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 1.5, borderColor: COLORS.border, paddingHorizontal: SPACING.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stateText: { color: COLORS.textTitle, fontSize: 15, fontFamily: 'Inter_500Medium' },
  cityInput: { height: 48, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 1.5, borderColor: COLORS.border, paddingHorizontal: SPACING.lg, color: COLORS.textTitle, fontSize: 15, fontFamily: 'Inter_500Medium' },
});