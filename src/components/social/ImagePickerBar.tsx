// src/components/social/ImagePickerBar.js
// Barra de opções de seleção de imagem (galeria/câmera)

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

export default function ImagePickerBar({ onGallery, onCamera, uploading, t }) {
  return (
    <View style={styles.bar}>
      <TouchableOpacity style={styles.btn} onPress={onGallery} disabled={uploading}>
        {uploading
          ? <ActivityIndicator size="small" color={COLORS.primary} />
          : <Ionicons name="image-outline" size={24} color={COLORS.primary} />}
        <Text style={styles.btnText}>{t('social.createPost.gallery')}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={onCamera} disabled={uploading}>
        <Ionicons name="camera-outline" size={24} color={COLORS.primary} />
        <Text style={styles.btnText}>{t('social.createPost.camera')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    gap: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  btn: {
    flex: 1,
    alignItems: 'center',
    gap: SPACING.xs,
    padding: SPACING.md,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  btnText: { color: COLORS.primary, fontSize: 12, fontWeight: '600' },
});
