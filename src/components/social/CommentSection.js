import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { Avatar } from '../ui/Avatar';

export default function CommentSection({ comments, loading, onSubmit, commentText, onCommentTextChange }) {
  return (
    <View style={styles.container}>
      {loading ? (
        <Text style={styles.loadingText}>Carregando...</Text>
      ) : comments.length > 0 ? (
        <View style={styles.list}>
          {comments.map((comment) => (
            <View key={comment.id} style={styles.item}>
              <Avatar name={comment.profiles?.name || 'Anônimo'} size="sm" />
              <View style={styles.content}>
                <Text style={styles.author}>{comment.profiles?.name || 'Anônimo'}</Text>
                <Text style={styles.text}>{comment.content}</Text>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.noComments}>Nenhum comentário ainda</Text>
      )}

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Comentário..."
          placeholderTextColor={COLORS.textMuted}
          value={commentText}
          onChangeText={onCommentTextChange}
        />
        <TouchableOpacity
          style={[styles.sendBtn, !commentText.trim() && styles.sendBtnDisabled]}
          onPress={onSubmit}
          disabled={!commentText.trim()}
        >
          <Ionicons name="send" size={18} color={commentText.trim() ? COLORS.primary : COLORS.textMuted} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

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
