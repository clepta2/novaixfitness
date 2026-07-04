
// app/workout/preCheckin.js
// Check-in pré-treino

import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { formatUserError } from '../../src/middleware';

import { ErrorBoundary } from '../../src/components';
import { COLORS } from '../../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../../src/constants/spacing';
import { MOOD_OPTIONS, MOOD_ADJUSTMENTS } from '../../src/data/injuryDetails';

const SUPPORT_OPTIONS = [
  { id: 'music', label: 'Música motivacional', icon: 'musical-notes' },
  { id: 'rest', label: 'Mais descanso entre séries', icon: 'timer' },
  { id: 'lighter', label: 'Carga mais leve', icon: 'barbell' },
  { id: 'stretch', label: 'Alongamento extra', icon: 'body' },
  { id: 'talk', label: 'Conversar com o coach', icon: 'chatbubble' },
];

export default function PreCheckinScreen() {
  
  const router = useRouter();
  const { saveOnboarding, onboarding } = useAuth();
  const [mood, setMood] = useState(null);
  const [notes, setNotes] = useState('');
  const [showSupport, setShowSupport] = useState(false);
  const [selectedSupport, setSelectedSupport] = useState(null);

  const handleFinish = async () => {
    try {
      await saveOnboarding({ ...onboarding, preCheckin: { mood, notes, support: selectedSupport, timestamp: new Date().toISOString() } });
      router.replace('/(tabs)/home');
    } catch (error) {
      Alert.alert('Erro', formatUserError(error));
    }
  };

  const adjustment = mood ? MOOD_ADJUSTMENTS[mood] : null;

  return (
    <ErrorBoundary screenName="PreCheckin">
    <View style={styles.screen}>
      <Text style={styles.title}>COMO ESTÁ SEU DIA?</Text>
      <Text style={styles.subtitle}>Isso ajuda o coach a ajustar seu treino</Text>

      <View style={styles.moodGrid}>
        {MOOD_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[styles.moodCard, mood === option.id && styles.moodCardActive]}
            accessibilityLabel={`Humor: ${option.label}`}
            accessibilityRole="button"
            onPress={() => { setMood(option.id); setShowSupport(option.id === 'bad' || option.id === 'terrible'); }}
          >
            <Text style={styles.moodEmoji}>{option.emoji}</Text>
            <Text style={[styles.moodLabel, mood === option.id && styles.moodLabelActive]}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {adjustment && (
        <View style={styles.adjustmentBox}>
          <Ionicons name="bulb" size={16} color={COLORS.primary} />
          <Text style={styles.adjustmentText}>{adjustment.message}</Text>
        </View>
      )}

      {showSupport && (
        <View style={styles.supportSection}>
          <Text style={styles.supportTitle}>O QUE PODERIA AJUDAR?</Text>
          <View style={styles.supportGrid}>
            {SUPPORT_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[styles.supportCard, selectedSupport === option.id && styles.supportCardActive]}
                accessibilityLabel={option.label}
                accessibilityRole="button"
                onPress={() => setSelectedSupport(option.id)}
              >
                <Ionicons name={option.icon} size={20} color={selectedSupport === option.id ? COLORS.primary : COLORS.textMuted} />
                <Text style={[styles.supportLabel, selectedSupport === option.id && styles.supportLabelActive]}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <View style={styles.notesSection}>
        <Text style={styles.notesLabel}>ALGUMA NOVIDADE? (opcional)</Text>
        <TextInput
          style={styles.notesInput}
          multiline
          placeholder="Ex: Dormi mal, estresse no trabalho..."
          placeholderTextColor={COLORS.textMuted}
          value={notes}
          onChangeText={setNotes}
        />
      </View>

      <TouchableOpacity style={styles.button} accessibilityLabel="Começar treino" accessibilityRole="button" onPress={handleFinish}>
        <Text style={styles.buttonText}>COMEÇAR TREINO</Text>
        <Ionicons name="play" size={20} color={COLORS.background} />
      </TouchableOpacity>
    </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background, padding: SPACING.xl, paddingTop: Platform.OS === 'ios' ? 54 : 40 },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 22, color: COLORS.textTitle, marginBottom: SPACING.sm },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, marginBottom: SPACING.xl },
  moodGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.xl },
  moodCard: { alignItems: 'center', padding: SPACING.md, borderRadius: BORDER_RADIUS.md, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, width: '18%' },
  moodCardActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '10' },
  moodEmoji: { fontSize: 28 },
  moodLabel: { fontFamily: 'Inter_500Medium', fontSize: 10, color: COLORS.textMuted, marginTop: SPACING.xs },
  moodLabelActive: { color: COLORS.primary },
  adjustmentBox: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, padding: SPACING.md, backgroundColor: COLORS.primary + '10', borderRadius: BORDER_RADIUS.md, marginBottom: SPACING.xl },
  adjustmentText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.primary, flex: 1 },
  supportSection: { marginBottom: SPACING.xl },
  supportTitle: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: SPACING.md },
  supportGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  supportCard: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.full, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  supportCardActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '10' },
  supportLabel: { fontFamily: 'Inter_500Medium', fontSize: 12, color: COLORS.textTitle },
  supportLabelActive: { color: COLORS.primary },
  notesSection: { flex: 1, marginBottom: SPACING.xl },
  notesLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: SPACING.sm },
  notesInput: { flex: 1, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.md, color: COLORS.textTitle, fontFamily: 'Inter_400Regular', textAlignVertical: 'top' },
  button: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: SPACING.sm, paddingVertical: SPACING.lg, borderRadius: BORDER_RADIUS.md, backgroundColor: COLORS.primary },
  buttonText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.background },
});


