// src/components/gamification/WeeklyChallenges.js
// Desafios semanais do hub de gamificacao - NOVAIX FITNESS

import React, { useState, useEffect, memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { WEEKLY_CHALLENGES } from '../../constants/gamification';

function WeeklyChallenges({ progress = {} }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const endOfWeek = new Date(now);
      endOfWeek.setDate(now.getDate() + (7 - now.getDay()));
      endOfWeek.setHours(23, 59, 59, 999);
      const diff = endOfWeek.getTime() - now.getTime();
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      setTimeLeft(days > 0 ? `${days}d ${hours}h restantes` : `${hours}h restantes`);
    };
    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="flash" size={20} color={COLORS.primary} />
        <Text style={styles.title}>DESAFIOS SEMANAIS</Text>
        <Text style={styles.timer}>{timeLeft}</Text>
      </View>

      {WEEKLY_CHALLENGES.map(challenge => {
        const current = progress[challenge.type] || 0;
        const prog = Math.min(1, current / challenge.target);
        const completed = prog >= 1;

        return (
          <View key={challenge.id} style={[styles.item, completed && styles.itemDone]}>
            <View style={[styles.iconWrap, completed && styles.iconDone]}>
              <Ionicons name={(completed ? 'checkmark' : challenge.icon) as any} size={16} color={completed ? COLORS.background : COLORS.primary} />
            </View>
            <View style={styles.info}>
              <View style={styles.infoRow}>
                <Text style={[styles.name, completed && styles.nameDone]}>{challenge.name}</Text>
                <Text style={styles.xp}>+{challenge.xpReward} XP</Text>
              </View>
              <View style={styles.track}>
                <View style={[styles.fill, { width: `${prog * 100}%`, backgroundColor: completed ? COLORS.success : COLORS.primary }]} />
              </View>
              <Text style={styles.progressText}>{current}/{challenge.target}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

export default memo(WeeklyChallenges);

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  title: { flex: 1, fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.textTitle, letterSpacing: 1 },
  timer: { fontFamily: 'Inter_500Medium', fontSize: 11, color: COLORS.secondary },
  item: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  itemDone: { opacity: 0.6 },
  iconWrap: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.primary + '15', justifyContent: 'center', alignItems: 'center' },
  iconDone: { backgroundColor: COLORS.success },
  info: { flex: 1 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  name: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textTitle },
  nameDone: { textDecorationLine: 'line-through', color: COLORS.textMuted },
  xp: { fontFamily: 'Montserrat_700Bold', fontSize: 11, color: COLORS.primary },
  track: { height: 4, backgroundColor: COLORS.background, borderRadius: 2, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 2 },
  progressText: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted, marginTop: 2 },
});
