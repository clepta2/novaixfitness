// app/onboarding/disponibilidade.js
// Tela 5 - Disponibilidade - NOVAIX FITNESS

import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/constants/colors';
import { SPACING } from '../../src/constants/spacing';
import { Card, Button, ProgressBar } from '../../src/components';
import { useAuth } from '../../src/context/AuthContext';
import { layout, typography } from '../../src/styles';

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
  const { saveOnboarding, onboarding } = useAuth();
  const [selectedDays, setSelectedDays] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleNext = async () => {
    if (!selectedDays || !selectedLocation) return;
    await saveOnboarding({ ...onboarding, daysPerWeek: selectedDays, location: selectedLocation });
    router.push(selectedLocation === 'gym' ? '/onboarding/tipo-academia' : '/onboarding/experiencia');
  };

  return (
    <View style={layout.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={typography.h3}>SUA DISPONIBILIDADE</Text>
          <Text style={typography.bodyMuted}>Quantos dias e onde você vai treinar?</Text>
          <View style={styles.progressContainer}><ProgressBar value={5} max={7} /></View>
          <Text style={typography.caption}>Passo 5 de 7</Text>
        </View>

        <View style={layout.section}>
          <Text style={typography.h5}>DIAS POR SEMANA</Text>
          <View style={styles.optionsGrid}>
            {weekDays.map((day) => (
              <Card key={day.id} variant={selectedDays === day.id ? 'active' : 'surface'} onPress={() => setSelectedDays(day.id)} style={styles.optionCard}>
                <Text style={typography.h4}>{day.label}</Text>
                <Text style={typography.caption}>{day.description}</Text>
              </Card>
            ))}
          </View>
        </View>

        <View style={layout.section}>
          <Text style={typography.h5}>ONDE VOCÊ VAI TREINAR?</Text>
          <View style={styles.locationsGrid}>
            {locations.map((location) => (
              <Card key={location.id} variant={selectedLocation === location.id ? 'active' : 'surface'} onPress={() => setSelectedLocation(location.id)} style={styles.locationCard}>
                <Ionicons name={location.icon} size={32} color={COLORS.primary} />
                <Text style={typography.h5}>{location.label}</Text>
              </Card>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={layout.footer}>
        <Button title="ANTERIOR" variant="secondary" icon="arrow-back" onPress={() => router.back()} />
        <Button title="PRÓXIMO" icon="arrow-forward" onPress={handleNext} disabled={!selectedDays || !selectedLocation} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1, padding: SPACING.xl, paddingTop: layout.scroll.paddingTop },
  header: { alignItems: 'center', marginBottom: 30 },
  progressContainer: { width: '100%', marginTop: SPACING.xxl },
  optionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md },
  optionCard: { width: '48%', alignItems: 'center' },
  locationsGrid: { flexDirection: 'row', gap: SPACING.md },
  locationCard: { flex: 1, alignItems: 'center' },
});
