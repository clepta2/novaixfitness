
// app/onboarding/dados-fisicos.tsx
// Tela 2 - Genero + Dados Fisicos com melhorias visuais - NOVAIX FITNESS

import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../../src/constants/spacing';
import { ErrorBoundary, DraggableSlider, MiniCalendar, LocationSection } from '../../src/components';
import { useDadosFisicos, GENDERS } from '../../src/hooks/useDadosFisicos';
import { useResponsive } from '../../src/hooks/useResponsive';
import OnboardingLayout from '../../src/components/onboarding/OnboardingLayout';

export default function OnboardingStep2() {
  const {
    gender, setGender, dob, setDob, showCalendar, setShowCalendar,
    weight, setWeight, height, setHeight,
    state, setState, city, setCity, cep, setCep,
    street, setStreet, neighborhood, setNeighborhood,
    number, setNumber, nearTo, setNearTo,
    dobValid, canProceed, handleNext,
  } = useDadosFisicos();
  const router = useRouter();
  const { isSmall } = useResponsive();

  return (
    <ErrorBoundary screenName="DadosFisicos">
      <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <OnboardingLayout
          stepNumber={2}
          totalSteps={3}
          title="SOBRE VOCE"
          subtitle="Dados fisicos e localizacao"
          icon="person"
          iconColor={COLORS.info}
        >
          {/* Genero */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.accentDot, { backgroundColor: COLORS.primary }]} />
              <Text style={styles.sectionLabel}>GENERO</Text>
            </View>
            <View style={styles.genderRow}>
              {GENDERS.map((g) => (
                <TouchableOpacity
                  key={g.id}
                  style={[styles.genderCard, gender === g.id && styles.genderCardActive]}
                  onPress={() => setGender(g.id)}
                >
                  <Ionicons name={g.icon as any} size={28} color={gender === g.id ? COLORS.primary : COLORS.textMuted} />
                  <Text style={[styles.genderLabel, gender === g.id && styles.genderLabelActive]}>{g.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Data de nascimento */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.accentDot, { backgroundColor: COLORS.secondary }]} />
              <Text style={styles.sectionLabel}>DATA DE NASCIMENTO</Text>
            </View>
            <MiniCalendar
              selectedDate={dob}
              onSelect={(date) => setDob(date)}
              visible={showCalendar}
              onClose={() => setShowCalendar(false)}
            />
          </View>

          {/* Dados fisicos */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.accentDot, { backgroundColor: COLORS.success }]} />
              <Text style={styles.sectionLabel}>DADOS FISICOS</Text>
            </View>
            <View style={styles.sliderRow}>
              <View style={styles.sliderContainer}>
                <Text style={styles.sliderLabel}>PESO (kg)</Text>
                <DraggableSlider value={weight} min={30} max={200} step={1} onValueChange={setWeight} />
                <Text style={styles.sliderValue}>{weight} kg</Text>
              </View>
              <View style={styles.sliderContainer}>
                <Text style={styles.sliderLabel}>ALTURA (cm)</Text>
                <DraggableSlider value={height} min={100} max={220} step={1} onValueChange={setHeight} />
                <Text style={styles.sliderValue}>{height} cm</Text>
              </View>
            </View>
          </View>

          {/* Localizacao */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.accentDot, { backgroundColor: COLORS.cyan }]} />
              <Text style={styles.sectionLabel}>LOCALIZACAO</Text>
            </View>
            <LocationSection
              state={state}
              setState={setState}
              city={city}
              setCity={setCity}
              cep={cep}
              setCep={setCep}
              street={street}
              setStreet={setStreet}
              neighborhood={neighborhood}
              setNeighborhood={setNeighborhood}
              number={number}
              setNumber={setNumber}
              nearTo={nearTo}
              setNearTo={setNearTo}
            />
          </View>
        </OnboardingLayout>
      </KeyboardAvoidingView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  section: { marginBottom: SPACING.xl },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  accentDot: { width: 8, height: 8, borderRadius: 4 },
  sectionLabel: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textTitle, letterSpacing: 1 },
  genderRow: { flexDirection: 'row', gap: SPACING.sm },
  genderCard: {
    flex: 1, alignItems: 'center', gap: SPACING.sm,
    backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg, borderWidth: 2, borderColor: COLORS.border,
  },
  genderCardActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '08' },
  genderLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: COLORS.textMuted },
  genderLabelActive: { color: COLORS.primary },
  sliderRow: { flexDirection: 'row', gap: SPACING.md },
  sliderContainer: { flex: 1 },
  sliderLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textMuted, letterSpacing: 0.5, marginBottom: SPACING.sm },
  sliderValue: { fontFamily: 'Montserrat_700Bold', fontSize: 18, color: COLORS.primary, textAlign: 'center', marginTop: SPACING.sm },
});
