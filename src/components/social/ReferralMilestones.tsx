// src/components/social/ReferralMilestones.js
// Marcos de indicação com recompensas

import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

const MILESTONES = [
  { referrals: 1, reward: '+30 dias', badge: 'Recrutador', icon: 'person-add', color: COLORS.info },
  { referrals: 5, reward: '+60 dias', badge: 'Recrutador Pro', icon: 'people', color: COLORS.purple },
  { referrals: 10, reward: '+90 dias', badge: 'Recrutador Elite', icon: 'trophy', color: COLORS.gold },
  { referrals: 25, reward: '+180 dias', badge: 'Recrutador Lenda', icon: 'star', color: COLORS.secondary },
  { referrals: 50, reward: 'Vitalício', badge: 'Embaixador Novaix', icon: 'ribbon', color: COLORS.primary },
];

export default function ReferralMilestones({ currentReferrals = 0 }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>MARCOS DE INDICAÇÃO</Text>
      {MILESTONES.map((milestone, i) => {
        const achieved = currentReferrals >= milestone.referrals;
        const progress = Math.min(1, currentReferrals / milestone.referrals);

        return (
          <View key={i} style={[styles.milestone, achieved && styles.achieved]}>
            <View style={[styles.iconContainer, { backgroundColor: milestone.color + '20' }]}>
              <Ionicons name={milestone.icon as any} size={20} color={achieved ? milestone.color : COLORS.textMuted} />
            </View>
            <View style={styles.info}>
              <Text style={[styles.badge, achieved && { color: milestone.color }]}>{milestone.badge}</Text>
              <Text style={styles.reward}>{milestone.reward} · {milestone.referrals} indicações</Text>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: milestone.color }]} />
              </View>
            </View>
            {achieved && <Ionicons name="checkmark-circle" size={20} color={milestone.color} />}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.lg },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textMuted, marginBottom: SPACING.md, letterSpacing: 1 },
  milestone: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, padding: SPACING.md, borderRadius: BORDER_RADIUS.md, marginBottom: SPACING.sm, backgroundColor: COLORS.surfaceElevated, borderWidth: 1, borderColor: COLORS.border },
  achieved: { borderColor: COLORS.primary + '40' },
  iconContainer: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  info: { flex: 1 },
  badge: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: COLORS.textTitle },
  reward: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  progressTrack: { height: 3, backgroundColor: COLORS.border, borderRadius: 2, marginTop: SPACING.xs },
  progressFill: { height: 3, borderRadius: 2 },
});
