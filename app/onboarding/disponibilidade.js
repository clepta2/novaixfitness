// app/onboarding/disponibilidade.js
// Tela 5 - Disponibilidade - NOVAIX FITNESS

import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/constants/colors';

const weekDays = [
  { id: 2, label: '2 dias', description: 'Mínimo para resultados' },
  { id: 3, label: '3 dias', description: 'Ideal para iniciantes' },
  { id: 4, label: '4 dias', description: 'Bom equilíbrio' },
  { id: 5, label: '5 dias', description: 'Para dedicados' },
  { id: 6, label: '6 dias', description: 'Máxima dedicação' },
];

const locations = [
  { id: 'gym', label: 'Academia', icon: 'barbell', description: 'Equipamentos completos' },
  { id: 'home', label: 'Casa', icon: 'home', description: 'Peso corporal' },
  { id: 'park', label: 'Parque', icon: 'leaf', description: 'Ao ar livre' },
];

export default function AvailabilityScreen() {
  const router = useRouter();
  const [selectedDays, setSelectedDays] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleNext = () => {
    if (!selectedDays || !selectedLocation) return;
    // Salvar disponibilidade e ir para próxima tela
    router.push('/onboarding/experiencia');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>SUA DISPONIBILIDADE</Text>
          <Text style={styles.subtitle}>Quantos dias e onde você vai treinar?</Text>
          
          {/* Progresso */}
          <View style={styles.progressContainer}>
            <View style={[styles.progressStep, styles.progressActive]} />
            <View style={[styles.progressStep, styles.progressActive]} />
            <View style={[styles.progressStep, styles.progressActive]} />
            <View style={[styles.progressStep, styles.progressActive]} />
            <View style={[styles.progressStep, styles.progressActive]} />
            <View style={styles.progressStep} />
          </View>
          <Text style={styles.progressText}>Passo 5 de 6</Text>
        </View>

        {/* Dias por Semana */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DIAS POR SEMANA</Text>
          <View style={styles.optionsGrid}>
            {weekDays.map((day) => (
              <TouchableOpacity
                key={day.id}
                style={[
                  styles.optionCard,
                  selectedDays === day.id && styles.optionCardSelected,
                ]}
                onPress={() => setSelectedDays(day.id)}
              >
                <Text style={styles.optionLabel}>{day.label}</Text>
                <Text style={styles.optionDescription}>{day.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Local de Treino */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ONDE VOCÊ VAI TREINAR?</Text>
          <View style={styles.locationsGrid}>
            {locations.map((location) => (
              <TouchableOpacity
                key={location.id}
                style={[
                  styles.locationCard,
                  selectedLocation === location.id && styles.locationCardSelected,
                ]}
                onPress={() => setSelectedLocation(location.id)}
              >
                <Ionicons name={location.icon} size={32} color={COLORS.primary} />
                <Text style={styles.locationLabel}>{location.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Botões */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.buttonSecondary} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={COLORS.textTitle} />
          <Text style={styles.buttonSecondaryText}>ANTERIOR</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.buttonPrimary, (!selectedDays || !selectedLocation) && styles.buttonDisabled]}
          onPress={handleNext}
          disabled={!selectedDays || !selectedLocation}
        >
          <Text style={styles.buttonPrimaryText}>PRÓXIMO</Text>
          <Ionicons name="arrow-forward" size={20} color={COLORS.background} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 24,
    color: COLORS.textTitle,
    textTransform: 'uppercase',
    textAlign: 'center',
    letterSpacing: 1,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textDescription,
    textAlign: 'center',
    marginTop: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 20,
  },
  progressStep: {
    width: 30,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
  },
  progressActive: {
    backgroundColor: COLORS.primary,
  },
  progressText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 8,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 14,
    color: COLORS.textTitle,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    padding: 16,
    alignItems: 'center',
  },
  optionCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surface,
  },
  optionLabel: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
    color: COLORS.textTitle,
  },
  optionDescription: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  locationsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  locationCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    padding: 16,
    alignItems: 'center',
  },
  locationCardSelected: {
    borderColor: COLORS.primary,
  },
  locationLabel: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 12,
    color: COLORS.textTitle,
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    paddingBottom: 40,
  },
  buttonSecondary: {
    flex: 1,
    height: 50,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  buttonSecondaryText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 14,
    color: COLORS.textTitle,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  buttonPrimary: {
    flex: 1,
    height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonPrimaryText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 14,
    color: COLORS.background,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
