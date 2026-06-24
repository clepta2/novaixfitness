// app/onboarding/experiencia.js
// Tela 6 - Nível de Experiência - NOVAIX FITNESS

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

const levels = [
  {
    id: 'beginner',
    label: 'Iniciante',
    icon: 'leaf',
    description: 'Nunca treinei ou estou parado há muito tempo',
    color: '#00E676',
    characteristics: ['Execução básica', 'Descanso longo', 'Exercícios simples'],
  },
  {
    id: 'intermediate',
    label: 'Intermediário',
    icon: 'flash',
    description: 'Treino de vez em quando',
    color: '#FFD600',
    characteristics: ['Execução correta', 'Descanso moderado', 'Variação de exercícios'],
  },
  {
    id: 'advanced',
    label: 'Avançado',
    icon: 'flame',
    description: 'Já treino pesado constantemente',
    color: '#FF6B35',
    characteristics: ['Execução perfeita', 'Descanso curto', 'Exercícios complexos'],
  },
];

export default function ExperienceScreen() {
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState(null);

  const handleNext = () => {
    if (!selectedLevel) return;
    // Salvar nível e ir para tela de processamento
    router.push('/onboarding/processando');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>QUAL SEU NÍVEL ATUAL?</Text>
          <Text style={styles.subtitle}>Isso define a intensidade dos seus treinos</Text>
          
          {/* Progresso */}
          <View style={styles.progressContainer}>
            <View style={[styles.progressStep, styles.progressActive]} />
            <View style={[styles.progressStep, styles.progressActive]} />
            <View style={[styles.progressStep, styles.progressActive]} />
            <View style={[styles.progressStep, styles.progressActive]} />
            <View style={[styles.progressStep, styles.progressActive]} />
            <View style={[styles.progressStep, styles.progressActive]} />
          </View>
          <Text style={styles.progressText}>Passo 6 de 6</Text>
        </View>

        {/* Cards de Nível */}
        <View style={styles.cardsContainer}>
          {levels.map((level) => (
            <TouchableOpacity
              key={level.id}
              style={[
                styles.levelCard,
                selectedLevel === level.id && styles.levelCardSelected,
              ]}
              onPress={() => setSelectedLevel(level.id)}
            >
              <View style={[styles.iconContainer, { backgroundColor: level.color + '20' }]}>
                <Ionicons name={level.icon} size={32} color={level.color} />
              </View>
              <View style={styles.levelInfo}>
                <Text style={styles.levelLabel}>{level.label}</Text>
                <Text style={styles.levelDescription}>{level.description}</Text>
                <View style={styles.characteristics}>
                  {level.characteristics.map((char, index) => (
                    <View key={index} style={styles.characteristic}>
                      <Ionicons name="checkmark" size={12} color={COLORS.primary} />
                      <Text style={styles.characteristicText}>{char}</Text>
                    </View>
                  ))}
                </View>
              </View>
              {selectedLevel === level.id && (
                <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Botões */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.buttonSecondary} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={COLORS.textTitle} />
          <Text style={styles.buttonSecondaryText}>ANTERIOR</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.buttonPrimary, !selectedLevel && styles.buttonDisabled]}
          onPress={handleNext}
          disabled={!selectedLevel}
        >
          <Text style={styles.buttonPrimaryText}>FINALIZAR</Text>
          <Ionicons name="checkmark" size={20} color={COLORS.background} />
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
  cardsContainer: {
    gap: 16,
  },
  levelCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.border,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  levelCardSelected: {
    borderColor: COLORS.primary,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  levelInfo: {
    flex: 1,
  },
  levelLabel: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 18,
    color: COLORS.textTitle,
  },
  levelDescription: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textDescription,
    marginTop: 4,
  },
  characteristics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  characteristic: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  characteristicText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: COLORS.textMuted,
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
