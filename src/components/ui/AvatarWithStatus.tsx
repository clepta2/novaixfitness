// src/components/ui/AvatarWithStatus.tsx
// Avatar com indicador de status online - NOVAIX FITNESS

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useColors } from '../../context/ThemeContext';
import { Avatar } from '../ui/Avatar';

interface AvatarWithStatusProps {
  name: string;
  uri?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  online?: boolean;
}

export default function AvatarWithStatus({ name, uri, size = 'md', online }: AvatarWithStatusProps) {
  const colors = useColors();
  const dotSize = size === 'xs' ? 8 : size === 'sm' ? 10 : 12;

  return (
    <View style={styles.container}>
      <Avatar name={name} uri={uri} size={size} style={{}} />
      {online !== undefined && (
        <View style={[styles.dot, { width: dotSize, height: dotSize, borderRadius: dotSize / 2, backgroundColor: online ? colors.success : colors.textMuted }]} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  dot: {
    position: 'absolute', bottom: 0, right: 0, borderWidth: 2, borderColor: '#121820',
  },
});
