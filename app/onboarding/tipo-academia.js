// app/onboarding/tipo-academia.js
// Tela 5b - Tipo de Academia - NOVAIX FITNESS

import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/constants/colors';
import { SPACING } from '../../src/constants/spacing';
import { Card, Button, ProgressBar } from '../../src/components';
import { useAuth } from '../../src/context/AuthContext';
import { layout, typography } from '../../src/styles';

const gymTypes = [
  { id: 'smart_fit', label: 'Smart Fit', icon: 'business', description: 'Rede low-cost' },
  { id: 'bio_ritness', label: 'Bio Ritmo', icon: 'diamond', description: 'Rede premium' },
  { id: 'bluefit', label: 'Bluefit', icon: 'fitness', description: 'Rede popular' },
  { id: 'bodytech', label: 'Bodytech', icon: 'flame', description: 'Rede premium' },
  { id: 'outro_chain', label: 'Outra rede', icon: 'layers', description: 'Franchise' },
  { id: 'individual', label: 'Individual', icon: 'home', description: 'Pequena/média' },
  { id: 'nao_tenho', label: 'Não tenho', icon: 'close-circle', description: 'Treino em casa/parque' },
];

export default function GymTypeScreen() {
  const router = useRouter();
  const { saveOnboarding, onboarding } = useAuth();
  const [selectedGym, setSelectedGym] = useState(null);

  const handleNext = async () => {
    if (!selectedGym) return;
    await saveOnboarding({ ...onboarding, gymType: selectedGym });
    router.push('/onboarding/experiencia');
  };

  return (
    <View style={layout.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={typography.h3}>QUAL TIPO DE ACADEMIA?</Text>
          <Text style={typography.bodyMuted}>Isso ajuda a personalizar seus equipamentos</Text>
          <View style={styles.progressContainer}><ProgressBar value={5.5} max={7} /></View>
          <Text style={typography.caption}>Passo 5b de 7</Text>
        </View>

        <View style={styles.cardsContainer}>
          {gymTypes.map((gym) => (
            <Card key={gym.id} variant={selectedGym === gym.id ? 'active' : 'surface'} onPress={() => setSelectedGym(gym.id)} style={styles.gymCard}>
              <View style={styles.gymContent}>
                <View style={styles.iconContainer}>
                  <Ionicons name={gym.icon} size={24} color={COLORS.primary} />
                </View>
                <View style={styles.gymInfo}>
                  <Text style={typography.h5}>{gym.label}</Text>
                  <Text style={typography.caption}>{gym.description}</Text>
                </View>
                {selectedGym === gym.id && <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />}
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>

      <View style={layout.footer}>
        <Button title="ANTERIOR" variant="secondary" icon="arrow-back" onPress={() => router.back()} />
        <Button title="PRÓXIMO" icon="arrow-forward" onPress={handleNext} disabled={!selectedGym} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1, padding: SPACING.xl, paddingTop: 60 },
  header: { alignItems: 'center', marginBottom: 30 },
  progressContainer: { width: '100%', marginTop: SPACING.xxl },
  cardsContainer: { gap: SPACING.md },
  gymCard: { padding: SPACING.lg },
  gymContent: { flexDirection: 'row', alignItems: 'center' },
  iconContainer: { width: 40, height: 40, borderRadius: 10, backgroundColor: COLORS.primary + '15', justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md },
  gymInfo: { flex: 1 },
});
