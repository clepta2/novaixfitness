import React, { memo, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { Avatar } from '../ui/Avatar';
import { MAX_REPLY_DEPTH } from '../../config/socialConfig';
import CommentLike from './CommentLike';

export interface CommentReplyData {
  id: string;
  user_id: string;
  content: string;
  parent_reply_id: string | null;
  created_at: string;
  profiles?: { name: string; avatar_url: string | null };
  reply_to_name?: string;
  like_count: number;
  is_liked: boolean;
}

interface CommentReplyProps {
  comment: CommentReplyData;
  currentUserId: string;
  depth?: number;
  onReply: (parentId: string, text: string) => void;
  onLike: (commentId: string) => void;
}

function CommentReply({ comment, currentUserId, depth = 0, onReply, onLike }: CommentReplyProps) {
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const name = comment.profiles?.name || 'Anônimo';

  const handleSendReply = () => {
    if (replyText.trim()) {
      onReply(comment.id, replyText.trim());
      setReplyText('');
      setReplying(false);
    }
  };

  return (
    <View style={[styles.container, depth > 0 && styles.nested]}>
      <Avatar name={name} size="sm" />
      <View style={styles.content}>
        <Text style={styles.author}>{name}</Text>
        {comment.reply_to_name && <Text style={styles.replyTo}>em resposta a @{comment.reply_to_name}</Text>}
        <Text style={styles.text}>{comment.content}</Text>
        <View style={styles.actions}>
          <CommentLike commentId={comment.id} likeCount={comment.like_count} isLiked={comment.is_liked} onToggle={() => onLike(comment.id)} />
          {depth < MAX_REPLY_DEPTH && (
            <TouchableOpacity style={styles.replyBtn} onPress={() => setReplying(!replying)}>
              <Ionicons name="chatbubble-outline" size={14} color={COLORS.textMuted} />
              <Text style={styles.replyLabel}>Responder</Text>
            </TouchableOpacity>
          )}
        </View>
        {replying && (
          <View style={styles.replyInput}>
            <TextInput style={styles.input} value={replyText} onChangeText={setReplyText}
              placeholder={`Responder para @${name}`} placeholderTextColor={COLORS.textMuted} autoFocus />
            <TouchableOpacity style={[styles.sendBtn, !replyText.trim() && styles.sendBtnDisabled]}
              onPress={handleSendReply} disabled={!replyText.trim()}>
              <Ionicons name="send" size={16} color={replyText.trim() ? COLORS.primary : COLORS.textMuted} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

export default memo(CommentReply);

const styles = StyleSheet.create({
  container: { flexDirection: 'row', gap: SPACING.sm, paddingVertical: SPACING.sm },
  nested: { marginLeft: SPACING.xl + SPACING.sm },
  content: { flex: 1, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, padding: SPACING.sm },
  author: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textTitle },
  replyTo: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted, marginTop: 1 },
  text: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textDescription, marginTop: 4 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginTop: SPACING.xs },
  replyBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  replyLabel: { fontFamily: 'Inter_500Medium', fontSize: 11, color: COLORS.textMuted },
  replyInput: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginTop: SPACING.sm },
  input: { flex: 1, height: 36, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.sm, paddingHorizontal: SPACING.sm, color: COLORS.textTitle, fontFamily: 'Inter_400Regular', fontSize: 12 },
  sendBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.primary + '20', justifyContent: 'center', alignItems: 'center' },
  sendBtnDisabled: { backgroundColor: COLORS.surfaceOverlay },
});
