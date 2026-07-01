// app/onboarding/objetivo.tsx
// Tela 1 - Objetivo Principal com melhorias visuais - NOVAIX FITNESS

import { useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../../src/constants/spacing';
import { SHADOWS } from '../../src/constants/shadows';
import { Button, ErrorBoundary } from '../../src/components';
import { useAuth } from '../../src/context/AuthContext';
import { useResponsive } from '../../src/hooks/useResponsive';
import OnboardingLayout from '../../src/components/onboarding/OnboardingLayout';
import { useStaggeredEntry } from '../../src/utils/animations';
import { useI18n } from '../../src/i18n';

const goals = [
  { id: 'weight_loss', icon: 'flame', color: COLORS.secondary, emoji: '🔥' },
  { id: 'muscle_gain', icon: 'barbell', color: COLORS.primary, emoji: '💪' },
  { id: 'fitness', icon: 'heart', color: COLORS.success, emoji: '❤️' },
  { id: 'flexibility', icon: 'body', color: COLORS.cyan, emoji: '🧘' },
];

export default function GoalScreen() {
  const router = useRouter();
  const { saveOnboarding, updateProfile } = useAuth();
  const { t } = useI18n();
  const { isSmall } = useResponsive();
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [anim0, anim1, anim2, anim3, anim4] = [0, 1, 2, 3, 4].map(useStaggeredEntry);

  const handleNext = async () => {
    if (!selectedGoal) return;
    await saveOnboarding({ goal: selectedGoal });
    await updateProfile({ current_step: 'onboarding' });
    router.push('/onboarding/dados-fisicos');
  };

  return (
    <ErrorBoundary screenName="Objetivo">
      <OnboardingLayout
        stepNumber={1}
        totalSteps={3}
        title={t('onboarding.goalTitle')}
        subtitle={t('onboarding.goalSubtitle')}
        icon="target"
        iconColor={COLORS.primary}
      >
        <View style={styles.cardsContainer}>
          {goals.map((goal, index) => {
            const anim = [anim0, anim1, anim2, anim3][index];
            const isSelected = selectedGoal === goal.id;
            return (
              <Animated.View
                key={goal.id}
                style={{
                  opacity: anim?.opacity,
                  transform: [{ translateY: anim?.translateY }],
                }}
              >
                <TouchableOpacity
                  style={[
                    styles.goalCard,
                    isSelected && styles.goalCardActive,
                    isSelected && { borderColor: goal.color, shadowColor: goal.color },
                  ]}
                  onPress={() => setSelectedGoal(goal.id)}
                  activeOpacity={0.85}
                >
                  <View style={[styles.iconWrap, { backgroundColor: goal.color + (isSelected ? '25' : '12') }]}>
                    <Ionicons name={goal.icon as any} size={28} color={goal.color} />
                  </View>
                  <View style={styles.goalInfo}>
                    <Text style={[styles.goalLabel, isSelected && { color: COLORS.primary }]}>
                      {t(`onboarding.goalOptions.${goal.id}`)}
                    </Text>
                    <Text style={styles.goalDesc}>
                      {t(`onboarding.goalOptions.${goal.id}_desc`)}
                    </Text>
                  </View>
                  <View style={[styles.radio, isSelected && styles.radioActive]}>
                    {isSelected && (
                      <Animated.View style={styles.radioDot} />
                    )}
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        <View style={styles.btnWrap}>
          <Button
            title={t('onboarding.goalNext')}
            icon="arrow-forward"
            iconPosition="right"
            onPress={handleNext}
            disabled={!selectedGoal}
            size={isSmall ? 'md' : 'lg'}
            style={{ width: '100%' }}
          />
        </View>
      </OnboardingLayout>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  cardsContainer: { gap: SPACING.sm, marginBottom: SPACING.xxl },
  goalCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
    ...SHADOWS.sm,
  },
  goalCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '06',
    ...SHADOWS.md,
  },
  iconWrap: {
    width: 54,
    height: 54,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  goalInfo: { flex: 1 },
  goalLabel: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
    color: COLORS.textTitle,
    marginBottom: 2,
  },
  goalDesc: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 18,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  radioActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '15',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  btnWrap: { marginTop: SPACING.md },
});
