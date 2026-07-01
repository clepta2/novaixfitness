// @ts-nocheck
// src/components/social/LiveWorkoutCard.js
// Card de live de treino

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { Avatar } from '../ui/Avatar';

export default function LiveWorkoutCard({ live, onPress }) {
  const isLive = live.status === 'live';
  const isScheduled = live.status === 'scheduled';

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress?.(live)} activeOpacity={0.8}>
      {isLive && (
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>AO VIVO</Text>
        </View>
      )}
      {isScheduled && (
        <View style={[styles.liveBadge, styles.scheduledBadge]}>
          <Ionicons name="time" size={12} color={COLORS.info} />
          <Text style={styles.scheduledText}>AGENDADA</Text>
        </View>
      )}

      <View style={styles.header}>
        <Avatar name={live.profiles?.name} size="sm" />
        <View style={styles.hostInfo}>
          <Text style={styles.hostName}>{live.profiles?.name || 'Host'}</Text>
          <Text style={styles.hostLabel}>Organizador</Text>
        </View>
      </View>

      <Text style={styles.title}>{live.title}</Text>
      {live.description && <Text style={styles.description} numberOfLines={2}>{live.description}</Text>}

      <View style={styles.footer}>
        <View style={styles.participants}>
          <Ionicons name="people" size={14} color={COLORS.textMuted} />
          <Text style={styles.participantCount}>{live.participant_count || 0} participantes</Text>
        </View>
        <View style={styles.typeBadge}>
          <Ionicons name="barbell" size={12} color={COLORS.primary} />
          <Text style={styles.typeText}>{live.workout_type || 'Geral'}</Text>
        </View>
      </View>

      {isLive && (
        <View style={styles.joinBtn}>
          <Ionicons name="enter" size={16} color={COLORS.background} />
          <Text style={styles.joinText}>ENTRAR</Text>
        </View>
      )}
      {isScheduled && (
        <View style={styles.notifyBtn}>
          <Ionicons name="notifications-outline" size={16} color={COLORS.info} />
          <Text style={styles.notifyText}>AVISAR-ME</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  liveBadge: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, backgroundColor: COLORS.error + '15', paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: BORDER_RADIUS.full, alignSelf: 'flex-start', marginBottom: SPACING.md },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.error },
  liveText: { fontFamily: 'Montserrat_700Bold', fontSize: 10, color: COLORS.error, letterSpacing: 1 },
  scheduledBadge: { backgroundColor: COLORS.info + '15' },
  scheduledText: { fontFamily: 'Montserrat_700Bold', fontSize: 10, color: COLORS.info, letterSpacing: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  hostInfo: { flex: 1 },
  hostName: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: COLORS.textTitle },
  hostLabel: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle, marginBottom: SPACING.xs },
  description: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textDescription, marginBottom: SPACING.md },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  participants: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  participantCount: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted },
  typeBadge: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, backgroundColor: COLORS.primary + '15', paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: BORDER_RADIUS.full },
  typeText: { fontFamily: 'Inter_500Medium', fontSize: 11, color: COLORS.primary },
  joinBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.xs, backgroundColor: COLORS.error, padding: SPACING.md, borderRadius: BORDER_RADIUS.full },
  joinText: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textTitle },
  notifyBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.xs, borderWidth: 1, borderColor: COLORS.info, padding: SPACING.md, borderRadius: BORDER_RADIUS.full },
  notifyText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.info },
});
