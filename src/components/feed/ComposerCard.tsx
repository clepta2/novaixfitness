// src/components/feed/ComposerCard.tsx - Box de composicao estilo Facebook

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { Avatar } from '../../components';
import { COMPOSER } from '../../data/socialTexts';

interface ComposerCardProps {
  userName?: string;
  userAvatar?: string | null;
  onPhoto?: () => void;
  onVideo?: () => void;
  onCheckIn?: () => void;
}

export default function ComposerCard({ userName, userAvatar, onPhoto, onVideo, onCheckIn }: ComposerCardProps) {
  return (
    <View style={styles.composerCard}>
      <View style={styles.composerRow}>
        <Avatar name={userName || 'User'} size="md" />
        <View style={styles.composerInputMock}>
          <Text style={styles.composerInputText}>
            {COMPOSER.feedPlaceholder.replace('{name}', userName?.split(' ')[0] || 'Atleta')}
          </Text>
        </View>
      </View>
      <View style={styles.composerDivider} />
      <View style={styles.composerActions}>
        <TouchableOpacity style={styles.composerActionBtn} onPress={onPhoto}>
          <Ionicons name="image" size={18} color="#45BD62" />
          <Text style={styles.composerActionLabel}>{COMPOSER.photoLabel}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.composerActionBtn} onPress={onVideo}>
          <Ionicons name="videocam" size={18} color="#F02849" />
          <Text style={styles.composerActionLabel}>{COMPOSER.videoLabel}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.composerActionBtn} onPress={onCheckIn}>
          <Ionicons name="flame" size={18} color="#F7B928" />
          <Text style={styles.composerActionLabel}>{COMPOSER.checkInLabel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  composerCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  composerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  composerInputMock: {
    flex: 1,
    height: 40,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.lg,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  composerInputText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: COLORS.textMuted,
  },
  composerDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  composerActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  composerActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.xs,
  },
  composerActionLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: COLORS.textDescription,
  },
});
