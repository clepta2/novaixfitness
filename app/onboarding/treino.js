// app/onboarding/treino.js
// Tela de tipo de treino - COM MIDDLEWARES

import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../../src/constants/spacing';
import { WORKOUT_TYPES } from '../../src/data/workoutType';
import { useAuth } from '../../src/context/AuthContext';
import { sanitizeObject } from '../../src/middleware/validation';
import { formatUserError } from '../../src/middleware/errorHandler';

const TIME_OPTIONS = [
  { id: 30, label: 'Até 30 min' },
  { id: 45, label: '30-45 min' },
  { id: 60, label: '45-60 min' },
  { id: 90, label: 'Mais de 1h' },
];

export default function TreinoScreen() {
  const router = useRouter();
  const { saveOnboarding, onboarding } = useAuth();
  const [selectedType, setSelectedType] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const handleNext = async () => {
    if (!selectedType) return;
    try {
      const workoutData = sanitizeObject({ workoutType: selectedType, dailyTime: selectedTime, currentStep: 'health' });
      await saveOnboarding({ ...onboarding, ...workoutData });
      router.replace('/onboarding');
    } catch (error) {
      Alert.alert('Erro', formatUserError(error));
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>COMO VOCÊ QUER TREINAR?</Text>
      <Text style={styles.subtitle}>Escolha o estilo que mais te agrada</Text>
      
      <View style={styles.typesGrid}>
        {WORKOUT_TYPES.map((type) => (
          <TouchableOpacity
            key={type.id}
            style={[styles.typeCard, selectedType === type.id && styles.typeCardActive]}
            onPress={() => setSelectedType(type.id)}
          >
            <View style={[styles.iconWrap, { backgroundColor: type.color + '20' }]}>
              <Ionicons name={type.icon} size={40} color={type.color} />
            </View>
            <Text style={[styles.typeLabel, selectedType === type.id && styles.typeLabelActive]}>
              {type.label}
            </Text>
            <Text style={styles.typeDescription}>{type.description}</Text>
            {selectedType === type.id && (
              <View style={styles.selectedBadge}>
                <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {selectedType && (
        <>
          <Text style={styles.timeLabel}>Quanto tempo você costuma treinar?</Text>
          <View style={styles.timeRow}>
            {TIME_OPTIONS.map((time) => (
              <TouchableOpacity
                key={time.id}
                style={[styles.timePill, selectedTime === time.id && styles.timePillActive]}
                onPress={() => setSelectedTime(time.id)}
              >
                <Text style={[styles.timePillText, selectedTime === time.id && styles.timePillTextActive]}>
                  {time.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      <TouchableOpacity
        style={[styles.button, !selectedType && styles.buttonDisabled]}
        onPress={handleNext}
        disabled={!selectedType}
      >
        <Text style={styles.buttonText}>CONTINUAR</Text>
        <Ionicons name="arrow-forward" size={20} color={COLORS.background} />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.xl, paddingTop: Platform.OS === 'ios' ? 54 : 40 },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 22, color: COLORS.textTitle, marginBottom: SPACING.sm },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, marginBottom: SPACING.xl },
  typesGrid: { gap: SPACING.md },
  typeCard: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, padding: SPACING.lg, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, borderWidth: 2, borderColor: COLORS.border },
  typeCardActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '05' },
  iconWrap: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  typeLabel: { flex: 1, fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle },
  typeLabelActive: { color: COLORS.primary },
  typeDescription: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted },
  selectedBadge: { position: 'absolute', top: SPACING.md, right: SPACING.md },
  timeLabel: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textMuted, marginTop: SPACING.xl, marginBottom: SPACING.md },
  timeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  timePill: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.full, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  timePillActive: { backgroundColor: COLORS.primary + '15', borderColor: COLORS.primary },
  timePillText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: COLORS.textTitle },
  timePillTextActive: { color: COLORS.primary },
  button: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: SPACING.sm, paddingVertical: SPACING.lg, borderRadius: BORDER_RADIUS.md, backgroundColor: COLORS.primary, marginTop: SPACING.xl },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.background },
});
