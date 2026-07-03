// Widget preview component for home screen widgets
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { typography } from '../../styles';
import { useColors } from '../../context/ThemeContext';

interface WidgetPreviewProps {
  type: 'workout' | 'streak' | 'quickstart';
  onPress?: () => void;
}

const WIDGET_CONFIG = {
  workout: {
    icon: 'barbell', label: 'Treino do Dia', subtitle: 'Treino A - Peito',
  },
  streak: {
    icon: 'flame', label: 'Streak', subtitle: '15 dias seguidos',
  },
  quickstart: {
    icon: 'play', label: 'Iniciar Treino', subtitle: 'Tap para começar',
  },
};

export default function WidgetPreview({ type, onPress }: WidgetPreviewProps) {
  const colors = useColors();
  const config = WIDGET_CONFIG[type];

  return (
    <View style={styles.container}>
      <Ionicons name={config.icon as any} size={32} color={colors.primary} />
      <Text style={styles.label}>{config.label}</Text>
      <Text style={styles.subtitle}>{config.subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 160,
    height: 160,
    backgroundColor: '#121820',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2A3040',
  },
  label: {
    ...typography.h5,
    color: '#FFFFFF',
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.bodySmall,
    color: '#8892A0',
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
});
