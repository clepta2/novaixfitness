// src/components/ui/OnboardingFooter.tsx
// Rodape das telas de onboarding - visual premium

import { View, StyleSheet, Platform } from 'react-native';
import { Button } from './Button';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';

interface OnboardingFooterProps {
  onBack: () => void;
  onNext: () => void;
  canProceed?: boolean;
  nextLabel?: string;
  backLabel?: string;
  loading?: boolean;
}

export function OnboardingFooter({
  onBack,
  onNext,
  canProceed = true,
  nextLabel = 'PROXIMO',
  backLabel = 'ANTERIOR',
  loading = false,
}: OnboardingFooterProps) {
  return (
    <View style={styles.footer}>
      <View style={styles.backWrap}>
        <Button title={backLabel} variant="secondary" icon="arrow-back" iconPosition="left" onPress={onBack} size="md" />
      </View>
      <View style={styles.nextWrap}>
        <Button title={nextLabel} icon={loading ? undefined : 'arrow-forward'} iconPosition="right" onPress={onNext} disabled={!canProceed} loading={loading} size="md" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    gap: SPACING.md,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    paddingBottom: Platform.OS === 'ios' ? 34 : SPACING.xl,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  backWrap: { width: 120 },
  nextWrap: { flex: 1 },
});
