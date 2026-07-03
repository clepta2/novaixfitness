// src/components/social/challenge/ChallengeConfirm.tsx
// Step 3: Confirmação do desafio - NOVAIX FITNESS

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../../constants/spacing';
import { ChallengeConfigData } from './ChallengeConfig';

interface Friend {
  id: string;
  name: string;
  avatar: string;
}

interface ChallengeConfirmProps {
  friend: Friend;
  config: ChallengeConfigData;
  onBack: () => void;
  onConfirm: () => void;
  colors: typeof COLORS;
}

const CHALLENGE_TYPES = [
  { key: 'reps', label: 'Repetições', icon: 'repeat' },
  { key: 'duration', label: 'Duração', icon: 'time' },
  { key: 'distance', label: 'Distância', icon: 'navigate' },
];

const DURATION_OPTIONS = [
  { key: '1day', label: '1 Dia' },
  { key: '3days', label: '3 Dias' },
  { key: '1week', label: '1 Semana' },
];

export function ChallengeConfirm({
  friend,
  config,
  onBack,
  onConfirm,
  colors,
}: ChallengeConfirmProps): React.JSX.Element {
  const challengeType = CHALLENGE_TYPES.find(t => t.key === config.type);
  const duration = DURATION_OPTIONS.find(d => d.key === config.duration);

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.textTitle }]}>Confirmar Desafio</Text>
      
      <View style={[styles.confirmCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
        <Image source={{ uri: friend.avatar }} style={styles.avatar} />
        <Text style={[styles.friendName, { color: colors.textTitle }]}>{friend.name}</Text>
        
        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Ionicons name={challengeType?.icon as any} size={20} color={colors.primary} />
            <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Tipo:</Text>
            <Text style={[styles.detailValue, { color: colors.textTitle }]}>{challengeType?.label}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="time" size={20} color={colors.info} />
            <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Duração:</Text>
            <Text style={[styles.detailValue, { color: colors.textTitle }]}>{duration?.label}</Text>
          </View>
          
          {config.stake > 0 && (
            <View style={styles.detailRow}>
              <Ionicons name="trophy" size={20} color={colors.attention} />
              <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Aposta:</Text>
              <Text style={[styles.detailValue, { color: colors.textTitle }]}>{config.stake} XP</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.navRow}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Ionicons name="arrow-back" size={18} color={colors.textMuted} />
          <Text style={[styles.backBtnText, { color: colors.textMuted }]}>Voltar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.sendBtn, { backgroundColor: colors.primary }]} onPress={onConfirm}>
          <Ionicons name="send" size={18} color={colors.background} />
          <Text style={[styles.sendBtnText, { color: colors.background }]}>ENVIAR DESAFIO</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { minHeight: 300 },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 20, marginBottom: SPACING.xl },
  confirmCard: { alignItems: 'center', borderRadius: BORDER_RADIUS.lg, padding: SPACING.xl, marginBottom: SPACING.xl, borderWidth: 1 },
  avatar: { width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: COLORS.primary, backgroundColor: '#2a2a2a', marginBottom: SPACING.md },
  friendName: { fontFamily: 'Montserrat_700Bold', fontSize: 18, marginBottom: SPACING.lg },
  details: { width: '100%', gap: SPACING.md },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  detailLabel: { fontFamily: 'Inter_400Regular', fontSize: 14 },
  detailValue: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, flex: 1, textAlign: 'right' },
  navRow: { flexDirection: 'row', justifyContent: 'space-between', gap: SPACING.md },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, paddingVertical: SPACING.md, paddingHorizontal: SPACING.lg },
  backBtnText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14 },
  sendBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, flex: 1, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.md },
  sendBtnText: { fontFamily: 'Montserrat_700Bold', fontSize: 14 },
});

export default ChallengeConfirm;
