import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

export default function OnboardingNavButtons({ step, totalSteps, canProceed, onBack, onNext }) {
  const isLast = step === totalSteps;

  return (
    <View style={styles.row}>
      {step > 1 && (
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color={COLORS.textMuted} />
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={[styles.nextBtn, !canProceed && styles.nextBtnDisabled]}
        onPress={onNext}
        disabled={!canProceed}
      >
        <Text style={styles.nextText}>{isLast ? 'FINALIZAR' : 'PRÓXIMO'}</Text>
        {!isLast && <Ionicons name="arrow-forward" size={20} color={COLORS.background} />}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: SPACING.md, marginTop: SPACING.xl },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, paddingVertical: SPACING.lg, paddingHorizontal: SPACING.xl, borderRadius: BORDER_RADIUS.md, backgroundColor: COLORS.surface },
  backText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: COLORS.textMuted },
  nextBtn: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: SPACING.sm, paddingVertical: SPACING.lg, borderRadius: BORDER_RADIUS.md, backgroundColor: COLORS.primary },
  nextBtnDisabled: { opacity: 0.5 },
  nextText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.background },
});
