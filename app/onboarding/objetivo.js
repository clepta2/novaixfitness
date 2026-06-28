// app/onboarding/objetivo.js
// Tela 1 - Objetivo Principal - NOVAIX FITNESS

import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Animated, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../../src/constants/spacing';
import { Button } from '../../src/components';
import { useAuth } from '../../src/context/AuthContext';
import { layout } from '../../src/styles';
import { useStaggeredEntry } from '../../src/utils/animations';

const goals = [
  { id: 'weight_loss', label: 'Emagrecimento', icon: 'flame', description: 'Queima de gordura e perda de peso', color: COLORS.secondary },
  { id: 'muscle_gain', label: 'Ganho de Massa', icon: 'barbell', description: 'Hipertrofia e definição muscular', color: COLORS.primary },
  { id: 'fitness', label: 'Condicionamento', icon: 'heart', description: 'Saúde, disposição e qualidade de vida', color: COLORS.success },
  { id: 'flexibility', label: 'Flexibilidade', icon: 'body', description: 'Mobilidade, yoga e alongamento', color: COLORS.cyan },
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
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.header, { opacity: anim0.opacity, transform: [{ translateY: anim0.translateY }] }]}>
          <View style={styles.stepPill}>
            <View style={styles.stepDot} />
            <Text style={styles.stepPillText}>PASSO 1 DE 6</Text>
          </View>
          <Text style={styles.title}>O QUE VOCÊ{`\n`}BUSCA HOJE?</Text>
          <Text style={styles.subtitle}>Selecione seu objetivo principal</Text>
          <View style={styles.progressWrap}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: '16.6%' }]} />
            </View>
            <Text style={styles.progressLabel}>17%</Text>
          </View>
        </Animated.View>

        <View style={styles.cardsContainer}>
          {goals.map((goal, index) => {
            const anim = [anim1, anim2, anim3][index];
            const isSelected = selectedGoal === goal.id;
            return (
              <Animated.View key={goal.id} style={{ opacity: anim?.opacity, transform: [{ translateY: anim?.translateY }] }}>
                <TouchableOpacity
                  style={[styles.goalCard, isSelected && styles.goalCardActive, isSelected && { shadowColor: goal.color }]}
                  onPress={() => setSelectedGoal(goal.id)}
                  activeOpacity={0.85}
                >
                  <View style={[styles.iconContainer, { backgroundColor: goal.color + (isSelected ? '25' : '18') }]}>
                    <Ionicons name={goal.icon} size={28} color={goal.color} />
                  </View>
                  <View style={styles.goalInfo}>
                    <Text style={[styles.goalLabel, isSelected && { color: COLORS.primary }]}>{goal.label}</Text>
                    <Text style={styles.goalDesc}>{goal.description}</Text>
                  </View>
                  <View style={[styles.radio, isSelected && styles.radioActive]}>
                    {isSelected && <View style={styles.radioDot} />}
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        <View style={styles.btnWrap}>
          <Button title="PRÓXIMO" icon="arrow-forward" iconPosition="right" onPress={handleNext} disabled={!selectedGoal} size="lg" style={{ width: '100%' }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1, padding: SPACING.xl, paddingTop: Platform.OS === 'ios' ? 54 : 40, paddingBottom: SPACING.xxl },
  header: { alignItems: 'center', marginBottom: SPACING.xxl },
  stepPill: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, backgroundColor: COLORS.primary + '15', paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: BORDER_RADIUS.full, marginBottom: SPACING.lg },
  stepDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.primary },
  stepPillText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.primary, letterSpacing: 1.5 },
  title: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 28, color: COLORS.textTitle, textAlign: 'center', lineHeight: 36, marginBottom: SPACING.sm },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, textAlign: 'center', marginBottom: SPACING.xl },
  progressWrap: { width: '100%', flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  progressTrack: { flex: 1, height: 4, backgroundColor: COLORS.border, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 2 },
  progressLabel: { fontFamily: 'Inter_500Medium', fontSize: 11, color: COLORS.primary, width: 30 },
  cardsContainer: { gap: SPACING.sm, marginBottom: SPACING.xxl },
  goalCard: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, borderWidth: 2, borderColor: COLORS.border, padding: SPACING.lg, flexDirection: 'row', alignItems: 'center', gap: SPACING.lg },
  goalCardActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '06', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 5 },
  iconContainer: { width: 54, height: 54, borderRadius: 16, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  goalInfo: { flex: 1 },
  goalLabel: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle, marginBottom: 2 },
  goalDesc: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted, lineHeight: 18 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: COLORS.border, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  radioActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '15' },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.primary },
  btnWrap: { marginTop: SPACING.md },
});
