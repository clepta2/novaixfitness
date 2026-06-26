// src/components/ui/Avatar.js
// Componente de Avatar NOVAIX FITNESS

import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { BORDER_RADIUS } from '../../constants/spacing';

export function Avatar({ uri, name, size = 'md', style }) {
  const sizes = {
    sm: 32,
    md: 48,
    lg: 64,
    xl: 96,
  };

  const fontSize = {
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
  };

  const sizeValue = sizes[size];
  const initials = name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '';

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[styles.image, { width: sizeValue, height: sizeValue, borderRadius: sizeValue / 2 }, style]}
      />
    );
  }

  return (
    <View style={[styles.placeholder, { width: sizeValue, height: sizeValue, borderRadius: sizeValue / 2 }, style]}>
      {name ? (
        <Text style={[styles.initials, { fontSize: fontSize[size] }]}>{initials}</Text>
      ) : (
        <Ionicons name="person" size={sizeValue * 0.5} color={COLORS.textMuted} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: COLORS.surface,
  },
  placeholder: {
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    fontFamily: 'Montserrat_700Bold',
    color: COLORS.primary,
  },
});
