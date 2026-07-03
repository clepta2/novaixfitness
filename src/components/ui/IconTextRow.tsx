// src/components/ui/IconTextRow.tsx
// Linha com icone + texto para seções - NOVAIX FITNESS

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SPACING } from '../../constants/spacing';
import { useColors } from '../../context/ThemeContext';

interface IconTextRowProps {
  icon: string;
  iconColor?: string;
  text: string;
  textColor?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function IconTextRow({ icon, iconColor, text, textColor, size = 'md' }: IconTextRowProps) {
  const colors = useColors();
  const fontSize = size === 'sm' ? 11 : size === 'md' ? 13 : 16;
  const iconSize = size === 'sm' ? 14 : size === 'md' ? 18 : 24;

  return (
    <View style={styles.row}>
      <Ionicons name={icon as any} size={iconSize} color={iconColor || colors.primary} />
      <Text style={[styles.text, { fontSize, color: textColor || colors.textTitle }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
  },
  text: {
    fontFamily: 'Montserrat_700Bold', textTransform: 'uppercase',
  },
});
