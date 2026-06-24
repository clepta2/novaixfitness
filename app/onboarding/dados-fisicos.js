// app/onboarding/dados-fisicos.js
// Tela 3 - Dados Físicos - NOVAIX FITNESS

import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/constants/colors';

export default function PhysicalDataScreen() {
  const router = useRouter();
  const [age, setAge] = useState(25);
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(170);

  const handleNext = () => {
    // Salvar dados e ir para próxima tela
    router.push('/onboarding/modelo');
  };

  // Componente de Slider customizado
  const Slider = ({ label, value, setValue, min, max, unit }) => (
    <View style={styles.sliderContainer}>
      <View style={styles.sliderHeader}>
        <Text style={styles.sliderLabel}>{label}</Text>
        <Text style={styles.sliderValue}>{value} {unit}</Text>
      </View>
      <View style={styles.sliderTrack}>
        <View
          style={[
            styles.sliderFill,
            { width: `${((value - min) / (max - min)) * 100}%` },
          ]}
        />
        <View
          style={[
            styles.sliderThumb,
            { left: `${((value - min) / (max - min)) * 100}%` },
          ]}
        />
      </View>
      <View style={styles.sliderButtons}>
        <TouchableOpacity
          style={styles.sliderButton}
          onPress={() => setValue(Math.max(min, value - 1))}
        >
          <Ionicons name="remove" size={20} color={COLORS.textTitle} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.sliderButton}
          onPress={() => setValue(Math.min(max, value + 1))}
        >
          <Ionicons name="add" size={20} color={COLORS.textTitle} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>CONTENOS SOBRE VOCÊ</Text>
        <Text style={styles.subtitle}>Seus dados físicos (última medição)</Text>
        
        {/* Progresso */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressStep, styles.progressActive]} />
          <View style={[styles.progressStep, styles.progressActive]} />
          <View style={[styles.progressStep, styles.progressActive]} />
          <View style={styles.progressStep} />
          <View style={styles.progressStep} />
          <View style={styles.progressStep} />
        </View>
        <Text style={styles.progressText}>Passo 3 de 6</Text>
      </View>

      {/* Sliders */}
      <View style={styles.slidersContainer}>
        <Slider
          label="IDADE"
          value={age}
          setValue={setAge}
          min={14}
          max={80}
          unit="anos"
        />
        
        <Slider
          label="PESO (KG)"
          value={weight}
          setValue={setWeight}
          min={40}
          max={150}
          unit="kg"
        />
        
        <Slider
          label="ALTURA (CM)"
          value={height}
          setValue={setHeight}
          min={140}
          max={210}
          unit="cm"
        />
      </View>

      {/* Botões */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.buttonSecondary} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={COLORS.textTitle} />
          <Text style={styles.buttonSecondaryText}>ANTERIOR</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonPrimary} onPress={handleNext}>
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
  slidersContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 40,
  },
  sliderContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sliderLabel: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 12,
    color: COLORS.textTitle,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sliderValue: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 24,
    color: COLORS.primary,
  },
  sliderTrack: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    position: 'relative',
    marginBottom: 16,
  },
  sliderFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  sliderThumb: {
    position: 'absolute',
    top: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    borderWidth: 3,
    borderColor: COLORS.background,
    transform: [{ translateX: -12 }],
  },
  sliderButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 20,
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
  buttonPrimaryText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 14,
    color: COLORS.background,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
