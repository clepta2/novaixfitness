// src/components/social/SuggestedFollows.tsx
// Usuarios sugeridos para seguir

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { supabase } from '../../config/supabase';
import { TABLES } from '../../config/tables';
import { useAuth } from '../../context/AuthContext';

type User = {
  id: string;
  name: string;
  avatar_url: string | null;
  level: number;
  mutualFollowers: number;
  workoutPattern: string;
};

interface SuggestedFollowsProps {
  users: User[];
  onFollow?: (userId: string) => void;
}

export default function SuggestedFollows({ users, onFollow }: SuggestedFollowsProps) {
  const { user } = useAuth();
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});

  if (!users.length) return null;

  const handleFollow = async (userId: string) => {
    if (!user?.id || followingMap[userId]) return;
    await supabase.from(TABLES.USER_FOLLOWS).insert({
      follower_id: user.id,
      following_id: userId,
    });
    setFollowingMap((prev) => ({ ...prev, [userId]: true }));
    onFollow?.(userId);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="person-add" size={16} color={COLORS.primary} />
        <Text style={styles.title}>Sugeridos</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {users.map((u) => (
          <View key={u.id} style={styles.card}>
            <Image
              source={u.avatar_url ? { uri: u.avatar_url } : undefined}
              style={styles.avatar}
            />
            {!u.avatar_url && (
              <View style={[styles.avatar, styles.avatarFallback]}>
                <Ionicons name="person" size={20} color={COLORS.textMuted} />
              </View>
            )}
            <Text style={styles.name} numberOfLines={1}>{u.name}</Text>
            <Text style={styles.meta}>Lv.{u.level} · {u.mutualFollowers} em comum</Text>
            <TouchableOpacity
              style={[styles.btn, followingMap[u.id] && styles.btnFollowing]}
              onPress={() => handleFollow(u.id)}
              disabled={!!followingMap[u.id]}
              activeOpacity={0.7}
            >
              <Text style={[styles.btnText, followingMap[u.id] && styles.btnTextFollowing]}>
                {followingMap[u.id] ? 'Seguindo' : 'Seguir'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  title: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 12,
    color: COLORS.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  scroll: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  card: {
    width: 110,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.surfaceElevated,
    marginBottom: SPACING.xs,
  },
  avatarFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: COLORS.textTitle,
    marginBottom: 2,
  },
  meta: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    color: COLORS.textMuted,
    marginBottom: SPACING.xs,
  },
  btn: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
  },
  btnFollowing: {
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  btnText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    color: COLORS.background,
  },
  btnTextFollowing: {
    color: COLORS.textMuted,
  },
});
