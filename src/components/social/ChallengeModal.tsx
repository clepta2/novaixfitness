// src/components/social/ChallengeModal.tsx
// Modal de detalhes do desafio - NOVAIX FITNESS

import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

const ICON_MAP: Record<string, string> = { Hidratação: 'water', Proteína: 'flash', Treino: 'barbell', Geral: 'fitness', Sono: 'moon', Nutrição: 'nutrition' };
const COLOR_MAP: Record<string, string> = { Hidratação: COLORS.info, Proteína: COLORS.success, Treino: COLORS.primary, Geral: COLORS.primary, Sono: COLORS.info, Nutrição: COLORS.attention };
const DIFF_COLORS: Record<string, string> = { 'Fácil': COLORS.success, 'Médio': COLORS.attention, 'Difícil': COLORS.error };

interface ChallengeData {
  category: string;
  title: string;
  desc: string;
  progress?: number;
  target?: number;
  duration: string;
  participants?: number;
  reward: number;
  difficulty: string;
}

interface ChallengeModalProps {
  challenge: ChallengeData | null;
  visible: boolean;
  onClose: () => void;
  onJoin?: (challenge: ChallengeData) => void;
}

export default function ChallengeModal({ challenge, visible, onClose, onJoin }: ChallengeModalProps) {
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, { toValue: 0, tension: 30, friction: 8, useNativeDriver: true }).start();
    }
  }, [visible]);

  if (!challenge) return null;

  const icon = ICON_MAP[challenge.category] || 'fitness';
  const color = COLOR_MAP[challenge.category] || COLORS.primary;
  const diffColor = DIFF_COLORS[challenge.difficulty] || COLORS.attention;
  const progress = challenge.progress || 0;
  const target = challenge.target || 7;
  const progressPct = target > 0 ? Math.min(100, (progress / target) * 100) : 0;
  const isComplete = progress >= target;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <Animated.View style={[styles.content, { transform: [{ translateY: slideAnim }] }]} onStartShouldSetResponder={() => true}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <View style={[styles.icon, { backgroundColor: color + '20' }]}>
              <Ionicons name={isComplete ? 'checkmark-circle' : (icon as any)} size={32} color={isComplete ? COLORS.success : color} />
            </View>
            <Text style={styles.title}>{challenge.title}</Text>
            <Text style={styles.desc}>{challenge.desc}</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="time" size={16} color={COLORS.textMuted} />
              <Text style={styles.statText}>{challenge.duration}</Text>
            </View>
            <View style={[styles.statItem, { backgroundColor: diffColor + '20' }]}>
              <Text style={[styles.statText, { color: diffColor }]}>{challenge.difficulty}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="people" size={16} color={COLORS.textMuted} />
              <Text style={styles.statText}>{challenge.participants || 0}</Text>
            </View>
          </View>

          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Progresso</Text>
              <Text style={[styles.progressValue, { color }]}>{progress}/{target}</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progressPct}%`, backgroundColor: color }]} />
            </View>
          </View>

          <View style={styles.rewardSection}>
            <Ionicons name="trophy" size={24} color={COLORS.primary} />
            <View>
              <Text style={styles.rewardLabel}>Recompensa</Text>
              <Text style={styles.rewardValue}>{challenge.reward} XP</Text>
            </View>
          </View>

          <TouchableOpacity style={[styles.joinBtn, { backgroundColor: isComplete ? COLORS.success : color }]} onPress={() => { onJoin?.(challenge); onClose(); }}>
            <Ionicons name={isComplete ? 'checkmark-circle' : 'add-circle'} size={20} color={COLORS.background} />
            <Text style={styles.joinText}>{isComplete ? 'COMPLETO!' : 'PARTICIPAR DO DESAFIO'}</Text>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  content: { backgroundColor: COLORS.surface, borderTopLeftRadius: BORDER_RADIUS.xl, borderTopRightRadius: BORDER_RADIUS.xl, padding: SPACING.xl, paddingBottom: 40 },
  handle: { width: 40, height: 4, backgroundColor: COLORS.border, borderRadius: 2, alignSelf: 'center', marginBottom: SPACING.xl },
  header: { alignItems: 'center', marginBottom: SPACING.xl },
  icon: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.md },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 20, color: COLORS.textTitle, marginBottom: SPACING.xs },
  desc: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, textAlign: 'center' },
  statsRow: { flexDirection: 'row', justifyContent: 'center', gap: SPACING.sm, marginBottom: SPACING.xl },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.sm },
  statText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textTitle },
  progressSection: { marginBottom: SPACING.xl },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.xs },
  progressLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textMuted },
  progressValue: { fontFamily: 'Montserrat_700Bold', fontSize: 12 },
  progressBar: { height: 10, backgroundColor: COLORS.surfaceOverlay, borderRadius: 5, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 5 },
  rewardSection: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, backgroundColor: COLORS.primary + '10', padding: SPACING.lg, borderRadius: BORDER_RADIUS.md, marginBottom: SPACING.xl },
  rewardLabel: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted },
  rewardValue: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 18, color: COLORS.primary },
  joinBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, paddingVertical: SPACING.lg, borderRadius: BORDER_RADIUS.md },
  joinText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.background, letterSpacing: 1 },
});
