// app/onboarding/experiencia.js
// Tela 6 - Nivel de Experiencia - NOVAIX FITNESS

import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../../src/constants/spacing';
import { Badge, OnboardingFooter } from '../../src/components';
import { useAuth } from '../../src/context/AuthContext';
import { useStaggeredEntry } from '../../src/utils/animations';

const levels = [
  { id: 'beginner', label: 'Iniciante', icon: 'leaf', description: 'Nunca treinei ou parei ha muito tempo', color: COLORS.success, tags: ['Basico', 'Descanso longo', 'Foco em tecnica'] },
  { id: 'intermediate', label: 'Intermediário', icon: 'flash', description: 'Treino de vez em quando, tenho alguma base', color: COLORS.attention, tags: ['Variado', 'Descanso medio', 'Progressao'] },
  { id: 'advanced', label: 'Avançado', icon: 'flame', description: 'Treino pesado e constante ha mais de 1 ano', color: COLORS.secondary, tags: ['Intenso', 'Descanso curto', 'Alta complexidade'] },
];

export default function ExperienceScreen() {
  const router = useRouter();
  const { saveOnboarding, onboarding, updateProfile } = useAuth();
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [anim0, anim1, anim2, anim3] = [0, 1, 2, 3].map(useStaggeredEntry);

  const handleFinish = async () => {
    if (!selectedLevel) return;
    await saveOnboarding({ ...onboarding, level: selectedLevel });
    await updateProfile({ current_step: 'pagamento' });
    router.push('/onboarding/processando');
  };

  return (
    <View style={s.screen}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View style={[s.header, { opacity: anim0.opacity, transform: [{ translateY: anim0.translateY }] }]}>
          <View style={s.stepPill}>
            <View style={s.stepDot} />
            <Text style={s.stepText}>PASSO 6 DE 6 - ULTIMO!</Text>
          </View>
          <Text style={s.title}>QUAL SEU NÍVEL{'\n'}ATUAL?</Text>
          <Text style={s.subtitle}>Isso define a intensidade dos seus treinos</Text>
          <View style={s.progressWrap}>
            <View style={s.progressTrack}>
              <View style={[s.progressFill, { width: '100%' }]} />
            </View>
            <Text style={s.progressLabel}>100%</Text>
          </View>
        </Animated.View>

        <View style={s.cards}>
          {levels.map((level, index) => {
            const anim = [anim1, anim2, anim3][index];
            const isSelected = selectedLevel === level.id;
            return (
              <Animated.View key={level.id} style={{ opacity: anim?.opacity, transform: [{ translateY: anim?.translateY }] }}>
                <TouchableOpacity
                  style={[s.card, isSelected && s.cardActive, isSelected && { shadowColor: level.color }]}
                  onPress={() => setSelectedLevel(level.id)}
                  activeOpacity={0.85}
                >
                  <View style={[s.iconWrap, { backgroundColor: level.color + (isSelected ? '30' : '18') }]}>
                    <Ionicons name={level.icon} size={26} color={level.color} />
                  </View>
                  <View style={s.info}>
                    <View style={s.labelRow}>
                      <Text style={[s.label, isSelected && { color: COLORS.primary }]}>{level.label}</Text>
                      {isSelected && (
                        <View style={s.checkBadge}>
                          <Ionicons name="checkmark" size={10} color={COLORS.background} />
                        </View>
                      )}
                    </View>
                    <Text style={s.desc}>{level.description}</Text>
                    <View style={s.tags}>
                      {level.tags.map((t, i) => (
                        <View key={i} style={[s.tag, isSelected && { borderColor: level.color + '60', backgroundColor: level.color + '12' }]}>
                          <Text style={[s.tagText, isSelected && { color: level.color }]}>{t}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </ScrollView>

      <OnboardingFooter onBack={() => router.back()} onNext={handleFinish} canProceed={!!selectedLevel} nextLabel="FINALIZAR" />
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flexGrow: 1, padding: SPACING.xl, paddingTop: Platform.OS === 'ios' ? 54 : 40, paddingBottom: SPACING.xxl },
  header: { alignItems: 'center', marginBottom: SPACING.xxl },
  stepPill: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, backgroundColor: COLORS.primary + '15', paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: BORDER_RADIUS.full, marginBottom: SPACING.lg },
  stepDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.primary },
  stepText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.primary, letterSpacing: 1.5 },
  title: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 28, color: COLORS.textTitle, textAlign: 'center', lineHeight: 36, marginBottom: SPACING.sm },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, textAlign: 'center', marginBottom: SPACING.xl },
  progressWrap: { width: '100%', flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  progressTrack: { flex: 1, height: 4, backgroundColor: COLORS.border, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 2 },
  progressLabel: { fontFamily: 'Inter_500Medium', fontSize: 11, color: COLORS.primary, width: 36 },
  cards: { gap: SPACING.md },
  card: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, borderWidth: 2, borderColor: COLORS.border, padding: SPACING.lg, flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.lg },
  cardActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '06', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 5 },
  iconWrap: { width: 50, height: 50, borderRadius: 14, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  info: { flex: 1 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: 4 },
  label: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle },
  checkBadge: { width: 18, height: 18, borderRadius: 9, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  desc: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted, lineHeight: 18, marginBottom: SPACING.md },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs },
  tag: { paddingHorizontal: SPACING.sm, paddingVertical: 3, borderRadius: BORDER_RADIUS.full, backgroundColor: COLORS.surfaceOverlay, borderWidth: 1, borderColor: COLORS.border },
  tagText: { fontFamily: 'Inter_500Medium', fontSize: 10, color: COLORS.textMuted },
});
