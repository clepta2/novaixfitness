// app/onboarding/genero.js
// Tela 2 - Gênero - NOVAIX FITNESS

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

const genders = [
  {
    id: 'male',
    label: 'Masculino',
    icon: 'male',
    color: '#6366F1',
  },
  {
    id: 'female',
    label: 'Feminino',
    icon: 'female',
    color: '#EC4899',
  },
];

export default function GenderScreen() {
  const router = useRouter();
  const [selectedGender, setSelectedGender] = useState(null);

  const handleNext = () => {
    if (!selectedGender) return;
    // Salvar gênero e ir para próxima tela
    router.push('/onboarding/dados-fisicos');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>QUAL SEU GÊNERO?</Text>
        <Text style={styles.subtitle}>Isso ajuda a personalizar seus treinos</Text>
        
        {/* Progresso */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressStep, styles.progressActive]} />
          <View style={[styles.progressStep, styles.progressActive]} />
          <View style={styles.progressStep} />
          <View style={styles.progressStep} />
          <View style={styles.progressStep} />
          <View style={styles.progressStep} />
        </View>
        <Text style={styles.progressText}>Passo 2 de 6</Text>
      </View>

      {/* Cards de Gênero */}
      <View style={styles.cardsContainer}>
        {genders.map((gender) => (
          <TouchableOpacity
            key={gender.id}
            style={[
              styles.genderCard,
              selectedGender === gender.id && styles.genderCardSelected,
            ]}
            onPress={() => setSelectedGender(gender.id)}
          >
            <View style={[styles.iconContainer, { backgroundColor: gender.color + '20' }]}>
              <Ionicons name={gender.icon} size={48} color={gender.color} />
            </View>
            <Text style={styles.genderLabel}>{gender.label}</Text>
            {selectedGender === gender.id && (
              <View style={styles.checkmark}>
                <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Botões */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.buttonSecondary} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={COLORS.textTitle} />
          <Text style={styles.buttonSecondaryText}>ANTERIOR</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.buttonPrimary, !selectedGender && styles.buttonDisabled]}
          onPress={handleNext}
          disabled={!selectedGender}
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
    padding: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
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
  cardsContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 20,
  },
  genderCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.border,
    padding: 30,
    alignItems: 'center',
  },
  genderCardSelected: {
    borderColor: COLORS.primary,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  genderLabel: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 18,
    color: COLORS.textTitle,
  },
  checkmark: {
    position: 'absolute',
    top: 16,
    right: 16,
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
