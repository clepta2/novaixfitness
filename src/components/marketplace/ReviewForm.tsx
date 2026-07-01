import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

const MAX_COMMENT_LENGTH = 500;

export default function ReviewForm({ rating, setRating, comment, setComment, submitting, onSubmit, onCancel }) {
  return (
    <View style={styles.form}>
      <View style={styles.stars}>
        {[1, 2, 3, 4, 5].map(i => (
          <TouchableOpacity key={i} onPress={() => setRating(i)}>
            <Ionicons name={i <= rating ? 'star' : 'star-outline'} size={22} color={COLORS.star} />
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        style={styles.input}
        placeholder="Deixe seu comentario..."
        placeholderTextColor={COLORS.textMuted}
        value={comment}
        onChangeText={(t) => setComment(t.slice(0, MAX_COMMENT_LENGTH))}
        multiline
        maxLength={MAX_COMMENT_LENGTH}
      />
      <Text style={styles.charCount}>{comment.length}/{MAX_COMMENT_LENGTH}</Text>
      <View style={styles.formActions}>
        <TouchableOpacity onPress={onCancel}>
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitBtn} onPress={onSubmit} disabled={submitting || !comment.trim()}>
          <Text style={styles.submitText}>{submitting ? '...' : 'Enviar'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  form: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  stars: { flexDirection: 'row', gap: 4, marginBottom: SPACING.sm },
  input: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textTitle, backgroundColor: COLORS.surfaceElevated, borderRadius: BORDER_RADIUS.sm, padding: SPACING.sm, minHeight: 60, textAlignVertical: 'top' },
  charCount: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted, textAlign: 'right', marginTop: 2 },
  formActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: SPACING.md, marginTop: SPACING.sm },
  cancelText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: COLORS.textMuted },
  submitBtn: { backgroundColor: COLORS.primary, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: BORDER_RADIUS.sm },
  submitText: { fontFamily: 'Montserrat_700Bold', fontSize: 11, color: COLORS.background },
});
