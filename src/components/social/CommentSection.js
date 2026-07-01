import React, { memo } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { Avatar } from '../ui/Avatar';
import { COMMENTS } from '../../data/socialTexts';
import { validateContent } from '../../middleware/communityGuard';

function CommentSection({ comments, loading, onSubmit, commentText, onCommentTextChange }) {
  const handleSubmit = () => {
    if (!commentText.trim()) return;
    const { clean, masked, violations } = validateContent(commentText);
    if (!clean) {
      Alert.alert(
        'Conteúdo inadequado',
        'Seu comentário contém palavras proibidas. Por favor, mantenha o respeito na comunidade.',
      );
      if (violations.length > 0) {
        onCommentTextChange(masked);
      }
      return;
    }
    onSubmit?.();
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <Text style={styles.loadingText}>{COMMENTS.loading}</Text>
      ) : comments.length > 0 ? (
        <View style={styles.list}>
          {comments.map((comment) => (
            <View key={comment.id} style={styles.item}>
              <Avatar name={comment.profiles?.name || COMMENTS.anonymous} size="sm" />
              <View style={styles.content}>
                <Text style={styles.author}>{comment.profiles?.name || COMMENTS.anonymous}</Text>
                <Text style={styles.text}>{comment.content}</Text>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.noComments}>{COMMENTS.empty}</Text>
      )}

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder={COMMENTS.inputPlaceholder}
          placeholderTextColor={COLORS.textMuted}
          value={commentText}
          onChangeText={onCommentTextChange}
          accessibilityLabel={COMMENTS.writeLabel}
        />
        <TouchableOpacity
          style={[styles.sendBtn, !commentText.trim() && styles.sendBtnDisabled]}
          onPress={handleSubmit}
          disabled={!commentText.trim()}
          accessibilityLabel={COMMENTS.sendLabel}
          accessibilityRole="button"
        >
          <Ionicons name="send" size={18} color={commentText.trim() ? COLORS.primary : COLORS.textMuted} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default memo(CommentSection);

const styles = StyleSheet.create({
  container: { marginTop: SPACING.md, paddingTop: SPACING.md, borderTopWidth: 1, borderTopColor: COLORS.border },
  loadingText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted, textAlign: 'center', paddingVertical: SPACING.md },
  list: { gap: SPACING.md, marginBottom: SPACING.md },
  item: { flexDirection: 'row', gap: SPACING.sm },
  content: { flex: 1, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, padding: SPACING.sm },
  author: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textTitle, marginBottom: 2 },
  text: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textDescription },
  noComments: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted, textAlign: 'center', paddingVertical: SPACING.md },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  input: { flex: 1, height: 40, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, paddingHorizontal: SPACING.md, color: COLORS.textTitle, fontFamily: 'Inter_400Regular', fontSize: 14 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primary + '20', justifyContent: 'center', alignItems: 'center' },
  sendBtnDisabled: { backgroundColor: COLORS.surfaceOverlay },
});
