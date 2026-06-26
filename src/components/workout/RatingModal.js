// src/components/workout/RatingModal.js
// Modal de avaliação de treino - NOVAIX FITNESS

import React, { useState, memo } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { Button } from '../index';

function RatingModal({ visible, onClose, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    onSubmit({ rating, comment });
    setRating(0);
    setComment('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.content} onStartShouldSetResponder={() => true}>
          <View style={styles.handle} />
          <Text style={styles.title}>Avalie este treino</Text>
          <Text style={styles.subtitle}>Sua avaliação ajuda outros usuários</Text>

          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Ionicons
                  name={star <= rating ? 'star' : 'star-outline'}
                  size={40}
                  color={star <= rating ? COLORS.primary : COLORS.textMuted}
                />
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={styles.input}
            placeholder="Comentário opcional..."
            placeholderTextColor={COLORS.textMuted}
            value={comment}
            onChangeText={setComment}
            multiline
            textAlignVertical="top"
          />

          <Button title="ENVIAR AVALIAÇÃO" onPress={handleSubmit} disabled={rating === 0} />
          <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
            <Text style={styles.cancelText}>Pular</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

export default memo(RatingModal);

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  content: { backgroundColor: COLORS.surface, borderTopLeftRadius: BORDER_RADIUS.xl, borderTopRightRadius: BORDER_RADIUS.xl, padding: SPACING.xl, paddingBottom: 40 },
  handle: { width: 40, height: 4, backgroundColor: COLORS.border, borderRadius: 2, alignSelf: 'center', marginBottom: SPACING.xl },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 18, color: COLORS.textTitle, textAlign: 'center' },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, textAlign: 'center', marginTop: SPACING.xs },
  stars: { flexDirection: 'row', justifyContent: 'center', gap: SPACING.md, marginVertical: SPACING.xl },
  input: { height: 100, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, color: COLORS.textTitle, fontFamily: 'Inter_400Regular', fontSize: 14, marginBottom: SPACING.xl, borderWidth: 1, borderColor: COLORS.border },
  cancelBtn: { alignItems: 'center', paddingVertical: SPACING.md },
  cancelText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted },
});
