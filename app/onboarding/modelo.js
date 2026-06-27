// app/onboarding/modelo.js
// Tela 4 - Modelo Corporal - NOVAIX FITNESS

import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/constants/colors';
import { SPACING } from '../../src/constants/spacing';
import { Card, Button, ProgressBar } from '../../src/components';
import { useAuth } from '../../src/context/AuthContext';
import { layout, typography } from '../../src/styles';

const models = [
  { id: 'young_boy', label: 'Jovem Menino', description: 'Adolescente magro, 14-20 anos', icon: 'person', color: '#6366F1' },
  { id: 'thin_man', label: 'Homem Magro', description: 'Adulto magro, 20+ anos', icon: 'man', color: '#6366F1' },
  { id: 'heavy_man', label: 'Homem Sobrepeso', description: 'Adulto acima do peso, 20+ anos', icon: 'man', color: '#F59E0B' },
  { id: 'young_girl', label: 'Jovem Menina', description: 'Adolescente magra, 14-20 anos', icon: 'woman', color: '#EC4899' },
  { id: 'thin_woman', label: 'Mulher Magra', description: 'Adulta magra, 20+ anos', icon: 'woman', color: '#EC4899' },
  { id: 'heavy_woman', label: 'Mulher Sobrepeso', description: 'Adulta acima do peso, 20+ anos', icon: 'woman', color: '#F59E0B' },
];

export default function ModelScreen() {
  const router = useRouter();
  const { saveOnboarding, onboarding } = useAuth();
  const [selectedModel, setSelectedModel] = useState(null);

  const handleNext = async () => {
    if (!selectedModel) return;
    await saveOnboarding({ ...onboarding, model: selectedModel });
    router.push('/onboarding/disponibilidade');
  };

  return (
    <View style={layout.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={typography.h3}>COM QUEM VOCÊ SE IDENTIFICA?</Text>
          <Text style={typography.bodyMuted}>Escolha o modelo mais parecido com você</Text>
          <View style={styles.progressContainer}><ProgressBar value={4} max={6} /></View>
          <Text style={typography.caption}>Passo 4 de 6</Text>
        </View>

        <View style={styles.cardsContainer}>
          {models.map((model) => (
            <Card key={model.id} variant={selectedModel === model.id ? 'active' : 'surface'} onPress={() => setSelectedModel(model.id)} style={styles.modelCard}>
              <View style={styles.modelContent}>
                <View style={[styles.iconContainer, { backgroundColor: model.color + '20' }]}>
                  <Ionicons name={model.icon} size={32} color={model.color} />
                </View>
                <View style={styles.modelInfo}>
                  <Text style={typography.h5}>{model.label}</Text>
                  <Text style={typography.caption}>{model.description}</Text>
                </View>
                {selectedModel === model.id && <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />}
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>

      <View style={layout.footer}>
        <Button title="ANTERIOR" variant="secondary" icon="arrow-back" onPress={() => router.back()} />
        <Button title="PRÓXIMO" icon="arrow-forward" onPress={handleNext} disabled={!selectedModel} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1, padding: SPACING.xl, paddingTop: layout.scroll.paddingTop },
  header: { alignItems: 'center', marginBottom: 30 },
  progressContainer: { width: '100%', marginTop: SPACING.xxl },
  cardsContainer: { gap: SPACING.md },
  modelCard: { padding: SPACING.lg },
  modelContent: { flexDirection: 'row', alignItems: 'center' },
  iconContainer: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md },
  modelInfo: { flex: 1 },
});
