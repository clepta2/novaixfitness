// app/onboarding/modelo.js
// Tela 4 - Modelo Corporal - NOVAIX FITNESS

import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/constants/colors';
import { SPACING } from '../../src/constants/spacing';
import { Card, Button, ProgressBar, OnboardingFooter } from '../../src/components';
import { useAuth } from '../../src/context/AuthContext';
import { layout, typography } from '../../src/styles';
import { useStaggeredEntry } from '../../src/utils/animations';

const models = [
  { id: 'young_boy', label: 'Jovem Menino', description: 'Adolescente magro, 14-20 anos', icon: 'person', color: COLORS.purple },
  { id: 'thin_man', label: 'Homem Magro', description: 'Adulto magro, 20+ anos', icon: 'man', color: COLORS.purple },
  { id: 'heavy_man', label: 'Homem Sobrepeso', description: 'Adulto acima do peso, 20+ anos', icon: 'man', color: COLORS.amber },
  { id: 'young_girl', label: 'Jovem Menina', description: 'Adolescente magra, 14-20 anos', icon: 'woman', color: COLORS.pink },
  { id: 'thin_woman', label: 'Mulher Magra', description: 'Adulta magra, 20+ anos', icon: 'woman', color: COLORS.pink },
  { id: 'heavy_woman', label: 'Mulher Sobrepeso', description: 'Adulta acima do peso, 20+ anos', icon: 'woman', color: COLORS.amber },
];

export default function ModelScreen() {
  const router = useRouter();
  const { saveOnboarding, onboarding, updateProfile } = useAuth();
  const [selectedModel, setSelectedModel] = useState(null);
  const [anim0, anim1, anim2, anim3, anim4, anim5, anim6, anim7] = [0, 1, 2, 3, 4, 5, 6, 7].map(useStaggeredEntry);

  const handleNext = async () => {
    if (!selectedModel) return;
    await saveOnboarding({ ...onboarding, model: selectedModel });
    await updateProfile({ current_step: 'onboarding' });
    router.push('/onboarding/disponibilidade');
  };

  const anims = [anim1, anim2, anim3, anim4, anim5, anim6];

  return (
    <View style={layout.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View style={[styles.header, { opacity: anim0.opacity, transform: [{ translateY: anim0.translateY }] }]}>
          <Text style={typography.h3}>COM QUEM VOCÊ SE IDENTIFICA?</Text>
          <Text style={typography.bodyMuted}>Escolha o modelo mais parecido com você</Text>
          <View style={styles.progressContainer}><ProgressBar value={3} max={6} /></View>
          <Text style={typography.caption}>Passo 3 de 6</Text>
        </Animated.View>

        <View style={styles.cardsContainer}>
          {models.map((model, index) => (
            <Animated.View key={model.id} style={{ opacity: anims[index]?.opacity, transform: [{ translateY: anims[index]?.translateY }] }}>
              <Card variant={selectedModel === model.id ? 'active' : 'surface'} onPress={() => setSelectedModel(model.id)} style={styles.modelCard}>
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
            </Animated.View>
          ))}
        </View>
      </ScrollView>

      <OnboardingFooter
        onBack={() => router.back()}
        onNext={handleNext}
        canProceed={!!selectedModel}
      />
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
