// src/components/ui/NavigationCard.tsx
// Card de navegacao: icone + label + chevron - NOVAIX FITNESS

import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { useColors } from '../../context/ThemeContext';

interface NavigationCardProps {
  icon: string;
  iconColor?: string;
  label: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
}

export default function NavigationCard({ icon, iconColor, label, onPress, rightElement }: NavigationCardProps) {
  const colors = useColors();

  return (
    <TouchableOpacity style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.left}>
        <View style={[styles.iconWrap, { backgroundColor: (iconColor || colors.primary) + '15' }]}>
          <Ionicons name={icon as any} size={20} color={iconColor || colors.primary} />
        </View>
        <Text style={[styles.label, { color: colors.textTitle }]}>{label}</Text>
      </View>
      {rightElement || (
        <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: SPACING.md, borderRadius: BORDER_RADIUS.md, borderWidth: 1,
  },
  left: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md, flex: 1,
  },
  iconWrap: {
    width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center',
  },
  label: {
    fontFamily: 'Inter_500Medium', fontSize: 14, flex: 1,
  },
});
