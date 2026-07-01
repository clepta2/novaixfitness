// src/components/social/ActiveDuelCard.tsx
// Card de duelo de treino ativo no feed - NOVAIX FITNESS

import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { Avatar } from '../ui/Avatar';

export interface Duel {
  id: string;
  challenger: { name: string; avatar: string | null; progress: number };
  challenged: { name: string; avatar: string | null; progress: number };
  target: number;
  workoutName: string;
  daysRemaining: number;
}

interface ActiveDuelCardProps {
  duel: Duel;
}

export default function ActiveDuelCard({ duel }: ActiveDuelCardProps) {
  const [challengerVotes, setChallengerVotes] = useState(14);
  const [challengedVotes, setChallengedVotes] = useState(8);
  const [supportedSide, setSupportedSide] = useState<'challenger' | 'challenged' | null>(null);

  const leftScale = useMemo(() => new Animated.Value(1), []);
  const rightScale = useMemo(() => new Animated.Value(1), []);

  const handleSupport = (side: 'challenger' | 'challenged') => {
    if (supportedSide) return;
    setSupportedSide(side);
    const scaleVal = side === 'challenger' ? leftScale : rightScale;
    
    if (side === 'challenger') {
      setChallengerVotes(prev => prev + 1);
    } else {
      setChallengedVotes(prev => prev + 1);
    }

    Animated.sequence([
      Animated.spring(scaleVal, { toValue: 1.3, friction: 3, useNativeDriver: true }),
      Animated.spring(scaleVal, { toValue: 1.0, friction: 3, useNativeDriver: true }),
    ]).start();
  };

  const totalProgress = duel.challenger.progress + duel.challenged.progress;
  const challengerPct = totalProgress > 0 ? (duel.challenger.progress / totalProgress) * 100 : 50;
  const challengedPct = 100 - challengerPct;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Ionicons name="flash" size={16} color={COLORS.primary} />
        <Text style={styles.headerTitle}>DUELO ATIVO · {duel.workoutName}</Text>
        <Text style={styles.timeText}>{duel.daysRemaining}d restantes</Text>
      </View>

      <View style={styles.versusContainer}>
        {/* Challenger info */}
        <View style={styles.userColumn}>
          <Avatar name={duel.challenger.name} uri={duel.challenger.avatar} size="md" />
          <Text style={styles.userName} numberOfLines={1}>{duel.challenger.name}</Text>
          <Text style={styles.userProgress}>{duel.challenger.progress} / {duel.target} séries</Text>
        </View>

        <Text style={styles.vsText}>VS</Text>

        {/* Challenged info */}
        <View style={styles.userColumn}>
          <Avatar name={duel.challenged.name} uri={duel.challenged.avatar} size="md" />
          <Text style={styles.userName} numberOfLines={1}>{duel.challenged.name}</Text>
          <Text style={styles.userProgress}>{duel.challenged.progress} / {duel.target} séries</Text>
        </View>
      </View>

      {/* Comparative Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressLeft, { width: `${challengerPct}%` }]} />
        <View style={[styles.progressRight, { width: `${challengedPct}%` }]} />
      </View>

      {/* Action Buttons to Support */}
      <View style={styles.actionsContainer}>
        <Animated.View style={{ transform: [{ scale: leftScale }] }}>
          <TouchableOpacity 
            style={[styles.supportBtn, supportedSide === 'challenger' && styles.supportBtnActive]} 
            onPress={() => handleSupport('challenger')}
            disabled={supportedSide !== null}
          >
            <Ionicons name="heart" size={14} color={supportedSide === 'challenger' ? COLORS.error : 'white'} />
            <Text style={styles.supportBtnText}>Apoiar ({challengerVotes})</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={{ transform: [{ scale: rightScale }] }}>
          <TouchableOpacity 
            style={[styles.supportBtn, supportedSide === 'challenged' && styles.supportBtnActive]} 
            onPress={() => handleSupport('challenged')}
            disabled={supportedSide !== null}
          >
            <Ionicons name="heart" size={14} color={supportedSide === 'challenged' ? COLORS.error : 'white'} />
            <Text style={styles.supportBtnText}>Apoiar ({challengedVotes})</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: 'rgba(30, 35, 42, 0.85)', borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.md, borderWidth: 1, borderColor: 'rgba(204, 255, 0, 0.15)' },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, marginBottom: SPACING.md },
  headerTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 11, color: COLORS.primary, flex: 1 },
  timeText: { fontFamily: 'Inter_500Medium', fontSize: 10, color: COLORS.textMuted },
  versusContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginVertical: SPACING.xs },
  userColumn: { alignItems: 'center', flex: 1, maxWidth: 100 },
  userName: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textTitle, marginTop: SPACING.xs },
  userProgress: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted, marginTop: 2 },
  vsText: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 16, color: COLORS.primary, paddingHorizontal: SPACING.sm },
  progressContainer: { height: 6, borderRadius: 3, overflow: 'hidden', flexDirection: 'row', backgroundColor: COLORS.surfaceOverlay, marginVertical: SPACING.md },
  progressLeft: { height: '100%', backgroundColor: COLORS.primary },
  progressRight: { height: '100%', backgroundColor: COLORS.info },
  actionsContainer: { flexDirection: 'row', justifyContent: 'space-between', gap: SPACING.md, marginTop: SPACING.xs },
  supportBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.surfaceElevated, paddingVertical: SPACING.sm, paddingHorizontal: SPACING.md, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border },
  supportBtnActive: { borderColor: COLORS.error, backgroundColor: 'rgba(255, 45, 85, 0.1)' },
  supportBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 11, color: COLORS.textTitle },
});
