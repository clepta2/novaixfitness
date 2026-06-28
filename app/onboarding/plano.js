// app/onboarding/plano.js
// Tela onde o usuário decide como quer treinar - COMPLETO

import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../../src/constants/spacing';
import { PLAN_TYPES, CARDIO_OPTIONS, YOGA_STYLES, ACTIVE_REST_ACTIVITIES, WEEKLY_PLAN_TEMPLATES } from '../../src/data/workoutPlanOptions';
import { useAuth } from '../../src/context/AuthContext';

export default function PlanoScreen() {
  const router = useRouter();
  const { saveOnboarding, onboarding } = useAuth();
  const [step, setStep] = useState(1); // 1=tipo, 2=subtipo, 3=dias, 4=descanso
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedSubtype, setSelectedSubtype] = useState(null);
  const [selectedDays, setSelectedDays] = useState(null);
  const [selectedRestActivities, setSelectedRestActivities] = useState([]);

  const currentPlan = PLAN_TYPES.find(p => p.id === selectedPlan);

  const handleNext = async () => {
    if (step === 1 && selectedPlan) {
      setStep(2);
    } else if (step === 2 && selectedSubtype) {
      setStep(3);
    } else if (step === 3 && selectedDays) {
      setStep(4);
    } else if (step === 4) {
      const planData = {
        workoutType: selectedPlan,
        workoutSubtype: selectedSubtype,
        daysPerWeek: selectedDays,
        restActivities: selectedRestActivities,
      };
      await saveOnboarding({ ...onboarding, ...planData });
      router.push('/onboarding/resumo');
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const toggleRestActivity = (activityId) => {
    setSelectedRestActivities(prev =>
      prev.includes(activityId)
        ? prev.filter(id => id !== activityId)
        : [...prev, activityId]
    );
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scroll}>
      {/* Progresso */}
      <View style={styles.progressBar}>
        {[1, 2, 3, 4].map((s) => (
          <View key={s} style={[styles.progressDot, s <= step && styles.progressDotActive]} />
        ))}
      </View>

      {/* Passo 1: Tipo de Treino */}
      {step === 1 && (
        <>
          <Text style={styles.title}>QUE TIPO DE TREINO VOCÊ QUER?</Text>
          <Text style={styles.subtitle}>Escolha o que mais te agrada</Text>
          <View style={styles.planGrid}>
            {PLAN_TYPES.map((plan) => (
              <TouchableOpacity
                key={plan.id}
                style={[styles.planCard, selectedPlan === plan.id && styles.planCardActive]}
                onPress={() => setSelectedPlan(plan.id)}
              >
                <Ionicons name={plan.icon} size={32} color={selectedPlan === plan.id ? COLORS.primary : COLORS.textMuted} />
                <Text style={[styles.planLabel, selectedPlan === plan.id && styles.planLabelActive]}>
                  {plan.label}
                </Text>
                <Text style={styles.planDescription}>{plan.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      {/* Passo 2: Subtipo */}
      {step === 2 && currentPlan && (
        <>
          <Text style={styles.title}>QUAL ESTILO DE {currentPlan.label.toUpperCase()}?</Text>
          <Text style={styles.subtitle}>Escolha o foco do seu treino</Text>
          <View style={styles.subtypeGrid}>
            {currentPlan.subcategories.map((sub) => (
              <TouchableOpacity
                key={sub.id}
                style={[styles.subtypeCard, selectedSubtype === sub.id && styles.subtypeCardActive]}
                onPress={() => setSelectedSubtype(sub.id)}
              >
                <Text style={[styles.subtypeLabel, selectedSubtype === sub.id && styles.subtypeLabelActive]}>
                  {sub.label}
                </Text>
                <Text style={styles.subtypeDescription}>{sub.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          {/* Equipamentos necessários */}
          <View style={styles.equipmentBox}>
            <Text style={styles.equipmentTitle}>EQUIPAMENTOS:</Text>
            <Text style={styles.equipmentList}>{currentPlan.equipment.join(', ')}</Text>
          </View>
        </>
      )}

      {/* Passo 3: Dias por Semana */}
      {step === 3 && (
        <>
          <Text style={styles.title}>QUANTOS DIAS POR SEMANA?</Text>
          <Text style={styles.subtitle}>Escolha a frequência ideal pra você</Text>
          <View style={styles.daysGrid}>
            {currentPlan?.daysPerWeek.map((days) => (
              <TouchableOpacity
                key={days}
                style={[styles.dayCard, selectedDays === days && styles.dayCardActive]}
                onPress={() => setSelectedDays(days)}
              >
                <Text style={[styles.dayNumber, selectedDays === days && styles.dayNumberActive]}>
                  {days}
                </Text>
                <Text style={[styles.dayLabel, selectedDays === days && styles.dayLabelActive]}>
                  dias
                </Text>
                <Text style={styles.dayDescription}>
                  {days === 3 ? 'Bom equilíbrio' : days === 4 ? 'Ideal' : 'Intenso'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          {/* Preview do plano */}
          {selectedDays && (
            <View style={styles.previewBox}>
              <Text style={styles.previewTitle}>COMO FICA SUA SEMANA:</Text>
              {WEEKLY_PLAN_TEMPLATES[selectedDays + '_days']?.template.map((day, i) => (
                <View key={i} style={styles.previewRow}>
                  <Text style={styles.previewDay}>{day.day}</Text>
                  <View style={[styles.previewBadge, day.type === 'workout' ? styles.badgeWorkout : styles.badgeRest]}>
                    <Text style={[styles.previewBadgeText, day.type === 'workout' ? styles.badgeWorkoutText : styles.badgeRestText]}>
                      {day.label}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </>
      )}

      {/* Passo 4: Descanso Ativo */}
      {step === 4 && (
        <>
          <Text style={styles.title}>O QUE FAZER NOS DIAS DE DESCANSO?</Text>
          <Text style={styles.subtitle}>Atividades leves para manter o corpo em movimento</Text>
          <View style={styles.restGrid}>
            {ACTIVE_REST_ACTIVITIES.map((activity) => (
              <TouchableOpacity
                key={activity.id}
                style={[
                  styles.restCard,
                  selectedRestActivities.includes(activity.id) && styles.restCardActive
                ]}
                onPress={() => toggleRestActivity(activity.id)}
              >
                <Ionicons name={activity.icon} size={24} color={selectedRestActivities.includes(activity.id) ? COLORS.primary : COLORS.textMuted} />
                <Text style={[
                  styles.restLabel,
                  selectedRestActivities.includes(activity.id) && styles.restLabelActive
                ]}>
                  {activity.label}
                </Text>
                <Text style={styles.restDuration}>{activity.duration}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      {/* Botões */}
      <View style={styles.buttonRow}>
        {step > 1 && (
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={20} color={COLORS.textMuted} />
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.nextButton, !canProceed() && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!canProceed()}
        >
          <Text style={styles.nextButtonText}>
            {step === 4 ? 'FINALIZAR' : 'PRÓXIMO'}
          </Text>
          {step < 4 && <Ionicons name="arrow-forward" size={20} color={COLORS.background} />}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  function canProceed() {
    if (step === 1) return !!selectedPlan;
    if (step === 2) return !!selectedSubtype;
    if (step === 3) return !!selectedDays;
    if (step === 4) return true;
    return false;
  }
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.xl, paddingTop: Platform.OS === 'ios' ? 54 : 40 },
  progressBar: { flexDirection: 'row', justifyContent: 'center', gap: SPACING.sm, marginBottom: SPACING.xl },
  progressDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.surface },
  progressDotActive: { backgroundColor: COLORS.primary },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 20, color: COLORS.textTitle, marginBottom: SPACING.sm },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, marginBottom: SPACING.xl },
  planGrid: { gap: SPACING.md },
  planCard: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, padding: SPACING.lg, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border },
  planCardActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '10' },
  planLabel: { flex: 1, fontFamily: 'Montserrat_600SemiBold', fontSize: 16, color: COLORS.textTitle },
  planLabelActive: { color: COLORS.primary },
  planDescription: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted },
  subtypeGrid: { gap: SPACING.md },
  subtypeCard: { padding: SPACING.lg, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border },
  subtypeCardActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '10' },
  subtypeLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 16, color: COLORS.textTitle },
  subtypeLabelActive: { color: COLORS.primary },
  subtypeDescription: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted, marginTop: SPACING.xs },
  equipmentBox: { marginTop: SPACING.xl, padding: SPACING.lg, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md },
  equipmentTitle: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 1.2 },
  equipmentList: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textTitle, marginTop: SPACING.sm },
  daysGrid: { flexDirection: 'row', gap: SPACING.md },
  dayCard: { flex: 1, padding: SPACING.lg, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center' },
  dayCardActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '10' },
  dayNumber: { fontFamily: 'Montserrat_700Bold', fontSize: 32, color: COLORS.textTitle },
  dayNumberActive: { color: COLORS.primary },
  dayLabel: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted },
  dayLabelActive: { color: COLORS.primary },
  dayDescription: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted, marginTop: SPACING.xs },
  previewBox: { marginTop: SPACING.xl, padding: SPACING.lg, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md },
  previewTitle: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: SPACING.md },
  previewRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: SPACING.sm },
  previewDay: { fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textTitle },
  previewBadge: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: BORDER_RADIUS.full },
  badgeWorkout: { backgroundColor: COLORS.primary + '20' },
  badgeRest: { backgroundColor: COLORS.surface },
  previewBadgeText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11 },
  badgeWorkoutText: { color: COLORS.primary },
  badgeRestText: { color: COLORS.textMuted },
  restGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  restCard: { width: '30%', padding: SPACING.md, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center' },
  restCardActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '10' },
  restLabel: { fontFamily: 'Inter_500Medium', fontSize: 12, color: COLORS.textTitle, marginTop: SPACING.sm, textAlign: 'center' },
  restLabelActive: { color: COLORS.primary },
  restDuration: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted, marginTop: SPACING.xs },
  buttonRow: { flexDirection: 'row', gap: SPACING.md, marginTop: SPACING.xl },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, paddingVertical: SPACING.lg, paddingHorizontal: SPACING.xl, borderRadius: BORDER_RADIUS.md, backgroundColor: COLORS.surface },
  backButtonText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: COLORS.textMuted },
  nextButton: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: SPACING.sm, paddingVertical: SPACING.lg, borderRadius: BORDER_RADIUS.md, backgroundColor: COLORS.primary },
  nextButtonDisabled: { opacity: 0.5 },
  nextButtonText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.background },
});
