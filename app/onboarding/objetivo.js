// app/onboarding/objetivo.js
// Tela 1 - Objetivo Principal - NOVAIX FITNESS

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

const goals = [
  {
    id: 'weight_loss',
    label: 'Emagrecimento',
    icon: 'flame',
    description: 'Queima de gordura e perda de peso',
    color: '#FF6B35',
  },
  {
    id: 'muscle_gain',
    label: 'Ganho de Massa',
    icon: 'barbell',
    description: 'Hipertrofia e definição muscular',
    color: '#CCFF00',
  },
  {
    id: 'fitness',
    label: 'Condicionamento',
    icon: 'heart',
    description: 'Saúde, disposição e qualidade de vida',
    color: '#00E676',
  },
];

export default function GoalScreen() {
  const router = useRouter();
  const [selectedGoal, setSelectedGoal] = useState(null);

  const handleNext = () => {
    if (!selectedGoal) return;
    // Salvar objetivo e ir para próxima tela
    router.push('/onboarding/genero');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>O QUE VOCÊ BUSCA HOJE?</Text>
          <Text style={styles.subtitle}>Selecione seu objetivo principal</Text>
          
          {/* Progresso */}
          <View style={styles.progressContainer}>
            <View style={[styles.progressStep, styles.progressActive]} />
            <View style={styles.progressStep} />
            <View style={styles.progressStep} />
            <View style={styles.progressStep} />
            <View style={styles.progressStep} />
            <View style={styles.progressStep} />
          </View>
          <Text style={styles.progressText}>Passo 1 de 6</Text>
        </View>

        {/* Cards de Objetivo */}
        <View style={styles.cardsContainer}>
          {goals.map((goal) => (
            <TouchableOpacity
              key={goal.id}
              style={[
                styles.goalCard,
                selectedGoal === goal.id && styles.goalCardSelected,
              ]}
              onPress={() => setSelectedGoal(goal.id)}
            >
              <View style={[styles.iconContainer, { backgroundColor: goal.color + '20' }]}>
                <Ionicons name={goal.icon} size={32} color={goal.color} />
              </View>
              <Text style={styles.goalLabel}>{goal.label}</Text>
              <Text style={styles.goalDescription}>{goal.description}</Text>
              {selectedGoal === goal.id && (
                <View style={styles.checkmark}>
                  <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Botão Próximo */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.buttonPrimary, !selectedGoal && styles.buttonDisabled]}
          onPress={handleNext}
          disabled={!selectedGoal}
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
  cardsContainer: {
    gap: 16,
  },
  goalCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.border,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surface,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  goalLabel: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
    color: COLORS.textTitle,
    flex: 1,
  },
  goalDescription: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.textMuted,
    position: 'absolute',
    bottom: 16,
    left: 92,
  },
  checkmark: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
  },
  buttonPrimary: {
    width: '100%',
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
