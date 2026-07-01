import React, { memo } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

interface CommentLikeProps {
  commentId: string;
  likeCount: number;
  isLiked: boolean;
  onToggle: () => void;
}

function CommentLike({ commentId, likeCount, isLiked, onToggle }: CommentLikeProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onToggle} activeOpacity={0.7}>
      <Ionicons
        name={isLiked ? 'heart' : 'heart-outline'}
        size={14}
        color={isLiked ? COLORS.primary : COLORS.textMuted}
      />
      {likeCount > 0 && (
        <Text style={[styles.count, isLiked && styles.countActive]}>{likeCount}</Text>
      )}
    </TouchableOpacity>
  );
}

export default memo(CommentLike);

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  count: { fontFamily: 'Inter_500Medium', fontSize: 11, color: COLORS.textMuted },
  countActive: { color: COLORS.primary },
});
