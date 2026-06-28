// app/onboarding/objetivo.js
// Tela 1 - Objetivo Principal - NOVAIX FITNESS

import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/constants/colors';
import { SPACING } from '../../src/constants/spacing';
import { Card, Button, ProgressBar } from '../../src/components';
import { useAuth } from '../../src/context/AuthContext';
import { layout, typography } from '../../src/styles';
import { useStaggeredEntry } from '../../src/utils/animations';

const goals = [
  { id: 'weight_loss', label: 'Emagrecimento', icon: 'flame', description: 'Queima de gordura e perda de peso', color: COLORS.secondary },
  { id: 'muscle_gain', label: 'Ganho de Massa', icon: 'barbell', description: 'Hipertrofia e definição muscular', color: COLORS.primary },
  { id: 'fitness', label: 'Condicionamento', icon: 'heart', description: 'Saúde, disposição e qualidade de vida', color: COLORS.success },
];

export default function GoalScreen() {
  const router = useRouter();
  const { saveOnboarding, updateProfile } = useAuth();
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [anim0, anim1, anim2, anim3] = [0, 1, 2, 3].map(useStaggeredEntry);

  const handleNext = async () => {
    if (!selectedGoal) return;
    await saveOnboarding({ goal: selectedGoal });
    await updateProfile({ current_step: 'onboarding' });
    router.push('/onboarding/dados-fisicos');
  };

  return (
    <View style={layout.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View style={[styles.header, { opacity: anim0.opacity, transform: [{ translateY: anim0.translateY }] }]}>
          <Text style={typography.h3}>O QUE VOCÊ BUSCA HOJE?</Text>
          <Text style={typography.bodyMuted}>Selecione seu objetivo principal</Text>
          <View style={styles.progressContainer}><ProgressBar value={1} max={6} /></View>
          <Text style={typography.caption}>Passo 1 de 6</Text>
        </Animated.View>

        <View style={styles.cardsContainer}>
          {goals.map((goal, index) => {
            const anim = [anim1, anim2, anim3][index];
            return (
              <Animated.View key={goal.id} style={{ opacity: anim?.opacity, transform: [{ translateY: anim?.translateY }] }}>
                <Card variant={selectedGoal === goal.id ? 'active' : 'surface'} onPress={() => setSelectedGoal(goal.id)} style={styles.goalCard}>
                  <View style={styles.goalContent}>
                    <View style={[styles.iconContainer, { backgroundColor: goal.color + '20' }]}>
                      <Ionicons name={goal.icon} size={32} color={goal.color} />
                    </View>
                    <View style={styles.goalInfo}>
                      <Text style={typography.h5}>{goal.label}</Text>
                      <Text style={typography.caption}>{goal.description}</Text>
                    </View>
                    {selectedGoal === goal.id && <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />}
                  </View>
                </Card>
              </Animated.View>
            );
          })}
        </View>
      </ScrollView>

      <View style={layout.footer}>
        <Button title="PRÓXIMO" icon="arrow-forward" onPress={handleNext} disabled={!selectedGoal} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1, padding: SPACING.xl, paddingTop: layout.scroll.paddingTop },
  header: { alignItems: 'center', marginBottom: 30 },
  progressContainer: { width: '100%', marginTop: SPACING.xxl },
  cardsContainer: { gap: SPACING.md },
  goalCard: { marginBottom: SPACING.sm },
  goalContent: { flexDirection: 'row', alignItems: 'center' },
  iconContainer: { width: 56, height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.lg },
  goalInfo: { flex: 1 },
});
