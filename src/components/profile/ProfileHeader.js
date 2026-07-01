// src/components/profile/ProfileHeader.js
// Header do perfil - NOVAIX FITNESS

import React, { useRef, useEffect, memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { Avatar } from '../ui/Avatar';

const PLAN_COLORS = { basic: COLORS.info, intermediate: COLORS.primary, premium: COLORS.attention, ultra: COLORS.secondary };
const PLAN_LABELS = { basic: 'Básico', intermediate: 'Intermediário', premium: 'Premium', ultra: 'Ultra' };

function ProfileHeaderInner({ name, email, memberSince, uri, onPressAvatar, subscription }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, tension: 30, friction: 8, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  const planColor = PLAN_COLORS[subscription] || COLORS.textMuted;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity onPress={onPressAvatar} disabled={!onPressAvatar} style={styles.avatarWrapper}>
        <Avatar name={name} uri={uri} size="xl" />
        {onPressAvatar && (
          <View style={styles.editBadge}>
            <Ionicons name="camera" size={12} color={COLORS.background} />
          </View>
        )}
      </TouchableOpacity>

      <Text style={styles.name}>{name}</Text>
      <Text style={styles.email}>{email}</Text>

      {subscription && (
        <View style={[styles.planBadge, { backgroundColor: planColor + '20' }]}>
          <Ionicons name="diamond" size={12} color={planColor} />
          <Text style={[styles.planText, { color: planColor }]}>{PLAN_LABELS[subscription] || subscription}</Text>
        </View>
      )}

      <Text style={styles.memberSince}>Membro desde {memberSince}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.xl, marginBottom: SPACING.xxl, borderWidth: 1, borderColor: COLORS.border },
  avatarWrapper: { position: 'relative' },
  editBadge: { position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: COLORS.surface },
  name: { fontFamily: 'Montserrat_700Bold', fontSize: 22, color: COLORS.textTitle, marginTop: SPACING.lg },
  email: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, marginTop: SPACING.xs },
  planBadge: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: BORDER_RADIUS.full, marginTop: SPACING.md },
  planText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12 },
  memberSince: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted, marginTop: SPACING.sm },
});

export default memo(ProfileHeaderInner);
