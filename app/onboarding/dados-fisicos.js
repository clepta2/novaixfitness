// app/onboarding/dados-fisicos.js
// Tela 3 - Dados Físicos - NOVAIX FITNESS

import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../../src/constants/spacing';
import { Card, Button, ProgressBar } from '../../src/components';
import { useAuth } from '../../src/context/AuthContext';
import { layout, typography } from '../../src/styles';

const Slider = ({ label, value, setValue, min, max, unit }) => (
  <Card variant="surface" style={styles.sliderCard}>
    <View style={styles.sliderHeader}>
      <Text style={typography.label}>{label}</Text>
      <Text style={typography.h3}>{value} {unit}</Text>
    </View>
    <View style={styles.sliderTrack}>
      <View style={[styles.sliderFill, { width: `${((value - min) / (max - min)) * 100}%` }]} />
    </View>
    <View style={styles.sliderButtons}>
      <TouchableOpacity style={styles.sliderButton} onPress={() => setValue(Math.max(min, value - 1))}>
        <Ionicons name="remove" size={20} color={COLORS.textTitle} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.sliderButton} onPress={() => setValue(Math.min(max, value + 1))}>
        <Ionicons name="add" size={20} color={COLORS.textTitle} />
      </TouchableOpacity>
    </View>
  </Card>
);

export default function PhysicalDataScreen() {
  const router = useRouter();
  const { saveOnboarding, onboarding } = useAuth();
  const [age, setAge] = useState(25);
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(170);

  const handleNext = async () => {
    await saveOnboarding({ ...onboarding, age, weight, height });
    router.push('/onboarding/modelo');
  };

  return (
    <View style={layout.screen}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={typography.h3}>CONTENOS SOBRE VOCÊ</Text>
          <Text style={typography.bodyMuted}>Seus dados físicos (última medição)</Text>
          <View style={styles.progressContainer}><ProgressBar value={3} max={6} /></View>
          <Text style={typography.caption}>Passo 3 de 6</Text>
        </View>

        <View style={styles.slidersContainer}>
          <Slider label="IDADE" value={age} setValue={setAge} min={14} max={80} unit="anos" />
          <Slider label="PESO" value={weight} setValue={setWeight} min={40} max={150} unit="kg" />
          <Slider label="ALTURA" value={height} setValue={setHeight} min={140} max={210} unit="cm" />
        </View>
      </View>

      <View style={layout.footer}>
        <Button title="ANTERIOR" variant="secondary" icon="arrow-back" onPress={() => router.back()} />
        <Button title="PRÓXIMO" icon="arrow-forward" onPress={handleNext} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, padding: SPACING.xl, paddingTop: 60 },
  header: { alignItems: 'center', marginBottom: 30 },
  progressContainer: { width: '100%', marginTop: SPACING.xxl },
  slidersContainer: { flex: 1, justifyContent: 'center', gap: SPACING.xxxl },
  sliderCard: { padding: SPACING.xl },
  sliderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  sliderTrack: { height: 8, backgroundColor: COLORS.border, borderRadius: BORDER_RADIUS.sm, marginBottom: SPACING.lg },
  sliderFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.sm },
  sliderButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  sliderButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
});
