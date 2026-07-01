import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { typography } from '../../styles';
import { Avatar } from '../ui/Avatar';

export default function HomeHeader({ userName, levelData, streak, onChatPress, onNotificationsPress, userAvatar }) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View>
        <Text style={typography.bodyMuted}>BEM-VINDO,</Text>
        <Text style={typography.h2}>{userName.toUpperCase()}!</Text>
      </View>
      <View style={styles.actions}>
        {levelData && (
          <View style={[styles.levelBadge, { backgroundColor: levelData.color + '20' }]}>
            <Ionicons name={levelData.icon} size={14} color={levelData.color} />
            <Text style={[styles.levelText, { color: levelData.color }]}>Nv.{levelData.level}</Text>
          </View>
        )}
        <View style={styles.streakBadge}>
          <Ionicons name="flame" size={16} color={COLORS.primary} />
          <Text style={styles.streakText}>{streak || 0}</Text>
        </View>
        <TouchableOpacity onPress={onNotificationsPress} style={styles.iconBtn}>
          <Ionicons name="notifications-outline" size={22} color={COLORS.textMuted} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/(tabs)/perfil')} style={styles.avatarBtn}>
          <Avatar name={userName} size="sm" uri={userAvatar} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  actions: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  levelBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: 12 },
  levelText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11 },
  streakBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.surface, paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border },
  streakText: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.primary },
  iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  avatarBtn: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: COLORS.primary, overflow: 'hidden' },
});
