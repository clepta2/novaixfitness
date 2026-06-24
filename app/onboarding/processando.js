// app/onboarding/processando.js
// Tela de Carregamento - NOVAIX FITNESS

import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../src/constants/colors';

const steps = [
  { icon: 'analytics', label: 'ANALISANDO DADOS CORPORAIS...' },
  { icon: 'barbell', label: 'SELECIONANDO TREINOS...' },
  { icon: 'calendar', label: 'GERANDO CALENDÁRIO...' },
  { icon: 'target', label: 'PERSONALIZANDO SEU PLANO...' },
];

export default function ProcessingScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const spinValue = new Animated.Value(0);

  // Animação de rotação
  useEffect(() => {
    const spin = Animated.loop(
      Animated.sequence([
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    spin.start();
    return () => spin.stop();
  }, []);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Progresso dos passos
  useEffect(() => {
    const stepTimer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        // Após todos os passos, redirecionar
        setTimeout(() => {
          router.replace('/(tabs)/home');
        }, 1000);
        return prev;
      });
    }, 1500);
    return () => clearInterval(stepTimer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>PROCESSANDO...</Text>
        <Text style={styles.subtitle}>PREPARANDO SUA NOVA EVOLUÇÃO NO TREINO</Text>
        
        {/* Progresso */}
        <View style={styles.progressContainer}>
          {steps.map((step, index) => (
            <View
              key={index}
              style={[
                styles.progressStep,
                index <= currentStep && styles.progressActive,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Timer */}
      <Text style={styles.timer}>{formatTime(elapsedTime)}</Text>

      {/* Spinner */}
      <View style={styles.spinnerContainer}>
        <Animated.View style={[styles.spinner, { transform: [{ rotate: spin }] }]}>
          <View style={styles.spinnerRing} />
        </Animated.View>
        <View style={styles.spinnerCenter}>
          <Text style={styles.spinnerText}>N</Text>
        </View>
        <Text style={styles.spinnerLabel}>Evolução Corporal</Text>
        <Text style={styles.spinnerSubLabel}>CALCULANDO PLANO...</Text>
      </View>

      {/* Passos */}
      <View style={styles.stepsContainer}>
        {steps.map((step, index) => (
          <View
            key={index}
            style={[
              styles.stepItem,
              index <= currentStep && styles.stepItemActive,
            ]}
          >
            <Ionicons
              name={step.icon}
              size={16}
              color={index <= currentStep ? COLORS.primary : COLORS.textMuted}
            />
            <Text
              style={[
                styles.stepLabel,
                index <= currentStep && styles.stepLabelActive,
              ]}
            >
              {step.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 28,
    color: COLORS.textTitle,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  subtitle: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: COLORS.textDescription,
    textAlign: 'center',
    marginTop: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 20,
  },
  progressStep: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
  },
  progressActive: {
    backgroundColor: COLORS.primary,
  },
  timer: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
    color: COLORS.textMuted,
    marginBottom: 30,
  },
  spinnerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  spinner: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 8,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinnerRing: {
    position: 'absolute',
    width: 134,
    height: 134,
    borderRadius: 67,
    borderWidth: 4,
    borderColor: 'transparent',
    borderTopColor: COLORS.primary,
  },
  spinnerCenter: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinnerText: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 32,
    color: COLORS.primary,
  },
  spinnerLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 16,
  },
  spinnerSubLabel: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 14,
    color: COLORS.textTitle,
    marginTop: 4,
  },
  stepsContainer: {
    width: '100%',
    gap: 12,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    opacity: 0.5,
  },
  stepItemActive: {
    opacity: 1,
  },
  stepLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.textMuted,
  },
  stepLabelActive: {
    color: COLORS.primary,
  },
});
