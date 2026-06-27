// app/onboarding/experiencia.js
// Tela 6 - Nível de Experiência - NOVAIX FITNESS

import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/constants/colors';
import { SPACING } from '../../src/constants/spacing';
import { Card, Button, Badge, ProgressBar } from '../../src/components';
import { useAuth } from '../../src/context/AuthContext';
import { layout, typography } from '../../src/styles';

const levels = [
  { id: 'beginner', label: 'Iniciante', icon: 'leaf', description: 'Nunca treinei ou estou parado há muito tempo', color: '#00E676', characteristics: ['Execução básica', 'Descanso longo', 'Exercícios simples'] },
  { id: 'intermediate', label: 'Intermediário', icon: 'flash', description: 'Treino de vez em quando', color: '#FFD600', characteristics: ['Execução correta', 'Descanso moderado', 'Variação de exercícios'] },
  { id: 'advanced', label: 'Avançado', icon: 'flame', description: 'Já treino pesado constantemente', color: '#FF6B35', characteristics: ['Execução perfeita', 'Descanso curto', 'Exercícios complexos'] },
];

export default function ExperienceScreen() {
  const router = useRouter();
  const { saveOnboarding, onboarding } = useAuth();
  const [selectedLevel, setSelectedLevel] = useState(null);

  const handleFinish = async () => {
    if (!selectedLevel) return;
    await saveOnboarding({ ...onboarding, level: selectedLevel });
    router.push('/onboarding/processando');
  };

  return (
    <View style={layout.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={typography.h3}>QUAL SEU NÍVEL ATUAL?</Text>
          <Text style={typography.bodyMuted}>Isso define a intensidade dos seus treinos</Text>
          <View style={styles.progressContainer}><ProgressBar value={6} max={6} /></View>
          <Text style={typography.caption}>Passo 6 de 6</Text>
        </View>

        <View style={styles.cardsContainer}>
          {levels.map((level) => (
            <Card key={level.id} variant={selectedLevel === level.id ? 'active' : 'surface'} onPress={() => setSelectedLevel(level.id)} style={styles.levelCard}>
              <View style={styles.levelContent}>
                <View style={[styles.iconContainer, { backgroundColor: level.color + '20' }]}>
                  <Ionicons name={level.icon} size={32} color={level.color} />
                </View>
                <View style={styles.levelInfo}>
                  <Text style={typography.h4}>{level.label}</Text>
                  <Text style={typography.bodyMuted}>{level.description}</Text>
                  <View style={styles.characteristics}>
                    {level.characteristics.map((char, i) => <Badge key={i} value={char} variant="default" size="sm" />)}
                  </View>
                </View>
                {selectedLevel === level.id && <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />}
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>

      <View style={layout.footer}>
        <Button title="ANTERIOR" variant="secondary" icon="arrow-back" onPress={() => router.back()} />
        <Button title="FINALIZAR" icon="checkmark" onPress={handleFinish} disabled={!selectedLevel} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1, padding: SPACING.xl, paddingTop: layout.scroll.paddingTop },
  header: { alignItems: 'center', marginBottom: 30 },
  progressContainer: { width: '100%', marginTop: SPACING.xxl },
  cardsContainer: { gap: SPACING.lg },
  levelCard: { padding: SPACING.xl },
  levelContent: { flexDirection: 'row', alignItems: 'flex-start' },
  iconContainer: { width: 56, height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.lg },
  levelInfo: { flex: 1 },
  characteristics: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginTop: SPACING.md },
});
