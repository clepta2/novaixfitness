// app/onboarding/modelo.js
// Tela 4 - Modelo Corporal - NOVAIX FITNESS

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

const models = [
  {
    id: 'young_boy',
    label: 'Jovem Menino',
    description: 'Adolescente magro, 14-20 anos',
    icon: 'person',
    color: '#6366F1',
  },
  {
    id: 'thin_man',
    label: 'Homem Magro',
    description: 'Adulto magro, 20+ anos',
    icon: 'man',
    color: '#6366F1',
  },
  {
    id: 'heavy_man',
    label: 'Homem Sobrepeso',
    description: 'Adulto acima do peso, 20+ anos',
    icon: 'man',
    color: '#F59E0B',
  },
  {
    id: 'young_girl',
    label: 'Jovem Menina',
    description: 'Adolescente magra, 14-20 anos',
    icon: 'woman',
    color: '#EC4899',
  },
  {
    id: 'thin_woman',
    label: 'Mulher Magra',
    description: 'Adulta magra, 20+ anos',
    icon: 'woman',
    color: '#EC4899',
  },
  {
    id: 'heavy_woman',
    label: 'Mulher Sobrepeso',
    description: 'Adulta acima do peso, 20+ anos',
    icon: 'woman',
    color: '#F59E0B',
  },
];

export default function ModelScreen() {
  const router = useRouter();
  const [selectedModel, setSelectedModel] = useState(null);

  const handleNext = () => {
    if (!selectedModel) return;
    // Salvar modelo e ir para próxima tela
    router.push('/onboarding/disponibilidade');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>COM QUEM VOCÊ SE IDENTIFICA?</Text>
          <Text style={styles.subtitle}>Escolha o modelo mais parecido com você</Text>
          
          {/* Progresso */}
          <View style={styles.progressContainer}>
            <View style={[styles.progressStep, styles.progressActive]} />
            <View style={[styles.progressStep, styles.progressActive]} />
            <View style={[styles.progressStep, styles.progressActive]} />
            <View style={[styles.progressStep, styles.progressActive]} />
            <View style={styles.progressStep} />
            <View style={styles.progressStep} />
          </View>
          <Text style={styles.progressText}>Passo 4 de 6</Text>
        </View>

        {/* Cards de Modelo */}
        <View style={styles.cardsContainer}>
          {models.map((model) => (
            <TouchableOpacity
              key={model.id}
              style={[
                styles.modelCard,
                selectedModel === model.id && styles.modelCardSelected,
              ]}
              onPress={() => setSelectedModel(model.id)}
            >
              <View style={[styles.iconContainer, { backgroundColor: model.color + '20' }]}>
                <Ionicons name={model.icon} size={32} color={model.color} />
              </View>
              <View style={styles.modelInfo}>
                <Text style={styles.modelLabel}>{model.label}</Text>
                <Text style={styles.modelDescription}>{model.description}</Text>
              </View>
              {selectedModel === model.id && (
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
          style={[styles.buttonPrimary, !selectedModel && styles.buttonDisabled]}
          onPress={handleNext}
          disabled={!selectedModel}
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
    fontSize: 20,
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
    gap: 12,
  },
  modelCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.border,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  modelCardSelected: {
    borderColor: COLORS.primary,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  modelInfo: {
    flex: 1,
  },
  modelLabel: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 14,
    color: COLORS.textTitle,
  },
  modelDescription: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
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
