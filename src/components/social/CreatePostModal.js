// src/components/social/CreatePostModal.js
// Modal para criar post - NOVAIX FITNESS

import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { Button } from '../index';

export default function CreatePostModal({ visible, onClose, onSubmit }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!content.trim()) {
      Alert.alert('Erro', 'Escreva algo antes de postar');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      onSubmit?.({ content, image: null });
      setContent('');
      setLoading(false);
      onClose();
    }, 500);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.content} onStartShouldSetResponder={() => true}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <Text style={styles.title}>Novo Post</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            placeholder="O que você está sentindo hoje?"
            placeholderTextColor={COLORS.textMuted}
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
          />

          <View style={styles.options}>
            <TouchableOpacity style={styles.optionBtn}>
              <Ionicons name="image-outline" size={24} color={COLORS.primary} />
              <Text style={styles.optionText}>Foto</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionBtn}>
              <Ionicons name="barbell-outline" size={24} color={COLORS.primary} />
              <Text style={styles.optionText}>Treino</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionBtn}>
              <Ionicons name="location-outline" size={24} color={COLORS.primary} />
              <Text style={styles.optionText}>Local</Text>
            </TouchableOpacity>
          </View>

          <Button
            title="PUBLICAR"
            onPress={handleSubmit}
            loading={loading}
            disabled={!content.trim()}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    paddingBottom: 40,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: SPACING.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 18,
    color: COLORS.textTitle,
  },
  input: {
    height: 150,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    color: COLORS.textTitle,
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  options: {
    flexDirection: 'row',
    gap: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  optionText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textTitle,
  },
});
