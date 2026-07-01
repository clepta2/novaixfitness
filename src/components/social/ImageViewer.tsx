// src/components/social/ImageViewer.js
// Componente de visualização de imagem de post com remoção

import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

export default function ImageViewer({ uri, onRemove }) {
  if (!uri) return null;

  return (
    <View style={styles.preview}>
      <Image source={{ uri }} style={styles.image} resizeMode="cover" />
      {onRemove && (
        <TouchableOpacity style={styles.removeBtn} onPress={onRemove}>
          <Ionicons name="close-circle" size={24} color={COLORS.error} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  preview: {
    marginVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: BORDER_RADIUS.md,
  },
  removeBtn: {
    position: 'absolute',
    top: SPACING.xs,
    right: SPACING.xs,
  },
});
