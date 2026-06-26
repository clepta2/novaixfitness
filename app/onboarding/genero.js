// app/onboarding/genero.js
// Tela 2 - Gênero - NOVAIX FITNESS

import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../src/constants/colors';
import { SPACING } from '../../src/constants/spacing';
import { Card, Button, ProgressBar } from '../../src/components';
import { useAuth } from '../../src/context/AuthContext';
import { layout, typography } from '../../src/styles';

const genders = [
  { id: 'male', label: 'Masculino', icon: 'male', color: '#6366F1' },
  { id: 'female', label: 'Feminino', icon: 'female', color: '#EC4899' },
];

export default function GenderScreen() {
  const router = useRouter();
  const { saveOnboarding, onboarding } = useAuth();
  const [selectedGender, setSelectedGender] = useState(null);

  const handleNext = async () => {
    if (!selectedGender) return;
    await saveOnboarding({ ...onboarding, gender: selectedGender });
    router.push('/onboarding/dados-fisicos');
  };

  return (
    <View style={layout.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={typography.h3}>QUAL SEU GÊNERO?</Text>
          <Text style={typography.bodyMuted}>Isso ajuda a personalizar seus treinos</Text>
          <View style={styles.progressContainer}><ProgressBar value={2} max={6} /></View>
          <Text style={typography.caption}>Passo 2 de 6</Text>
        </View>

        <View style={styles.cardsContainer}>
          {genders.map((gender) => (
            <Card key={gender.id} variant={selectedGender === gender.id ? 'active' : 'surface'} onPress={() => setSelectedGender(gender.id)} style={styles.genderCard}>
              <View style={styles.genderContent}>
                <View style={[styles.iconContainer, { backgroundColor: gender.color + '20' }]}>
                  <Ionicons name={gender.icon} size={48} color={gender.color} />
                </View>
                <Text style={typography.h4}>{gender.label}</Text>
                {selectedGender === gender.id && <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} style={styles.checkmark} />}
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>

      <View style={layout.footer}>
        <Button title="ANTERIOR" variant="secondary" icon="arrow-back" onPress={() => router.back()} />
        <Button title="PRÓXIMO" icon="arrow-forward" onPress={handleNext} disabled={!selectedGender} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1, padding: SPACING.xl, paddingTop: 60 },
  header: { alignItems: 'center', marginBottom: 40 },
  progressContainer: { width: '100%', marginTop: SPACING.xxl },
  cardsContainer: { flex: 1, justifyContent: 'center', gap: SPACING.xl },
  genderCard: { padding: SPACING.xxxl },
  genderContent: { alignItems: 'center' },
  iconContainer: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.lg },
  checkmark: { position: 'absolute', top: 0, right: 0 },
});
