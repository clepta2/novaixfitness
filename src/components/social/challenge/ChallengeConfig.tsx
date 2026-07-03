// src/components/social/challenge/ChallengeConfig.tsx
// Step 2: Configuração do desafio - NOVAIX FITNESS

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../../constants/spacing';

export interface ChallengeConfigData {
  type: 'reps' | 'duration' | 'distance';
  duration: '1day' | '3days' | '1week';
  stake: number;
}

interface ChallengeConfigProps {
  config: ChallengeConfigData;
  onChange: (config: Partial<ChallengeConfigData>) => void;
  onBack: () => void;
  onContinue: () => void;
  friendName: string;
  colors: typeof COLORS;
}

const CHALLENGE_TYPES = [
  { key: 'reps', label: 'Repetições', icon: 'repeat', color: COLORS.primary },
  { key: 'duration', label: 'Duração', icon: 'time', color: COLORS.info },
  { key: 'distance', label: 'Distância', icon: 'navigate', color: COLORS.success },
];

const DURATION_OPTIONS = [
  { key: '1day', label: '1 Dia', icon: 'calendar' },
  { key: '3days', label: '3 Dias', icon: 'calendar' },
  { key: '1week', label: '1 Semana', icon: 'calendar' },
];

const STAKE_OPTIONS = [0, 10, 25, 50, 100];

export function ChallengeConfig({
  config,
  onChange,
  onBack,
  onContinue,
  friendName,
  colors,
}: ChallengeConfigProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.textTitle }]}>Configure o Desafio</Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>Desafiando {friendName}</Text>

      <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>Tipo de Desafio</Text>
      <View style={styles.typeGrid}>
        {CHALLENGE_TYPES.map(type => (
          <TouchableOpacity
            key={type.key}
            style={[
              styles.typeCard,
              { backgroundColor: colors.background, borderColor: colors.border },
              config.type === type.key && { borderColor: colors.primary, backgroundColor: colors.primary + '10' },
            ]}
            onPress={() => onChange({ type: type.key as any })}
          >
            <View style={[styles.typeIcon, { backgroundColor: type.color + '20' }]}>
              <Ionicons name={type.icon as any} size={24} color={type.color} />
            </View>
            <Text style={[
              styles.typeLabel,
              { color: colors.textMuted },
              config.type === type.key && { color: colors.primary },
            ]}>
              {type.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>Duração</Text>
      <View style={styles.durationRow}>
        {DURATION_OPTIONS.map(option => (
          <TouchableOpacity
            key={option.key}
            style={[
              styles.durationBtn,
              { backgroundColor: colors.background, borderColor: colors.border },
              config.duration === option.key && { backgroundColor: colors.primary, borderColor: colors.primary },
            ]}
            onPress={() => onChange({ duration: option.key as any })}
          >
            <Ionicons
              name={option.icon as any}
              size={16}
              color={config.duration === option.key ? colors.background : colors.textMuted}
            />
            <Text style={[
              styles.durationText,
              { color: colors.textMuted },
              config.duration === option.key && { color: colors.background },
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>Apostar XP (Opcional)</Text>
      <View style={styles.stakeRow}>
        {STAKE_OPTIONS.map(amount => (
          <TouchableOpacity
            key={amount}
            style={[
              styles.stakeBtn,
              { backgroundColor: colors.background, borderColor: colors.border },
              config.stake === amount && { backgroundColor: colors.primary, borderColor: colors.primary },
            ]}
            onPress={() => onChange({ stake: amount })}
          >
            <Text style={[
              styles.stakeText,
              { color: colors.textMuted },
              config.stake === amount && { color: colors.background },
            ]}>
              {amount === 0 ? 'Nenhum' : `${amount} XP`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.navRow}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Ionicons name="arrow-back" size={18} color={colors.textMuted} />
          <Text style={[styles.backBtnText, { color: colors.textMuted }]}>Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.nextBtn, { backgroundColor: colors.primary }]} onPress={onContinue}>
          <Text style={[styles.nextBtnText, { color: colors.background }]}>Continuar</Text>
          <Ionicons name="arrow-forward" size={18} color={colors.background} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { minHeight: 300 },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 20, marginBottom: SPACING.xs },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, marginBottom: SPACING.xl },
  sectionLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, marginBottom: SPACING.sm, textTransform: 'uppercase', letterSpacing: 0.5 },
  typeGrid: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.xl },
  typeCard: { flex: 1, alignItems: 'center', padding: SPACING.md, borderRadius: BORDER_RADIUS.md, borderWidth: 1 },
  typeIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.sm },
  typeLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11 },
  durationRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.xl },
  durationBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.xs, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.md, borderWidth: 1 },
  durationText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12 },
  stakeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.xl },
  stakeBtn: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.full, borderWidth: 1 },
  stakeText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12 },
  navRow: { flexDirection: 'row', justifyContent: 'space-between', gap: SPACING.md },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, paddingVertical: SPACING.md, paddingHorizontal: SPACING.lg },
  backBtnText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14 },
  nextBtn: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, paddingVertical: SPACING.md, paddingHorizontal: SPACING.xl, borderRadius: BORDER_RADIUS.md },
  nextBtnText: { fontFamily: 'Montserrat_700Bold', fontSize: 14 },
});

export default ChallengeConfig;
