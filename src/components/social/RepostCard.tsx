import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { Avatar } from '../ui/Avatar';

export interface OriginalPost {
  id: string;
  content: string;
  image_url?: string | null;
  user: { name: string; avatar_url: string | null };
}

interface RepostCardProps {
  originalPost: OriginalPost;
  repostedBy: { name: string; avatar_url: string | null };
}

function RepostCard({ originalPost, repostedBy }: RepostCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.attribution}>
        <Ionicons name="repeat" size={14} color={COLORS.primary} />
        <Avatar name={repostedBy.name} size="xs" />
        <Text style={styles.attributionText}>
          Repostado por <Text style={styles.attributionName}>@{repostedBy.name}</Text>
        </Text>
      </View>
      <View style={styles.originalCard}>
        <View style={styles.originalHeader}>
          <Avatar name={originalPost.user.name} size="sm" />
          <Text style={styles.originalAuthor}>{originalPost.user.name}</Text>
        </View>
        <Text style={styles.originalContent} numberOfLines={4}>{originalPost.content}</Text>
      </View>
    </View>
  );
}

export default memo(RepostCard);

const styles = StyleSheet.create({
  container: { marginTop: SPACING.sm },
  attribution: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, marginBottom: SPACING.sm },
  attributionText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted },
  attributionName: { fontFamily: 'Montserrat_600SemiBold', color: COLORS.textDescription },
  originalCard: { borderWidth: 1, borderColor: COLORS.border, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, backgroundColor: COLORS.background },
  originalHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm },
  originalAuthor: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: COLORS.textTitle },
  originalContent: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textDescription, lineHeight: 18 },
});
